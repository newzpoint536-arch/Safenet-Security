-- ==============================================================================
-- SAFENET SECURITY SOLUTIONS LTD — SUPABASE POSTGRESQL PRODUCTION SCHEMA (PHASE 2B REVISED)
-- ==============================================================================
-- Normalized schema for production backend (Render Node.js/Express service)
-- Supabase PostgreSQL production source of truth.
-- Preserves zero-loss compatibility with existing JSON database (data/database.json).
-- Enforces least-privilege security, strict domain constraints, safe publication
-- defaults, and durable worker queue structures.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES (Idempotent creation)
DO $$ BEGIN
  CREATE TYPE safenet_admin_role AS ENUM (
    'super_admin',
    'operations_director',
    'content_editor',
    'social_media_manager',
    'operations_officer',
    'recruitment_officer',
    'auditor'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. SITE SETTINGS TABLE (Single-Row Configuration Vault)
-- ==============================================================================
-- SINGLETON ENFORCEMENT:
-- Enforces exactly one canonical record with id = 'current'.
-- The legacy 'primary' identifier is strictly retired.
-- Direct client access (anon, authenticated) is fully revoked.
-- Public marketing site consumes ONLY the dedicated public_site_settings view.
CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(32) PRIMARY KEY DEFAULT 'current' CHECK (id = 'current'),
  company_name VARCHAR(255) NOT NULL DEFAULT 'SafeNet Security Solutions Ltd',
  tagline TEXT NOT NULL DEFAULT 'Protecting What Matters Most With Unwavering Vigilance',
  phone VARCHAR(64) NOT NULL DEFAULT '+234 813 129 6054',
  email VARCHAR(255) NOT NULL DEFAULT 'info@safenetsecurityltd.com',
  whatsapp VARCHAR(64) NOT NULL DEFAULT '+234 813 129 6054',
  address_nigeria TEXT NOT NULL DEFAULT 'Plot 14, Commercial Avenue, Victoria Island, Lagos, Nigeria',
  address_uk TEXT NOT NULL DEFAULT '85 Great Portland Street, First Floor, London, W1W 7LT, United Kingdom',
  established_year VARCHAR(16) NOT NULL DEFAULT '2025',
  stats JSONB NOT NULL DEFAULT '{
    "trainedGuards": "500+",
    "responseTime": "24/7",
    "droneCctvCoverage": "100%",
    "clientRetention": "99.4%"
  }'::jsonb,
  social_publishing_mode VARCHAR(32) NOT NULL DEFAULT 'manual_approval' CHECK (social_publishing_mode IN ('manual_approval', 'automatic', 'disabled')),
  social_links JSONB NOT NULL DEFAULT '{
    "facebook": "https://www.facebook.com/share/1H3ow82i4q",
    "linkedin": "https://linkedin.com/company/safenet-security-solutions-ltd",
    "x": "https://x.com/LtdSafenet10159",
    "instagram": "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=itpgcrs",
    "youtube": "https://youtube.com/@safenetsecurityltd"
  }'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- DEDICATED RESTRICTED PUBLIC PROJECTION VIEW: public_site_settings
-- ==============================================================================
-- ARCHITECTURAL & SECURITY SPECIFICATION:
-- 1. View Owner: postgres (or database administrator role).
-- 2. Security Mode: Standard PostgreSQL View (executes with the view owner's permissions,
--    i.e., security_invoker = false).
-- 3. Source Table: public.site_settings.
-- 4. WHERE Filter: WHERE id = 'current' (enforces canonical singleton row).
-- 5. Projection: Exposes ONLY the 12 approved public marketing columns.
--    Internal administrative settings (social_publishing_mode, internal flags) are strictly excluded.
-- 6. Privilege Separation:
--    - Direct SELECT on site_settings is REVOKED from anon and authenticated.
--    - GRANT SELECT on public_site_settings is GRANTED to anon and authenticated.
--    - In PostgreSQL, standard views execute with the view owner's permissions, which allows
--      anon and authenticated clients to read approved public fields through this view
--      despite possessing zero direct table privileges.
-- 7. Defense-in-Depth (RLS vs View Privileges):
--    - REVOKE on the base table plus GRANT on the view does NOT replace Row-Level Security (RLS).
--    - RLS on site_settings remains enabled as the primary defense against direct query access,
--      ensuring that no direct or leaked queries can bypass the column projection boundary.
CREATE OR REPLACE VIEW public_site_settings AS
SELECT
  id,
  company_name,
  tagline,
  phone,
  email,
  whatsapp,
  address_nigeria,
  address_uk,
  established_year,
  stats,
  social_links,
  updated_at
