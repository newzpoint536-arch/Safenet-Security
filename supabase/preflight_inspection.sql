-- ==============================================================================
-- SAFENET SECURITY SOLUTIONS LTD — PHASE 2B.2 REMOTE PREFLIGHT INSPECTION SCRIPT
-- ==============================================================================
-- SAFETY CLASSIFICATION: 100% READ-ONLY DIAGNOSTIC SCRIPT
-- PERMITTED COMMANDS: SELECT ONLY against pg_catalog and information_schema
-- PROHIBITED: NO DDL (CREATE, ALTER, DROP), NO DML (INSERT, UPDATE, DELETE, TRUNCATE)
-- TARGET ENVIRONMENT: Supabase SQL Editor (PostgreSQL 15+)
-- ==============================================================================

-- ==============================================================================
-- SECTION 0: PREFLIGHT RUNTIME & ENVIRONMENT METADATA
-- ==============================================================================

-- Query 0.1: PostgreSQL Version, Current Database, Current User, and Session Timezone
SELECT 
    '0.1_SERVER_ENVIRONMENT' AS check_id,
    version() AS postgres_version,
    current_database() AS database_name,
    current_user AS executing_user,
    current_schema() AS default_schema,
    current_setting('TIMEZONE') AS session_timezone;

-- Query 0.2: Installed Extensions vs Required Extensions (uuid-ossp, pgcrypto)
SELECT 
    '0.2_EXTENSIONS' AS check_id,
    e.extname AS extension_name,
    e.extversion AS installed_version,
    n.nspname AS schema_name
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
ORDER BY e.extname;

-- Query 0.3: Custom Types / Enums (e.g., safenet_admin_role)
SELECT 
    '0.3_CUSTOM_ENUMS' AS check_id,
    n.nspname AS enum_schema,
    t.typname AS enum_name,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) AS enum_labels
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE n.nspname = 'public'
GROUP BY n.nspname, t.typname
ORDER BY t.typname;

-- ==============================================================================
-- SECTION A: DATABASE OBJECTS (TABLES, COLUMNS, KEYS, CONSTRAINTS, INDEXES, VIEWS)
-- ==============================================================================

-- Query A.1: Existing SafeNet Tables and Non-SafeNet Objects in public Schema
SELECT 
    'A.1_TABLE_INVENTORY' AS check_id,
    c.relname AS table_name,
    CASE 
        WHEN c.relname IN (
            'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
            'leads', 'security_assessments', 'blog_posts', 'social_accounts',
            'social_publish_jobs', 'career_openings', 'job_applications',
            'testimonials', 'audit_logs', 'migration_metadata'
        ) THEN 'SAFENET_CORE_TABLE'
        ELSE 'OTHER_PUBLIC_TABLE'
    END AS object_classification,
    pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size,
    pg_stat_get_live_tuples(c.oid) AS estimated_row_count
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY object_classification DESC, c.relname;

-- Query A.2: Detailed Column Definitions for SafeNet Tables (Data Types, Nullability, Defaults)
SELECT 
    'A.2_COLUMN_SPECS' AS check_id,
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

-- Query A.3: Primary Keys and Unique Constraints
SELECT 
    'A.3_PK_AND_UNIQUE_CONSTRAINTS' AS check_id,
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    kcu.ordinal_position
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name 
   AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public'
  AND tc.table_name IN (
      'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
      'leads', 'security_assessments', 'blog_posts', 'social_accounts',
      'social_publish_jobs', 'career_openings', 'job_applications',
      'testimonials', 'audit_logs', 'migration_metadata'
  )
  AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name, kcu.ordinal_position;

-- Query A.4: Foreign Keys and Referential Integrity Actions (ON DELETE / ON UPDATE)
SELECT 
    'A.4_FOREIGN_KEYS' AS check_id,
    kcu.table_name AS child_table,
    kcu.column_name AS child_column,
    rc.constraint_name,
    ccu.table_name AS referenced_parent_table,
    ccu.column_name AS referenced_parent_column,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.referential_constraints rc
JOIN information_schema.key_column_usage kcu 
    ON rc.constraint_name = kcu.constraint_name 
   AND rc.constraint_schema = kcu.constraint_schema
JOIN information_schema.constraint_column_usage ccu 
    ON rc.unique_constraint_name = ccu.constraint_name 
   AND rc.unique_constraint_schema = ccu.constraint_schema
