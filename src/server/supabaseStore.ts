import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import pg from 'pg';
import { 
  readDatabase as readJsonDatabase, 
  writeDatabase as writeJsonDatabase, 
  DEFAULT_SITE_SETTINGS, 
  normalizeDbSiteSettings 
} from './dbStore.js';
import type { 
  SiteSettings, 
  Lead, 
  LeadNote,
  LeadStatus,
  SecurityAssessmentSubmission, 
  BlogPost, 
  SocialAccount, 
  SocialPublishJob, 
  CareerOpening, 
  JobApplication, 
  Testimonial, 
  AuditLog 
} from '../types/index.js';
import type { AdminUserRecord, AdminSession } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================================================================
// ENVIRONMENT RESOLUTION & SECURITY CONTROLS (PHASE 2C.1.2)
// ==============================================================================
// Server-only environment variables.
// Privileged backend routines must NEVER use VITE_ variables or unvalidated aliases.
const SUPABASE_URL = process.env.SUPABASE_URL?.trim() || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';
const DATABASE_URL = process.env.DATABASE_URL?.trim() || '';

export const isSupabaseConfigured = Boolean(
  DATABASE_URL || (SUPABASE_URL && SUPABASE_SERVICE_KEY)
);

// PostgreSQL 64-bit advisory transaction lock key for audit HMAC chaining
const AUDIT_LOCK_ID = 742369;

// Repository-controlled canonical genesis anchor for unbroken HMAC chaining
export const CANONICAL_GENESIS_PREV_HASH = 'GENESIS-SAFENET-SECURE-ANCHOR-000';

// ==============================================================================
// AUDIT LEDGER HMAC SECRET RESOLUTION
// ==============================================================================
// HISTORICAL TRANSITION & KEY COMPROMISE DOCUMENTATION:
// The legacy key 'safenet-audit-integrity-chain-key-v1' is COMPROMISED and PERMANENTLY REVOKED.
// It must NEVER be used to sign any new audit entries.
// All historical audit records and hashes are preserved immutably to ensure continuity.
// In production (NODE_ENV === 'production'): AUDIT_HMAC_SECRET is strictly mandatory (>= 32 characters).
// The service fails closed if missing or invalid.
// In development: No fallback to the compromised key is permitted. If unset, an explicit
// 'DEV-UNSIGNED' hash is generated.
export function getAuditHmacSecret(): string | null {
  const secret = process.env.AUDIT_HMAC_SECRET?.trim() || '';
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    if (!secret || secret.length < 32) {
      throw new Error(
        '[FATAL SECURITY CONFIGURATION] Missing or insufficient AUDIT_HMAC_SECRET in production. ' +
        'A fresh cryptographically secure secret (minimum 32 characters / 256 bits) must be configured.'
      );
    }
    return secret;
  }

  if (!secret || secret.length < 32) {
    return null;
  }
  return secret;
}

// Client singletons
let supabaseClient: SupabaseClient | null = null;
let pgPool: pg.Pool | null = null;

if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  } catch (err: any) {
    console.warn('[SafeNet Supabase] Initialization notice:', err?.message || err);
  }
}

if (DATABASE_URL) {
  try {
    // Preserve TLS certificate verification by default.
    // Certificate rejection is only bypassed if DATABASE_SSL_REJECT_UNAUTHORIZED === 'false' is explicitly configured.
    const isSslDisabled = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'false';
    pgPool = new pg.Pool({
      connectionString: DATABASE_URL,
      ssl: isSslDisabled ? { rejectUnauthorized: false } : true,
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });

    pgPool.on('error', (err) => {
      console.warn('[SafeNet Postgres Pool] Unexpected background pool error:', err.message);
    });
  } catch (err: any) {
    console.warn('[SafeNet Postgres] Pool initialization notice:', err?.message || err);
  }
}

// ==============================================================================
// UTILITY / DATA NORMALIZATION HELPERS
// ==============================================================================
function safeJsonParse<T>(val: any, fallback: T): T {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object') return val as T;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function safeArray<T>(val: any): T[] {
  return safeJsonParse<T[]>(val, []);
}

function safeBigIntToNumber(val: any, fallback = 0): number {
  if (val === null || val === undefined) return fallback;
  const num = Number(val);
  return Number.isNaN(num) ? fallback : num;
}

// ==============================================================================
// 1. HEALTH & READINESS PROBES (Render compliant, zero secrets exposed)
// ==============================================================================
export async function checkDatabaseConnectivity(): Promise<{
  connected: boolean;
  provider: 'supabase' | 'postgres' | 'json_fallback';
  latencyMs?: number;
  details: string;
}> {
  const start = Date.now();

  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT NOW() as now, current_database() as db');
        if (res.rows[0]) {
          return {
            connected: true,
            provider: 'postgres',
            latencyMs: Date.now() - start,
            details: `PostgreSQL direct pool connection verified (Database: ${res.rows[0].db}).`
          };
        }
      } catch (err: any) {
        return {
          connected: false,
          provider: 'postgres',
          latencyMs: Date.now() - start,
          details: `PostgreSQL direct pool connection probe failed: ${err.message}`
        };
      }
    }

    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from('site_settings').select('id').limit(1);
        if (!error) {
          return {
            connected: true,
            provider: 'supabase',
            latencyMs: Date.now() - start,
            details: 'Supabase client REST connection verified.'
          };
        }
        return {
          connected: false,
          provider: 'supabase',
          latencyMs: Date.now() - start,
          details: `Supabase client REST probe failed: ${error.message}`
        };
      } catch (err: any) {
        return {
          connected: false,
          provider: 'supabase',
          latencyMs: Date.now() - start,
          details: `Supabase client REST probe exception: ${err.message}`
        };
      }
    }

    return {
      connected: false,
      provider: 'postgres',
      latencyMs: Date.now() - start,
      details: 'Authoritative database credentials configured but clients failed to initialize.'
    };
  }

  // Graceful local persistence fallback (explicitly unconfigured mode)
  const jsonDb = readJsonDatabase();
  return {
    connected: Boolean(jsonDb),
    provider: 'json_fallback',
    latencyMs: Date.now() - start,
    details: 'Operating on local database store in development mode.'
  };
}

// ==============================================================================
// 2. SITE SETTINGS TABLE & RESTRICTED PUBLIC VIEW (Singleton: id = 'current')
// ==============================================================================
export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM site_settings WHERE id = $1', ['current']);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return normalizeDbSiteSettings({
            companyName: row.company_name,
            tagline: row.tagline,
            phone: row.phone,
            email: row.email,
            whatsapp: row.whatsapp,
            addressNigeria: row.address_nigeria,
            addressUK: row.address_uk,
            establishedYear: row.established_year,
            stats: safeJsonParse(row.stats, DEFAULT_SITE_SETTINGS.stats),
            socialPublishingMode: row.social_publishing_mode,
            socialLinks: safeJsonParse(row.social_links, DEFAULT_SITE_SETTINGS.socialLinks)
          });
        }
        // Valid empty state on fresh database: return default settings without error
        return normalizeDbSiteSettings(DEFAULT_SITE_SETTINGS);
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getSiteSettings] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('site_settings')
        .select('*')
        .eq('id', 'current')
        .maybeSingle();

      if (error) {
        throw new Error(`[SafeNet Supabase:getSiteSettings] REST query failed: ${error.message}`);
      }
      if (data) {
        return normalizeDbSiteSettings({
          companyName: data.company_name,
          tagline: data.tagline,
          phone: data.phone,
          email: data.email,
          whatsapp: data.whatsapp,
          addressNigeria: data.address_nigeria,
          addressUK: data.address_uk,
          establishedYear: data.established_year,
          stats: safeJsonParse(data.stats, DEFAULT_SITE_SETTINGS.stats),
          socialPublishingMode: data.social_publishing_mode,
          socialLinks: safeJsonParse(data.social_links, DEFAULT_SITE_SETTINGS.socialLinks)
        });
      }
      return normalizeDbSiteSettings(DEFAULT_SITE_SETTINGS);
    }

    throw new Error('[SafeNet DB:getSiteSettings] Authoritative DB client unavailable.');
  }

  // Local development mode only
  const jsonDb = readJsonDatabase();
  return normalizeDbSiteSettings(jsonDb?.siteSettings);
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const normalized = normalizeDbSiteSettings(settings);

  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query(`
          INSERT INTO site_settings (
            id, company_name, tagline, phone, email, whatsapp,
            address_nigeria, address_uk, established_year, stats,
            social_publishing_mode, social_links, updated_at
          ) VALUES (
            'current', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            company_name = EXCLUDED.company_name,
            tagline = EXCLUDED.tagline,
            phone = EXCLUDED.phone,
            email = EXCLUDED.email,
            whatsapp = EXCLUDED.whatsapp,
            address_nigeria = EXCLUDED.address_nigeria,
            address_uk = EXCLUDED.address_uk,
            established_year = EXCLUDED.established_year,
            stats = EXCLUDED.stats,
            social_publishing_mode = EXCLUDED.social_publishing_mode,
            social_links = EXCLUDED.social_links,
            updated_at = NOW();
        `, [
          normalized.companyName,
          normalized.tagline,
          normalized.phone,
          normalized.email,
          normalized.whatsapp,
          normalized.addressNigeria,
          normalized.addressUK,
          normalized.establishedYear,
          JSON.stringify(normalized.stats),
          normalized.socialPublishingMode,
          JSON.stringify(normalized.socialLinks)
        ]);
        return normalized;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:saveSiteSettings] PostgreSQL update failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('site_settings').upsert({
        id: 'current',
        company_name: normalized.companyName,
        tagline: normalized.tagline,
        phone: normalized.phone,
        email: normalized.email,
        whatsapp: normalized.whatsapp,
        address_nigeria: normalized.addressNigeria,
        address_uk: normalized.addressUK,
        established_year: normalized.establishedYear,
        stats: normalized.stats,
        social_publishing_mode: normalized.socialPublishingMode,
        social_links: normalized.socialLinks,
        updated_at: new Date().toISOString()
      });

      if (error) {
        throw new Error(`[SafeNet Supabase:saveSiteSettings] REST upsert failed: ${error.message}`);
      }
      return normalized;
    }

    throw new Error('[SafeNet DB:saveSiteSettings] Authoritative DB client unavailable.');
  }

  // Local development mode write
  const jsonDb = readJsonDatabase() || ({} as any);
  jsonDb.siteSettings = normalized;
  writeJsonDatabase(jsonDb);
  return normalized;
}

// RESTRICTED PUBLIC VIEW GETTER:
// Consumes EXCLUSIVELY the public_site_settings view.
// NEVER falls back to unrestricted getSiteSettings().
// Exposes ONLY the approved public columns, preventing leak of private operational settings.
export async function getPublicSiteSettings(): Promise<Partial<SiteSettings>> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM public_site_settings WHERE id = $1', ['current']);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            companyName: row.company_name,
            tagline: row.tagline,
            phone: row.phone,
            email: row.email,
            whatsapp: row.whatsapp,
            addressNigeria: row.address_nigeria,
            addressUK: row.address_uk,
            establishedYear: row.established_year,
            stats: safeJsonParse(row.stats, DEFAULT_SITE_SETTINGS.stats),
            socialLinks: safeJsonParse(row.social_links, DEFAULT_SITE_SETTINGS.socialLinks)
          };
        }
        // Valid empty projection on newly initialized database
        return {};
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getPublicSiteSettings] View query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('public_site_settings')
        .select('*')
        .eq('id', 'current')
        .maybeSingle();

      if (error) {
        throw new Error(`[SafeNet Supabase:getPublicSiteSettings] View query failed: ${error.message}`);
      }
      if (data) {
        return {
          companyName: data.company_name,
          tagline: data.tagline,
          phone: data.phone,
          email: data.email,
          whatsapp: data.whatsapp,
          addressNigeria: data.address_nigeria,
          addressUK: data.address_uk,
          establishedYear: data.established_year,
          stats: safeJsonParse(data.stats, DEFAULT_SITE_SETTINGS.stats),
          socialLinks: safeJsonParse(data.social_links, DEFAULT_SITE_SETTINGS.socialLinks)
        };
      }
      return {};
    }

    throw new Error('[SafeNet DB:getPublicSiteSettings] Authoritative DB client unavailable.');
  }

  // Local development mode projection (strictly sanitized public fields only)
  const jsonDb = readJsonDatabase();
  const s = normalizeDbSiteSettings(jsonDb?.siteSettings);
  return {
    companyName: s.companyName,
    tagline: s.tagline,
    phone: s.phone,
    email: s.email,
    whatsapp: s.whatsapp,
    addressNigeria: s.addressNigeria,
    addressUK: s.addressUK,
    establishedYear: s.establishedYear,
    stats: s.stats,
    socialLinks: s.socialLinks
  };
}

