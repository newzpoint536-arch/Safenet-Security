import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { readDatabase, writeDatabase } from './dbStore.js';
import type { AdminRole } from '../types/index.js';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  salt: string;
  hash: string;
  recoveryPassphraseHash?: string;
  recoveryPassphraseSalt?: string;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'suspended';
}

export interface AdminSession {
  token: string;
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  expiresAt: number;
  ip: string;
}

// In-memory active session registry
const activeSessions = new Map<string, AdminSession>();

// In-memory rate limiting map for login attempts: key -> { attempts: number; lockedUntil: number }
const loginRateLimits = new Map<string, { attempts: number; lockedUntil: number }>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

// Cryptographic hash helper using PBKDF2 with SHA-512 and 100,000 iterations
export function hashPassword(password: string, providedSalt?: string): { salt: string; hash: string } {
  const salt = providedSalt || crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    const expectedBuffer = Buffer.from(expectedHash, 'hex');
    if (hashBuffer.length !== expectedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(hashBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

// Rate limit checker
export function checkRateLimit(key: string): { allowed: boolean; remainingMinutes?: number } {
  const now = Date.now();
  const record = loginRateLimits.get(key);
  if (!record) return { allowed: true };

  if (record.lockedUntil > now) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    return { allowed: false, remainingMinutes };
  }

  // Lockout expired, reset
  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    loginRateLimits.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(key: string): { locked: boolean; attemptsLeft: number; remainingMinutes?: number } {
  const now = Date.now();
  const record = loginRateLimits.get(key) || { attempts: 0, lockedUntil: 0 };
  record.attempts += 1;

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginRateLimits.set(key, record);
    return { locked: true, attemptsLeft: 0, remainingMinutes: 15 };
  }

  loginRateLimits.set(key, record);
  return { locked: false, attemptsLeft: MAX_FAILED_ATTEMPTS - record.attempts };
}

export function clearRateLimit(key: string) {
  loginRateLimits.delete(key);
}

// Check if any Super Admin or admin accounts exist in storage
export function hasAdminUsers(): boolean {
  const db = readDatabase();
  return Boolean(db && Array.isArray(db.adminUsers) && db.adminUsers.length > 0);
}

// Retrieve sanitized user object
export function sanitizeUser(user: AdminUserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
    status: user.status
  };
}

// Initial Admin Provisioning
export function createInitialSuperAdmin(data: {
  name: string;
  email: string;
  password: string;
  recoveryPassphrase?: string;
  ip: string;
}): { user: ReturnType<typeof sanitizeUser>; token: string; expiresAt: string } {
  const db = readDatabase();
  if (!db) {
    throw new Error('Database is unavailable');
  }

  const existingUsers = Array.isArray(db.adminUsers) ? db.adminUsers : [];
  if (existingUsers.length > 0) {
    throw new Error('System setup is already completed. Initial provisioning is locked.');
  }

  const email = data.email.trim().toLowerCase();
  const name = data.name.trim();

  if (!email || !name || !data.password) {
    throw new Error('Full Name, Email, and Password are required.');
  }

  if (data.password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  const { salt, hash } = hashPassword(data.password);

  let recoveryPassphraseHash: string | undefined;
  let recoveryPassphraseSalt: string | undefined;
  if (data.recoveryPassphrase && data.recoveryPassphrase.trim().length >= 8) {
    const rec = hashPassword(data.recoveryPassphrase.trim());
    recoveryPassphraseHash = rec.hash;
    recoveryPassphraseSalt = rec.salt;
  }

  const newUser: AdminUserRecord = {
    id: `admin-${Date.now()}`,
    name,
    email,
    role: 'super_admin',
    salt,
    hash,
    recoveryPassphraseHash,
    recoveryPassphraseSalt,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: 'active'
  };

  db.adminUsers = [newUser];

  // Log to audit log
  if (Array.isArray(db.auditLogs)) {
    db.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: `${name} (${email})`,
      action: 'ADMIN_PROVISIONED',
      target: 'System Security Core',
      details: 'First Super Administrator account securely provisioned with PBKDF2-SHA512 encryption.',
      ip: data.ip
    });
  }

  writeDatabase(db);

  // Create session
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAtMs = Date.now() + SESSION_DURATION_MS;
  const session: AdminSession = {
    token,
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAtMs,
    ip: data.ip
  };

  activeSessions.set(token, session);

  return {
    user: sanitizeUser(newUser),
    token,
    expiresAt: new Date(expiresAtMs).toISOString()
  };
}

