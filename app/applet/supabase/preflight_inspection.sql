-- =============================================================================
-- SAFENET SECURITY SOLUTIONS LTD
-- PHASE 2B.2: REMOTE SUPABASE PREFLIGHT INSPECTION SCRIPT
-- =============================================================================
-- OBJECTIVE:
-- Comprehensive READ-ONLY diagnostic script to be executed manually in the
-- Supabase SQL Editor prior to deploying the Phase 2B production schema.
--
-- STRICT SAFETY GUARANTEES:
-- 1. 100% READ-ONLY: Contains only SELECT statements against pg_catalog and
--    information_schema.
-- 2. ZERO MODIFICATIONS: No CREATE, ALTER, DROP, TRUNCATE, INSERT, UPDATE, or
--    DELETE statements.
-- 3. IDEMPOTENT & NON-INVASIVE: Safe to execute multiple times on any database.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- SECTION 0: ENVIRONMENT & DATABASE CONTEXT
-- Purpose: Verify current PostgreSQL version, server timezone, connected user,
-- current database, search path, and installed extensions.
-- -----------------------------------------------------------------------------

SELECT 
    current_database() AS database_name,
    current_user AS connected_user,
    session_user AS session_user,
    version() AS postgres_version,
    current_setting('TIMEZONE') AS server_timezone,
    current_setting('search_path') AS search_path;

-- 0.1 Check installed extensions and availability of pgcrypto
SELECT 
    extname AS extension_name,
    extversion AS installed_version,
    extnamespace::regnamespace::text AS schema_name
FROM pg_extension
ORDER BY extname;

-- 0.2 Check for custom enum types or domain types in public schema
SELECT 
    t.typname AS type_name,
    t.typtype AS type_category, -- 'e' = enum, 'd' = domain, 'c' = composite
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS enum_labels
FROM pg_type t
JOIN pg_namespace n ON n.oid = t.typnamespace
LEFT JOIN pg_enum e ON e.enumtypid = t.oid
WHERE n.nspname = 'public'
GROUP BY t.typname, t.typtype
ORDER BY t.typname;


-- =============================================================================
-- SECTION A: EXISTING DATABASE OBJECTS (TABLES, COLUMNS, KEYS, INDEXES, VIEWS)
-- =============================================================================

-- A.1 Summary of All Public Tables and Row Counts / Sizes
-- Identifies which SafeNet tables or other pre-existing tables currently exist.
SELECT 
    c.relname AS table_name,
    pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size,
    c.reltuples::bigint AS estimated_row_count,
    c.relrowsecurity AS rls_enabled,
    c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY c.relname;

-- A.2 SafeNet 14 Tables Presence Checklist
-- Evaluates presence of all 14 expected SafeNet tables in the public schema.
WITH expected_tables(table_name) AS (
    VALUES 
        ('site_settings'),
        ('admin_users'),
        ('admin_sessions'),
        ('owner_recovery_state'),
        ('leads'),
        ('security_assessments'),
        ('blog_posts'),
        ('social_accounts'),
        ('social_publish_jobs'),
        ('career_openings'),
        ('job_applications'),
        ('testimonials'),
        ('audit_logs'),
        ('migration_metadata')
)
SELECT 
    e.table_name,
    CASE WHEN t.table_name IS NOT NULL THEN 'EXISTS' ELSE 'MISSING / CLEAN' END AS current_status,
    COALESCE(c.relrowsecurity, false) AS rls_enabled
FROM expected_tables e
LEFT JOIN information_schema.tables t 
    ON t.table_schema = 'public' AND t.table_name = e.table_name
LEFT JOIN pg_class c 
    ON c.relname = e.table_name AND c.relnamespace = 'public'::regnamespace;

-- A.3 Comprehensive Column Definitions (Data Types, Nullability, Defaults)
-- Inspects schema definition for any SafeNet tables that already exist.
SELECT 
    table_name,
    ordinal_position,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
        'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
        'leads', 'security_assessments', 'blog_posts', 'social_accounts',
        'social_publish_jobs', 'career_openings', 'job_applications',
        'testimonials', 'audit_logs', 'migration_metadata'
  )
ORDER BY table_name, ordinal_position;

-- A.4 Primary Keys, Foreign Keys, Unique & Check Constraints
-- Details all constraint names, types, referenced tables, and delete action rules.
SELECT 
    con.conname AS constraint_name,
    rel.relname AS table_name,
    CASE con.contype
        WHEN 'p' THEN 'PRIMARY KEY'
        WHEN 'f' THEN 'FOREIGN KEY'
        WHEN 'u' THEN 'UNIQUE'
        WHEN 'c' THEN 'CHECK'
        ELSE con.contype::text
    END AS constraint_type,
    pg_get_constraintdef(con.oid, true) AS definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = con.connamespace