// ==============================================================================
// 3. ADMINISTRATOR USERS & AUTHENTICATION
// ==============================================================================
export async function getAdminUsers(): Promise<AdminUserRecord[]> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM admin_users ORDER BY created_at ASC');
        return res.rows.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          salt: u.salt,
          hash: u.hash,
          iterations: u.iterations,
          recoveryPassphraseHash: u.recovery_passphrase_hash,
          recoveryPassphraseSalt: u.recovery_passphrase_salt,
          recoveryPassphraseIterations: u.recovery_passphrase_iterations,
          createdAt: u.created_at instanceof Date ? u.created_at.toISOString() : u.created_at,
          lastLogin: u.last_login instanceof Date ? u.last_login.toISOString() : u.last_login,
          status: u.status
        }));
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getAdminUsers] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient.from('admin_users').select('*').order('created_at', { ascending: true });
      if (error) {
        throw new Error(`[SafeNet Supabase:getAdminUsers] Query failed: ${error.message}`);
      }
      if (data) {
        return data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          salt: u.salt,
          hash: u.hash,
          iterations: u.iterations,
          recoveryPassphraseHash: u.recovery_passphrase_hash,
          recoveryPassphraseSalt: u.recovery_passphrase_salt,
          recoveryPassphraseIterations: u.recovery_passphrase_iterations,
          createdAt: u.created_at,
          lastLogin: u.last_login,
          status: u.status
        }));
      }
      return [];
    }

    throw new Error('[SafeNet DB:getAdminUsers] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  return Array.isArray(jsonDb?.adminUsers) ? jsonDb.adminUsers : [];
}

export async function getAdminUserById(id: string): Promise<AdminUserRecord | null> {
  const users = await getAdminUsers();
  return users.find(u => u.id === id) || null;
}

export async function getAdminUserByEmail(email: string): Promise<AdminUserRecord | null> {
  const normalized = email.trim().toLowerCase();
  const users = await getAdminUsers();
  return users.find(u => u.email.toLowerCase() === normalized) || null;
}

export async function saveAdminUsers(users: AdminUserRecord[]): Promise<void> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      if (users.length === 0) return;
      let client: pg.PoolClient | null = null;
      try {
        client = await pgPool.connect();
        await client.query('BEGIN');
        for (const u of users) {
          await client.query(`
            INSERT INTO admin_users (
              id, name, email, role, salt, hash, iterations,
              recovery_passphrase_hash, recovery_passphrase_salt,
              recovery_passphrase_iterations, created_at, last_login, status
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
            )
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              email = EXCLUDED.email,
              role = EXCLUDED.role,
              salt = EXCLUDED.salt,
              hash = EXCLUDED.hash,
              iterations = EXCLUDED.iterations,
              recovery_passphrase_hash = EXCLUDED.recovery_passphrase_hash,
              recovery_passphrase_salt = EXCLUDED.recovery_passphrase_salt,
              recovery_passphrase_iterations = EXCLUDED.recovery_passphrase_iterations,
              last_login = EXCLUDED.last_login,
              status = EXCLUDED.status;
          `, [
            u.id,
            u.name,
            u.email,
            u.role,
            u.salt,
            u.hash,
            u.iterations || 210000,
            u.recoveryPassphraseHash || null,
            u.recoveryPassphraseSalt || null,
            u.recoveryPassphraseIterations || null,
            u.createdAt || new Date().toISOString(),
            u.lastLogin || null,
            u.status || 'active'
          ]);
        }
        await client.query('COMMIT');
        return;
      } catch (err: any) {
        if (client) {
          try { await client.query('ROLLBACK'); } catch {}
        }
        throw new Error(`[SafeNet DB:saveAdminUsers] Transactional upsert failed: ${err.message}`);
      } finally {
        if (client) client.release();
      }
    }

    if (supabaseClient) {
      if (users.length === 0) return;
      const rows = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        salt: u.salt,
        hash: u.hash,
        iterations: u.iterations || 210000,
        recovery_passphrase_hash: u.recoveryPassphraseHash || null,
        recovery_passphrase_salt: u.recoveryPassphraseSalt || null,
        recovery_passphrase_iterations: u.recoveryPassphraseIterations || null,
        created_at: u.createdAt || new Date().toISOString(),
        last_login: u.lastLogin || null,
        status: u.status || 'active'
      }));
      const { error } = await supabaseClient.from('admin_users').upsert(rows);
      if (error) {
        throw new Error(`[SafeNet Supabase:saveAdminUsers] Upsert failed: ${error.message}`);
      }
      return;
    }

    throw new Error('[SafeNet DB:saveAdminUsers] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  jsonDb.adminUsers = users;
  writeJsonDatabase(jsonDb);
}

export async function updateAdminUserLastLogin(id: string): Promise<void> {
  const nowIso = new Date().toISOString();
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query('UPDATE admin_users SET last_login = NOW() WHERE id = $1', [id]);
        return;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:updateAdminUserLastLogin] Update failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('admin_users').update({ last_login: nowIso }).eq('id', id);
      if (error) {
        throw new Error(`[SafeNet Supabase:updateAdminUserLastLogin] Update failed: ${error.message}`);
      }
      return;
    }

    throw new Error('[SafeNet DB:updateAdminUserLastLogin] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  if (jsonDb && Array.isArray(jsonDb.adminUsers)) {
    const user = jsonDb.adminUsers.find((u: any) => u.id === id);
    if (user) {
      user.lastLogin = nowIso;
      writeJsonDatabase(jsonDb);
    }
  }
}

// ==============================================================================
// 4. ADMINISTRATOR SESSIONS TABLE (Durable Server-Side Sessions)
// ==============================================================================
export async function createAdminSession(session: AdminSession): Promise<void> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query(`
          INSERT INTO admin_sessions (
            token, csrf_token, user_id, email, name, role,
            created_at, expires_at, last_activity_at, ip, user_agent, auth_source
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
          )
          ON CONFLICT (token) DO UPDATE SET
            expires_at = EXCLUDED.expires_at,
            last_activity_at = EXCLUDED.last_activity_at;
        `, [
          session.token,
          session.csrfToken,
          session.userId,
          session.email,
          session.name,
          session.role,
          session.createdAt || new Date().toISOString(),
          session.expiresAt,
          session.lastActivityAt,
          session.ip || null,
          session.userAgent || null,
          session.authSource || 'cookie'
        ]);
        return;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:createAdminSession] Session insert failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('admin_sessions').upsert({
        token: session.token,
        csrf_token: session.csrfToken,
        user_id: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
        created_at: session.createdAt || new Date().toISOString(),
        expires_at: session.expiresAt,
        last_activity_at: session.lastActivityAt,
        ip: session.ip || null,
        user_agent: session.userAgent || null,
        auth_source: session.authSource || 'cookie'
      });
      if (error) {
        throw new Error(`[SafeNet Supabase:createAdminSession] Session upsert failed: ${error.message}`);
      }
      return;
    }

    throw new Error('[SafeNet DB:createAdminSession] Authoritative DB client unavailable.');
  }
}

export async function getAdminSession(token: string): Promise<AdminSession | null> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM admin_sessions WHERE token = $1', [token]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            token: row.token,
            csrfToken: row.csrf_token,
            userId: row.user_id,
            email: row.email,
            name: row.name,
            role: row.role,
            createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
            expiresAt: safeBigIntToNumber(row.expires_at),
            lastActivityAt: safeBigIntToNumber(row.last_activity_at),
            ip: row.ip,
            userAgent: row.user_agent,
            authSource: row.auth_source || 'cookie'
          };
        }
        return null;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getAdminSession] Session lookup failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('admin_sessions')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (error) {
        throw new Error(`[SafeNet Supabase:getAdminSession] Session query failed: ${error.message}`);
      }
      if (data) {
        return {
          token: data.token,
          csrfToken: data.csrf_token,
          userId: data.user_id,
          email: data.email,
          name: data.name,
          role: data.role,
          createdAt: data.created_at,
          expiresAt: safeBigIntToNumber(data.expires_at),
          lastActivityAt: safeBigIntToNumber(data.last_activity_at),
          ip: data.ip,
          userAgent: data.user_agent,
          authSource: data.auth_source || 'cookie'
        };
      }
      return null;
    }

    throw new Error('[SafeNet DB:getAdminSession] Authoritative DB client unavailable.');
  }

  return null;
}

export async function deleteAdminSession(token: string): Promise<void> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query('DELETE FROM admin_sessions WHERE token = $1', [token]);
        return;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:deleteAdminSession] Delete failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('admin_sessions').delete().eq('token', token);
      if (error) {
        throw new Error(`[SafeNet Supabase:deleteAdminSession] Delete failed: ${error.message}`);
      }
      return;
    }

    throw new Error('[SafeNet DB:deleteAdminSession] Authoritative DB client unavailable.');
  }
}

export async function deleteAdminSessionsByUserId(userId: string): Promise<void> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query('DELETE FROM admin_sessions WHERE user_id = $1', [userId]);
        return;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:deleteAdminSessionsByUserId] Delete failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('admin_sessions').delete().eq('user_id', userId);
      if (error) {
        throw new Error(`[SafeNet Supabase:deleteAdminSessionsByUserId] Delete failed: ${error.message}`);
      }
      return;
    }

    throw new Error('[SafeNet DB:deleteAdminSessionsByUserId] Authoritative DB client unavailable.');
  }
}

export async function cleanExpiredAdminSessions(): Promise<number> {
  const now = Date.now();
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('DELETE FROM admin_sessions WHERE expires_at < $1', [now]);
        return res.rowCount || 0;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:cleanExpiredAdminSessions] Cleanup failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('admin_sessions')
        .delete()
        .lt('expires_at', now)
        .select('token');
      if (error) {
        throw new Error(`[SafeNet Supabase:cleanExpiredAdminSessions] Cleanup failed: ${error.message}`);
      }
      return Array.isArray(data) ? data.length : 0;
    }

    throw new Error('[SafeNet DB:cleanExpiredAdminSessions] Authoritative DB client unavailable.');
  }
  return 0;
}

// ==============================================================================
// 5. OWNER RECOVERY STATE TABLE (Singleton: id = 'current')
// ==============================================================================
// CANONICAL SINGLETON ENFORCEMENT:
// The production PostgreSQL schema (supabase/schema.sql line 158) strictly enforces:
//   CHECK (id = 'current')
// Legacy identifier 'primary' is prohibited by the schema constraint and must not be used.
export async function getOwnerRecoveryState(): Promise<any> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM owner_recovery_state WHERE id = $1', ['current']);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            ownerRecoveryDisabled: Boolean(row.owner_recovery_disabled),
            ownerRecoveryDisabledAt: row.owner_recovery_disabled_at,
            ownerRecoveryDisabledReason: row.owner_recovery_disabled_reason,
            recoverySecretHash: row.recovery_secret_hash,
            recoverySecretSalt: row.recovery_secret_salt,
            recoverySecretIterations: row.recovery_secret_iterations,
            invalidatedSecretHashes: safeArray<string>(row.invalidated_secret_hashes),
            lockedUntil: row.locked_until,
            version: row.version || 1
          };
        }
        // Valid empty state on fresh database: return uninitialized state object
        return {
          ownerRecoveryDisabled: false,
          invalidatedSecretHashes: [],
          version: 1
        };
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getOwnerRecoveryState] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('owner_recovery_state')
        .select('*')
        .eq('id', 'current')
        .maybeSingle();

      if (error) {
        throw new Error(`[SafeNet Supabase:getOwnerRecoveryState] Query failed: ${error.message}`);
      }
      if (data) {
        return {
          ownerRecoveryDisabled: Boolean(data.owner_recovery_disabled),
          ownerRecoveryDisabledAt: data.owner_recovery_disabled_at,
          ownerRecoveryDisabledReason: data.owner_recovery_disabled_reason,
          recoverySecretHash: data.recovery_secret_hash,
          recoverySecretSalt: data.recovery_secret_salt,
          recoverySecretIterations: data.recovery_secret_iterations,
          invalidatedSecretHashes: safeArray<string>(data.invalidated_secret_hashes),
          lockedUntil: data.locked_until,
          version: data.version || 1
        };
      }
      return {
        ownerRecoveryDisabled: false,
        invalidatedSecretHashes: [],
        version: 1
      };
    }

    throw new Error('[SafeNet DB:getOwnerRecoveryState] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  return jsonDb?.securityState || {};
}

