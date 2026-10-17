import crypto from 'node:crypto';
import util from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Request, Response, NextFunction } from 'express';
import { readDatabase, writeDatabase } from './dbStore.js';
import type { AdminRole, AuditLog } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OWNER_RECOVERY_TOKEN_FILE = path.resolve(__dirname, '../../data/.owner_recovery_token');

const pbkdf2Async = util.promisify(crypto.pbkdf2);

// OWASP 2024 guidance for PBKDF2 with SHA-512
export const RECOMMENDED_ITERATIONS = 210000;
export const LEGACY_ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

// Session lifetime limits
export const SESSION_LIFETIME_MS = 8 * 60 * 60 * 1000; // 8 hours absolute limit
export const IDLE_TIMEOUT_MS = 45 * 60 * 1000;         // 45 minutes idle limit

// Rate limiting parameters
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const MAX_RECOVERY_ATTEMPTS = 3;
const RECOVERY_LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes

// Internal secret for HMAC-SHA256 audit chaining
const AUDIT_HMAC_SECRET = process.env.AUDIT_HMAC_SECRET || 'safenet-audit-integrity-chain-key-v1';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  salt: string;
  hash: string;
  iterations?: number;
  recoveryPassphraseHash?: string;
  recoveryPassphraseSalt?: string;
  recoveryPassphraseIterations?: number;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'suspended';
}

export interface AdminSession {
  token: string;
  csrfToken: string;
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  expiresAt: number;        // Absolute expiry
  lastActivityAt: number;   // Idle expiry tracker
  ip: string;
  userAgent?: string;
  authSource: 'cookie' | 'bearer';
}

// In-memory active session registry
const activeSessions = new Map<string, AdminSession>();

// In-memory rate limiting map: key -> { attempts: number; lockedUntil: number }
const rateLimitMap = new Map<string, { attempts: number; lockedUntil: number }>();

// In-memory atomic mutex for initial provisioning
let isProvisioningMutexLocked = false;

// ==========================================
// 1. PASSWORD HASHING & VALIDATION (OWASP)
// ==========================================