WHERE rc.constraint_schema = 'public'
ORDER BY kcu.table_name, rc.constraint_name;

-- Query A.5: Check Constraints (e.g., status enums, admin user status)
SELECT 
    'A.5_CHECK_CONSTRAINTS' AS check_id,
    tc.table_name,
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name 
   AND tc.constraint_schema = cc.constraint_schema
WHERE tc.table_schema = 'public'
  AND tc.table_name IN (
      'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
      'leads', 'security_assessments', 'blog_posts', 'social_accounts',
      'social_publish_jobs', 'career_openings', 'job_applications',
      'testimonials', 'audit_logs', 'migration_metadata'
  )
  AND tc.constraint_type = 'CHECK'
ORDER BY tc.table_name, tc.constraint_name;

-- Query A.6: Index Definitions (Indexes, Uniqueness, Method)
SELECT 
    'A.6_INDEX_DEFINITIONS' AS check_id,
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
      'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
      'leads', 'security_assessments', 'blog_posts', 'social_accounts',
      'social_publish_jobs', 'career_openings', 'job_applications',
      'testimonials', 'audit_logs', 'migration_metadata'
  )
ORDER BY tablename, indexname;

-- Query A.7: Views, Definitions, View Ownership, and Security Invoker Setting
SELECT 
    'A.7_VIEW_DEFINITIONS' AS check_id,
    v.table_name AS view_name,
    pg_get_userbyid(c.relowner) AS view_owner,
    c.reloptions AS view_options, -- Shows security_invoker if enabled
    v.view_definition
FROM information_schema.views v
JOIN pg_class c ON c.relname = v.table_name
JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = v.table_schema
WHERE v.table_schema = 'public'
ORDER BY v.table_name;

-- ==============================================================================
-- SECTION B: SECURITY CONFIGURATION (RLS, POLICIES, ROLE PRIVILEGES)
-- ==============================================================================

-- Query B.1: Row Level Security (RLS) Status on SafeNet Tables
SELECT 
    'B.1_RLS_STATUS' AS check_id,
    c.relname AS table_name,
    c.relrowsecurity AS rls_enabled,
    c.relforcerowsecurity AS rls_enforced_for_owners
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
      'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
      'leads', 'security_assessments', 'blog_posts', 'social_accounts',
      'social_publish_jobs', 'career_openings', 'job_applications',
      'testimonials', 'audit_logs', 'migration_metadata'
  )
ORDER BY c.relname;

-- Query B.2: Complete RLS Policies Listing (Commands, Roles, USING and WITH CHECK expressions)
SELECT 
    'B.2_RLS_POLICIES' AS check_id,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual AS using_expression,
    with_check AS with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
      'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
      'leads', 'security_assessments', 'blog_posts', 'social_accounts',
      'social_publish_jobs', 'career_openings', 'job_applications',
      'testimonials', 'audit_logs', 'migration_metadata'
  )
ORDER BY tablename, policyname;

-- Query B.3: Table Privileges for Client & Service Roles (anon, authenticated, service_role)
SELECT 
    'B.3_TABLE_PRIVILEGES' AS check_id,
    table_name,
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND table_name IN (
      'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
      'leads', 'security_assessments', 'blog_posts', 'social_accounts',
      'social_publish_jobs', 'career_openings', 'job_applications',
      'testimonials', 'audit_logs', 'migration_metadata', 'public_site_settings'
  )
  AND grantee IN ('anon', 'authenticated', 'service_role', 'public')
ORDER BY table_name, grantee, privilege_type;

-- Query B.4: Schema USAGE Privileges on public
SELECT 
    'B.4_SCHEMA_PRIVILEGES' AS check_id,
    nspname AS schema_name,
    rolname AS role_name,
    has_schema_privilege(rolname, nspname, 'USAGE') AS has_usage,
    has_schema_privilege(rolname, nspname, 'CREATE') AS has_create
FROM pg_namespace
CROSS JOIN pg_roles
WHERE nspname = 'public'
  AND rolname IN ('anon', 'authenticated', 'service_role', 'postgres')
ORDER BY rolname;