// CONDITIONAL ATOMIC RECOVERY STATE PERSISTENCE (PHASE 2C.1.2 HARDENED):
// 1. STRICT VERSION VALIDATION:
//    - If expectedVersion is supplied in state (even if null, NaN, or non-integer),
//      it requires a valid, finite, non-negative integer.
//    - Malformed values are strictly rejected; operations are NEVER silently downgraded to an unversioned upsert!
// 2. CONCURRENCY CONTROLS:
//    - Under pgPool: executes a conditional UPDATE validating (version = expectedVersion AND owner_recovery_disabled = FALSE).
//    - Under REST: fails safely and documents the required database RPC 'consume_owner_recovery'.
//    - In local development mode: validates expectedVersion against current stored version.
export async function saveOwnerRecoveryState(state: any): Promise<void> {
  const invalidated = safeArray<string>(state.invalidatedSecretHashes);

  // Validate expectedVersion if present in the state object
  const hasExpectedVersion = 'expectedVersion' in state && state.expectedVersion !== undefined;

  if (hasExpectedVersion) {
    const ev = state.expectedVersion;
    if (typeof ev !== 'number' || !Number.isInteger(ev) || ev < 0 || !Number.isFinite(ev)) {
      throw new Error(
        `[SafeNet DB:saveOwnerRecoveryState] Malformed expectedVersion rejected: must be a valid non-negative finite integer, got ${typeof ev === 'symbol' ? 'symbol' : JSON.stringify(ev)}.`
      );
    }

    if (isSupabaseConfigured) {
      if (pgPool) {
        try {
          const updateRes = await pgPool.query(`
            UPDATE owner_recovery_state SET
              version = version + 1,
              owner_recovery_disabled = $1,
              owner_recovery_disabled_at = $2,
              owner_recovery_disabled_reason = $3,
              recovery_secret_hash = $4,
              recovery_secret_salt = $5,
              recovery_secret_iterations = $6,
              invalidated_secret_hashes = $7,
              locked_until = $8,
              updated_at = NOW()
            WHERE id = 'current' AND version = $9 AND owner_recovery_disabled = FALSE
            RETURNING version;
          `, [
            Boolean(state.ownerRecoveryDisabled),
            state.ownerRecoveryDisabledAt || null,
            state.ownerRecoveryDisabledReason || null,
            state.recoverySecretHash || null,
            state.recoverySecretSalt || null,
            state.recoverySecretIterations || null,
            JSON.stringify(invalidated),
            state.lockedUntil || null,
            ev
          ]);

          if (updateRes.rows.length === 0) {
            throw new Error(
              `[SafeNet DB:saveOwnerRecoveryState] Concurrency conflict: Recovery state version mismatch or already disabled (expected version: ${ev}).`
            );
          }
          return;
        } catch (err: any) {
          throw new Error(`[SafeNet DB:saveOwnerRecoveryState] Conditional update failed: ${err.message}`);
        }
      }

      // Supabase REST client cannot perform conditional atomic version checks without an RPC function
      throw new Error(
        '[SafeNet Supabase:saveOwnerRecoveryState] Version-sensitive conditional update in Supabase REST mode ' +
        'requires database RPC "consume_owner_recovery". Direct REST cannot atomically guarantee single-consumer consumption. ' +
        'Use direct PostgreSQL connection (DATABASE_URL) or deploy the required database RPC.'
      );
    }

    // Local development concurrency enforcement
    const jsonDb = readJsonDatabase() || ({} as any);
    const currentVersion = jsonDb.securityState?.version ?? 1;
    if (currentVersion !== ev) {
      throw new Error(`[SafeNet DB:saveOwnerRecoveryState] Concurrency conflict: Version mismatch (expected ${ev}, got ${currentVersion}).`);
    }
    if (jsonDb.securityState?.ownerRecoveryDisabled) {
      throw new Error('[SafeNet DB:saveOwnerRecoveryState] Owner recovery has already been disabled.');
    }

    const newVersion = currentVersion + 1;
    jsonDb.securityState = {
      ...state,
      version: newVersion,
      invalidatedSecretHashes: invalidated
    };
    writeJsonDatabase(jsonDb);
    return;
  }

  // Standard unversioned upsert (ONLY reached when expectedVersion was NOT supplied in state)
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query(`
          INSERT INTO owner_recovery_state (
            id, version, owner_recovery_disabled, owner_recovery_disabled_at,
            owner_recovery_disabled_reason, recovery_secret_hash,
            recovery_secret_salt, recovery_secret_iterations,
            invalidated_secret_hashes, locked_until, updated_at
          ) VALUES (
            'current', COALESCE($1, 1), $2, $3, $4, $5, $6, $7, $8, $9, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            version = owner_recovery_state.version + 1,
            owner_recovery_disabled = EXCLUDED.owner_recovery_disabled,
            owner_recovery_disabled_at = EXCLUDED.owner_recovery_disabled_at,
            owner_recovery_disabled_reason = EXCLUDED.owner_recovery_disabled_reason,
            recovery_secret_hash = EXCLUDED.recovery_secret_hash,
            recovery_secret_salt = EXCLUDED.recovery_secret_salt,
            recovery_secret_iterations = EXCLUDED.recovery_secret_iterations,
            invalidated_secret_hashes = EXCLUDED.invalidated_secret_hashes,
            locked_until = EXCLUDED.locked_until,
            updated_at = NOW();
        `, [
          state.version || 1,
          Boolean(state.ownerRecoveryDisabled),
          state.ownerRecoveryDisabledAt || null,
          state.ownerRecoveryDisabledReason || null,
          state.recoverySecretHash || null,
          state.recoverySecretSalt || null,
          state.recoverySecretIterations || null,
          JSON.stringify(invalidated),
          state.lockedUntil || null
        ]);
        return;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:saveOwnerRecoveryState] Upsert failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('owner_recovery_state').upsert({
        id: 'current',
        version: (state.version || 1) + 1,
        owner_recovery_disabled: Boolean(state.ownerRecoveryDisabled),
        owner_recovery_disabled_at: state.ownerRecoveryDisabledAt || null,
        owner_recovery_disabled_reason: state.ownerRecoveryDisabledReason || null,
        recovery_secret_hash: state.recoverySecretHash || null,
        recovery_secret_salt: state.recoverySecretSalt || null,
        recovery_secret_iterations: state.recoverySecretIterations || null,
        invalidated_secret_hashes: invalidated,
        locked_until: state.lockedUntil || null,
        updated_at: new Date().toISOString()
      });

      if (error) {
        throw new Error(`[SafeNet Supabase:saveOwnerRecoveryState] Upsert failed: ${error.message}`);
      }
      return;
    }

    throw new Error('[SafeNet DB:saveOwnerRecoveryState] Authoritative DB client unavailable.');
  }

  // Local development fallback unversioned update
  const jsonDb = readJsonDatabase() || ({} as any);
  const newVersion = (jsonDb.securityState?.version || 1) + 1;
  jsonDb.securityState = {
    ...state,
    version: newVersion,
    invalidatedSecretHashes: invalidated
  };
  writeJsonDatabase(jsonDb);
}

// ==============================================================================
// 6. LEADS / CRM / QUOTE INQUIRIES
// ==============================================================================
export async function getLeads(): Promise<Lead[]> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM leads ORDER BY created_at DESC');
        return res.rows.map(row => ({
          id: row.id,
          fullName: row.full_name,
          company: row.company || undefined,
          email: row.email,
          phone: row.phone,
          whatsapp: row.whatsapp || undefined,
          location: row.location,
          industry: row.industry || '',
          serviceRequired: row.service_required,
          propertyType: row.property_type || '',
          projectDescription: row.project_description || '',
          urgency: row.urgency || 'immediate',
          preferredContact: row.preferred_contact || 'phone',
          status: row.status || 'new',
          estimatedValue: row.estimated_value || undefined,
          notes: safeArray<LeadNote>(row.notes),
          createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
        }));
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getLeads] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`[SafeNet Supabase:getLeads] Query failed: ${error.message}`);
      }
      if (data) {
        return data.map(row => ({
          id: row.id,
          fullName: row.full_name,
          company: row.company || undefined,
          email: row.email,
          phone: row.phone,
          whatsapp: row.whatsapp || undefined,
          location: row.location,
          industry: row.industry || '',
          serviceRequired: row.service_required,
          propertyType: row.property_type || '',
          projectDescription: row.project_description || '',
          urgency: row.urgency || 'immediate',
          preferredContact: row.preferred_contact || 'phone',
          status: row.status || 'new',
          estimatedValue: row.estimated_value || undefined,
          notes: safeArray<LeadNote>(row.notes),
          createdAt: row.created_at
        }));
      }
      return [];
    }

    throw new Error('[SafeNet DB:getLeads] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  return Array.isArray(jsonDb?.leads) ? jsonDb.leads : [];
}

export async function createLead(lead: Lead): Promise<Lead> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query(`
          INSERT INTO leads (
            id, full_name, company, email, phone, whatsapp, location,
            industry, service_required, property_type, project_description,
            urgency, preferred_contact, status, estimated_value, notes,
            created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            company = EXCLUDED.company,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            whatsapp = EXCLUDED.whatsapp,
            location = EXCLUDED.location,
            industry = EXCLUDED.industry,
            service_required = EXCLUDED.service_required,
            property_type = EXCLUDED.property_type,
            project_description = EXCLUDED.project_description,
            urgency = EXCLUDED.urgency,
            preferred_contact = EXCLUDED.preferred_contact,
            status = EXCLUDED.status,
            estimated_value = EXCLUDED.estimated_value,
            notes = EXCLUDED.notes,
            updated_at = NOW();
        `, [
          lead.id,
          lead.fullName,
          lead.company || null,
          lead.email,
          lead.phone,
          lead.whatsapp || null,
          lead.location,
          lead.industry || null,
          lead.serviceRequired,
          lead.propertyType || null,
          lead.projectDescription || null,
          lead.urgency || 'immediate',
          lead.preferredContact || 'phone',
          lead.status || 'new',
          lead.estimatedValue || null,
          JSON.stringify(lead.notes || []),
          lead.createdAt || new Date().toISOString()
        ]);
        return lead;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:createLead] Upsert failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('leads').upsert({
        id: lead.id,
        full_name: lead.fullName,
        company: lead.company || null,
        email: lead.email,
        phone: lead.phone,
        whatsapp: lead.whatsapp || null,
        location: lead.location,
        industry: lead.industry || null,
        service_required: lead.serviceRequired,
        property_type: lead.propertyType || null,
        project_description: lead.projectDescription || null,
        urgency: lead.urgency || 'immediate',
        preferred_contact: lead.preferredContact || 'phone',
        status: lead.status || 'new',
        estimated_value: lead.estimatedValue || null,
        notes: lead.notes || [],
        created_at: lead.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (error) {
        throw new Error(`[SafeNet Supabase:createLead] Upsert failed: ${error.message}`);
      }
      return lead;
    }

    throw new Error('[SafeNet DB:createLead] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  if (!Array.isArray(jsonDb.leads)) jsonDb.leads = [];
  const existingIdx = jsonDb.leads.findIndex((l: any) => l.id === lead.id);
  if (existingIdx >= 0) {
    jsonDb.leads[existingIdx] = lead;
  } else {
    jsonDb.leads.unshift(lead);
  }
  writeJsonDatabase(jsonDb);

  return lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
        if (res.rowCount === 0) {
          throw new Error(`Lead not found with ID: ${id}`);
        }
        return;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:updateLeadStatus] Update failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id');

      if (error) {
        throw new Error(`[SafeNet Supabase:updateLeadStatus] Update failed: ${error.message}`);
      }
      if (!data || data.length === 0) {
        throw new Error(`Lead not found with ID: ${id}`);
      }
      return;
    }

    throw new Error('[SafeNet DB:updateLeadStatus] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  if (jsonDb && Array.isArray(jsonDb.leads)) {
    const lead = jsonDb.leads.find((l: any) => l.id === id);
    if (!lead) {
      throw new Error(`Lead not found with ID: ${id}`);
    }
    lead.status = status;
    writeJsonDatabase(jsonDb);
  }
}

