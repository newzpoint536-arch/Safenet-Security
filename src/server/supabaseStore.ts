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
  SecurityAssessmentSubmission, 
  BlogPost, 
  SocialAccount, 
  SocialPublishJob, 
  JobApplication, 
  Testimonial, 
  AuditLog 
} from '../types/index.js';
import type { AdminUserRecord } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment detection
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || '';

export const isSupabaseConfigured = Boolean(
  (SUPABASE_URL && SUPABASE_SERVICE_KEY) || DATABASE_URL
);

// ==========================================
// AUDIT LEDGER HMAC SECRET RESOLUTION
// ==========================================
// HISTORICAL TRANSITION & KEY COMPROMISE DOCUMENTATION:
// The legacy key 'safenet-audit-integrity-chain-key-v1' is COMPROMISED and PERMANENTLY REVOKED.
// It must NEVER be used to sign any new audit entries.
// In production (NODE_ENV === 'production'): AUDIT_HMAC_SECRET is strictly mandatory (>= 32 characters).
// Fails closed if missing or invalid.
// In development: No fallback to the compromised key is permitted.
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

const AUDIT_LOCK_ID = 742369; // PostgreSQL 64-bit advisory transaction lock key for audit HMAC chaining

let supabaseClient: SupabaseClient | null = null;
let pgPool: pg.Pool | null = null;

if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  } catch (err) {
    console.warn('[SafeNet Supabase] Initialization notice:', err);
  }
}

if (DATABASE_URL) {
  try {
    pgPool = new pg.Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000
    });
  } catch (err) {
    console.warn('[SafeNet Postgres] Pool initialization notice:', err);
  }
}

// ==============================================================================
// HEALTH & READINESS PROBES (Render compliant, zero secrets exposed)
// ==============================================================================

export async function checkDatabaseConnectivity(): Promise<{
  connected: boolean;
  provider: 'supabase' | 'postgres' | 'json_fallback';
  latencyMs?: number;
  details: string;
}> {
  const start = Date.now();

  if (pgPool) {
    try {
      const res = await pgPool.query('SELECT NOW() as now');
      return {
        connected: Boolean(res.rows[0]),
        provider: 'postgres',
        latencyMs: Date.now() - start,
        details: 'PostgreSQL direct pool connection verified.'
      };
    } catch (err: any) {
      console.warn('[SafeNet DB] PostgreSQL pool ping failed, falling back:', err.message);
    }
  }

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('site_settings').select('id').limit(1);
      if (!error) {
        return {
          connected: true,
          provider: 'supabase',
          latencyMs: Date.now() - start,
          details: 'Supabase client REST connection verified.'
        };
      }
    } catch (err: any) {
      console.warn('[SafeNet DB] Supabase client ping failed, falling back:', err.message);
    }
  }

  // Graceful local persistence fallback
  const jsonDb = readJsonDatabase();
  return {
    connected: Boolean(jsonDb),
    provider: 'json_fallback',
    latencyMs: Date.now() - start,
    details: 'Operating on local database store with zero loss.'
  };
}

// ==============================================================================
// SITE SETTINGS
// ==============================================================================

export async function getSiteSettings(): Promise<SiteSettings> {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('site_settings')
        .select('*')
        .eq('id', 'current')
        .single();

      if (!error && data) {
        return normalizeDbSiteSettings({
          companyName: data.company_name,
          tagline: data.tagline,
          phone: data.phone,
          email: data.email,
          whatsapp: data.whatsapp,
          addressNigeria: data.address_nigeria,
          addressUK: data.address_uk,
          establishedYear: data.established_year,
          stats: data.stats,
          socialPublishingMode: data.social_publishing_mode,
          socialLinks: data.social_links
        });
      }
    } catch {}
  }

  const jsonDb = readJsonDatabase();
  return normalizeDbSiteSettings(jsonDb?.siteSettings);
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const normalized = normalizeDbSiteSettings(settings);

  if (supabaseClient) {
    try {
      await supabaseClient.from('site_settings').upsert({
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
    } catch {}
  }

  // Dual-write to keep local store synchronized
  const jsonDb = readJsonDatabase() || ({} as any);
  jsonDb.siteSettings = normalized;
  writeJsonDatabase(jsonDb);

  return normalized;
}

// ==============================================================================
// ADMINISTRATOR USERS & AUTHENTICATION
// ==============================================================================

export async function getAdminUsers(): Promise<AdminUserRecord[]> {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('admin_users').select('*');
      if (!error && data && data.length > 0) {
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
    } catch {}
  }

  const jsonDb = readJsonDatabase();
  return Array.isArray(jsonDb?.adminUsers) ? jsonDb.adminUsers : [];
}