-- Query B.5: Default Privileges Affecting Future Tables / Sequences in public Schema
SELECT 
    'B.5_DEFAULT_PRIVILEGES' AS check_id,
    pg_get_userbyid(d.defpaclnamespace) AS schema_owner,
    n.nspname AS target_schema,
    d.defaclobjtype AS object_type,
    d.defaclacl AS acl_privilege_array
FROM pg_default_acl d
JOIN pg_namespace n ON n.oid = d.defaclnamespace
WHERE n.nspname = 'public';

-- ==============================================================================
-- SECTION C: SAFENET-SPECIFIC EXPOSURE & ISOLATION AUDIT
-- ==============================================================================

-- Query C.1: Verification of View Projection: public_site_settings vs site_settings
SELECT 
    'C.1_VIEW_COLUMN_PROJECTION' AS check_id,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('site_settings', 'public_site_settings')
ORDER BY table_name, ordinal_position;

-- Query C.2: High-Risk Permission Exposure Audit (Flag any unexpected client access)
SELECT 
    'C.2_RISK_AUDIT_ANON_AUTHENTICATED' AS check_id,
    table_name,
    grantee,
    privilege_type,
    'CRITICAL_VIOLATION' AS audit_status
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated', 'public')
  AND table_name IN (
      'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
      'leads', 'security_assessments', 'social_accounts', 'social_publish_jobs',
      'job_applications', 'audit_logs', 'migration_metadata'
  );

-- Query C.3: Verification of Approved Public Select Grants
SELECT 
    'C.3_APPROVED_PUBLIC_SELECT' AS check_id,
    table_name,
    grantee,
    privilege_type,
    'APPROVED_PUBLIC_GRANT' AS audit_status
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated')
  AND table_name IN ('blog_posts', 'testimonials', 'career_openings', 'public_site_settings')
  AND privilege_type = 'SELECT';

-- Query C.4: Service Role Privileges Audit (Ensuring exact CRUD without excess)
SELECT 
    'C.4_SERVICE_ROLE_TABLE_ACCESS' AS check_id,
    table_name,
    string_agg(privilege_type, ', ' ORDER BY privilege_type) AS granted_privileges
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee = 'service_role'
  AND table_name IN (
      'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
      'leads', 'security_assessments', 'blog_posts', 'social_accounts',
      'social_publish_jobs', 'career_openings', 'job_applications',
      'testimonials', 'audit_logs', 'migration_metadata', 'public_site_settings'
  )
GROUP BY table_name
ORDER BY table_name;

-- ==============================================================================
-- SECTION D: MIGRATION READINESS & EXISTING DATA STATE
-- ==============================================================================

-- Query D.1: Existing Row Counts for SafeNet Tables (Exact Live Tuples)
SELECT 
    'D.1_ROW_COUNTS' AS check_id,
    c.relname AS table_name,
    pg_stat_get_live_tuples(c.oid) AS live_tuples,
    pg_size_pretty(pg_relation_size(c.oid)) AS table_data_size,
    pg_size_pretty(pg_total_relation_size(c.oid)) AS total_table_and_indexes_size
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
      'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
      'leads', 'security_assessments', 'blog_posts', 'social_accounts',
      'social_publish_jobs', 'career_openings', 'job_applications',
      'testimonials', 'audit_logs', 'migration_metadata'
  )
ORDER BY c.relname;

-- Query D.2: Non-SafeNet Objects in public Schema (Detecting Collisions or Foreign Tables)
SELECT 
    'D.2_FOREIGN_OR_EXISTING_OBJECTS' AS check_id,
    c.relname AS object_name,
    c.relkind AS object_kind, -- r=table, v=view, m=materialized view, S=sequence
    pg_get_userbyid(c.relowner) AS owner_name
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname NOT IN (
      'site_settings', 'admin_users', 'admin_sessions', 'owner_recovery_state',
      'leads', 'security_assessments', 'blog_posts', 'social_accounts',
      'social_publish_jobs', 'career_openings', 'job_applications',
      'testimonials', 'audit_logs', 'migration_metadata', 'public_site_settings'
  )
  AND c.relkind IN ('r', 'v', 'm')
ORDER BY c.relname;

-- Query D.3: Storage and Database Capacity
SELECT 
    'D.3_DATABASE_CAPACITY' AS check_id,
    current_database() AS database_name,
    pg_size_pretty(pg_database_size(current_database())) AS current_db_size;