// ATOMIC LEAD NOTE APPEND:
// 1. Under pgPool: executes inside an explicit transaction with row-level locking (FOR UPDATE),
//    guaranteeing true database-level atomicity without race conditions.
// 2. Under Supabase REST: direct REST SELECT-then-UPDATE cannot guarantee atomicity under concurrent requests.
//    Fails safely and documents the required database RPC 'append_lead_note'.
export async function addLeadNote(leadId: string, note: LeadNote): Promise<void> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      let client: pg.PoolClient | null = null;
      try {
        client = await pgPool.connect();
        await client.query('BEGIN');
        
        const res = await client.query('SELECT id, notes FROM leads WHERE id = $1 FOR UPDATE', [leadId]);
        if (res.rows.length === 0) {
          throw new Error(`Lead not found with ID: ${leadId}`);
        }

        const existingNotes = safeArray<LeadNote>(res.rows[0].notes);
        existingNotes.push(note);

        await client.query(
          'UPDATE leads SET notes = $1, updated_at = NOW() WHERE id = $2',
          [JSON.stringify(existingNotes), leadId]
        );

        await client.query('COMMIT');
        return;
      } catch (err: any) {
        if (client) {
          try { await client.query('ROLLBACK'); } catch {}
        }
        throw new Error(`[SafeNet DB:addLeadNote] Append failed: ${err.message}`);
      } finally {
        if (client) client.release();
      }
    }

    // Direct REST SELECT-then-UPDATE does not guarantee atomicity under concurrent requests
    throw new Error(
      '[SafeNet Supabase:addLeadNote] Atomic lead note append in Supabase REST mode requires database RPC "append_lead_note". ' +
      'Direct REST cannot guarantee atomic array append without race conditions. ' +
      'Use direct PostgreSQL connection (DATABASE_URL) or deploy the required database RPC.'
    );
  }

  // Local development fallback
  const jsonDb = readJsonDatabase();
  if (!jsonDb || !Array.isArray(jsonDb.leads)) {
    throw new Error(`Lead database is uninitialized; cannot add note to ID: ${leadId}`);
  }
  const lead = jsonDb.leads.find((l: any) => l.id === leadId);
  if (!lead) {
    throw new Error(`Lead not found with ID: ${leadId}`);
  }
  if (!Array.isArray(lead.notes)) lead.notes = [];
  lead.notes.push(note);
  writeJsonDatabase(jsonDb);
}

// ==============================================================================
// 7. SECURITY ASSESSMENTS TABLE
// ==============================================================================
export async function getSecurityAssessments(): Promise<SecurityAssessmentSubmission[]> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM security_assessments ORDER BY created_at DESC');
        return res.rows.map(row => ({
          id: row.id,
          createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
          clientName: row.client_name,
          clientEmail: row.client_email || '',
          clientPhone: row.client_phone,
          clientCompany: row.client_company || undefined,
          propertyType: row.facility_type || row.property_type || '',
          industry: row.industry || '',
          location: row.location || '',
          facilitiesCount: row.facilities_count || '',
          existingPersonnel: row.existing_personnel || '',
          cctvCoverage: row.cctv_coverage || '',
          accessControl: row.access_control || '',
          alarmSystems: row.alarm_systems || '',
          fleetSize: row.fleet_size || '',
          primaryRiskConcerns: safeArray<string>(row.primary_risk_concerns),
          calculatedScore: row.calculated_score || 50,
          riskRating: row.risk_rating || 'Moderate Risk',
          identifiedGaps: safeArray<string>(row.identified_gaps),
          recommendedServices: safeArray<string>(row.recommended_services)
        }));
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getSecurityAssessments] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('security_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`[SafeNet Supabase:getSecurityAssessments] Query failed: ${error.message}`);
      }
      if (data) {
        return data.map(row => ({
          id: row.id,
          createdAt: row.created_at,
          clientName: row.client_name,
          clientEmail: row.client_email || '',
          clientPhone: row.client_phone,
          clientCompany: row.client_company || undefined,
          propertyType: row.facility_type || row.property_type || '',
          industry: row.industry || '',
          location: row.location || '',
          facilitiesCount: row.facilities_count || '',
          existingPersonnel: row.existing_personnel || '',
          cctvCoverage: row.cctv_coverage || '',
          accessControl: row.access_control || '',
          alarmSystems: row.alarm_systems || '',
          fleetSize: row.fleet_size || '',
          primaryRiskConcerns: safeArray<string>(row.primary_risk_concerns),
          calculatedScore: row.calculated_score || 50,
          riskRating: row.risk_rating || 'Moderate Risk',
          identifiedGaps: safeArray<string>(row.identified_gaps),
          recommendedServices: safeArray<string>(row.recommended_services)
        }));
      }
      return [];
    }

    throw new Error('[SafeNet DB:getSecurityAssessments] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  return Array.isArray(jsonDb?.securityAssessments) ? jsonDb.securityAssessments : [];
}

export async function createSecurityAssessment(assessment: any): Promise<any> {
  const primaryConcerns = safeArray<string>(assessment.primaryRiskConcerns);
  const gaps = safeArray<string>(assessment.identifiedGaps);
  const recServices = safeArray<string>(assessment.recommendedServices);
  const recLayers = safeArray<string>(assessment.recommendedLayers);

  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query(`
          INSERT INTO security_assessments (
            id, client_name, client_email, client_phone, client_company,
            facility_type, industry, location, facilities_count,
            existing_personnel, cctv_coverage, access_control, alarm_systems,
            fleet_size, primary_risk_concerns, calculated_score, risk_rating,
            identified_gaps, recommended_services, recommended_layers, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
          )
          ON CONFLICT (id) DO UPDATE SET
            client_name = EXCLUDED.client_name,
            client_email = EXCLUDED.client_email,
            client_phone = EXCLUDED.client_phone,
            client_company = EXCLUDED.client_company,
            facility_type = EXCLUDED.facility_type,
            calculated_score = EXCLUDED.calculated_score,
            risk_rating = EXCLUDED.risk_rating;
        `, [
          assessment.id,
          assessment.clientName,
          assessment.clientEmail || null,
          assessment.clientPhone,
          assessment.clientCompany || null,
          assessment.facilityType || assessment.propertyType || null,
          assessment.industry || null,
          assessment.location || null,
          assessment.facilitiesCount || null,
          assessment.existingPersonnel || null,
          assessment.cctvCoverage || null,
          assessment.accessControl || null,
          assessment.alarmSystems || null,
          assessment.fleetSize || null,
          JSON.stringify(primaryConcerns),
          assessment.calculatedScore || 50,
          assessment.riskRating || 'Moderate Risk',
          JSON.stringify(gaps),
          JSON.stringify(recServices),
          JSON.stringify(recLayers),
          assessment.createdAt || new Date().toISOString()
        ]);
        return assessment;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:createSecurityAssessment] Upsert failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('security_assessments').upsert({
        id: assessment.id,
        client_name: assessment.clientName,
        client_email: assessment.clientEmail || null,
        client_phone: assessment.clientPhone,
        client_company: assessment.clientCompany || null,
        facility_type: assessment.facilityType || assessment.propertyType || null,
        industry: assessment.industry || null,
        location: assessment.location || null,
        facilities_count: assessment.facilitiesCount || null,
        existing_personnel: assessment.existingPersonnel || null,
        cctv_coverage: assessment.cctvCoverage || null,
        access_control: assessment.accessControl || null,
        alarm_systems: assessment.alarmSystems || null,
        fleet_size: assessment.fleetSize || null,
        primary_risk_concerns: primaryConcerns,
        calculated_score: assessment.calculatedScore || 50,
        risk_rating: assessment.riskRating || 'Moderate Risk',
        identifiedGaps: gaps,
        recommended_services: recServices,
        recommended_layers: recLayers,
        created_at: assessment.createdAt || new Date().toISOString()
      });

      if (error) {
        throw new Error(`[SafeNet Supabase:createSecurityAssessment] Upsert failed: ${error.message}`);
      }
      return assessment;
    }

    throw new Error('[SafeNet DB:createSecurityAssessment] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  if (!Array.isArray(jsonDb.securityAssessments)) jsonDb.securityAssessments = [];
  const existingIdx = jsonDb.securityAssessments.findIndex((a: any) => a.id === assessment.id);
  if (existingIdx >= 0) {
    jsonDb.securityAssessments[existingIdx] = assessment;
  } else {
    jsonDb.securityAssessments.unshift(assessment);
  }
  writeJsonDatabase(jsonDb);

  return assessment;
}

// ==============================================================================
// 8. BLOG POSTS TABLE
// ==============================================================================
export async function getBlogPosts(statusFilter: 'published' | 'draft' | 'all' = 'all'): Promise<BlogPost[]> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        let query = 'SELECT * FROM blog_posts';
        const params: any[] = [];
        if (statusFilter !== 'all') {
          query += ' WHERE status = $1';
          params.push(statusFilter);
        }
        query += ' ORDER BY published_at DESC';

        const res = await pgPool.query(query, params);
        return res.rows.map(row => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          content: row.content,
          featuredImage: row.featured_image || '',
          author: safeJsonParse(row.author, { name: 'SafeNet Editorial Team', role: 'Security Intelligence Group' }),
          category: row.category,
          tags: safeArray<string>(row.tags),
          publishedAt: row.published_at instanceof Date ? row.published_at.toISOString() : row.published_at,
          updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
          readingTime: row.reading_time || '4 min read',
          status: row.status,
          seoTitle: row.seo_title || '',
          seoDescription: row.seo_description || '',
          relatedServices: safeArray<string>(row.related_services),
          views: row.views || 0
        }));
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getBlogPosts] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      let builder = supabaseClient.from('blog_posts').select('*').order('published_at', { ascending: false });
      if (statusFilter !== 'all') {
        builder = builder.eq('status', statusFilter);
      }
      const { data, error } = await builder;
      if (error) {
        throw new Error(`[SafeNet Supabase:getBlogPosts] Query failed: ${error.message}`);
      }
      if (data) {
        return data.map(row => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          content: row.content,
          featuredImage: row.featured_image || '',
          author: safeJsonParse(row.author, { name: 'SafeNet Editorial Team', role: 'Security Intelligence Group' }),
          category: row.category,
          tags: safeArray<string>(row.tags),
          publishedAt: row.published_at,
          updatedAt: row.updated_at,
          readingTime: row.reading_time || '4 min read',
          status: row.status,
          seoTitle: row.seo_title || '',
          seoDescription: row.seo_description || '',
          relatedServices: safeArray<string>(row.related_services),
          views: row.views || 0
        }));
      }
      return [];
    }

    throw new Error('[SafeNet DB:getBlogPosts] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  const posts = Array.isArray(jsonDb?.blogPosts) ? jsonDb.blogPosts : [];
  if (statusFilter === 'all') return posts;
  return posts.filter(p => p.status === statusFilter);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM blog_posts WHERE slug = $1 LIMIT 1', [slug]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            id: row.id,
            slug: row.slug,
            title: row.title,
            excerpt: row.excerpt,
            content: row.content,
            featuredImage: row.featured_image || '',
            author: safeJsonParse(row.author, { name: 'SafeNet Editorial Team', role: 'Security Intelligence Group' }),
            category: row.category,
            tags: safeArray<string>(row.tags),
            publishedAt: row.published_at instanceof Date ? row.published_at.toISOString() : row.published_at,
            updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
            readingTime: row.reading_time || '4 min read',
            status: row.status,
            seoTitle: row.seo_title || '',
            seoDescription: row.seo_description || '',
            relatedServices: safeArray<string>(row.related_services),
            views: row.views || 0
          };
        }
        return null;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getBlogPostBySlug] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient.from('blog_posts').select('*').eq('slug', slug).maybeSingle();
      if (error) {
        throw new Error(`[SafeNet Supabase:getBlogPostBySlug] Query failed: ${error.message}`);
      }
      if (data) {
        return {
          id: data.id,
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          featuredImage: data.featured_image || '',
          author: safeJsonParse(data.author, { name: 'SafeNet Editorial Team', role: 'Security Intelligence Group' }),
          category: data.category,
          tags: safeArray<string>(data.tags),
          publishedAt: data.published_at,
          updatedAt: data.updated_at,
          readingTime: data.reading_time || '4 min read',
          status: data.status,
          seoTitle: data.seo_title || '',
          seoDescription: data.seo_description || '',
          relatedServices: safeArray<string>(data.related_services),
          views: data.views || 0
        };
      }
      return null;
    }

    throw new Error('[SafeNet DB:getBlogPostBySlug] Authoritative DB client unavailable.');
  }

  const posts = await getBlogPosts('all');
  return posts.find(p => p.slug === slug) || null;
}