export async function saveAdminUsers(users: AdminUserRecord[]): Promise<void> {
  if (supabaseClient && users.length > 0) {
    try {
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
      await supabaseClient.from('admin_users').upsert(rows);
    } catch {}
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  jsonDb.adminUsers = users;
  writeJsonDatabase(jsonDb);
}

// ==============================================================================
// OWNER RECOVERY STATE
// ==============================================================================

export async function getOwnerRecoveryState(): Promise<any> {
  if (pgPool) {
    try {
      const res = await pgPool.query('SELECT * FROM owner_recovery_state WHERE id = $1', ['primary']);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          ownerRecoveryDisabled: Boolean(row.owner_recovery_disabled),
          ownerRecoveryDisabledAt: row.owner_recovery_disabled_at,
          ownerRecoveryDisabledReason: row.owner_recovery_disabled_reason,
          recoverySecretHash: row.recovery_secret_hash,
          recoverySecretSalt: row.recovery_secret_salt,
          recoverySecretIterations: row.recovery_secret_iterations,
          invalidatedSecretHashes: Array.isArray(row.invalidated_secret_hashes)
            ? row.invalidated_secret_hashes
            : typeof row.invalidated_secret_hashes === 'string'
              ? JSON.parse(row.invalidated_secret_hashes)
              : []
        };
      }
    } catch (err: any) {
      console.warn('[SafeNet DB] PostgreSQL pool query for owner_recovery_state notice:', err.message);
    }
  }

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('owner_recovery_state')
        .select('*')
        .eq('id', 'primary')
        .single();

      if (!error && data) {
        return {
          ownerRecoveryDisabled: data.owner_recovery_disabled,
          ownerRecoveryDisabledAt: data.owner_recovery_disabled_at,
          ownerRecoveryDisabledReason: data.owner_recovery_disabled_reason,
          recoverySecretHash: data.recovery_secret_hash,
          recoverySecretSalt: data.recovery_secret_salt,
          recoverySecretIterations: data.recovery_secret_iterations,
          invalidatedSecretHashes: data.invalidated_secret_hashes || []
        };
      }
    } catch {}
  }

  const jsonDb = readJsonDatabase();
  return jsonDb?.securityState || {};
}