export function validatePasswordStrength(password: string): { valid: boolean; reason?: string } {
  if (typeof password !== 'string' || password.length < 10) {
    return { valid: false, reason: 'Password must be at least 10 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one uppercase letter (A-Z).' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one lowercase letter (a-z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one digit (0-9).' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one special character (!@#$%^&*...).' };
  }
  return { valid: true };
}

export async function hashPasswordAsync(
  password: string,
  providedSalt?: string,
  iterations = RECOMMENDED_ITERATIONS
): Promise<{ salt: string; hash: string; iterations: number }> {
  const salt = providedSalt || crypto.randomBytes(32).toString('hex');
  const derivedKey = await pbkdf2Async(password, salt, iterations, KEY_LENGTH, DIGEST);
  return { salt, hash: derivedKey.toString('hex'), iterations };
}

export async function verifyPasswordAsync(
  password: string,
  salt: string,
  expectedHash: string,
  iterations = RECOMMENDED_ITERATIONS
): Promise<boolean> {
  try {
    const derivedKey = await pbkdf2Async(password, salt, iterations, KEY_LENGTH, DIGEST);
    const derivedBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
    const expectedBuffer = Buffer.from(expectedHash, 'hex');
    if (derivedBuffer.length !== expectedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(derivedBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

// Synchronous fallback maintained for backward compatibility
export function hashPassword(password: string, providedSalt?: string): { salt: string; hash: string } {
  const salt = providedSalt || crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, RECOMMENDED_ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const hash = crypto.pbkdf2Sync(password, salt, RECOMMENDED_ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
    const hashBuffer = Buffer.from(hash, 'hex');
    const expectedBuffer = Buffer.from(expectedHash, 'hex');
    if (hashBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

// ==========================================
// 2. RATE LIMITING
// ==========================================

export function checkRateLimit(key: string): { allowed: boolean; remainingMinutes?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  if (!record) return { allowed: true };

  if (record.lockedUntil > now) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    return { allowed: false, remainingMinutes };
  }

  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    rateLimitMap.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedAttempt(
  key: string,
  maxAttempts = MAX_LOGIN_ATTEMPTS,
  lockoutDurationMs = LOGIN_LOCKOUT_MS
): { locked: boolean; attemptsLeft: number; remainingMinutes?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key) || { attempts: 0, lockedUntil: 0 };
  record.attempts += 1;

  if (record.attempts >= maxAttempts) {
    record.lockedUntil = now + lockoutDurationMs;
    rateLimitMap.set(key, record);
    return { locked: true, attemptsLeft: 0, remainingMinutes: Math.ceil(lockoutDurationMs / 60000) };
  }

  rateLimitMap.set(key, record);
  return { locked: false, attemptsLeft: maxAttempts - record.attempts };
}

export function clearRateLimit(key: string) {
  rateLimitMap.delete(key);
}

// ==========================================
// 3. TAMPER-EVIDENT AUDIT LOGGING WITH HMAC
// ==========================================

export function appendTamperEvidentAuditLog(
  db: any,
  entry: {
    user: string;
    action: string;
    target: string;
    details: string;
    ip: string;
  }
): AuditLog {
  if (!Array.isArray(db.auditLogs)) {
    db.auditLogs = [];
  }

  const prevLog = db.auditLogs[0];
  const prevHash = prevLog?.hash || 'GENESIS-SAFENET-SECURE-ANCHOR-000';
  const timestamp = new Date().toISOString();
  const id = `audit-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const logPayload = `${prevHash}:${id}:${timestamp}:${entry.user}:${entry.action}:${entry.target}:${entry.details}:${entry.ip}`;
  const hash = crypto.createHmac('sha256', AUDIT_HMAC_SECRET).update(logPayload).digest('hex');

  const newLog: AuditLog = {
    id,
    timestamp,
    user: entry.user,
    action: entry.action,
    target: entry.target,
    details: entry.details,
    ip: entry.ip,
    hash,
    prevHash
  };

  db.auditLogs.unshift(newLog);

  // Retain up to 250 verified historical logs
  if (db.auditLogs.length > 250) {
    db.auditLogs = db.auditLogs.slice(0, 250);
  }

  return newLog;
}

// ==========================================
// 4. USER SANITIZATION & STATE QUERIES
// ==========================================

export function hasAdminUsers(): boolean {
  const db = readDatabase();
  return Boolean(db && Array.isArray(db.adminUsers) && db.adminUsers.length > 0);
}

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

// ==========================================
// 5. INITIAL SUPER ADMINISTRATOR PROVISIONING
// ==========================================

export function isSetupKeyRequired(): boolean {
  return Boolean(process.env.INITIAL_SETUP_KEY && process.env.INITIAL_SETUP_KEY.trim().length > 0);
}

export async function createInitialSuperAdmin(data: {
  name: string;
  email: string;
  password: string;
  recoveryPassphrase?: string;
  setupKey?: string;
  ip: string;
}): Promise<{ user: ReturnType<typeof sanitizeUser>; session: AdminSession }> {
  // Enforce atomic provisioning mutex
  if (isProvisioningMutexLocked) {
    throw new Error('Provisioning operation in progress by another request.');
  }

  isProvisioningMutexLocked = true;
  try {
    const db = readDatabase();
    if (!db) {
      throw new Error('Database service is unavailable.');
    }

    const existingUsers = Array.isArray(db.adminUsers) ? db.adminUsers : [];
    if (existingUsers.length > 0) {
      throw new Error('System setup is already completed. Initial provisioning is permanently locked.');
    }

    // Check protected one-time setup authorization mechanism if configured
    if (isSetupKeyRequired()) {
      const requiredKey = (process.env.INITIAL_SETUP_KEY || '').trim();
      const providedKey = (data.setupKey || '').trim();
      if (!providedKey || providedKey !== requiredKey) {
        throw new Error('Invalid or missing Initial Setup Authorization Key. Contact systems administrator.');
      }
    }

    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();

    if (!email || !name || !data.password) {
      throw new Error('Full Name, Email, and Password are required.');
    }

    // OWASP password strength validation
    const strength = validatePasswordStrength(data.password);
    if (!strength.valid) {
      throw new Error(strength.reason || 'Password does not meet enterprise security requirements.');
    }

    // Asynchronous PBKDF2 hashing with 210,000 iterations
    const { salt, hash, iterations } = await hashPasswordAsync(data.password, undefined, RECOMMENDED_ITERATIONS);

    let recoveryPassphraseHash: string | undefined;
    let recoveryPassphraseSalt: string | undefined;
    let recoveryPassphraseIterations: number | undefined;

    if (data.recoveryPassphrase && data.recoveryPassphrase.trim().length >= 10) {
      const rec = await hashPasswordAsync(data.recoveryPassphrase.trim(), undefined, RECOMMENDED_ITERATIONS);
      recoveryPassphraseHash = rec.hash;
      recoveryPassphraseSalt = rec.salt;
      recoveryPassphraseIterations = rec.iterations;
    }

    const newUser: AdminUserRecord = {
      id: `admin-${Date.now()}`,
      name,
      email,
      role: 'super_admin',
      salt,
      hash,
      iterations,
      recoveryPassphraseHash,
      recoveryPassphraseSalt,
      recoveryPassphraseIterations,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'active'
    };

    db.adminUsers = [newUser];

    // Record tamper-evident audit log
    appendTamperEvidentAuditLog(db, {
      user: `${name} (${email})`,
      action: 'INITIAL_PROVISIONING',
      target: 'Core Administrative Identity',
      details: `First Super Administrator provisioned using PBKDF2-SHA512 (${iterations.toLocaleString()} iterations). Initial setup permanently locked.`,
      ip: data.ip
    });

    writeDatabase(db);

    // Create session with CSRF protection and rotation
    const session = createSession(newUser, data.ip, 'cookie');

    return {
      user: sanitizeUser(newUser),
      session
    };
  } finally {
    isProvisioningMutexLocked = false;
  }
}

// ==========================================
// 6. ADMINISTRATOR AUTHENTICATION (LOGIN)
// ==========================================

export async function loginAdministrator(
  emailInput: string,
  passwordInput: string,
  ip: string,
  userAgent?: string
): Promise<{ user: ReturnType<typeof sanitizeUser>; session: AdminSession }> {
  const db = readDatabase();
  if (!db) {
    throw new Error('Database service unavailable.');
  }

  const email = emailInput.trim().toLowerCase();
  const rateLimitKey = `login:${ip}:${email}`;

  const rateCheck = checkRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    throw new Error(
      `Access temporarily locked due to excessive failed attempts. Please retry in ${rateCheck.remainingMinutes} minutes.`
    );
  }

  const users: AdminUserRecord[] = Array.isArray(db.adminUsers) ? db.adminUsers : [];
  const user = users.find(u => u.email.toLowerCase() === email);

  if (!user || user.status === 'suspended') {
    const { attemptsLeft, locked } = recordFailedAttempt(rateLimitKey, MAX_LOGIN_ATTEMPTS, LOGIN_LOCKOUT_MS);
    appendTamperEvidentAuditLog(db, {
      user: email,
      action: 'LOGIN_FAILURE_UNKNOWN_USER',
      target: 'Auth Gateway',
      details: `Failed authentication attempt for non-existent or suspended account. ${attemptsLeft} attempts remaining.`,
      ip
    });
    writeDatabase(db);

    if (locked) {
      throw new Error('Maximum login attempts exceeded. Access locked for 15 minutes.');
    }
    throw new Error(`Invalid authentication credentials. ${attemptsLeft} attempt(s) remaining.`);
  }

  // Determine iterations (backward compatibility: defaults to LEGACY 100,000 if not set, or RECOMMENDED 210,000)
  const storedIterations = user.iterations || LEGACY_ITERATIONS;

  // Verify password asynchronously with timing-safe comparison
  let isMatch = await verifyPasswordAsync(passwordInput, user.salt, user.hash, storedIterations);

  // If failed and storedIterations was 210,000, attempt fallback to legacy 100,000 for seamless migration
  let needsUpgrade = false;
  if (!isMatch && storedIterations !== LEGACY_ITERATIONS) {
    isMatch = await verifyPasswordAsync(passwordInput, user.salt, user.hash, LEGACY_ITERATIONS);
    if (isMatch) {
      needsUpgrade = true;
    }
  } else if (isMatch && storedIterations < RECOMMENDED_ITERATIONS) {
    needsUpgrade = true;
  }

  if (!isMatch) {
    const { attemptsLeft, locked } = recordFailedAttempt(rateLimitKey, MAX_LOGIN_ATTEMPTS, LOGIN_LOCKOUT_MS);
    appendTamperEvidentAuditLog(db, {
      user: `${user.name} (${user.email})`,
      action: 'LOGIN_FAILURE_BAD_PASSWORD',
      target: 'Auth Gateway',
      details: `Incorrect password supplied. ${attemptsLeft} attempts remaining before lockout.`,
      ip
    });
    writeDatabase(db);

    if (locked) {
      throw new Error('Maximum login attempts exceeded. Access locked for 15 minutes.');
    }
    throw new Error(`Invalid authentication credentials. ${attemptsLeft} attempt(s) remaining.`);
  }

  // Clear rate limits upon successful credential verification
  clearRateLimit(rateLimitKey);

  // Automated backward-compatible hash upgrade to 210,000 iterations on login
  if (needsUpgrade) {
    const upgraded = await hashPasswordAsync(passwordInput, user.salt, RECOMMENDED_ITERATIONS);
    user.hash = upgraded.hash;
    user.iterations = RECOMMENDED_ITERATIONS;
    appendTamperEvidentAuditLog(db, {
      user: `${user.name} (${user.email})`,
      action: 'SECURITY_HASH_UPGRADED',
      target: 'Credential Storage',
      details: `Password hash transparently upgraded to OWASP standard (${RECOMMENDED_ITERATIONS.toLocaleString()} iterations PBKDF2-SHA512).`,
      ip
    });
  }

  // Update last login
  user.lastLogin = new Date().toISOString();

  appendTamperEvidentAuditLog(db, {
    user: `${user.name} (${user.email})`,
    action: 'ADMIN_LOGIN_SUCCESS',
    target: 'Operations Command Console',
    details: `Authenticated with role [${user.role}]. Session established.`,
    ip
  });

  writeDatabase(db);

  // Create rotated session with unique CSRF secret
  const session = createSession(user, ip, 'cookie', userAgent);

  return {
    user: sanitizeUser(user),
    session
  };
}

// ==========================================
// 7. SESSION CREATION, ROTATION & REVOCATION
// ==========================================

export function createSession(
  user: AdminUserRecord,
  ip: string,
  authSource: 'cookie' | 'bearer' = 'cookie',
  userAgent?: string
): AdminSession {
  // Generate 256-bit cryptographically secure session and CSRF tokens
  const token = crypto.randomBytes(32).toString('hex');
  const csrfToken = crypto.randomBytes(32).toString('hex');
  const now = Date.now();

  const session: AdminSession = {
    token,
    csrfToken,
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: new Date(now).toISOString(),
    expiresAt: now + SESSION_LIFETIME_MS,
    lastActivityAt: now,
    ip,
    userAgent,
    authSource
  };

  activeSessions.set(token, session);
  return session;
}

export function verifySessionToken(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  const now = Date.now();

  // 1. Check absolute session expiration (8 hours)
  if (now > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  // 2. Check idle session timeout (45 minutes)
  if (now - session.lastActivityAt > IDLE_TIMEOUT_MS) {
    activeSessions.delete(token);
    return null;
  }

  // Refresh idle activity tracker
  session.lastActivityAt = now;
  return session;
}

export function logoutSession(token: string | undefined) {
  if (token) {
    activeSessions.delete(token);
  }
}

export function invalidateAllUserSessions(userId: string) {
  for (const [token, sess] of activeSessions.entries()) {
    if (sess.userId === userId) {
      activeSessions.delete(token);
    }
  }
}

// ==========================================
// 8. EMERGENCY CREDENTIAL RECOVERY
// ==========================================

export async function resetPasswordWithPassphrase(
  emailInput: string,
  recoveryPassphrase: string,
  newPassword: string,
  ip: string
): Promise<boolean> {
  const db = readDatabase();
  if (!db) throw new Error('Database service unavailable.');

  const email = emailInput.trim().toLowerCase();
  const rateLimitKey = `recovery:${ip}:${email}`;

  const rateCheck = checkRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    throw new Error(
      `Emergency recovery locked due to multiple failed attempts. Please retry in ${rateCheck.remainingMinutes} minutes.`
    );
  }

  const users: AdminUserRecord[] = Array.isArray(db.adminUsers) ? db.adminUsers : [];
  const user = users.find(u => u.email.toLowerCase() === email);

  if (!user || !user.recoveryPassphraseHash || !user.recoveryPassphraseSalt) {
    recordFailedAttempt(rateLimitKey, MAX_RECOVERY_ATTEMPTS, RECOVERY_LOCKOUT_MS);
    appendTamperEvidentAuditLog(db, {
      user: email,
      action: 'RECOVERY_FAILURE_INVALID_ACCOUNT',
      target: 'Emergency Recovery Key',
      details: 'Recovery attempt submitted for account without configured recovery key.',
      ip
    });
    writeDatabase(db);
    throw new Error('Recovery passphrase is not configured or user was not found.');
  }

  // Verify recovery passphrase asynchronously
  const recIterations = user.recoveryPassphraseIterations || RECOMMENDED_ITERATIONS;
  let isPassphraseValid = await verifyPasswordAsync(
    recoveryPassphrase.trim(),
    user.recoveryPassphraseSalt,
    user.recoveryPassphraseHash,
    recIterations
  );

  if (!isPassphraseValid && recIterations !== LEGACY_ITERATIONS) {
    // Legacy fallback check
    isPassphraseValid = await verifyPasswordAsync(
      recoveryPassphrase.trim(),
      user.recoveryPassphraseSalt,
      user.recoveryPassphraseHash,
      LEGACY_ITERATIONS
    );
  }

  if (!isPassphraseValid) {
    const { attemptsLeft, locked } = recordFailedAttempt(rateLimitKey, MAX_RECOVERY_ATTEMPTS, RECOVERY_LOCKOUT_MS);
    appendTamperEvidentAuditLog(db, {
      user: `${user.name} (${user.email})`,
      action: 'RECOVERY_FAILURE_BAD_PASSPHRASE',
      target: 'Emergency Recovery Key',
      details: `Invalid recovery passphrase supplied. ${attemptsLeft} attempt(s) remaining.`,
      ip
    });
    writeDatabase(db);

    if (locked) {
      throw new Error('Maximum recovery attempts exceeded. Recovery locked for 30 minutes.');
    }
    throw new Error(`Invalid recovery passphrase. ${attemptsLeft} attempt(s) remaining.`);
  }

  // Validate new password strength
  const strength = validatePasswordStrength(newPassword);
  if (!strength.valid) {
    throw new Error(strength.reason || 'New password does not meet security requirements.');
  }

  // Hash new password with 210,000 iterations
  const { salt, hash, iterations } = await hashPasswordAsync(newPassword, undefined, RECOMMENDED_ITERATIONS);
  user.salt = salt;
  user.hash = hash;
  user.iterations = iterations;

  // Clear rate limits
  clearRateLimit(rateLimitKey);

  // Invalidate all existing sessions for this user (session revocation)
  invalidateAllUserSessions(user.id);

  // Audit log
  appendTamperEvidentAuditLog(db, {
    user: `${user.name} (${user.email})`,
    action: 'PASSWORD_RESET_EMERGENCY_RECOVERY',
    target: 'Credential Store',
    details: 'Master password reset via emergency recovery passphrase. All existing active sessions revoked.',
    ip
  });

  writeDatabase(db);
  return true;
}

// ==========================================
// 8B. ONE-TIME OWNER PRIVILEGE RECOVERY
// ==========================================

let isOwnerRecoveryBurned = false;

export function getOrGenerateOwnerRecoverySecret(): string {
  if (isOwnerRecoveryBurned) return '';

  // 1. Check environment variable first
  if (process.env.OWNER_RECOVERY_KEY && process.env.OWNER_RECOVERY_KEY.trim().length > 0) {
    return process.env.OWNER_RECOVERY_KEY.trim();
  }

  // 2. Check server-protected one-time token file in /data/.owner_recovery_token
  try {
    if (fs.existsSync(OWNER_RECOVERY_TOKEN_FILE)) {
      const stored = fs.readFileSync(OWNER_RECOVERY_TOKEN_FILE, 'utf-8').trim();
      if (stored.length > 0) return stored;
    }

    // 3. Generate high-entropy 256-bit cryptographically secure one-time recovery key
    const generated = 'SFN-OWNER-' + crypto.randomBytes(24).toString('hex').toUpperCase();
    const dataDir = path.dirname(OWNER_RECOVERY_TOKEN_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(OWNER_RECOVERY_TOKEN_FILE, generated, { encoding: 'utf-8', mode: 0o600 });
    console.log('\n================================================================');
    console.log(' [SAFENET SECURITY] ONE-TIME OWNER RECOVERY AUTHORIZATION SECRET:');
    console.log(` ${generated}`);
    console.log(' Use this key on /admin/login under "Owner Recovery" to reset credentials.');
    console.log(' Once used, this key will be permanently burned and disabled.');
    console.log('================================================================\n');
    return generated;
  } catch (err) {
    console.warn('[SafeNet Security] Could not access owner recovery token file:', err);
    return '';
  }
}

export function isOwnerRecoveryAvailable(): boolean {
  if (isOwnerRecoveryBurned) return false;
  const secret = getOrGenerateOwnerRecoverySecret();
  return Boolean(secret && secret.length > 0);
}

export async function recoverSuperAdminWithSecret(data: {
  recoverySecret: string;
  newEmail: string;
  newName?: string;
  newPassword: string;
  newRecoveryPassphrase?: string;
  ip: string;
}): Promise<{ user: ReturnType<typeof sanitizeUser>; session: AdminSession }> {
  if (isOwnerRecoveryBurned) {
    throw new Error('Owner recovery authorization has already been consumed or permanently disabled.');
  }

  const serverSecret = getOrGenerateOwnerRecoverySecret();
  if (!serverSecret) {
    throw new Error('Owner recovery authorization is not active on this server.');
  }

  const rateLimitKey = `owner-recovery:${data.ip}`;
  const rateCheck = checkRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    throw new Error(
      `Owner recovery locked due to excessive failed attempts. Please retry in ${rateCheck.remainingMinutes} minutes.`
    );
  }

  // Timing-safe comparison to prevent side-channel timing analysis
  const providedBuf = Buffer.from(data.recoverySecret.trim());
  const expectedBuf = Buffer.from(serverSecret.trim());

  let isAuthorized = false;
  if (providedBuf.length === expectedBuf.length) {
    isAuthorized = crypto.timingSafeEqual(providedBuf, expectedBuf);
  }

  if (!isAuthorized) {
    const { attemptsLeft, locked } = recordFailedAttempt(rateLimitKey, 3, 30 * 60 * 1000);
    const db = readDatabase();
    if (db) {
      appendTamperEvidentAuditLog(db, {
        user: `Unknown (${data.newEmail || 'Anonymous'})`,
        action: 'OWNER_RECOVERY_INVALID_SECRET',
        target: 'Security Authorization Gateway',
        details: `Failed owner recovery attempt with invalid authorization secret. ${attemptsLeft} attempts remaining.`,
        ip: data.ip
      });
      writeDatabase(db);
    }

    if (locked) {
      throw new Error('Maximum owner recovery attempts exceeded. Operation locked for 30 minutes.');
    }
    throw new Error(`Invalid owner recovery authorization secret. ${attemptsLeft} attempt(s) remaining.`);
  }

  // Clear rate limits on valid recovery secret
  clearRateLimit(rateLimitKey);

  const db = readDatabase();
  if (!db) {
    throw new Error('Database service is unavailable.');
  }

  const users: AdminUserRecord[] = Array.isArray(db.adminUsers) ? db.adminUsers : [];
  if (users.length === 0) {
    throw new Error('No administrator account exists to recover. Please complete initial provisioning.');
  }

  // Locate existing super_admin (or primary administrator)
  const adminRecord = users.find(u => u.role === 'super_admin') || users[0];

  const newEmail = data.newEmail.trim().toLowerCase();
  if (!newEmail || !newEmail.includes('@')) {
    throw new Error('A valid official administrative email address is required.');
  }

  const strength = validatePasswordStrength(data.newPassword);
  if (!strength.valid) {
    throw new Error(strength.reason || 'New password does not meet security requirements.');
  }

  // Hash new password using OWASP-standard 210,000 PBKDF2-SHA512 iterations and 32-byte salt
  const { salt, hash, iterations } = await hashPasswordAsync(data.newPassword, undefined, RECOMMENDED_ITERATIONS);

  let recHash = adminRecord.recoveryPassphraseHash;
  let recSalt = adminRecord.recoveryPassphraseSalt;
  let recIter = adminRecord.recoveryPassphraseIterations;

  if (data.newRecoveryPassphrase && data.newRecoveryPassphrase.trim().length >= 10) {
    const rec = await hashPasswordAsync(data.newRecoveryPassphrase.trim(), undefined, RECOMMENDED_ITERATIONS);
    recHash = rec.hash;
    recSalt = rec.salt;
    recIter = rec.iterations;
  }

  const previousEmail = adminRecord.email;
  const previousName = adminRecord.name;

  // Preserve existing account record ID and role, update credentials
  adminRecord.email = newEmail;
  if (data.newName && data.newName.trim().length > 0) {
    adminRecord.name = data.newName.trim();
  }
  adminRecord.salt = salt;
  adminRecord.hash = hash;
  adminRecord.iterations = iterations;
  adminRecord.recoveryPassphraseHash = recHash;
  adminRecord.recoveryPassphraseSalt = recSalt;
  adminRecord.recoveryPassphraseIterations = recIter;
  adminRecord.status = 'active';
  adminRecord.lastLogin = new Date().toISOString();

  // Invalidate all existing administrator sessions across all devices
  invalidateAllUserSessions(adminRecord.id);

  // Permanently burn and disable this one-time recovery authorization
  isOwnerRecoveryBurned = true;
  try {
    if (fs.existsSync(OWNER_RECOVERY_TOKEN_FILE)) {
      fs.unlinkSync(OWNER_RECOVERY_TOKEN_FILE);
    }
  } catch (err) {
    console.warn('[SafeNet Security] Could not remove token file after consumption:', err);
  }

  // Record tamper-evident audit log
  appendTamperEvidentAuditLog(db, {
    user: `${adminRecord.name} (${adminRecord.email})`,
    action: 'OWNER_PRIVILEGE_RECOVERY',
    target: 'Super Administrator Account',
    details: `Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: ${previousName} (${previousEmail}). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled.`,
    ip: data.ip
  });

  writeDatabase(db);

  // Create fresh authenticated session for owner
  const session = createSession(adminRecord, data.ip, 'cookie');

  return {
    user: sanitizeUser(adminRecord),
    session
  };
}

// ==========================================
// 9. EXPRESS COOKIE & CSRF HELPERS
// ==========================================

export function setSessionCookies(res: Response, session: AdminSession, req: Request) {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production';

  // 1. HttpOnly, Secure, SameSite=Lax Session Cookie
  res.cookie('safenet_session', session.token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_LIFETIME_MS
  });

  // 2. Client-Accessible Anti-CSRF Token Cookie
  res.cookie('safenet_csrf', session.csrfToken, {
    httpOnly: false, // Frontend reads this to include in X-CSRF-Token header
    secure: isHttps,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_LIFETIME_MS
  });
}

export function clearSessionCookies(res: Response) {
  res.clearCookie('safenet_session', { path: '/' });
  res.clearCookie('safenet_csrf', { path: '/' });
}

// ==========================================
// 10. BACKEND-ENFORCED RBAC & CSRF MIDDLEWARE
// ==========================================

export function requireAdminAuth(allowedRoles?: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    let authSource: 'cookie' | 'bearer' = 'cookie';

    // 1. Check HttpOnly cookie
    if (req.cookies && req.cookies.safenet_session) {
      token = req.cookies.safenet_session;
      authSource = 'cookie';
    }

    // 2. Fallback to Authorization: Bearer <token>
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7).trim();
      authSource = 'bearer';
    } else if (!token && req.headers['x-admin-token']) {
      token = String(req.headers['x-admin-token']).trim();
      authSource = 'bearer';
    }

    const session = verifySessionToken(token);
    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized: Valid administrator session required.',
        code: 'AUTH_REQUIRED'
      });
    }

    // CSRF Protection for state-mutating requests (POST, PUT, DELETE, PATCH)
    // Only required when authenticated via cookies (Bearer tokens are immune to ambient browser CSRF)
    const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    if (authSource === 'cookie' && mutatingMethods.includes(req.method.toUpperCase())) {
      const clientCsrfToken = req.headers['x-csrf-token'] || req.body?._csrf;
      if (!clientCsrfToken || clientCsrfToken !== session.csrfToken) {
        return res.status(403).json({
          error: 'Forbidden: Invalid or missing anti-CSRF verification token.',
          code: 'CSRF_VALIDATION_FAILED'
        });
      }
    }

    // Role check: super_admin always has access
    if (allowedRoles && allowedRoles.length > 0) {
      if (session.role !== 'super_admin' && !allowedRoles.includes(session.role)) {
        return res.status(403).json({
          error: `Forbidden: Current role '${session.role}' lacks permission for this administrative endpoint.`,
          requiredRoles: allowedRoles,
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }
    }

    // Attach to request
    (req as any).adminSession = session;
    (req as any).adminUser = {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role
    };

    next();
  };
}