// Authenticate Administrator
export function loginAdministrator(
  emailInput: string,
  passwordInput: string,
  ip: string
): { user: ReturnType<typeof sanitizeUser>; token: string; expiresAt: string } {
  const db = readDatabase();
  if (!db) {
    throw new Error('Database service unavailable.');
  }

  const email = emailInput.trim().toLowerCase();
  const rateLimitKey = `${ip}:${email}`;

  const rateCheck = checkRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    throw new Error(
      `Access temporarily locked due to excessive failed attempts. Please retry in ${rateCheck.remainingMinutes} minutes.`
    );
  }

  const users: AdminUserRecord[] = Array.isArray(db.adminUsers) ? db.adminUsers : [];
  const user = users.find(u => u.email.toLowerCase() === email);

  if (!user || user.status === 'suspended') {
    const { attemptsLeft, locked } = recordFailedAttempt(rateLimitKey);
    if (locked) {
      throw new Error('Maximum login attempts exceeded. Account access locked for 15 minutes.');
    }
    throw new Error(`Invalid authentication credentials. ${attemptsLeft} attempt(s) remaining.`);
  }

  const isMatch = verifyPassword(passwordInput, user.salt, user.hash);
  if (!isMatch) {
    const { attemptsLeft, locked } = recordFailedAttempt(rateLimitKey);
    if (locked) {
      throw new Error('Maximum login attempts exceeded. Account access locked for 15 minutes.');
    }
    throw new Error(`Invalid authentication credentials. ${attemptsLeft} attempt(s) remaining.`);
  }

  // Clear failed attempt record on successful login
  clearRateLimit(rateLimitKey);

  // Update user last login
  user.lastLogin = new Date().toISOString();
  writeDatabase(db);

  // Record audit log
  if (Array.isArray(db.auditLogs)) {
    db.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: `${user.name} (${user.email})`,
      action: 'ADMIN_LOGIN_SUCCESS',
      target: 'Operations Command Console',
      details: `Successful authenticated session started with role [${user.role}].`,
      ip
    });
    // Keep max 200 audit logs
    if (db.auditLogs.length > 200) {
      db.auditLogs = db.auditLogs.slice(0, 200);
    }
    writeDatabase(db);
  }

  // Generate session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAtMs = Date.now() + SESSION_DURATION_MS;

  const session: AdminSession = {
    token,
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAtMs,
    ip
  };

  activeSessions.set(token, session);

  return {
    user: sanitizeUser(user),
    token,
    expiresAt: new Date(expiresAtMs).toISOString()
  };
}

// Verify Session Token
export function verifySessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  return session;
}

// Invalidate Session (Logout)
export function logoutSession(token: string | undefined) {
  if (token) {
    activeSessions.delete(token);
  }
}

// Password Reset via Recovery Passphrase
export function resetPasswordWithPassphrase(
  emailInput: string,
  recoveryPassphrase: string,
  newPassword: string,
  ip: string
): boolean {
  const db = readDatabase();
  if (!db) throw new Error('Database service unavailable.');

  const email = emailInput.trim().toLowerCase();
  const users: AdminUserRecord[] = Array.isArray(db.adminUsers) ? db.adminUsers : [];
  const user = users.find(u => u.email.toLowerCase() === email);

  if (!user || !user.recoveryPassphraseHash || !user.recoveryPassphraseSalt) {
    throw new Error('Recovery passphrase is not configured or user not found.');
  }

  const isPassphraseValid = verifyPassword(
    recoveryPassphrase.trim(),
    user.recoveryPassphraseSalt,
    user.recoveryPassphraseHash
  );

  if (!isPassphraseValid) {
    throw new Error('Invalid recovery passphrase.');
  }

  if (newPassword.length < 8) {
    throw new Error('New password must be at least 8 characters long.');
  }

  const { salt, hash } = hashPassword(newPassword);
  user.salt = salt;
  user.hash = hash;
  writeDatabase(db);

  // Invalidate any active sessions for this user
  for (const [token, sess] of activeSessions.entries()) {
    if (sess.userId === user.id) {
      activeSessions.delete(token);
    }
  }

  // Log password reset
  if (Array.isArray(db.auditLogs)) {
    db.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: `${user.name} (${user.email})`,
      action: 'PASSWORD_RESET_PASSPHRASE',
      target: 'Admin Security Credentials',
      details: 'Password was securely updated using the cryptographic recovery passphrase.',
      ip
    });
    writeDatabase(db);
  }

  return true;
}

// Express Middleware for backend-enforced RBAC
export function requireAdminAuth(allowedRoles?: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (req.headers['x-admin-token']) {
      token = String(req.headers['x-admin-token']).trim();
    }

    const session = verifySessionToken(token);
    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized: Valid administrator session required.',
        code: 'AUTH_REQUIRED'
      });
    }

    // Role check: super_admin always has access
    if (allowedRoles && allowedRoles.length > 0) {
      if (session.role !== 'super_admin' && !allowedRoles.includes(session.role)) {
        return res.status(403).json({
          error: `Forbidden: Current role '${session.role}' lacks permissions for this command endpoint.`,
          requiredRoles: allowedRoles,
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }
    }

    // Attach to request
    (req as any).adminSession = session;
    next();
  };
}