WHERE nsp.nspname = 'public'
  AND rel.relname IN (
        'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
        'leads', 'security_assessments', 'blog_posts', 'social_accounts',
        'social_publish_jobs', 'career_openings', 'job_applications',
        'testimonials', 'audit_logs', 'migration_metadata'
  )
ORDER BY rel.relname, con.contype, con.conname;

-- A.5 All Existing Indexes in the Public Schema
-- Verifies whether standard or customized B-Tree indexes are already in place.
SELECT 
    tablename AS table_name,
    indexname AS index_name,
    indexdef AS index_definition
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- A.6 Existing Views, Definitions, Owners and Security Invoker Settings
-- Inspects public views, specifically public_site_settings.
SELECT 
    v.relname AS view_name,
    pg_get_userbyid(v.relowner) AS view_owner,
    pg_get_viewdef(v.oid, true) AS view_definition,
    COALESCE(
        array_to_string(v.reloptions, ', '),
        'none'
    ) AS view_options
FROM pg_class v
JOIN pg_namespace n ON n.oid = v.relnamespace
WHERE n.nspname = 'public' AND v.relkind = 'v'
ORDER BY v.relname;


-- =============================================================================
-- SECTION B: SECURITY CONFIGURATION & ACCESS PRIVILEGES
-- =============================================================================

-- B.1 Row-Level Security (RLS) Status for All Tables
SELECT 
    c.relname AS table_name,
    c.relrowsecurity AS rls_enabled,
    c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY c.relname;

-- B.2 Detailed RLS Policies (Commands, Roles, USING & WITH CHECK expressions)
SELECT 
    pol.schemaname,
    pol.tablename,
    pol.policyname,
    pol.permissive, -- 'PERMISSIVE' or 'RESTRICTIVE'
    pol.roles,
    pol.cmd, -- 'ALL', 'SELECT', 'INSERT', 'UPDATE', 'DELETE'
    pol.qual AS using_expression,
    pol.with_check AS with_check_expression
FROM pg_policies pol
WHERE pol.schemaname = 'public'
ORDER BY pol.tablename, pol.policyname;

-- B.3 Table and View Privileges by Role (anon, authenticated, service_role)
-- Verifies whether client roles have dangerous direct table grants.
SELECT 
    table_name,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated', 'service_role', 'PUBLIC')
  AND table_name IN (
        'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
        'leads', 'security_assessments', 'blog_posts', 'social_accounts',
        'social_publish_jobs', 'career_openings', 'job_applications',
        'testimonials', 'audit_logs', 'migration_metadata', 'public_site_settings'
  )
ORDER BY table_name, grantee, privilege_type;

-- B.4 Schema-level Privileges on 'public'
SELECT 
    nspname AS schema_name,
    r.rolname AS grantee,
    has_schema_privilege(r.rolname, nspname, 'USAGE') AS has_usage,
    has_schema_privilege(r.rolname, nspname, 'CREATE') AS has_create
FROM pg_namespace n
CROSS JOIN pg_roles r
WHERE n.nspname = 'public'
  AND r.rolname IN ('anon', 'authenticated', 'service_role')
ORDER BY r.rolname;

-- B.5 Default Privileges for New Tables/Sequences in public schema
SELECT 
    pg_get_userbyid(d.defaclrole) AS grantor_role,
    r.rolname AS grantee,
    d.defaclobjtype AS object_type, -- 'r' = relation/table, 'S' = sequence, 'f' = function
    d.defaclacl::text AS acl_rights
FROM pg_default_acl d
CROSS JOIN pg_roles r
JOIN pg_namespace n ON n.oid = d.defaclnamespace
WHERE n.nspname = 'public'
  AND r.rolname IN ('anon', 'authenticated', 'service_role');


-- =============================================================================
-- SECTION C: SAFENET CRITICAL SPECIFIC AUDITS
-- =============================================================================