FROM site_settings
WHERE id = 'current';

-- ==============================================================================
-- 4. ADMINISTRATOR USERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(64) NOT NULL DEFAULT 'operations_officer',
  salt VARCHAR(128) NOT NULL,
  hash VARCHAR(256) NOT NULL,
  iterations INTEGER NOT NULL DEFAULT 210000 CHECK (iterations >= 100000),
  recovery_passphrase_hash VARCHAR(256),
  recovery_passphrase_salt VARCHAR(128),
  recovery_passphrase_iterations INTEGER CHECK (recovery_passphrase_iterations IS NULL OR recovery_passphrase_iterations >= 100000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended'))
);

-- NOTE: idx_admin_users_email was removed because email UNIQUE automatically creates a unique b-tree index.
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- ==============================================================================
-- 5. ADMINISTRATOR SESSIONS TABLE (Durable Server-Side Sessions)
-- ==============================================================================
-- ARCHITECTURAL NOTE: The session lookup key is stored as 'token VARCHAR(128) PRIMARY KEY'
-- to preserve immediate compatibility with existing auth.ts and supabaseStore.ts logic.
-- An adaptation roadmap for migrating to a SHA-256 hashed token lookup (token_hash)
-- is documented in the Phase 2B migration report.
CREATE TABLE IF NOT EXISTS admin_sessions (
  token VARCHAR(128) PRIMARY KEY,
  csrf_token VARCHAR(128) NOT NULL,
  user_id VARCHAR(64) NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at BIGINT NOT NULL,
  last_activity_at BIGINT NOT NULL,
  ip VARCHAR(64),
  user_agent TEXT,
  auth_source VARCHAR(32) DEFAULT 'cookie',
  CONSTRAINT chk_admin_sessions_timestamps CHECK (expires_at > 0 AND last_activity_at > 0)
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- ==============================================================================
-- 6. OWNER RECOVERY STATE TABLE (Persistent Zero-Leakage Recovery Vault)
-- ==============================================================================
-- SINGLETON ENFORCEMENT:
-- Enforces exactly one canonical record with id = 'current'.
-- The legacy 'primary' identifier is strictly retired.
-- Enforces optimistic locking (version) and brute-force throttling fields.
CREATE TABLE IF NOT EXISTS owner_recovery_state (
  id VARCHAR(32) PRIMARY KEY DEFAULT 'current' CHECK (id = 'current'),
  version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
  owner_recovery_disabled BOOLEAN NOT NULL DEFAULT FALSE,
  owner_recovery_disabled_at TIMESTAMPTZ,
  owner_recovery_disabled_reason TEXT,
  recovery_secret_hash VARCHAR(256),
  recovery_secret_salt VARCHAR(128),
  recovery_secret_iterations INTEGER CHECK (recovery_secret_iterations IS NULL OR recovery_secret_iterations >= 100000),
  invalidated_secret_hashes JSONB NOT NULL DEFAULT '[]'::jsonb,
  locked_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. LEADS / CRM / QUOTE INQUIRIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(64) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  whatsapp VARCHAR(64),
  location VARCHAR(255) NOT NULL,
  industry VARCHAR(128),
  service_required VARCHAR(255) NOT NULL,
  property_type VARCHAR(128),
  project_description TEXT,
  urgency VARCHAR(64) DEFAULT 'immediate',
  preferred_contact VARCHAR(32) DEFAULT 'phone',
  status VARCHAR(32) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'archived')),
  estimated_value VARCHAR(64),
  notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- ==============================================================================