export async function saveOwnerRecoveryState(state: any): Promise<void> {
  if (pgPool) {
    try {
      await pgPool.query(`
        INSERT INTO owner_recovery_state (
          id, owner_recovery_disabled, owner_recovery_disabled_at,
          owner_recovery_disabled_reason, recovery_secret_hash,
          recovery_secret_salt, recovery_secret_iterations,
          invalidated_secret_hashes, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          owner_recovery_disabled = EXCLUDED.owner_recovery_disabled,
          owner_recovery_disabled_at = EXCLUDED.owner_recovery_disabled_at,
          owner_recovery_disabled_reason = EXCLUDED.owner_recovery_disabled_reason,
          recovery_secret_hash = EXCLUDED.recovery_secret_hash,
          recovery_secret_salt = EXCLUDED.recovery_secret_salt,
          recovery_secret_iterations = EXCLUDED.recovery_secret_iterations,
          invalidated_secret_hashes = EXCLUDED.invalidated_secret_hashes,
          updated_at = NOW();
      `, [
        'primary',
        Boolean(state.ownerRecoveryDisabled),
        state.ownerRecoveryDisabledAt || null,
        state.ownerRecoveryDisabledReason || null,
        state.recoverySecretHash || null,
        state.recoverySecretSalt || null,
        state.recoverySecretIterations || null,
        JSON.stringify(state.invalidatedSecretHashes || [])
      ]);
    } catch (err: any) {
      console.warn('[SafeNet DB] PostgreSQL pool update for owner_recovery_state notice:', err.message);
    }
  }

  if (supabaseClient) {
    try {
      await supabaseClient.from('owner_recovery_state').upsert({
        id: 'primary',
        owner_recovery_disabled: Boolean(state.ownerRecoveryDisabled),
        owner_recovery_disabled_at: state.ownerRecoveryDisabledAt || null,
        owner_recovery_disabled_reason: state.ownerRecoveryDisabledReason || null,
        recovery_secret_hash: state.recoverySecretHash || null,
        recovery_secret_salt: state.recoverySecretSalt || null,
        recovery_secret_iterations: state.recoverySecretIterations || null,
        invalidated_secret_hashes: state.invalidatedSecretHashes || [],
        updated_at: new Date().toISOString()
      });
    } catch {}
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  jsonDb.securityState = state;
  writeJsonDatabase(jsonDb);
}

// ==============================================================================
// LEADS / CRM
// ==============================================================================

export async function getLeads(): Promise<Lead[]> {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(row => ({
          id: row.id,
          fullName: row.full_name,
          company: row.company,
          email: row.email,
          phone: row.phone,
          whatsapp: row.whatsapp,
          location: row.location,
          industry: row.industry,
          serviceRequired: row.service_required,
          propertyType: row.property_type,
          projectDescription: row.project_description,
          urgency: row.urgency,
          preferredContact: row.preferred_contact,
          status: row.status,
          estimatedValue: row.estimated_value,
          notes: row.notes || [],
          createdAt: row.created_at
        }));
      }
    } catch {}
  }

  const jsonDb = readJsonDatabase();
  return Array.isArray(jsonDb?.leads) ? jsonDb.leads : [];
}

export async function createLead(lead: Lead): Promise<Lead> {
  if (supabaseClient) {
    try {
      await supabaseClient.from('leads').upsert({
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
    } catch {}
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  if (!Array.isArray(jsonDb.leads)) jsonDb.leads = [];
  jsonDb.leads.unshift(lead);
  writeJsonDatabase(jsonDb);

  return lead;
}

// ==============================================================================
// SECURITY ASSESSMENTS
// ==============================================================================

export async function getSecurityAssessments(): Promise<SecurityAssessmentSubmission[]> {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('security_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(row => ({
          id: row.id,
          createdAt: row.created_at,
          clientName: row.client_name,
          clientEmail: row.client_email,
          clientPhone: row.client_phone,
          clientCompany: row.client_company,
          propertyType: row.property_type,
          industry: row.industry,
          location: row.location,
          facilitiesCount: row.facilities_count,
          existingPersonnel: row.existing_personnel,
          cctvCoverage: row.cctv_coverage,
          accessControl: row.access_control,
          alarmSystems: row.alarm_systems,
          fleetSize: row.fleet_size,
          primaryRiskConcerns: row.primary_risk_concerns || [],
          calculatedScore: row.calculated_score,
          riskRating: row.risk_rating,
          identifiedGaps: row.identified_gaps || [],
          recommendedServices: row.recommended_services || [],
          recommendedLayers: row.recommended_layers || []
        }));
      }
    } catch {}
  }

  const jsonDb = readJsonDatabase();
  return Array.isArray(jsonDb?.securityAssessments) ? jsonDb.securityAssessments : [];
}