-- C.1 SafeNet Foreign Key Integrity Check
-- Verifies:
-- 1) social_publish_jobs.post_id REFERENCES blog_posts(id) ON DELETE CASCADE
-- 2) job_applications.opening_id REFERENCES career_openings(id) ON DELETE SET NULL
-- 3) admin_sessions.user_id REFERENCES admin_users(id) ON DELETE CASCADE
SELECT 
    con.conname AS fk_name,
    src_table.relname AS source_table,
    att_src.attname AS source_column,
    ref_table.relname AS referenced_table,
    att_ref.attname AS referenced_column,
    CASE con.confdeltype
        WHEN 'c' THEN 'CASCADE'
        WHEN 'n' THEN 'SET NULL'
        WHEN 'd' THEN 'SET DEFAULT'
        WHEN 'r' THEN 'RESTRICT'
        WHEN 'a' THEN 'NO ACTION'
        ELSE con.confdeltype::text
    END AS on_delete_action
FROM pg_constraint con
JOIN pg_class src_table ON src_table.oid = con.conrelid
JOIN pg_class ref_table ON ref_table.oid = con.confrelid
JOIN pg_attribute att_src ON att_src.attrelid = con.conrelid AND att_src.attnum = con.conkey[1]
JOIN pg_attribute att_ref ON att_ref.attrelid = con.confrelid AND att_ref.attnum = con.confkey[1]
WHERE con.contype = 'f'
  AND src_table.relname IN ('social_publish_jobs', 'job_applications', 'admin_sessions');

-- C.2 SafeNet Primary Key Structure Verification
-- Verifies that admin_sessions primary key is 'token' (not 'id' or 'session_token').
SELECT 
    rel.relname AS table_name,
    att.attname AS primary_key_column,
    format_type(att.atttypid, att.atttypmod) AS column_type
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = con.conkey[1]
WHERE con.contype = 'p'
  AND rel.relname IN ('admin_sessions', 'owner_recovery_state', 'site_settings', 'social_accounts');

-- C.3 Nullability of job_applications.opening_id
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'job_applications'
  AND column_name = 'opening_id';

-- C.4 owner_recovery_state Field Coverage Check
-- Verifies required columns: id, owner_recovery_disabled, one_time_secret_hash,
-- salt, iterations, invalidated_secret_hashes, updated_at
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'owner_recovery_state'
ORDER BY ordinal_position;

-- C.5 Public View Isolation Audit for public_site_settings
-- Exposes ONLY non-sensitive company info (company_name, registration_number, address,
-- contact, emails, emergency_hotline, psira_registration, etc.).
-- MUST NOT expose internal administrative credentials or sensitive metadata.
SELECT 
    table_name AS view_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'public_site_settings'
ORDER BY ordinal_position;

-- C.6 Sensitive Tables Client Access Exposure Audit
-- Verifies that 'anon' and 'authenticated' roles have NO SELECT or ALL permissions
-- on highly sensitive tables: social_accounts, admin_users, admin_sessions,
-- owner_recovery_state, audit_logs, leads, security_assessments, job_applications.
SELECT 
    table_name,
    grantee,
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated')
  AND table_name IN (
        'social_accounts',
        'admin_users',
        'admin_sessions',
        'owner_recovery_state',
        'audit_logs',
        'leads',
        'security_assessments',
        'job_applications',
        'social_publish_jobs',
        'site_settings'
  );


-- =============================================================================
-- SECTION D: CONFLICT & DRIFT DETECTION
-- =============================================================================

-- D.1 Identify Non-SafeNet Public Tables or Orphaned Schema Elements
SELECT 
    c.relname AS foreign_or_unexpected_table,
    pg_get_userbyid(c.relowner) AS table_owner,
    c.reltuples::bigint AS estimated_rows
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname NOT IN (
        'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
        'leads', 'security_assessments', 'blog_posts', 'social_accounts',
        'social_publish_jobs', 'career_openings', 'job_applications',
        'testimonials', 'audit_logs', 'migration_metadata'
  );

-- D.2 Identify Incomplete Schema Definitions (Tables present with 0 columns matching SafeNet)
SELECT 
    table_name,
    COUNT(*) AS total_columns
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
        'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
        'leads', 'security_assessments', 'blog_posts', 'social_accounts',
        'social_publish_jobs', 'career_openings', 'job_applications',
        'testimonials', 'audit_logs', 'migration_metadata'
  )
GROUP BY table_name;

-- D.3 SafeNet Migration Metadata Check
-- Checks if an earlier migration has run and its recorded status.
SELECT 
    id,
    version,
    applied_at,
    checksum,
    notes
FROM public.migration_metadata;
-- (Note: If migration_metadata does not exist, PostgreSQL will safely return an
-- object not found message, signaling a clean database ready for initial deployment).

-- =============================================================================
-- END OF PREFLIGHT INSPECTION SCRIPT
-- =============================================================================