export async function saveBlogPost(post: BlogPost): Promise<BlogPost> {
  const authorJson = JSON.stringify(post.author || { name: 'SafeNet Editorial Team', role: 'Security Intelligence Group' });
  const tagsJson = JSON.stringify(post.tags || []);
  const relServicesJson = JSON.stringify(post.relatedServices || []);

  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query(`
          INSERT INTO blog_posts (
            id, slug, title, excerpt, content, featured_image, author,
            category, tags, published_at, updated_at, reading_time,
            status, seo_title, seo_description, related_services, views
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
          )
          ON CONFLICT (id) DO UPDATE SET
            slug = EXCLUDED.slug,
            title = EXCLUDED.title,
            excerpt = EXCLUDED.excerpt,
            content = EXCLUDED.content,
            featured_image = EXCLUDED.featured_image,
            author = EXCLUDED.author,
            category = EXCLUDED.category,
            tags = EXCLUDED.tags,
            published_at = EXCLUDED.published_at,
            updated_at = NOW(),
            reading_time = EXCLUDED.reading_time,
            status = EXCLUDED.status,
            seo_title = EXCLUDED.seo_title,
            seo_description = EXCLUDED.seo_description,
            related_services = EXCLUDED.related_services;
        `, [
          post.id,
          post.slug,
          post.title,
          post.excerpt,
          post.content,
          post.featuredImage || null,
          authorJson,
          post.category,
          tagsJson,
          post.publishedAt || new Date().toISOString(),
          post.updatedAt || new Date().toISOString(),
          post.readingTime || '4 min read',
          post.status || 'draft',
          post.seoTitle || null,
          post.seoDescription || null,
          relServicesJson,
          post.views || 0
        ]);
        return post;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:saveBlogPost] Upsert failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('blog_posts').upsert({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        featured_image: post.featuredImage || null,
        author: post.author,
        category: post.category,
        tags: post.tags || [],
        published_at: post.publishedAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reading_time: post.readingTime || '4 min read',
        status: post.status || 'draft',
        seo_title: post.seoTitle || null,
        seo_description: post.seoDescription || null,
        related_services: post.relatedServices || [],
        views: post.views || 0
      });

      if (error) {
        throw new Error(`[SafeNet Supabase:saveBlogPost] Upsert failed: ${error.message}`);
      }
      return post;
    }

    throw new Error('[SafeNet DB:saveBlogPost] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  if (!Array.isArray(jsonDb.blogPosts)) jsonDb.blogPosts = [];
  const idx = jsonDb.blogPosts.findIndex((b: any) => b.id === post.id);
  if (idx >= 0) {
    jsonDb.blogPosts[idx] = post;
  } else {
    jsonDb.blogPosts.unshift(post);
  }
  writeJsonDatabase(jsonDb);

  return post;
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('DELETE FROM blog_posts WHERE id = $1', [id]);
        if (res.rowCount === 0) {
          throw new Error(`Blog post not found with ID: ${id}`);
        }
        return;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:deleteBlogPost] Delete failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('blog_posts').delete().eq('id', id);
      if (error) {
        throw new Error(`[SafeNet Supabase:deleteBlogPost] Delete failed: ${error.message}`);
      }
      return;
    }

    throw new Error('[SafeNet DB:deleteBlogPost] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  if (jsonDb && Array.isArray(jsonDb.blogPosts)) {
    jsonDb.blogPosts = jsonDb.blogPosts.filter((b: any) => b.id !== id);
    writeJsonDatabase(jsonDb);
  }
}

export async function incrementBlogPostViews(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query('UPDATE blog_posts SET views = views + 1 WHERE id = $1', [id]);
        return;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:incrementBlogPostViews] Update failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.rpc('increment_blog_views', { post_id: id });
      if (error) {
        throw new Error(`[SafeNet Supabase:incrementBlogPostViews] RPC failed: ${error.message}`);
      }
      return;
    }

    throw new Error('[SafeNet DB:incrementBlogPostViews] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  if (jsonDb && Array.isArray(jsonDb.blogPosts)) {
    const post = jsonDb.blogPosts.find((b: any) => b.id === id);
    if (post) {
      post.views = (post.views || 0) + 1;
      writeJsonDatabase(jsonDb);
    }
  }
}

// ==============================================================================
// 9. SOCIAL MEDIA ACCOUNTS TABLE
// ==============================================================================
export async function getSocialAccounts(): Promise<SocialAccount[]> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM social_accounts ORDER BY platform ASC');
        return res.rows.map(row => ({
          platform: row.platform,
          displayName: row.display_name,
          handle: row.handle,
          connected: Boolean(row.connected),
          tokenExpiry: row.token_expiry instanceof Date ? row.token_expiry.toISOString() : (row.token_expiry || ''),
          autoPublish: Boolean(row.auto_publish),
          lastSyncedAt: row.last_synced_at instanceof Date ? row.last_synced_at.toISOString() : row.last_synced_at,
          avatarUrl: row.avatar_url || undefined
        }));
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getSocialAccounts] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient.from('social_accounts').select('*').order('platform', { ascending: true });
      if (error) {
        throw new Error(`[SafeNet Supabase:getSocialAccounts] Query failed: ${error.message}`);
      }
      if (data) {
        return data.map(row => ({
          platform: row.platform,
          displayName: row.display_name,
          handle: row.handle,
          connected: Boolean(row.connected),
          tokenExpiry: row.token_expiry || '',
          autoPublish: Boolean(row.auto_publish),
          lastSyncedAt: row.last_synced_at,
          avatarUrl: row.avatar_url || undefined
        }));
      }
      return [];
    }

    throw new Error('[SafeNet DB:getSocialAccounts] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  return Array.isArray(jsonDb?.socialAccounts) ? jsonDb.socialAccounts : [];
}

export async function saveSocialAccount(account: SocialAccount): Promise<SocialAccount> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query(`
          INSERT INTO social_accounts (
            platform, display_name, handle, connected, token_expiry,
            auto_publish, last_synced_at, avatar_url
          ) VALUES (
            $1, $2, $3, $4, $5, $6, NOW(), $7
          )
          ON CONFLICT (platform) DO UPDATE SET
            display_name = EXCLUDED.display_name,
            handle = EXCLUDED.handle,
            connected = EXCLUDED.connected,
            token_expiry = EXCLUDED.token_expiry,
            auto_publish = EXCLUDED.auto_publish,
            last_synced_at = NOW(),
            avatar_url = EXCLUDED.avatar_url;
        `, [
          account.platform,
          account.displayName,
          account.handle,
          Boolean(account.connected),
          account.tokenExpiry || null,
          Boolean(account.autoPublish),
          account.avatarUrl || null
        ]);
        return account;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:saveSocialAccount] Upsert failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('social_accounts').upsert({
        platform: account.platform,
        display_name: account.displayName,
        handle: account.handle,
        connected: Boolean(account.connected),
        token_expiry: account.tokenExpiry || null,
        auto_publish: Boolean(account.autoPublish),
        last_synced_at: new Date().toISOString(),
        avatar_url: account.avatarUrl || null
      });

      if (error) {
        throw new Error(`[SafeNet Supabase:saveSocialAccount] Upsert failed: ${error.message}`);
      }
      return account;
    }

    throw new Error('[SafeNet DB:saveSocialAccount] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  if (!Array.isArray(jsonDb.socialAccounts)) jsonDb.socialAccounts = [];
  const idx = jsonDb.socialAccounts.findIndex((a: any) => a.platform === account.platform);
  if (idx >= 0) {
    jsonDb.socialAccounts[idx] = account;
  } else {
    jsonDb.socialAccounts.push(account);
  }
  writeJsonDatabase(jsonDb);

  return account;
}

// ==============================================================================
// 10. SOCIAL PUBLISH JOBS TABLE & WORKER QUEUE (PHASE 2C.1.2)
// ==============================================================================
export async function getSocialPublishJobs(): Promise<SocialPublishJob[]> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM social_publish_jobs ORDER BY date DESC');
        return res.rows.map(row => ({
          id: row.id,
          postId: row.post_id,
          postTitle: row.post_title,
          platform: row.platform,
          status: row.status,
          date: row.date instanceof Date ? row.date.toISOString() : row.date,
          postUrl: row.post_url || undefined,
          caption: row.caption,
          hashtags: safeArray<string>(row.hashtags),
          errorMessage: row.error_message || undefined,
          retryCount: row.retry_count || 0,
          idempotencyKey: row.idempotency_key,
          utmParams: safeJsonParse(row.utm_params, { source: '', medium: '', campaign: '', content: '' })
        }));
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getSocialPublishJobs] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('social_publish_jobs')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw new Error(`[SafeNet Supabase:getSocialPublishJobs] Query failed: ${error.message}`);
      }
      if (data) {
        return data.map(row => ({
          id: row.id,
          postId: row.post_id,
          postTitle: row.post_title,
          platform: row.platform,
          status: row.status,
          date: row.date,
          postUrl: row.post_url || undefined,
          caption: row.caption,
          hashtags: safeArray<string>(row.hashtags),
          errorMessage: row.error_message || undefined,
          retryCount: row.retry_count || 0,
          idempotencyKey: row.idempotency_key,
          utmParams: safeJsonParse(row.utm_params, { source: '', medium: '', campaign: '', content: '' })
        }));
      }
      return [];
    }

    throw new Error('[SafeNet DB:getSocialPublishJobs] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  return Array.isArray(jsonDb?.socialPublishJobs) ? jsonDb.socialPublishJobs : [];
}

export async function createSocialPublishJob(job: SocialPublishJob): Promise<SocialPublishJob> {
  const hashtagsJson = JSON.stringify(job.hashtags || []);
  const utmJson = JSON.stringify(job.utmParams || {});

  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query(`
          INSERT INTO social_publish_jobs (
            id, post_id, post_title, platform, status, date,
            post_url, caption, hashtags, error_message, retry_count,
            idempotency_key, utm_params, next_attempt_at, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW(), NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            error_message = EXCLUDED.error_message,
            retry_count = EXCLUDED.retry_count,
            post_url = EXCLUDED.post_url,
            updated_at = NOW();
        `, [
          job.id,
          job.postId,
          job.postTitle,
          job.platform,
          job.status || 'queued',
          job.date || new Date().toISOString(),
          job.postUrl || null,
          job.caption,
          hashtagsJson,
          job.errorMessage || null,
          job.retryCount || 0,
          job.idempotencyKey,
          utmJson
        ]);
        return job;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:createSocialPublishJob] Upsert failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('social_publish_jobs').upsert({
        id: job.id,
        post_id: job.postId,
        post_title: job.postTitle,
        platform: job.platform,
        status: job.status || 'queued',
        date: job.date || new Date().toISOString(),
        post_url: job.postUrl || null,
        caption: job.caption,
        hashtags: job.hashtags || [],
        error_message: job.errorMessage || null,
        retry_count: job.retryCount || 0,
        idempotency_key: job.idempotencyKey,
        utm_params: job.utmParams || {},
        updated_at: new Date().toISOString()
      });

      if (error) {
        throw new Error(`[SafeNet Supabase:createSocialPublishJob] Upsert failed: ${error.message}`);
      }
      return job;
    }

    throw new Error('[SafeNet DB:createSocialPublishJob] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  if (!Array.isArray(jsonDb.socialPublishJobs)) jsonDb.socialPublishJobs = [];
  const idx = jsonDb.socialPublishJobs.findIndex((j: any) => j.id === job.id);
  if (idx >= 0) {
    jsonDb.socialPublishJobs[idx] = job;
  } else {
    jsonDb.socialPublishJobs.unshift(job);
  }
  writeJsonDatabase(jsonDb);

  return job;
}