-- 8. SECURITY ASSESSMENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS security_assessments (
  id VARCHAR(64) PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_phone VARCHAR(64) NOT NULL,
  client_company VARCHAR(255),
  facility_type VARCHAR(128),
  industry VARCHAR(128),
  location VARCHAR(255),
  facilities_count VARCHAR(64),
  existing_personnel VARCHAR(64),
  cctv_coverage VARCHAR(64),
  access_control VARCHAR(64),
  alarm_systems VARCHAR(64),
  fleet_size VARCHAR(64),
  primary_risk_concerns JSONB DEFAULT '[]'::jsonb,
  calculated_score INTEGER NOT NULL DEFAULT 50 CHECK (calculated_score >= 0 AND calculated_score <= 100),
  risk_rating VARCHAR(64) NOT NULL DEFAULT 'Moderate Risk',
  identified_gaps JSONB DEFAULT '[]'::jsonb,
  recommended_services JSONB DEFAULT '[]'::jsonb,
  recommended_layers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON security_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_risk_rating ON security_assessments(risk_rating);

-- ==============================================================================
-- 9. BLOG POSTS TABLE
-- ==============================================================================
-- SAFE PUBLICATION DEFAULT: status defaults to 'draft' to prevent accidental exposure.
CREATE TABLE IF NOT EXISTS blog_posts (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  author JSONB NOT NULL DEFAULT '{"name": "SafeNet Editorial Team", "role": "Security Intelligence Group"}'::jsonb,
  category VARCHAR(128) NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reading_time VARCHAR(32) DEFAULT '4 min read',
  status VARCHAR(32) NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'scheduled')),
  seo_title VARCHAR(255),
  seo_description TEXT,
  related_services JSONB DEFAULT '[]'::jsonb,
  views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0)
);

-- NOTE: idx_blog_posts_slug was removed because slug UNIQUE automatically creates a unique b-tree index.
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- ==============================================================================
-- 10. SOCIAL MEDIA ACCOUNTS TABLE
-- ==============================================================================
-- SAFE DEFAULT: connected defaults to FALSE until explicit admin OAuth authentication.
CREATE TABLE IF NOT EXISTS social_accounts (
  platform VARCHAR(32) PRIMARY KEY CHECK (platform IN ('facebook', 'linkedin', 'x', 'instagram', 'youtube')),
  display_name VARCHAR(128) NOT NULL,
  handle VARCHAR(128) NOT NULL,
  connected BOOLEAN NOT NULL DEFAULT FALSE,
  token_expiry TIMESTAMPTZ,
  auto_publish BOOLEAN NOT NULL DEFAULT FALSE,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  avatar_url TEXT
);