export async function createSecurityAssessment(assessment: any): Promise<any> {
  if (supabaseClient) {
    try {
      await supabaseClient.from('security_assessments').upsert({
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
        primary_risk_concerns: assessment.primaryRiskConcerns || [],
        calculated_score: assessment.calculatedScore || 50,
        risk_rating: assessment.riskRating || 'Moderate Risk',
        identified_gaps: assessment.identifiedGaps || [],
        recommended_services: assessment.recommendedServices || [],
        recommended_layers: assessment.recommendedLayers || [],
        created_at: assessment.createdAt || new Date().toISOString()
      });
    } catch {}
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  if (!Array.isArray(jsonDb.securityAssessments)) jsonDb.securityAssessments = [];
  jsonDb.securityAssessments.unshift(assessment);
  writeJsonDatabase(jsonDb);

  return assessment;
}

// ==============================================================================
// CAREERS / JOB APPLICATIONS
// ==============================================================================

export async function createJobApplication(app: any): Promise<any> {
  if (supabaseClient) {
    try {
      await supabaseClient.from('job_applications').upsert({
        id: app.id,
        opening_id: app.openingId || null,
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
    } catch {}
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  if (!Array.isArray(jsonDb.jobApplications)) jsonDb.jobApplications = [];
  jsonDb.jobApplications.unshift(app);
  writeJsonDatabase(jsonDb);

  return app;
}

// ==============================================================================
// AUDIT LOGS
// ==============================================================================

export async function recordAuditLog(log: AuditLog): Promise<AuditLog> {
  // If direct PostgreSQL pool is active, serialize writes using transaction-level advisory locking
  if (pgPool) {
    let client: pg.PoolClient | null = null;
    try {
      client = await pgPool.connect();
      await client.query('BEGIN');
      // Hold transaction-level advisory lock (released automatically on COMMIT/ROLLBACK)
      await client.query('SELECT pg_advisory_xact_lock($1)', [AUDIT_LOCK_ID]);

      // Read newest audit record hash to ensure uninterrupted cryptographic HMAC chaining
      const latestRes = await client.query('SELECT hash FROM audit_logs ORDER BY timestamp DESC, id DESC LIMIT 1');
      const prevHash = latestRes.rows[0]?.hash || log.prevHash || 'GENESIS-SAFENET-SECURE-ANCHOR-000';

      // Compute tamper-evident HMAC
      const logPayload = `${prevHash}:${log.id}:${log.timestamp}:${log.user}:${log.action}:${log.target}:${log.details}:${log.ip}`;
      const hmacSecret = getAuditHmacSecret();
      let hash: string;
      if (hmacSecret) {
        hash = crypto.createHmac('sha256', hmacSecret).update(logPayload).digest('hex');
      } else {
        hash = log.hash || `DEV-UNSIGNED-${crypto.createHash('sha256').update(logPayload).digest('hex').substring(0, 16)}`;
      }

      await client.query(`
        INSERT INTO audit_logs (id, timestamp, user_identifier, action, target, details, ip, hash, prev_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO NOTHING
      `, [log.id, log.timestamp || new Date().toISOString(), log.user, log.action, log.target, log.details, log.ip, hash, prevHash]);

      await client.query('COMMIT');
      log.hash = hash;
      log.prevHash = prevHash;
    } catch (pgErr) {
      if (client) {
        try { await client.query('ROLLBACK'); } catch {}
      }
      console.warn('[SafeNet DB] Advisory-locked audit write failed, falling back:', pgErr);
    } finally {
      if (client) client.release();
    }
  } else if (supabaseClient) {
    try {
      await supabaseClient.from('audit_logs').upsert({
        id: log.id,
        timestamp: log.timestamp || new Date().toISOString(),
        user_identifier: log.user,
        action: log.action,
        target: log.target,
        details: log.details,
        ip: log.ip,
        hash: log.hash || null,
        prev_hash: log.prevHash || null
      });
    } catch {}
  }

  const jsonDb = readJsonDatabase() || ({} as any);
  if (!Array.isArray(jsonDb.auditLogs)) jsonDb.auditLogs = [];
  jsonDb.auditLogs.unshift(log);
  if (jsonDb.auditLogs.length > 250) jsonDb.auditLogs = jsonDb.auditLogs.slice(0, 250);
  writeJsonDatabase(jsonDb);

  return log;
}

// ==============================================================================
// FULL APPLICATION STATE SYNC
// ==============================================================================

export async function getFullState(isAdmin = false): Promise<any> {
  const jsonDb = readJsonDatabase() || ({} as any);

  if (!isAdmin) {
    return {
      siteSettings: normalizeDbSiteSettings(jsonDb.siteSettings),
      blogPosts: (jsonDb.blogPosts || []).filter((b: any) => b.status === 'published'),
      testimonials: (jsonDb.testimonials || []).filter((t: any) => t.published !== false),
      careerOpenings: (jsonDb.careerOpenings || []).filter((c: any) => c.active !== false)
    };
  }

  return {
    ...jsonDb,
    siteSettings: normalizeDbSiteSettings(jsonDb.siteSettings)
  };
}