// ATOMIC WORKER CLAIM (FOR UPDATE SKIP LOCKED)
// Guarantees zero contention across concurrent multi-worker instances (e.g. Render replicas).
// Safely reclaims jobs with expired leases (locked_until < NOW()).
export async function claimNextSocialPublishJob(
  workerId: string, 
  leaseDurationMs = 300000 // 5 minutes default lease
): Promise<SocialPublishJob | null> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      let client: pg.PoolClient | null = null;
      try {
        client = await pgPool.connect();
        await client.query('BEGIN');

        const claimSql = `
          WITH claimable AS (
            SELECT id
            FROM social_publish_jobs
            WHERE (
              (status IN ('queued', 'retrying') AND next_attempt_at <= NOW() AND (locked_until IS NULL OR locked_until < NOW()))
              OR
              (status = 'processing' AND locked_until < NOW())
            )
            ORDER BY next_attempt_at ASC, created_at ASC
            LIMIT 1
            FOR UPDATE SKIP LOCKED
          )
          UPDATE social_publish_jobs j
          SET
            status = 'processing',
            locked_at = NOW(),
            locked_by = $1,
            locked_until = NOW() + ($2 || ' milliseconds')::interval,
            updated_at = NOW()
          FROM claimable
          WHERE j.id = claimable.id
          RETURNING j.*;
        `;

        const res = await client.query(claimSql, [workerId, leaseDurationMs]);
        await client.query('COMMIT');

        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            id: row.id,
            postId: row.post_id,
            postTitle: row.post_title,
            platform: row.platform,
            status: row.status,
            date: row.date instanceof Date ? row.date.toISOString() : row.date,
            postUrl: row.post_url || undefined,
            caption: row.caption,
            hashtags: safeArray<string>(row.hashtags),
            errorMessage: row.error_message || undefined,
            retryCount: row.retry_count || 0,
            idempotencyKey: row.idempotency_key,
            utmParams: safeJsonParse(row.utm_params, { source: '', medium: '', campaign: '', content: '' })
          };
        }
        return null;
      } catch (err: any) {
        if (client) {
          try { await client.query('ROLLBACK'); } catch {}
        }
        throw new Error(`[SafeNet DB:claimNextSocialPublishJob] Atomic lease claim failed: ${err.message}`);
      } finally {
        if (client) client.release();
      }
    }

    // Supabase REST client cannot perform atomic multi-statement row locks (FOR UPDATE SKIP LOCKED) without a stored procedure.
    throw new Error(
      '[SafeNet WorkerQueue] Distributed queue leasing requires direct PostgreSQL pool (DATABASE_URL) ' +
      'for FOR UPDATE SKIP LOCKED concurrency semantics. An RPC stored procedure is required for REST mode.'
    );
  }

  // Local development single-process in-memory queue
  const jsonDb = readJsonDatabase();
  if (jsonDb && Array.isArray(jsonDb.socialPublishJobs)) {
    const now = Date.now();
    const job = jsonDb.socialPublishJobs.find(
      (j: any) => j.status === 'queued' || j.status === 'retrying' || (j.status === 'processing' && j.lockedUntil && j.lockedUntil < now)
    );
    if (job) {
      job.status = 'processing';
      job.lockedBy = workerId;
      job.lockedAt = now;
      job.lockedUntil = now + leaseDurationMs;
      writeJsonDatabase(jsonDb);
      return job;
    }
  }

  return null;
}

// LEASE-VERIFIED WORKER COMPLETION (PHASE 2C.1.2 HARDENED):
// Requires matching worker identity and an unexpired lease before completion.
// Rejects stale workers even if their worker ID still matches.
export async function completeSocialPublishJob(jobId: string, workerId: string, postUrl?: string): Promise<void> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query(`
          UPDATE social_publish_jobs
          SET
            status = 'published',
            post_url = COALESCE($3, post_url),
            locked_until = NULL,
            updated_at = NOW()
          WHERE id = $1
            AND status = 'processing'
            AND locked_by = $2
            AND (locked_until IS NULL OR locked_until >= NOW())
          RETURNING id;
        `, [jobId, workerId, postUrl || null]);

        if (res.rowCount === 0) {
          throw new Error(
            `[SafeNet DB:completeSocialPublishJob] Cannot complete job ${jobId}: Worker lease expired or job was reclaimed by another worker.`
          );
        }
        return;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:completeSocialPublishJob] Completion failed: ${err.message}`);
      }
    }

    throw new Error(
      '[SafeNet WorkerQueue:completeSocialPublishJob] Safe lease-verified job completion requires direct PostgreSQL pool (DATABASE_URL).'
    );
  }

  // Local development mode lease and worker validation
  const jsonDb = readJsonDatabase();
  if (jsonDb && Array.isArray(jsonDb.socialPublishJobs)) {
    const job = jsonDb.socialPublishJobs.find((j: any) => j.id === jobId);
    if (!job) throw new Error(`[SafeNet Queue] Job not found: ${jobId}`);

    // Require processing status
    if (job.status !== 'processing') {
      throw new Error(`[SafeNet Queue] Cannot complete job ${jobId}: Job status is '${job.status}', expected 'processing'.`);
    }

    // Require matching worker identity
    if (!job.lockedBy || job.lockedBy !== workerId) {
      throw new Error(`[SafeNet Queue] Cannot complete job ${jobId}: Owned by worker '${job.lockedBy || 'none'}', not '${workerId}'.`);
    }

    // Require unexpired lease (reject stale workers even if their worker ID matches)
    const now = Date.now();
    if (typeof job.lockedUntil === 'number' && job.lockedUntil < now) {
      throw new Error(`[SafeNet Queue] Cannot complete job ${jobId}: Lease expired at ${new Date(job.lockedUntil).toISOString()} for worker '${workerId}'.`);
    }

    job.status = 'published';
    if (postUrl) job.postUrl = postUrl;
    job.lockedUntil = null;
    job.lockedBy = null;
    writeJsonDatabase(jsonDb);
    return;
  }
  throw new Error(`[SafeNet Queue] Job not found: ${jobId}`);
}

// LEASE-VERIFIED WORKER RETRY / FAILURE (PHASE 2C.1.2 HARDENED):
// Requires matching worker identity and an unexpired lease before retry/failure transition.
// Rejects stale workers even if their worker ID still matches.
export async function failOrRetrySocialPublishJob(
  jobId: string,
  workerId: string,
  errorMessage: string,
  retryDelayMs = 60000
): Promise<void> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query(`
          UPDATE social_publish_jobs
          SET
            status = CASE WHEN retry_count + 1 >= max_retries THEN 'failed' ELSE 'retrying' END,
            retry_count = retry_count + 1,
            error_message = $3,
            next_attempt_at = NOW() + ($4 || ' milliseconds')::interval,
            locked_by = NULL,
            locked_at = NULL,
            locked_until = NULL,
            updated_at = NOW()
          WHERE id = $1
            AND status = 'processing'
            AND locked_by = $2
            AND (locked_until IS NULL OR locked_until >= NOW())
          RETURNING status, retry_count;
        `, [jobId, workerId, errorMessage, retryDelayMs]);

        if (res.rowCount === 0) {
          throw new Error(
            `[SafeNet DB:failOrRetrySocialPublishJob] Cannot fail/retry job ${jobId}: Worker lease expired or job was reclaimed by another worker.`
          );
        }
        return;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:failOrRetrySocialPublishJob] Update failed: ${err.message}`);
      }
    }

    throw new Error(
      '[SafeNet WorkerQueue:failOrRetrySocialPublishJob] Safe lease-verified job retry requires direct PostgreSQL pool (DATABASE_URL).'
    );
  }

  // Local development mode lease and worker validation
  const jsonDb = readJsonDatabase();
  if (jsonDb && Array.isArray(jsonDb.socialPublishJobs)) {
    const job = jsonDb.socialPublishJobs.find((j: any) => j.id === jobId);
    if (!job) throw new Error(`[SafeNet Queue] Job not found: ${jobId}`);

    // Require processing status
    if (job.status !== 'processing') {
      throw new Error(`[SafeNet Queue] Cannot fail/retry job ${jobId}: Job status is '${job.status}', expected 'processing'.`);
    }

    // Require matching worker identity
    if (!job.lockedBy || job.lockedBy !== workerId) {
      throw new Error(`[SafeNet Queue] Cannot fail/retry job ${jobId}: Owned by worker '${job.lockedBy || 'none'}', not '${workerId}'.`);
    }

    // Require unexpired lease (reject stale workers even if their worker ID matches)
    const now = Date.now();
    if (typeof job.lockedUntil === 'number' && job.lockedUntil < now) {
      throw new Error(`[SafeNet Queue] Cannot fail/retry job ${jobId}: Lease expired at ${new Date(job.lockedUntil).toISOString()} for worker '${workerId}'.`);
    }

    job.retryCount = (job.retryCount || 0) + 1;
    job.status = job.retryCount >= (job.maxRetries || 3) ? 'failed' : 'retrying';
    job.errorMessage = errorMessage;
    job.nextAttemptAt = new Date(now + retryDelayMs).toISOString();
    job.lockedBy = null;
    job.lockedAt = null;
    job.lockedUntil = null;
    writeJsonDatabase(jsonDb);
    return;
  }
  throw new Error(`[SafeNet Queue] Job not found: ${jobId}`);
}

// ==============================================================================
// 11. CAREER OPENINGS TABLE
// ==============================================================================
export async function getCareerOpenings(activeOnly = false): Promise<CareerOpening[]> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        let query = 'SELECT * FROM career_openings';
        if (activeOnly) query += ' WHERE active = TRUE';
        query += ' ORDER BY created_at DESC';

        const res = await pgPool.query(query);
        return res.rows.map(row => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          department: row.department,
          location: row.location,
          employmentType: row.employment_type || 'Full-time',
          requirements: safeArray<string>(row.requirements),
          responsibilities: safeArray<string>(row.responsibilities),
          active: Boolean(row.active)
        }));
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getCareerOpenings] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      let builder = supabaseClient.from('career_openings').select('*').order('created_at', { ascending: false });
      if (activeOnly) {
        builder = builder.eq('active', true);
      }
      const { data, error } = await builder;
      if (error) {
        throw new Error(`[SafeNet Supabase:getCareerOpenings] Query failed: ${error.message}`);
      }
      if (data) {
        return data.map(row => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          department: row.department,
          location: row.location,
          employmentType: row.employment_type || 'Full-time',
          requirements: safeArray<string>(row.requirements),
          responsibilities: safeArray<string>(row.responsibilities),
          active: Boolean(row.active)
        }));
      }
      return [];
    }

    throw new Error('[SafeNet DB:getCareerOpenings] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  const openings = Array.isArray(jsonDb?.careerOpenings) ? jsonDb.careerOpenings : [];
  if (activeOnly) return openings.filter(o => o.active !== false);
  return openings;
}

export async function saveCareerOpening(opening: CareerOpening): Promise<CareerOpening> {
  const reqJson = JSON.stringify(opening.requirements || []);
  const respJson = JSON.stringify(opening.responsibilities || []);

  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query(`
          INSERT INTO career_openings (
            id, slug, title, department, location, employment_type,
            requirements, responsibilities, active, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            slug = EXCLUDED.slug,
            title = EXCLUDED.title,
            department = EXCLUDED.department,
            location = EXCLUDED.location,
            employment_type = EXCLUDED.employment_type,
            requirements = EXCLUDED.requirements,
            responsibilities = EXCLUDED.responsibilities,
            active = EXCLUDED.active;
        `, [
          opening.id,
          opening.slug,
          opening.title,
          opening.department,
          opening.location,
          opening.employmentType || 'Full-time',
          reqJson,
          respJson,
          Boolean(opening.active)
        ]);
        return opening;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:saveCareerOpening] Upsert failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('career_openings').upsert({
        id: opening.id,
        slug: opening.slug,
        title: opening.title,
        department: opening.department,
        location: opening.location,
        employment_type: opening.employmentType || 'Full-time',
        requirements: opening.requirements || [],
        responsibilities: opening.responsibilities || [],
        active: Boolean(opening.active)
      });

      if (error) {
        throw new Error(`[SafeNet Supabase:saveCareerOpening] Upsert failed: ${error.message}`);
      }
      return opening;
    }

    throw new Error('[SafeNet DB:saveCareerOpening] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  if (!Array.isArray(jsonDb.careerOpenings)) jsonDb.careerOpenings = [];
  const idx = jsonDb.careerOpenings.findIndex((o: any) => o.id === opening.id);
  if (idx >= 0) {
    jsonDb.careerOpenings[idx] = opening;
  } else {
    jsonDb.careerOpenings.unshift(opening);
  }
  writeJsonDatabase(jsonDb);

  return opening;
}