-- ==============================================================================
-- 11. SOCIAL PUBLISH JOBS TABLE (Durable Outbox Queue)
-- ==============================================================================
-- MULTI-INSTANCE WORKER QUEUE ARCHITECTURE:
-- 1. Locking Fields:
--    - locked_at: Timestamp when worker claimed the job lease.
--    - locked_by: Unique identifier of worker pod/process (e.g., 'render-worker-pod-uuid').
--    - locked_until: Timestamp when the lease expires (e.g., locked_at + INTERVAL '5 minutes').
-- 2. Lease Expiry & Worker Crash Recovery:
--    - If a worker crashes or network stalls during publication, the lease expires when NOW() > locked_until.
--    - A subsequent worker polling cycle safely reclaims abandoned jobs where status = 'processing' AND locked_until < NOW().
-- 3. Atomic Worker Claim Pattern (FOR UPDATE SKIP LOCKED):
--    Workers query and lock pending or expired-lease jobs without contention:
--    ```sql
--    WITH claimable AS (
--      SELECT id
--      FROM social_publish_jobs
--      WHERE (
--        (status IN ('queued', 'retrying') AND next_attempt_at <= NOW() AND (locked_until IS NULL OR locked_until < NOW()))
--        OR
--        (status = 'processing' AND locked_until < NOW())
--      )
--      ORDER BY next_attempt_at ASC, created_at ASC
--      LIMIT 1
--      FOR UPDATE SKIP LOCKED
--    )
--    UPDATE social_publish_jobs j
--    SET
--      status = 'processing',
--      locked_at = NOW(),
--      locked_by = $1, -- worker identifier
--      locked_until = NOW() + INTERVAL '5 minutes',
--      updated_at = NOW()
--    FROM claimable
--    WHERE j.id = claimable.id
--    RETURNING j.*;
--    ```
CREATE TABLE IF NOT EXISTS social_publish_jobs (
  id VARCHAR(64) PRIMARY KEY,
  post_id VARCHAR(64) NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  post_title VARCHAR(255) NOT NULL,
  platform VARCHAR(32) NOT NULL CHECK (platform IN ('facebook', 'linkedin', 'x', 'instagram', 'youtube')),
  status VARCHAR(32) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'published', 'failed', 'retrying')),
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  post_url TEXT,
  caption TEXT NOT NULL,
  hashtags JSONB NOT NULL DEFAULT '[]'::jsonb,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0 CHECK (retry_count >= 0),
  max_retries INTEGER NOT NULL DEFAULT 3 CHECK (max_retries >= 0),
  locked_at TIMESTAMPTZ,
  locked_by VARCHAR(128),
  locked_until TIMESTAMPTZ,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  idempotency_key VARCHAR(128) UNIQUE NOT NULL,
  utm_params JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NOTE: idx_social_jobs_idempotency was removed because idempotency_key UNIQUE automatically creates a unique b-tree index.
CREATE INDEX IF NOT EXISTS idx_social_jobs_status ON social_publish_jobs(status);
CREATE INDEX IF NOT EXISTS idx_social_jobs_date ON social_publish_jobs(date DESC);
CREATE INDEX IF NOT EXISTS idx_social_jobs_post_id ON social_publish_jobs(post_id);
CREATE INDEX IF NOT EXISTS idx_social_jobs_poll ON social_publish_jobs(status, next_attempt_at) WHERE status IN ('queued', 'retrying');

