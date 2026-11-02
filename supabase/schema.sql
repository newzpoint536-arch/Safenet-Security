-- ==============================================================================
-- SAFENET SECURITY SOLUTIONS LTD — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- ==============================================================================
-- Normalized schema for production backend (Render Node.js/Express service)
-- Supports complete zero-loss migration from data/database.json
-- Includes primary keys, foreign keys, unique constraints, indexes, and RLS policies
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES (where helpful, otherwise safe check constraints)
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

-- 3. SITE SETTINGS TABLE (Single-row configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(32) PRIMARY KEY DEFAULT 'current',
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
  social_publishing_mode VARCHAR(32) NOT NULL DEFAULT 'manual_approval',
  social_links JSONB NOT NULL DEFAULT '{
    "facebook": "https://www.facebook.com/share/1H3ow82i4q",
    "linkedin": "https://linkedin.com/company/safenet-security-solutions-ltd",
    "x": "https://x.com/LtdSafenet10159",
    "instagram": "https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=itpgcrs",
    "youtube": "https://youtube.com/@safenetsecurityltd"
  }'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- DEDICATED RESTRICTED PUBLIC PROJECTION VIEW: public_site_settings
-- Exposes ONLY approved branding, tagline, public contact numbers/emails, verified office addresses,
-- public performance statistics, established year, approved public social URLs/handles, and last updated timestamp.
-- All internal configuration (e.g., social_publishing_mode, administrative flags, future API keys or webhook secrets)
-- remains strictly isolated and completely inaccessible to anon/authenticated client roles.
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

-- 4. ADMINISTRATOR USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(64) NOT NULL DEFAULT 'operations_officer',
  salt VARCHAR(128) NOT NULL,
  hash VARCHAR(256) NOT NULL,
  iterations INTEGER NOT NULL DEFAULT 210000,
  recovery_passphrase_hash VARCHAR(256),
  recovery_passphrase_salt VARCHAR(128),
  recovery_passphrase_iterations INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended'))
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- 5. ADMINISTRATOR SESSIONS TABLE (Durable Server-Side Sessions)
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
  auth_source VARCHAR(32) DEFAULT 'cookie'
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- 6. OWNER RECOVERY STATE TABLE (Persistent Zero-Leakage Recovery Vault)
CREATE TABLE IF NOT EXISTS owner_recovery_state (
  id VARCHAR(32) PRIMARY KEY DEFAULT 'primary',
  owner_recovery_disabled BOOLEAN NOT NULL DEFAULT FALSE,
  owner_recovery_disabled_at TIMESTAMPTZ,
  owner_recovery_disabled_reason TEXT,
  recovery_secret_hash VARCHAR(256),
  recovery_secret_salt VARCHAR(128),
  recovery_secret_iterations INTEGER,
  invalidated_secret_hashes JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. LEADS / CRM / QUOTE INQUIRIES TABLE
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

-- 8. SECURITY ASSESSMENTS TABLE
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
  calculated_score INTEGER NOT NULL DEFAULT 50,
  risk_rating VARCHAR(64) NOT NULL DEFAULT 'Moderate Risk',
  identified_gaps JSONB DEFAULT '[]'::jsonb,
  recommended_services JSONB DEFAULT '[]'::jsonb,
  recommended_layers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON security_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_risk_rating ON security_assessments(risk_rating);

-- 9. BLOG POSTS TABLE
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
  status VARCHAR(32) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'scheduled')),
  seo_title VARCHAR(255),
  seo_description TEXT,
  related_services JSONB DEFAULT '[]'::jsonb,
  views INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- 10. SOCIAL MEDIA ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS social_accounts (
  platform VARCHAR(32) PRIMARY KEY CHECK (platform IN ('facebook', 'linkedin', 'x', 'instagram', 'youtube')),
  display_name VARCHAR(128) NOT NULL,
  handle VARCHAR(128) NOT NULL,
  connected BOOLEAN NOT NULL DEFAULT TRUE,
  token_expiry TIMESTAMPTZ,
  auto_publish BOOLEAN NOT NULL DEFAULT FALSE,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  avatar_url TEXT
);

-- 11. SOCIAL PUBLISH JOBS TABLE (Durable Outbox Queue)
CREATE TABLE IF NOT EXISTS social_publish_jobs (
  id VARCHAR(64) PRIMARY KEY,
  post_id VARCHAR(64) NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  post_title VARCHAR(255) NOT NULL,
  platform VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'published', 'failed', 'retrying')),
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  post_url TEXT,
  caption TEXT NOT NULL,
  hashtags JSONB NOT NULL DEFAULT '[]'::jsonb,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  idempotency_key VARCHAR(128) UNIQUE NOT NULL,
  utm_params JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_social_jobs_status ON social_publish_jobs(status);
CREATE INDEX IF NOT EXISTS idx_social_jobs_idempotency ON social_publish_jobs(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_social_jobs_date ON social_publish_jobs(date DESC);
CREATE INDEX IF NOT EXISTS idx_social_jobs_post_id ON social_publish_jobs(post_id);

-- 12. CAREER OPENINGS TABLE
CREATE TABLE IF NOT EXISTS career_openings (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(128) NOT NULL,
  location VARCHAR(128) NOT NULL,
  employment_type VARCHAR(64) NOT NULL DEFAULT 'Full-time',
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. JOB APPLICATIONS TABLE (Careers Dossier)
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

-- 14. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  testimonial TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  location VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. AUDIT LOGS TABLE (Tamper-Evident HMAC Integrity Chain)
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

-- 16. MIGRATION METADATA TABLE (Tracks Idempotent Migrations)
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

-- Enable RLS on all tables
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
-- INDEPENDENTLY IDEMPOTENT SERVICE ROLE POLICIES (Backend Render Express Service)
-- ==============================================================================
-- Each policy is independently dropped and recreated so an existing policy
-- never prevents other policies from being created or updated.

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

-- 2. Explicitly grant SELECT ONLY on approved public marketing tables and the restricted public view
GRANT SELECT ON TABLE blog_posts, testimonials, career_openings TO anon, authenticated;
GRANT SELECT ON TABLE public_site_settings TO anon, authenticated;

-- 3. Explicitly grant required backend privileges ONLY on the 14 SafeNet tables and public view to service_role
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