export async function deleteCareerOpening(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('DELETE FROM career_openings WHERE id = $1', [id]);
        if (res.rowCount === 0) {
          throw new Error(`Career opening not found with ID: ${id}`);
        }
        return;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:deleteCareerOpening] Delete failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('career_openings').delete().eq('id', id);
      if (error) {
        throw new Error(`[SafeNet Supabase:deleteCareerOpening] Delete failed: ${error.message}`);
      }
      return;
    }

    throw new Error('[SafeNet DB:deleteCareerOpening] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  if (jsonDb && Array.isArray(jsonDb.careerOpenings)) {
    jsonDb.careerOpenings = jsonDb.careerOpenings.filter((o: any) => o.id !== id);
    writeJsonDatabase(jsonDb);
  }
}

// ==============================================================================
// 12. JOB APPLICATIONS TABLE (Careers Dossier) (PHASE 2C.1.2 HARDENED)
// ==============================================================================
// IDEMPOTENCY & DUPLICATE PROTECTION:
// Duplicate submissions with the same ID cannot reset or overwrite an existing application's
// processing status ('reviewing', 'interviewed', 'offered', 'rejected'), submitted_at, or NSDC status.
// Handles simultaneous duplicate submissions safely across race conditions.
export async function getJobApplications(): Promise<JobApplication[]> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM job_applications ORDER BY submitted_at DESC');
        return res.rows.map(row => ({
          id: row.id,
          openingId: row.opening_id || undefined,
          jobSlug: row.job_slug || '',
          jobTitle: row.job_title || 'Security Guard',
          applicantName: row.applicant_name,
          applicantEmail: row.applicant_email,
          applicantPhone: row.applicant_phone,
          experienceYears: row.experience_years || '',
          coverNote: row.cover_note || undefined,
          resumeFileName: row.resume_file_name || '',
          status: row.status || 'pending',
          submittedAt: row.submitted_at instanceof Date ? row.submitted_at.toISOString() : row.submitted_at
        }));
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getJobApplications] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('job_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        throw new Error(`[SafeNet Supabase:getJobApplications] Query failed: ${error.message}`);
      }
      if (data) {
        return data.map(row => ({
          id: row.id,
          openingId: row.opening_id || undefined,
          jobSlug: row.job_slug || '',
          jobTitle: row.job_title || 'Security Guard',
          applicantName: row.applicant_name,
          applicantEmail: row.applicant_email,
          applicantPhone: row.applicant_phone,
          experienceYears: row.experience_years || '',
          coverNote: row.cover_note || undefined,
          resumeFileName: row.resume_file_name || '',
          status: row.status || 'pending',
          submittedAt: row.submitted_at
        }));
      }
      return [];
    }

    throw new Error('[SafeNet DB:getJobApplications] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  return Array.isArray(jsonDb?.jobApplications) ? jsonDb.jobApplications : [];
}

export async function createJobApplication(app: any): Promise<any> {
  // Respect nullable foreign key relationship to career_openings
  const cleanOpeningId = app.openingId && typeof app.openingId === 'string' && app.openingId.trim().length > 0 
    ? app.openingId.trim() 
    : null;

  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        // ON CONFLICT (id) DO NOTHING preserves existing status and data unconditionally
        const insertRes = await pgPool.query(`
          INSERT INTO job_applications (
            id, opening_id, job_slug, job_title, applicant_name,
            applicant_email, applicant_phone, experience_years, cover_note,
            resume_file_name, status, nsdc_status, submitted_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
          )
          ON CONFLICT (id) DO NOTHING
          RETURNING *;
        `, [
          app.id,
          cleanOpeningId,
          app.jobSlug || null,
          app.jobTitle || 'Security Guard',
          app.applicantName,
          app.applicantEmail,
          app.applicantPhone,
          app.experienceYears || null,
          app.coverNote || null,
          app.resumeFileName || null,
          app.status || 'pending',
          app.nsdcStatus || null,
          app.submittedAt || new Date().toISOString()
        ]);

        if (insertRes.rows.length > 0) {
          return app;
        }

        // Duplicate submission detected (insert lost race or duplicate ID):
        // Retrieve and return existing application without altering review status, NSDC status, or submittedAt
        const existingRes = await pgPool.query('SELECT * FROM job_applications WHERE id = $1', [app.id]);
        if (existingRes.rows.length > 0) {
          const row = existingRes.rows[0];
          return {
            id: row.id,
            openingId: row.opening_id || undefined,
            jobSlug: row.job_slug,
            jobTitle: row.job_title,
            applicantName: row.applicant_name,
            applicantEmail: row.applicant_email,
            applicantPhone: row.applicant_phone,
            experienceYears: row.experience_years,
            coverNote: row.cover_note || undefined,
            resumeFileName: row.resume_file_name,
            status: row.status,
            nsdcStatus: row.nsdc_status || undefined,
            submittedAt: row.submitted_at instanceof Date ? row.submitted_at.toISOString() : row.submitted_at
          };
        }
        return app;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:createJobApplication] Insert failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      // Check for existing application first to preserve processing status
      const { data: existing, error: checkErr } = await supabaseClient
        .from('job_applications')
        .select('*')
        .eq('id', app.id)
        .maybeSingle();

      if (checkErr) {
        throw new Error(`[SafeNet Supabase:createJobApplication] Check failed: ${checkErr.message}`);
      }
      if (existing) {
        return {
          id: existing.id,
          openingId: existing.opening_id || undefined,
          jobSlug: existing.job_slug,
          jobTitle: existing.job_title,
          applicantName: existing.applicant_name,
          applicantEmail: existing.applicant_email,
          applicantPhone: existing.applicant_phone,
          experienceYears: existing.experience_years,
          coverNote: existing.cover_note || undefined,
          resumeFileName: existing.resume_file_name,
          status: existing.status,
          nsdcStatus: existing.nsdc_status || undefined,
          submittedAt: existing.submitted_at
        };
      }

      // Insert new application
      const { error: insertErr } = await supabaseClient.from('job_applications').insert({
        id: app.id,
        opening_id: cleanOpeningId,
        job_slug: app.jobSlug || null,
        job_title: app.jobTitle || 'Security Guard',
        applicant_name: app.applicantName,
        applicant_email: app.applicantEmail,
        applicant_phone: app.applicantPhone,
        experience_years: app.experienceYears || null,
        cover_note: app.coverNote || null,
        resume_file_name: app.resumeFileName || null,
        status: app.status || 'pending',
        nsdc_status: app.nsdcStatus || null,
        submitted_at: app.submittedAt || new Date().toISOString()
      });

      if (insertErr) {
        // If an insert loses a unique-ID race (Postgres code 23505 / duplicate key error / 409):
        // Retrieve and return the existing record. Never overwrite or throw unhandled.
        const isDuplicateRace = insertErr.code === '23505' || 
          insertErr.message?.includes('duplicate key') || 
          insertErr.message?.includes('job_applications_pkey') ||
          insertErr.details?.includes('already exists');

        if (isDuplicateRace) {
          const { data: raceWinner, error: raceLookupErr } = await supabaseClient
            .from('job_applications')
            .select('*')
            .eq('id', app.id)
            .maybeSingle();

          if (!raceLookupErr && raceWinner) {
            return {
              id: raceWinner.id,
              openingId: raceWinner.opening_id || undefined,
              jobSlug: raceWinner.job_slug,
              jobTitle: raceWinner.job_title,
              applicantName: raceWinner.applicant_name,
              applicantEmail: raceWinner.applicant_email,
              applicantPhone: raceWinner.applicant_phone,
              experienceYears: raceWinner.experience_years,
              coverNote: raceWinner.cover_note || undefined,
              resumeFileName: raceWinner.resume_file_name,
              status: raceWinner.status,
              nsdcStatus: raceWinner.nsdc_status || undefined,
              submittedAt: raceWinner.submitted_at
            };
          }
        }

        throw new Error(`[SafeNet Supabase:createJobApplication] Insert failed: ${insertErr.message}`);
      }
      return app;
    }

    throw new Error('[SafeNet DB:createJobApplication] Authoritative DB client unavailable.');
  }

  // Local development fallback: preserve existing record on duplicate submission
  const jsonDb = readJsonDatabase() || ({} as any);
  if (!Array.isArray(jsonDb.jobApplications)) jsonDb.jobApplications = [];
  const existing = jsonDb.jobApplications.find((a: any) => a.id === app.id);
  if (existing) {
    return existing; // Idempotent return without status reset
  }

  jsonDb.jobApplications.unshift(app);
  writeJsonDatabase(jsonDb);
  return app;
}

// ==============================================================================
// 13. TESTIMONIALS TABLE
// ==============================================================================
export async function getTestimonials(publishedOnly = false): Promise<Testimonial[]> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        let query = 'SELECT * FROM testimonials';
        if (publishedOnly) query += ' WHERE published = TRUE';
        query += ' ORDER BY created_at DESC';

        const res = await pgPool.query(query);
        return res.rows.map(row => ({
          id: row.id,
          name: row.name,
          position: row.position,
          organization: row.organization,
          testimonial: row.testimonial,
          rating: row.rating || 5,
          published: Boolean(row.published),
          location: row.location
        }));
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getTestimonials] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      let builder = supabaseClient.from('testimonials').select('*').order('created_at', { ascending: false });
      if (publishedOnly) {
        builder = builder.eq('published', true);
      }
      const { data, error } = await builder;
      if (error) {
        throw new Error(`[SafeNet Supabase:getTestimonials] Query failed: ${error.message}`);
      }
      if (data) {
        return data.map(row => ({
          id: row.id,
          name: row.name,
          position: row.position,
          organization: row.organization,
          testimonial: row.testimonial,
          rating: row.rating || 5,
          published: Boolean(row.published),
          location: row.location
        }));
      }
      return [];
    }

    throw new Error('[SafeNet DB:getTestimonials] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  const list = Array.isArray(jsonDb?.testimonials) ? jsonDb.testimonials : [];
  if (publishedOnly) return list.filter(t => t.published !== false);
  return list;
}

export async function saveTestimonial(testimonial: Testimonial): Promise<Testimonial> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query(`
          INSERT INTO testimonials (
            id, name, position, organization, testimonial,
            rating, published, location, created_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            position = EXCLUDED.position,
            organization = EXCLUDED.organization,
            testimonial = EXCLUDED.testimonial,
            rating = EXCLUDED.rating,
            published = EXCLUDED.published,
            location = EXCLUDED.location;
        `, [
          testimonial.id,
          testimonial.name,
          testimonial.position,
          testimonial.organization,
          testimonial.testimonial,
          testimonial.rating || 5,
          Boolean(testimonial.published),
          testimonial.location
        ]);
        return testimonial;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:saveTestimonial] Upsert failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('testimonials').upsert({
        id: testimonial.id,
        name: testimonial.name,
        position: testimonial.position,
        organization: testimonial.organization,
        testimonial: testimonial.testimonial,
        rating: testimonial.rating || 5,
        published: Boolean(testimonial.published),
        location: testimonial.location
      });

      if (error) {
        throw new Error(`[SafeNet Supabase:saveTestimonial] Upsert failed: ${error.message}`);
      }
      return testimonial;
    }

    throw new Error('[SafeNet DB:saveTestimonial] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  if (!Array.isArray(jsonDb.testimonials)) jsonDb.testimonials = [];
  const idx = jsonDb.testimonials.findIndex((t: any) => t.id === testimonial.id);
  if (idx >= 0) {
    jsonDb.testimonials[idx] = testimonial;
  } else {
    jsonDb.testimonials.unshift(testimonial);
  }
  writeJsonDatabase(jsonDb);

  return testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('DELETE FROM testimonials WHERE id = $1', [id]);
        if (res.rowCount === 0) {
          throw new Error(`Testimonial not found with ID: ${id}`);
        }
        return;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:deleteTestimonial] Delete failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('testimonials').delete().eq('id', id);
      if (error) {
        throw new Error(`[SafeNet Supabase:deleteTestimonial] Delete failed: ${error.message}`);
      }
      return;
    }

    throw new Error('[SafeNet DB:deleteTestimonial] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  if (jsonDb && Array.isArray(jsonDb.testimonials)) {
    jsonDb.testimonials = jsonDb.testimonials.filter((t: any) => t.id !== id);
    writeJsonDatabase(jsonDb);
  }
}