-- ==============================================================================
-- 12. CAREER OPENINGS TABLE
-- ==============================================================================
-- SAFE DEFAULT: active defaults to FALSE until published by HR administrator.
CREATE TABLE IF NOT EXISTS career_openings (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(128) NOT NULL,
  location VARCHAR(128) NOT NULL,
  employment_type VARCHAR(64) NOT NULL DEFAULT 'Full-time',
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NOTE: idx_career_openings_slug was removed because slug UNIQUE automatically creates a unique b-tree index.
CREATE INDEX IF NOT EXISTS idx_career_openings_active ON career_openings(active);

-- ==============================================================================
-- 13. JOB APPLICATIONS TABLE (Careers Dossier)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS job_applications (
  id VARCHAR(64) PRIMARY KEY,
  opening_id VARCHAR(64) REFERENCES career_openings(id) ON DELETE SET NULL,
  job_slug VARCHAR(128),
  job_title VARCHAR(255) NOT NULL,
  applicant_name VARCHAR(255) NOT NULL,
  applicant_email VARCHAR(255) NOT NULL,
  applicant_phone VARCHAR(64) NOT NULL,
  experience_years VARCHAR(128),
  cover_note TEXT,
  resume_file_name VARCHAR(255),
  status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interviewed', 'offered', 'rejected')),
  nsdc_status VARCHAR(64),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_apps_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_apps_submitted_at ON job_applications(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_apps_opening_id ON job_applications(opening_id);

-- ==============================================================================
-- 14. TESTIMONIALS TABLE
-- ==============================================================================
-- SAFE DEFAULT: published defaults to FALSE until vetted and approved.
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  testimonial TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  location VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(published);

-- ==============================================================================
-- 15. AUDIT LOGS TABLE (Tamper-Evident HMAC Integrity Chain)
-- ==============================================================================
-- CRYPTOGRAPHIC INTEGRITY CHAIN & CONCURRENCY SPECIFICATION:
-- 1. Atomic Append Operation:
--    - Audit log append operations must be serialized and atomic at the application/database boundary.
--    - The backend utilizes transaction-level advisory locking (SELECT pg_advisory_xact_lock(742369))
--      inside an explicit BEGIN ... COMMIT transaction block.
--    - This guarantees that concurrent requests cannot read the same latest hash simultaneously,
--      preventing chain forks or orphan links.
-- 2. Purpose of Indexes vs Cryptographic Enforcement:
--    - idx_audit_logs_chain (timestamp ASC, id ASC) and idx_audit_logs_prev_hash (prev_hash)
--      provide fast chronological scanning and backward hash verification queries.
--    - Crucially, database indexes do NOT enforce sequential hash ordering or cryptographic integrity;
--      cryptographic continuity is enforced exclusively by the application-level HMAC verification logic
--      and serialized database transactions.
-- 3. Historical Record Preservation & Key Rotation:
--    - All historical audit records and their existing HMAC signatures are preserved immutably as-is.
--    - Any previously exposed development HMAC keys (e.g., 'safenet-audit-integrity-chain-key-v1')
--      are permanently compromised and must NEVER be reused.
--    - Future records must be signed using a fresh, cryptographically secure secret (minimum 32 bytes)
--      supplied strictly via the AUDIT_HMAC_SECRET runtime environment variable.
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_identifier VARCHAR(255) NOT NULL,
  action VARCHAR(128) NOT NULL,
  target VARCHAR(255) NOT NULL,
  details TEXT NOT NULL,
  ip VARCHAR(64) NOT NULL,
  hash VARCHAR(128),
  prev_hash VARCHAR(128)
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_chain ON audit_logs(timestamp ASC, id ASC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_prev_hash ON audit_logs(prev_hash);

-- ==============================================================================
-- 16. MIGRATION METADATA TABLE (Tracks Idempotent Migrations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS migration_metadata (
  id VARCHAR(64) PRIMARY KEY,
  source_file VARCHAR(255) NOT NULL,
  migrated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  record_counts JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'completed'
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all 14 tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_recovery_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_publish_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_metadata ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- SERVICE ROLE POLICIES (Backend Render Express Service)
-- ==============================================================================
-- ARCHITECTURAL NOTE: In Supabase, the 'service_role' PostgreSQL role has the
-- BYPASSRLS attribute by default, bypassing row-level security checks entirely.
-- These explicit policies are maintained as an essential defense-in-depth layer
-- for standard PostgreSQL or non-Supabase replica environments (e.g., Neon or local pg)
-- where the service role might not possess the BYPASSRLS attribute.

DROP POLICY IF EXISTS "Service Role full access on site_settings" ON site_settings;
CREATE POLICY "Service Role full access on site_settings" ON site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role full access on admin_users" ON admin_users;
CREATE POLICY "Service Role full access on admin_users" ON admin_users FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role full access on admin_sessions" ON admin_sessions;
CREATE POLICY "Service Role full access on admin_sessions" ON admin_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role full access on owner_recovery_state" ON owner_recovery_state;
CREATE POLICY "Service Role full access on owner_recovery_state" ON owner_recovery_state FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role full access on leads" ON leads;
CREATE POLICY "Service Role full access on leads" ON leads FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role full access on security_assessments" ON security_assessments;
CREATE POLICY "Service Role full access on security_assessments" ON security_assessments FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role full access on blog_posts" ON blog_posts;
CREATE POLICY "Service Role full access on blog_posts" ON blog_posts FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role full access on social_accounts" ON social_accounts;
CREATE POLICY "Service Role full access on social_accounts" ON social_accounts FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role full access on social_publish_jobs" ON social_publish_jobs;
CREATE POLICY "Service Role full access on social_publish_jobs" ON social_publish_jobs FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role full access on job_applications" ON job_applications;
CREATE POLICY "Service Role full access on job_applications" ON job_applications FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role full access on career_openings" ON career_openings;
CREATE POLICY "Service Role full access on career_openings" ON career_openings FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role full access on testimonials" ON testimonials;
CREATE POLICY "Service Role full access on testimonials" ON testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role full access on audit_logs" ON audit_logs;
CREATE POLICY "Service Role full access on audit_logs" ON audit_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role full access on migration_metadata" ON migration_metadata;
CREATE POLICY "Service Role full access on migration_metadata" ON migration_metadata FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- INDEPENDENTLY IDEMPOTENT PUBLIC READ POLICIES (Approved Marketing Content ONLY)
-- ==============================================================================
-- Direct client access to site_settings table is fully revoked; approved public
-- configuration is projected exclusively through the dedicated public_site_settings view.
-- Direct client access to CRM leads, assessments, job applications, social accounts,
-- user credentials, recovery state, and audit logs is strictly blocked.

-- Cleanup legacy or broad policies if present
DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public insert leads" ON leads;
DROP POLICY IF EXISTS "Public insert security_assessments" ON security_assessments;
DROP POLICY IF EXISTS "Public insert job_applications" ON job_applications;
DROP POLICY IF EXISTS "Public read social_accounts" ON social_accounts;

-- Independent public read policies
DROP POLICY IF EXISTS "Public read published blog_posts" ON blog_posts;
CREATE POLICY "Public read published blog_posts" ON blog_posts FOR SELECT TO anon, authenticated USING (status = 'published');

DROP POLICY IF EXISTS "Public read published testimonials" ON testimonials;
CREATE POLICY "Public read published testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "Public read active career_openings" ON career_openings;
CREATE POLICY "Public read active career_openings" ON career_openings FOR SELECT TO anon, authenticated USING (active = true);

-- ==============================================================================
-- LEAST-PRIVILEGE ROLE PERMISSIONS (No blanket schema grants)
-- ==============================================================================

-- 1. Schema Usage (Explicit schema navigation for defined roles)
GRANT USAGE ON SCHEMA public TO service_role, anon, authenticated;

-- 2. Explicitly revoke ALL direct privileges on all 14 underlying tables from client roles (anon, authenticated)
REVOKE ALL ON TABLE
  site_settings,
  admin_users,
  admin_sessions,
  owner_recovery_state,
  leads,
  security_assessments,
  blog_posts,
  social_accounts,
  social_publish_jobs,
  job_applications,
  career_openings,
  testimonials,
  audit_logs,
  migration_metadata
FROM anon, authenticated;

-- 3. Explicitly grant SELECT ONLY on approved public marketing tables and the restricted public view
GRANT SELECT ON TABLE blog_posts, testimonials, career_openings TO anon, authenticated;
GRANT SELECT ON TABLE public_site_settings TO anon, authenticated;

-- 4. Explicitly grant required backend privileges ONLY on the 14 SafeNet tables and public view to service_role
-- (No blanket ALL TABLES or ALL SEQUENCES in public schema)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  site_settings,
  admin_users,
  admin_sessions,
  owner_recovery_state,
  leads,
  security_assessments,
  blog_posts,
  social_accounts,
  social_publish_jobs,
  job_applications,
  career_openings,
  testimonials,
  audit_logs,
  migration_metadata
TO service_role;

GRANT SELECT ON TABLE public_site_settings TO service_role;