// ==============================================================================
// 14. AUDIT LOGS TABLE & TAMPER-EVIDENT HMAC CHAIN (PHASE 2C.1.2)
// ==============================================================================
export async function getAuditLogs(limit = 100): Promise<AuditLog[]> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT $1', [limit]);
        return res.rows.map(row => ({
          id: row.id,
          timestamp: row.timestamp instanceof Date ? row.timestamp.toISOString() : row.timestamp,
          user: row.user_identifier,
          action: row.action,
          target: row.target,
          details: row.details,
          ip: row.ip,
          hash: row.hash || undefined,
          prevHash: row.prev_hash || undefined
        }));
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getAuditLogs] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`[SafeNet Supabase:getAuditLogs] Query failed: ${error.message}`);
      }
      if (data) {
        return data.map(row => ({
          id: row.id,
          timestamp: row.timestamp,
          user: row.user_identifier,
          action: row.action,
          target: row.target,
          details: row.details,
          ip: row.ip,
          hash: row.hash || undefined,
          prevHash: row.prev_hash || undefined
        }));
      }
      return [];
    }

    throw new Error('[SafeNet DB:getAuditLogs] Authoritative DB client unavailable.');
  }

  const jsonDb = readJsonDatabase();
  const list = Array.isArray(jsonDb?.auditLogs) ? jsonDb.auditLogs : [];
  return list.slice(0, limit);
}

// ATOMIC ADVISORY-LOCKED AUDIT LOG APPEND:
// 1. Authoritative history is preserved unconditionally; history is NEVER truncated in the DB.
// 2. Timestamp is normalized once before HMAC calculation and database insert.
// 3. Advisory lock, hash lookup, and insert are executed strictly on the SAME transaction/client.
// 4. CANONICAL GENESIS ANCHORING: When the audit table is empty, CANONICAL_GENESIS_PREV_HASH is enforced.
//    Caller-supplied log.prevHash is NEVER trusted as the initial chain anchor.
export async function recordAuditLog(log: AuditLog): Promise<AuditLog> {
  const hmacSecret = getAuditHmacSecret();

  // Normalize timestamp once to guarantee byte-for-byte fidelity across HMAC and DB storage
  const normalizedTimestamp = log.timestamp ? new Date(log.timestamp).toISOString() : new Date().toISOString();
  log.timestamp = normalizedTimestamp;

  if (isSupabaseConfigured) {
    if (pgPool) {
      let client: pg.PoolClient | null = null;
      try {
        client = await pgPool.connect();
        await client.query('BEGIN');
        
        // Hold transaction-level advisory lock (released automatically on COMMIT/ROLLBACK)
        await client.query('SELECT pg_advisory_xact_lock($1)', [AUDIT_LOCK_ID]);

        // Read newest audit record hash on the SAME connection
        const latestRes = await client.query('SELECT hash FROM audit_logs ORDER BY timestamp DESC, id DESC LIMIT 1');
        // REPOSITORY-CONTROLLED GENESIS ANCHOR: ignore caller-supplied prevHash when table is empty
        const prevHash = latestRes.rows[0]?.hash || CANONICAL_GENESIS_PREV_HASH;

        // Compute tamper-evident HMAC
        const logPayload = `${prevHash}:${log.id}:${normalizedTimestamp}:${log.user}:${log.action}:${log.target}:${log.details}:${log.ip}`;
        let hash: string;
        if (hmacSecret) {
          hash = crypto.createHmac('sha256', hmacSecret).update(logPayload).digest('hex');
        } else {
          hash = log.hash || `DEV-UNSIGNED-${crypto.createHash('sha256').update(logPayload).digest('hex').substring(0, 16)}`;
        }

        await client.query(`
          INSERT INTO audit_logs (id, timestamp, user_identifier, action, target, details, ip, hash, prev_hash)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `, [
          log.id,
          normalizedTimestamp,
          log.user,
          log.action,
          log.target,
          log.details,
          log.ip,
          hash,
          prevHash
        ]);

        await client.query('COMMIT');
        log.hash = hash;
        log.prevHash = prevHash;
        return log;
      } catch (err: any) {
        if (client) {
          try { await client.query('ROLLBACK'); } catch {}
        }
        throw new Error(`[SafeNet DB:recordAuditLog] Advisory-locked audit append failed: ${err.message}`);
      } finally {
        if (client) client.release();
      }
    }

    if (supabaseClient) {
      // Supabase REST client cannot hold advisory locks across distinct HTTP calls.
      // In production, reject REST audit writes to avoid race conditions and chain forking.
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          '[SafeNet Audit] Production audit logging requires direct PostgreSQL connection (DATABASE_URL) ' +
          'for transactional advisory locking to prevent hash chain forks. A database RPC is required for REST mode.'
        );
      }

      // Non-production REST append attempt
      const { data: latestData, error: latestErr } = await supabaseClient
        .from('audit_logs')
        .select('hash')
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestErr) {
        throw new Error(`[SafeNet Supabase:recordAuditLog] Chain lookup failed: ${latestErr.message}`);
      }

      // Repository-controlled genesis anchor
      const prevHash = latestData?.hash || CANONICAL_GENESIS_PREV_HASH;
      const logPayload = `${prevHash}:${log.id}:${normalizedTimestamp}:${log.user}:${log.action}:${log.target}:${log.details}:${log.ip}`;
      let hash: string;
      if (hmacSecret) {
        hash = crypto.createHmac('sha256', hmacSecret).update(logPayload).digest('hex');
      } else {
        hash = log.hash || `DEV-UNSIGNED-${crypto.createHash('sha256').update(logPayload).digest('hex').substring(0, 16)}`;
      }

      const { error: insertErr } = await supabaseClient.from('audit_logs').insert({
        id: log.id,
        timestamp: normalizedTimestamp,
        user_identifier: log.user,
        action: log.action,
        target: log.target,
        details: log.details,
        ip: log.ip,
        hash,
        prev_hash: prevHash
      });

      if (insertErr) {
        throw new Error(`[SafeNet Supabase:recordAuditLog] Insert failed: ${insertErr.message}`);
      }

      log.hash = hash;
      log.prevHash = prevHash;
      return log;
    }

    throw new Error('[SafeNet DB:recordAuditLog] Authoritative DB client unavailable.');
  }

  // Local development fallback: repository-controlled genesis anchor
  const jsonDb = readJsonDatabase() || ({} as any);
  if (!Array.isArray(jsonDb.auditLogs)) jsonDb.auditLogs = [];
  
  const prevHash = jsonDb.auditLogs[0]?.hash || CANONICAL_GENESIS_PREV_HASH;
  const logPayload = `${prevHash}:${log.id}:${normalizedTimestamp}:${log.user}:${log.action}:${log.target}:${log.details}:${log.ip}`;
  if (hmacSecret) {
    log.hash = crypto.createHmac('sha256', hmacSecret).update(logPayload).digest('hex');
  } else {
    log.hash = `DEV-UNSIGNED-${crypto.createHash('sha256').update(logPayload).digest('hex').substring(0, 16)}`;
  }
  log.prevHash = prevHash;

  jsonDb.auditLogs.unshift(log);
  if (jsonDb.auditLogs.length > 250) {
    jsonDb.auditLogs = jsonDb.auditLogs.slice(0, 250);
  }
  writeJsonDatabase(jsonDb);

  return log;
}

// ==============================================================================
// 15. MIGRATION METADATA TABLE
// ==============================================================================
export async function recordMigrationMetadata(metadata: {
  id: string;
  sourceFile: string;
  recordCounts: Record<string, number>;
  status?: string;
}): Promise<void> {
  const countsJson = JSON.stringify(metadata.recordCounts || {});
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        await pgPool.query(`
          INSERT INTO migration_metadata (id, source_file, migrated_at, record_counts, status)
          VALUES ($1, $2, NOW(), $3, $4)
          ON CONFLICT (id) DO UPDATE SET
            migrated_at = NOW(),
            record_counts = EXCLUDED.record_counts,
            status = EXCLUDED.status;
        `, [metadata.id, metadata.sourceFile, countsJson, metadata.status || 'completed']);
        return;
      } catch (err: any) {
        throw new Error(`[SafeNet DB:recordMigrationMetadata] Upsert failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { error } = await supabaseClient.from('migration_metadata').upsert({
        id: metadata.id,
        source_file: metadata.sourceFile,
        migrated_at: new Date().toISOString(),
        record_counts: metadata.recordCounts,
        status: metadata.status || 'completed'
      });
      if (error) {
        throw new Error(`[SafeNet Supabase:recordMigrationMetadata] Upsert failed: ${error.message}`);
      }
      return;
    }

    throw new Error('[SafeNet DB:recordMigrationMetadata] Authoritative DB client unavailable.');
  }
}

export async function getMigrationMetadata(): Promise<any[]> {
  if (isSupabaseConfigured) {
    if (pgPool) {
      try {
        const res = await pgPool.query('SELECT * FROM migration_metadata ORDER BY migrated_at DESC');
        return res.rows.map(row => ({
          id: row.id,
          sourceFile: row.source_file,
          migratedAt: row.migrated_at,
          recordCounts: safeJsonParse(row.record_counts, {}),
          status: row.status
        }));
      } catch (err: any) {
        throw new Error(`[SafeNet DB:getMigrationMetadata] Query failed: ${err.message}`);
      }
    }

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('migration_metadata')
        .select('*')
        .order('migrated_at', { ascending: false });
      if (error) {
        throw new Error(`[SafeNet Supabase:getMigrationMetadata] Query failed: ${error.message}`);
      }
      return data || [];
    }

    throw new Error('[SafeNet DB:getMigrationMetadata] Authoritative DB client unavailable.');
  }
  return [];
}

// ==============================================================================
// 16. FULL APPLICATION STATE SYNCHRONIZATION (PHASE 2C.1.2)
// ==============================================================================
// PUBLIC DATA ISOLATION:
// When getFullState(false) is called, it consumes getPublicSiteSettings()
// instead of getSiteSettings(), guaranteeing that private administrative configs
// (social_publishing_mode, internal flags, etc.) can never leak into public responses.
export async function getFullState(isAdmin = false): Promise<any> {
  if (isSupabaseConfigured) {
    if (!isAdmin) {
      const [siteSettings, blogPosts, testimonials, careerOpenings] = await Promise.all([
        getPublicSiteSettings(), // Enforces strict public projection boundary
        getBlogPosts('published'),
        getTestimonials(true),
        getCareerOpenings(true)
      ]);

      return {
        siteSettings,
        blogPosts,
        testimonials,
        careerOpenings,
        updatedAt: new Date().toISOString()
      };
    }

    const [
      siteSettings,
      adminUsers,
      leads,
      securityAssessments,
      blogPosts,
      socialAccounts,
      socialPublishJobs,
      careerOpenings,
      jobApplications,
      testimonials,
      auditLogs,
      securityState
    ] = await Promise.all([
      getSiteSettings(),
      getAdminUsers(),
      getLeads(),
      getSecurityAssessments(),
      getBlogPosts('all'),
      getSocialAccounts(),
      getSocialPublishJobs(),
      getCareerOpenings(false),
      getJobApplications(),
      getTestimonials(false),
      getAuditLogs(250),
      getOwnerRecoveryState()
    ]);

    return {
      siteSettings,
      adminUsers,
      leads,
      securityAssessments,
      blogPosts,
      socialAccounts,
      socialPublishJobs,
      careerOpenings,
      jobApplications,
      testimonials,
      auditLogs,
      securityState,
      updatedAt: new Date().toISOString()
    };
  }

  // Local development fallback
  if (!isAdmin) {
    const publicSettings = await getPublicSiteSettings(); // Sanitized public settings only
    const jsonDb = readJsonDatabase() || ({} as any);
    return {
      siteSettings: publicSettings,
      blogPosts: (jsonDb.blogPosts || []).filter((b: any) => b.status === 'published'),
      testimonials: (jsonDb.testimonials || []).filter((t: any) => t.published !== false),
      careerOpenings: (jsonDb.careerOpenings || []).filter((c: any) => c.active !== false),
      updatedAt: jsonDb.updatedAt || new Date().toISOString()
    };
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  return {
    ...jsonDb,
    siteSettings: normalizeDbSiteSettings(jsonDb.siteSettings)
  };
}
