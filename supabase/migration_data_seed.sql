-- SafeNet Security Solutions Ltd — Production Data Migration
-- Generated deterministically from data/database.json
BEGIN;


INSERT INTO site_settings (
  id, company_name, tagline, phone, email, whatsapp,
  address_nigeria, address_uk, established_year, stats,
  social_publishing_mode, social_links, updated_at
) VALUES (
  'current',
  'SafeNet Security Solutions Ltd',
  'Protecting What Matters Most With Unwavering Vigilance',
  '+234 813 129 6054',
  'info@safenetsecurityltd.com',
  '+234 813 129 6054',
  'Plot 14, Commercial Avenue, Victoria Island, Lagos, Nigeria',
  '85 Great Portland Street, First Floor, London, W1W 7LT, United Kingdom',
  '2025',
  '{"trainedGuards":"500+","responseTime":"24/7","droneCctvCoverage":"100%","clientRetention":"99.4%"}'::jsonb,
  'manual_approval',
  '{"facebook":"https://www.facebook.com/share/1H3ow82i4q","linkedin":"https://linkedin.com/company/safenet-security-solutions-ltd","x":"https://x.com/LtdSafenet10159","instagram":"https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=itpgcrs","youtube":"https://youtube.com/@safenetsecurityltd"}'::jsonb,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  tagline = EXCLUDED.tagline,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  address_nigeria = EXCLUDED.address_nigeria,
  address_uk = EXCLUDED.address_uk,
  stats = EXCLUDED.stats,
  social_publishing_mode = EXCLUDED.social_publishing_mode,
  social_links = EXCLUDED.social_links,
  updated_at = NOW();


INSERT INTO admin_users (
  id, name, email, role, salt, hash, iterations,
  recovery_passphrase_hash, recovery_passphrase_salt, recovery_passphrase_iterations,
  created_at, last_login, status
) VALUES (
  'admin-1792261423636',
  'Capt. Emmanuel Adeleke (Rtd.)',
  'director@safenetsecurityltd.com',
  'super_admin',
  '53976f8723bf778cb49350cb398725156c17fbf15c74c90db569b05aa8695c55',
  '1034b9241b32ac7fc86d547be81d78bf8707163d381a5cfa70bbaef2eb0f2918e128a798ebe07e194265c4de44afa743646589ae76fa1e1abb546a37a9238d0d',
  210000,
  'cd154dc740ea4fe2484be4d54ad938cc9e9554ec2d9e8a3e2b6bc147e13e53566fd6458b11bdad21c7f5c8903977f9cc6da584d00401e87ac2dd1bef722d5636',
  '460fe9dc1db2254b25bcb386eb980b5dab5d8c7864b88b993a4d36080442c148',
  210000,
  '2026-10-17T18:23:43.636Z',
  '2026-10-27T15:53:10.504Z',
  'active'
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


INSERT INTO owner_recovery_state (
  id, owner_recovery_disabled, owner_recovery_disabled_at,
  owner_recovery_disabled_reason, recovery_secret_hash,
  recovery_secret_salt, recovery_secret_iterations,
  invalidated_secret_hashes, updated_at
) VALUES (
  'primary',
  false,
  NULL,
  NULL,
  '1f08404bbd889eb822a8b817fd71f7460f94769ce0ddd703c75ce9da94f5f33878b21bfc822952f572be972e5de3a862c29ca5fd08c7c675449b04f15a0caf84',
  'd7bf5c545d7a601b10b3b66716432e675750762bf931deaaf7fb6e8a55732902',
  210000,
  '["e76c0fa479a69a997bf2471eda535fc217ab94c5166432b5b25344440b0acdbc","46284fb269b2a48900e9e43be0ad8caf157847c277d37dc0a51637fec99ab279","96f26daff167847a897be23fc477a511ac87dfab587e52963511c291611a3e64","a3d6dbf72a3079b9aa8af413d8f1c2d1966ea6c38c4346c22e1a838d4062eb94","dca4a8aabe9488d792e6c074c864849d1140e87195724e85d198a8f6b68af2ab","50a0284f797d6ab5eb651aa34f66ac94e3295a784b1d47848b03410f97b28e20","df881195ce24477895c20e8c532196024dffc3e18d78568206c82084db5d478e","c2f24374074922d8643637c35c0b28fc83f4d8939df95d34d2d1ec5c9f8f73c1","f4153045513936beb60a741f5044fb70a9b0f2bf41adc9d235d2393f746fc422","9770503c7d27278502851a9deefcd359101db9b35d4a1d5ee85c0dd38d26780b","4c6664975c1a17b1a005a3c4460c3105d367893b94f9c6ed1559308e30431c56","4bff956ee67c3fa45aebb9b40c7134b9e111bf8cb76e15f4dd74a21de44e9cae","12a2ec8a102fdcd6d0a46a1a6f4a86d239da895aef9345c2574e393fefac6380","e1d151c0e9033a9fda231ae7f2d72b2595a0037a908493e3add47d41c124a8d7","d34fe3fba029a8d58af51e1bea07d03fba1340ee89e11c81cd2e4034c5850cd8","4894a55c8c0776ced8e285dc52ddfca54e3090ff6eeb602d90f632a8c3aaf0a5","d2e0886d41b65240e5a68e5e2012d7f6ee8764b0474f29ead63293e70acaf54f","94ba78ecbabd2ce0c8e744a63ec84ca9de35439c23358164291db5a4c020e9ff","2fc4125e4ae536fdb727c02141dbdaf0175ca2da42cbfd171bf3e70a92256a2a","bf18b1df31593851f5ffaa762ab222817f2715eb83cda071a738f06864498fa3","ffb95393871af74b024509bd2d05957f6d9515e8f6ca7abc4386b8d67d75c8d4","2fe1c0207eac08696717d3c8474899180c77b36539db8fdd8fd438dbaf80d44d","702219a24d0b05ab7231a9e129f4719fc6af4510e3d6e60c20f7b96febdfdffa","97e3ac01c5db49edddc359a5bf979d3eaad92923d81a9c4f3e9036845c1c7261","50cadc6d3f8bd3a446784ef75bc3e2a3ac0e8fd79ed43a196b09942eb8b049b1","ffb45c3f0703cff0acecdd3fde9dd24dfc238af6a387d04f27d495faa23ac888","3d4276e189c88adb6ea5fded4cf4b7ac705181201594b5c6fe2a99d24f7748ff","d65f0a7dd9971800814d6daa4c1b23601992d0892bef5e3df547a1a007d513b1","14fa0c1777885894bab25d2fd841038af99a9f9795a7e7f9ab9594859b7e48f4","859596e27c3870e16d16eb753bec767c37a7eef8ccac08aafaa9b40790f424e1","af9023b3aa6478ce1129836f128119d7382a7ec97a1bca150bfd768da939355c","3aea20e51dd91e38d31ef496a8414765f8688c952d7ec39b3907dc18c1a0bd16","d2e9ee100931253887d989a687dd4b65d02c67243267816a755146c46c23120d","713a5cdc890d82bb26f49427a38c4ac7aa63a435e5d5fb2264da8e833fbfc3dd"]'::jsonb,
  NOW()
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


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1793116390550-4111',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-27T15:53:10.550Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1793107868806-7703',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-27T13:31:08.806Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1793100467585-7808',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-27T11:27:47.585Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1793097106311-4737',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-27T10:31:46.311Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792694678257-6879',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-22T18:44:38.257Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792683517479-1819',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-22T15:38:37.479Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792675908433-6121',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-22T13:31:48.433Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792675056069-1173',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-22T13:17:36.069Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792526031010-6104',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-20T19:53:51.010Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792525977216-6809',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-20T19:52:57.216Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792525864148-7133',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-20T19:51:04.148Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792525705101-7782',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-20T19:48:25.101Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792525594568-8414',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-20T19:46:34.568Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792525561583-9618',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-20T19:46:01.583Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792421644657-4792',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-19T14:54:04.657Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792405025191-6885',
  'Dr. Christopher Danjuma',
  'Atlantic Energy & Terminal Logistics',
  'c.danjuma@atlanticenergy.ng',
  '+234 803 987 6543',
  NULL,
  'Victoria Island, Lagos',
  NULL,
  'Offshore Maritime & Vessel Escort Security',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-19T10:17:05.191Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792261501855-2307',
  'Alhaji Musa Danjuma',
  NULL,
  'musa@danjumagroup.ng',
  '+234 803 555 1234',
  NULL,
  'Abuja CBD',
  NULL,
  'Manned Guarding & Tactical Response',
  NULL,
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-17T18:25:01.855Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1792154084927-3146',
  'Chief Babatunde Adeleke',
  'Zenith Marine Terminals',
  'babatunde@zenithmarine.ng',
  '+234 803 555 0192',
  NULL,
  'Apapa Port Complex, Lagos',
  NULL,
  'Armed Maritime Security & Fast Patrol Escorts',
  'Marine Terminal & Tank Farm',
  NULL,
  'immediate',
  'phone',
  'new',
  NULL,
  '[]'::jsonb,
  '2026-10-16T12:34:44.927Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-1',
  'Chief Babatunde Alabi',
  'Alabi Properties & Investment Group',
  'b.alabi@alabigroup.ng',
  '+234 802 345 6789',
  '+234 802 345 6789',
  'Victoria Island, Lagos',
  'Corporate Organizations',
  'Corporate Security Management & CCTV Installation',
  '12-Storey Commercial Tower',
  'Require 24 armed/unarmed static guards, automated biometric speed gates at reception, and a 64-channel CCTV installation with cloud backup.',
  'immediate',
  'phone',
  'proposal',
  '₦48,000,000 / year',
  '[{"id":"note-1","author":"Lead Manager","text":"Conducted initial site survey on March 25. Chief Alabi was impressed by our command center capabilities. Proposal submitted for review.","createdAt":"2026-03-25T16:00:00Z"}]'::jsonb,
  '2026-03-24T14:20:00Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-2',
  'Engr. Folake Adeleke',
  'Pacific Marine & Logistics Ltd',
  'f.adeleke@pacificmarineltd.com',
  '+234 818 901 2345',
  '+234 818 901 2345',
  'Onne Port, Port Harcourt',
  'Maritime & Ports',
  'Maritime Security & Armed Escort Vessels',
  'Offshore Jetty & Supply Vessels',
  'Need continuous armed maritime security escort for 3 crew supply vessels operating between Port Harcourt and Bonny Island.',
  '1-2_weeks',
  'whatsapp',
  'qualified',
  '₦85,000,000 / year',
  '[{"id":"note-2","author":"Specialist Advisory Team","text":"Vessel coordinates and Navy MOU alignment discussed via WhatsApp call. Scheduling technical security audit next Tuesday.","createdAt":"2026-03-26T11:30:00Z"}]'::jsonb,
  '2026-03-26T09:15:00Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO leads (
  id, full_name, company, email, phone, whatsapp,
  location, industry, service_required, property_type,
  project_description, urgency, preferred_contact, status,
  estimated_value, notes, created_at, updated_at
) VALUES (
  'lead-3',
  'Dr. Chuka Eze',
  'Harmony Crest Residents Association',
  'chairman@harmonycrestestate.org',
  '+234 803 765 4321',
  '+234 803 765 4321',
  'Lekki Scheme 2, Lagos',
  'Residential Estates',
  'Residential & Estate Security with K9 Patrols',
  'Gated Residential Estate (180 Houses)',
  'Current security provider has poor attendance. We need 16 disciplined guards, WhatsApp visitor pass system, and night K9 patrols along the perimeter.',
  'immediate',
  'phone',
  'new',
  '₦26,000,000 / year',
  '[]'::jsonb,
  '2026-03-27T10:05:00Z',
  NOW()
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
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = NOW();


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1793116390577-3713',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-27T15:53:10.577Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1793107868835-8735',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-27T13:31:08.835Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1793100467604-5671',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-27T11:27:47.604Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1793097106330-9085',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-27T10:31:46.330Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1792694678280-4461',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-22T18:44:38.280Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1792683517500-6342',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-22T15:38:37.500Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1792675908453-3105',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-22T13:31:48.453Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1792675056088-6797',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-22T13:17:36.088Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1792526031026-7556',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-20T19:53:51.026Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1792525977231-4103',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-20T19:52:57.231Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1792525864160-7535',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-20T19:51:04.160Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1792525705112-8288',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-20T19:48:25.112Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1792525594572-2937',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-20T19:46:34.572Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1792525561588-9171',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-20T19:46:01.588Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1792421644665-8224',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-19T14:54:04.665Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO security_assessments (
  id, client_name, client_email, client_phone, client_company,
  facility_type, industry, location, facilities_count,
  existing_personnel, cctv_coverage, access_control,
  alarm_systems, fleet_size, primary_risk_concerns,
  calculated_score, risk_rating, identified_gaps,
  recommended_services, recommended_layers, created_at
) VALUES (
  'assess-1792405025200-8244',
  'Engr. Emeka Okonkwo',
  'e.okonkwo@transcorp.ng',
  '+234 812 345 6789',
  NULL,
  'Industrial Plant & Tank Farm',
  NULL,
  'Port Harcourt, Rivers State',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '[]'::jsonb,
  78,
  'High Priority Vulnerability',
  '[]'::jsonb,
  '[]'::jsonb,
  '["Perimeter Thermal CCTV","Drone Patrols","Manned Tactical Operatives"]'::jsonb,
  '2026-10-19T10:17:05.200Z'
)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name,
  client_email = EXCLUDED.client_email,
  client_phone = EXCLUDED.client_phone,
  calculated_score = EXCLUDED.calculated_score,
  risk_rating = EXCLUDED.risk_rating;


INSERT INTO blog_posts (
  id, slug, title, excerpt, content, featured_image,
  author, category, tags, published_at, updated_at,
  reading_time, status, seo_title, seo_description,
  related_services, views
) VALUES (
  'blog-1',
  'corporate-security-trends-nigeria-2026',
  'Modernizing Corporate Security in Nigeria: From Gatekeeping to Integrated Intelligence',
  'How leading enterprises in Lagos, Abuja, and Port Harcourt are combining UK operational rigor with biometric access control, drone surveillance, and continuous command center monitoring.',
  'For decades, corporate security in Nigeria was largely understood as a static numbers game: post guards at the main gate, hand them an attendance notebook, and hope for the best.

However, the threat landscape confronting Nigerian businesses today has evolved dramatically. Organized criminal networks, corporate espionage, civil disruptions, and targeted executive extortion demand a paradigm shift from passive gatekeeping to proactive, technology-driven security intelligence.

### The Limits of Traditional Manned Guarding

While professional, well-trained human guards remain indispensable, relying on human eyes alone across sprawling facilities is inherently flawed. Night fatigue, blind spots around perimeter walls, and lack of immediate coordination during coordinated incursions leave facilities exposed.

SafeNet''s operational model addresses this by fusing high-discipline human personnel with autonomous technology. Every guard on our client sites operates as a connected node in a wider security network—equipped with electronic patrol verification wands and direct radio uplinks to our 24/7 central monitoring station.

### The Role of Drone Surveillance in Estate and Industrial Defense

Nowhere is the technological leap more apparent than in drone surveillance. Across large manufacturing plants, residential estates in Lekki, and industrial tank farms, drone reconnaissance provides:
1. **Instant Elevation**: Gaining 360-degree top-down visibility over a 50-hectare facility in less than 90 seconds.
2. **Thermal Penetration**: Detecting human thermal signatures hidden in darkness or dense vegetation where conventional cameras cannot see.
3. **Safe Vectoring**: Directing armed ground units safely to intercept intruders without exposing guards to blind ambushes.

### Building Resilience for 2026 and Beyond

As Nigerian enterprises expand, executive protection, data sovereignty, and physical perimeter hardening must be designed as an integrated ecosystem. Forward-thinking companies are conducting comprehensive security audits, identifying single points of failure, and migrating to unified monitoring.

SafeNet Security Solutions Ltd continues to lead this transformation, proving that with UK-level operational standards and authentic Nigerian local knowledge, corporations can operate with total confidence and unyielding vigilance.',
  '/src/assets/images/hero_nigerian_security_command_1790574276695.jpg',
  '{"name":"Capt. Emmanuel Adeleke (Rtd.)","role":"Head of Operations & Strategic Advisory, SafeNet"}'::jsonb,
  'Corporate Security',
  '["Corporate Security","Drone Surveillance","CCTV Monitoring","Nigeria Business"]'::jsonb,
  '2026-03-15T09:00:00Z',
  '2026-03-15T09:00:00Z',
  '5 min read',
  'published',
  'Corporate Security Trends Nigeria 2026 — SafeNet Security Solutions Ltd',
  'Discover how modern Nigerian corporations are adopting integrated drone surveillance, biometric access, and 24/7 command operations.',
  '["cctv-installation-monitoring","drone-surveillance-security","corporate-security"]'::jsonb,
  1420
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  featured_image = EXCLUDED.featured_image,
  updated_at = EXCLUDED.updated_at,
  status = EXCLUDED.status,
  views = EXCLUDED.views;


INSERT INTO blog_posts (
  id, slug, title, excerpt, content, featured_image,
  author, category, tags, published_at, updated_at,
  reading_time, status, seo_title, seo_description,
  related_services, views
) VALUES (
  'blog-2',
  'drone-surveillance-revolution-industrial-protection',
  'Deploying Autonomous Drone Surveillance: Lessons from Nigerian Energy Facilities',
  'Examining the technical deployment of thermal-equipped UAVs for perimeter security, pipeline inspection, and rapid alert verification in remote terrains.',
  'Securing critical infrastructure across remote and challenging Nigerian terrain—from the coastal mangroves of the Niger Delta to the expansive savannahs of the North—presents unique physical challenges.

Ground vehicles are often constrained by bad roads or flooded paths. Human foot patrols move too slowly to intercept fast-moving intruders. Autonomous and piloted drone technology has emerged as the definitive game-changer.

### Thermal Night Vision: The Ultimate Deterrent

Most infiltration and pipeline tapping attempts occur between 00:00 and 04:00 under the cover of pitch darkness. Standard CCTV cameras, even with infrared illuminators, have a limited range of 30 to 50 meters.

By contrast, SafeNet''s industrial drone platforms, such as the DJI Matrice 350 RTK equipped with radiometric thermal sensors, detect human body heat from altitudes exceeding 300 meters and distances over 1.5 kilometers. An intruder attempting to breach a boundary fence cannot hide behind trees, water hyacinth, or topography.

### Key Deployment Considerations in Nigeria

Deploying security drones in Nigeria requires careful operational planning:
- **Regulatory Compliance**: Full compliance with NCAA (Nigerian Civil Aviation Authority) flight clearances and designated no-fly zones around airfields.
- **Power Resilience**: Automated weather-proof charging docks and solar battery stations ensuring zero mission downtime.
- **Data Encryption**: AES-256 encrypted digital video streams transmitting directly to our command center to prevent signal interception.

Through disciplined aerial surveillance, energy and logistics operators can turn thousands of unmonitored hectares into an actively defended, transparent security perimeter.',
  '/src/assets/images/nigerian_drone_surveillance_1790574299226.jpg',
  '{"name":"Ibrahim Bala","role":"Chief Drone Systems Engineer, SafeNet"}'::jsonb,
  'Security Technology',
  '["Drone Surveillance","Critical Infrastructure","Oil & Gas","Thermal Imaging"]'::jsonb,
  '2026-03-08T11:30:00Z',
  '2026-03-08T11:30:00Z',
  '6 min read',
  'published',
  'Drone Surveillance for Industrial Facilities in Nigeria — SafeNet',
  'How thermal drone security overcomes terrain challenges to protect industrial and energy corridors across Nigeria.',
  '["drone-surveillance-security","pipeline-surveillance-security"]'::jsonb,
  980
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  featured_image = EXCLUDED.featured_image,
  updated_at = EXCLUDED.updated_at,
  status = EXCLUDED.status,
  views = EXCLUDED.views;


INSERT INTO blog_posts (
  id, slug, title, excerpt, content, featured_image,
  author, category, tags, published_at, updated_at,
  reading_time, status, seo_title, seo_description,
  related_services, views
) VALUES (
  'blog-3',
  'executive-protection-vip-travel-security-lagos',
  'Executive Protection & Secure Transit in Urban Nigeria: A Strategic Guide',
  'Essential protocols for international delegations, C-suite executives, and high-net-worth families navigating travel between airport corridors, hotels, and operational sites.',
  'Navigating commercial centers like Lagos, Port Harcourt, and Abuja requires meticulous attention to transit security. While urban Nigeria offers tremendous commercial vitality, transit corridors present inherent vulnerabilities if travel planning is neglected.

### The Fallacy of "Armed Flashing Lights"

A common misconception is that effective executive protection simply means hiring a loud vehicle with sirens and armed men waving guns. In truth, overt aggression often draws unnecessary attention, provokes hostility in heavy traffic, and telegraphs the presence of high-value principals.

True executive protection, as practiced by SafeNet to British and international standards, is built upon **discretion, advance reconnaissance, and predictive intelligence**:

1. **Advance Reconnaissance**: Our advance security officers traverse the intended itinerary hours before the principal departs, identifying choke points, alternative escape routes, nearby verified hospitals, and safe havens.
2. **Low-Profile Armored Vehicles**: B6-rated armored SUVs look indistinguishable from standard luxury vehicles, offering certified protection against high-caliber assault rifle rounds and explosive fragments without announcing vulnerability.
3. **Evasive Tactical Driving**: Certified security drivers trained in vehicle dynamics, anti-ambush evasive maneuvers, and skid recovery ensure the principal is never pinned in gridlock.

### Safe Tarmac Meet-and-Greet Protocols

The initial arrival at the airport is often the most stressful phase for visiting foreign executives. SafeNet’s protocol teams coordinate directly with federal aviation authorities to provide seamless airside greeting, expedited customs processing, and direct transfer into staged armored convoys.

By mitigating transit friction and physical risks, executives can focus entirely on their business objectives, secure in the knowledge that their personal safety is guarded by true professionals.',
  '/src/assets/images/hero_nigerian_corporate_guards_1790574288138.jpg',
  '{"name":"David O. Nwosu","role":"Director of Specialist Protection, SafeNet"}'::jsonb,
  'Executive Protection',
  '["Executive Protection","VIP Transit","Armored Vehicles","Lagos Security"]'::jsonb,
  '2026-02-27T14:15:00Z',
  '2026-02-27T14:15:00Z',
  '5 min read',
  'published',
  'Executive Protection & VIP Travel Security in Lagos — SafeNet',
  'Strategic guide to VIP travel security, armored motorcades, and close protection in urban Nigeria.',
  '["vip-escort-bodyguard-services","airport-security"]'::jsonb,
  1210
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  featured_image = EXCLUDED.featured_image,
  updated_at = EXCLUDED.updated_at,
  status = EXCLUDED.status,
  views = EXCLUDED.views;


INSERT INTO social_accounts (
  platform, display_name, handle, connected,
  token_expiry, auto_publish, last_synced_at, avatar_url
) VALUES (
  'facebook',
  'Facebook Page',
  'SafeNet Security Solutions Ltd',
  true,
  '2026-09-30T00:00:00Z',
  true,
  '2026-03-27T20:00:00Z',
  NULL
)
ON CONFLICT (platform) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  handle = EXCLUDED.handle,
  connected = EXCLUDED.connected,
  auto_publish = EXCLUDED.auto_publish,
  last_synced_at = EXCLUDED.last_synced_at,
  avatar_url = EXCLUDED.avatar_url;


INSERT INTO social_accounts (
  platform, display_name, handle, connected,
  token_expiry, auto_publish, last_synced_at, avatar_url
) VALUES (
  'linkedin',
  'LinkedIn Corporate',
  'SafeNet Security Solutions Ltd',
  true,
  '2026-10-15T00:00:00Z',
  true,
  '2026-03-27T20:00:00Z',
  NULL
)
ON CONFLICT (platform) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  handle = EXCLUDED.handle,
  connected = EXCLUDED.connected,
  auto_publish = EXCLUDED.auto_publish,
  last_synced_at = EXCLUDED.last_synced_at,
  avatar_url = EXCLUDED.avatar_url;


INSERT INTO social_accounts (
  platform, display_name, handle, connected,
  token_expiry, auto_publish, last_synced_at, avatar_url
) VALUES (
  'x',
  'X / Twitter Official',
  '@safenet_sec',
  true,
  '2026-11-01T00:00:00Z',
  true,
  '2026-03-27T20:00:00Z',
  NULL
)
ON CONFLICT (platform) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  handle = EXCLUDED.handle,
  connected = EXCLUDED.connected,
  auto_publish = EXCLUDED.auto_publish,
  last_synced_at = EXCLUDED.last_synced_at,
  avatar_url = EXCLUDED.avatar_url;


INSERT INTO social_accounts (
  platform, display_name, handle, connected,
  token_expiry, auto_publish, last_synced_at, avatar_url
) VALUES (
  'instagram',
  'Instagram Business',
  '@safenetsecurityltd',
  true,
  '2026-08-20T00:00:00Z',
  false,
  '2026-03-27T20:00:00Z',
  NULL
)
ON CONFLICT (platform) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  handle = EXCLUDED.handle,
  connected = EXCLUDED.connected,
  auto_publish = EXCLUDED.auto_publish,
  last_synced_at = EXCLUDED.last_synced_at,
  avatar_url = EXCLUDED.avatar_url;


INSERT INTO social_accounts (
  platform, display_name, handle, connected,
  token_expiry, auto_publish, last_synced_at, avatar_url
) VALUES (
  'youtube',
  'YouTube Channel',
  'SafeNet Security Solutions',
  false,
  '',
  false,
  '2026-10-31T19:53:16.515Z',
  NULL
)
ON CONFLICT (platform) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  handle = EXCLUDED.handle,
  connected = EXCLUDED.connected,
  auto_publish = EXCLUDED.auto_publish,
  last_synced_at = EXCLUDED.last_synced_at,
  avatar_url = EXCLUDED.avatar_url;


INSERT INTO social_publish_jobs (
  id, post_id, post_title, platform, status, date,
  post_url, caption, hashtags, error_message, retry_count,
  idempotency_key, utm_params
) VALUES (
  'job-1',
  'blog-1',
  'Modernizing Corporate Security in Nigeria: From Gatekeeping to Integrated Intelligence',
  'facebook',
  'published',
  '2026-03-15T09:05:00Z',
  'https://facebook.com/safenetsecurityltd/posts/981247192',
  'Is your corporate facility still relying on static gatekeeping? Discover how leading Nigerian enterprises in Lagos and Abuja are integrating 24/7 command surveillance, biometric access, and drone reconnaissance for comprehensive protection.',
  '["#CorporateSecurity","#NigeriaBusiness","#SafeNetSecurity","#LagosHQ"]'::jsonb,
  NULL,
  0,
  'fb-blog-1-20260315',
  '{"source":"facebook","medium":"social","campaign":"blog","content":"corporate-security-trends-nigeria-2026"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  post_url = EXCLUDED.post_url,
  error_message = EXCLUDED.error_message,
  retry_count = EXCLUDED.retry_count;


INSERT INTO social_publish_jobs (
  id, post_id, post_title, platform, status, date,
  post_url, caption, hashtags, error_message, retry_count,
  idempotency_key, utm_params
) VALUES (
  'job-2',
  'blog-1',
  'Modernizing Corporate Security in Nigeria: From Gatekeeping to Integrated Intelligence',
  'linkedin',
  'published',
  '2026-03-15T09:06:00Z',
  'https://linkedin.com/feed/update/urn:li:activity:71298410294',
  'Strategic Insight for C-Suite & Risk Leaders: The shift from passive physical guarding to integrated security intelligence in Nigeria. Read our operational analysis on balancing corporate hospitality with unyielding perimeter vigilance.',
  '["#SecurityManagement","#RiskMitigation","#NigeriaEnterprise","#SafeNet"]'::jsonb,
  NULL,
  0,
  'li-blog-1-20260315',
  '{"source":"linkedin","medium":"social","campaign":"blog","content":"corporate-security-trends-nigeria-2026"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  post_url = EXCLUDED.post_url,
  error_message = EXCLUDED.error_message,
  retry_count = EXCLUDED.retry_count;


INSERT INTO social_publish_jobs (
  id, post_id, post_title, platform, status, date,
  post_url, caption, hashtags, error_message, retry_count,
  idempotency_key, utm_params
) VALUES (
  'job-3',
  'blog-1',
  'Modernizing Corporate Security in Nigeria: From Gatekeeping to Integrated Intelligence',
  'x',
  'published',
  '2026-03-15T09:07:00Z',
  'https://x.com/safenet_sec/status/178912401924',
  'Why static guards alone cannot protect modern corporate towers in Nigeria. Read how SafeNet combines UK operational standards with 24/7 CCTV command centers and drone defense: https://safenetsecurityltd.com/blog/corporate-security-trends-nigeria-2026',
  '["#CorporateSecurity","#Lagos","#DroneSecurity"]'::jsonb,
  NULL,
  0,
  'x-blog-1-20260315',
  '{"source":"x","medium":"social","campaign":"blog","content":"corporate-security-trends-nigeria-2026"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  post_url = EXCLUDED.post_url,
  error_message = EXCLUDED.error_message,
  retry_count = EXCLUDED.retry_count;


INSERT INTO social_publish_jobs (
  id, post_id, post_title, platform, status, date,
  post_url, caption, hashtags, error_message, retry_count,
  idempotency_key, utm_params
) VALUES (
  'job-4',
  'blog-2',
  'Deploying Autonomous Drone Surveillance: Lessons from Nigerian Energy Facilities',
  'linkedin',
  'published',
  '2026-03-08T11:35:00Z',
  'https://linkedin.com/feed/update/urn:li:activity:71298410385',
  'Thermal Reconnaissance in Remote Corridors: How unmanned aerial systems (UAVs) are helping energy and industrial operators monitor sprawling perimeters in Nigeria with sub-minute alert verification.',
  '["#DroneSurveillance","#OilAndGasSecurity","#EnergyInfrastructure","#SafeNet"]'::jsonb,
  NULL,
  0,
  'li-blog-2-20260308',
  '{"source":"linkedin","medium":"social","campaign":"blog","content":"drone-surveillance-revolution-industrial-protection"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  post_url = EXCLUDED.post_url,
  error_message = EXCLUDED.error_message,
  retry_count = EXCLUDED.retry_count;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1793116390603-2078',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-27T15:53:10.603Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1793107868869-5046',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-27T13:31:08.869Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1793100467623-7931',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-27T11:27:47.623Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1793097106349-7751',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-27T10:31:46.349Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792694678300-4783',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-22T18:44:38.300Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792683517525-3795',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-22T15:38:37.525Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792675908472-5395',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-22T13:31:48.472Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792675056108-4757',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-22T13:17:36.108Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792526031041-2431',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-20T19:53:51.041Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792525977245-8681',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-20T19:52:57.245Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792525864173-9196',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-20T19:51:04.173Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792525705125-6585',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-20T19:48:25.125Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792525594577-2122',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-20T19:46:34.577Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792525561593-1764',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-20T19:46:01.593Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792421644676-3124',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-19T14:54:04.676Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO job_applications (
  id, opening_id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792405025219-1861',
  NULL,
  NULL,
  'Tactical Mobile Patrol Commander',
  'Sergeant Samuel Bamidele (Rtd.)',
  's.bamidele@gmail.com',
  '+234 805 123 4567',
  '8 years military/police background',
  NULL,
  NULL,
  'pending',
  'Certified',
  '2026-10-19T10:17:05.219Z'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  experience_years = EXCLUDED.experience_years;


INSERT INTO testimonials (
  id, name, position, organization, testimonial,
  rating, published, location, created_at
) VALUES (
  'test-1',
  'Mr. James Akume',
  'Head of Facility Operations',
  'Corporate Banking Tower, Victoria Island',
  'SafeNet completely transformed our facility security. Their officers are sharp, well-groomed, and punctually disciplined. The integration of biometric speed gates and 24/7 camera monitoring has eliminated access vulnerabilities while elevating our corporate presentation.',
  5,
  true,
  'Lagos',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  organization = EXCLUDED.organization,
  testimonial = EXCLUDED.testimonial,
  rating = EXCLUDED.rating,
  published = EXCLUDED.published;


INSERT INTO testimonials (
  id, name, position, organization, testimonial,
  rating, published, location, created_at
) VALUES (
  'test-2',
  'Mrs. Patricia Oghene',
  'Chairperson, Security Committee',
  'Lekki Peninsula Gated Community',
  'Since SafeNet took over our estate security, our residents have slept with total peace of mind. The thermal drone night sweeps and automated visitor pass codes stopped unauthorized entries immediately. Their supervisory responsiveness is exemplary.',
  5,
  true,
  'Lagos',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  organization = EXCLUDED.organization,
  testimonial = EXCLUDED.testimonial,
  rating = EXCLUDED.rating,
  published = EXCLUDED.published;


INSERT INTO testimonials (
  id, name, position, organization, testimonial,
  rating, published, location, created_at
) VALUES (
  'test-3',
  'Mr. Chinedu Okonkwo',
  'Director of Logistics & Terminal Security',
  'Apex Maritime Services Ltd',
  'In the Niger Delta, reliable maritime security is rare. SafeNet delivers international-grade offshore protection with impeccable naval coordination. Their escort patrol teams have conducted over 60 passages for our vessels without a single security breach.',
  5,
  true,
  'Port Harcourt',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  position = EXCLUDED.position,
  organization = EXCLUDED.organization,
  testimonial = EXCLUDED.testimonial,
  rating = EXCLUDED.rating,
  published = EXCLUDED.published;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-3',
  '2026-03-27T20:00:00Z',
  'Content Manager',
  'SOCIAL_QUEUE_SYNC',
  'Social Distribution Worker',
  'Automated publishing queue verified across Facebook, LinkedIn, and X.',
  '102.89.23.14 (Lagos, Nigeria)',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-2',
  '2026-03-27T19:15:00Z',
  'Operations Officer',
  'LEAD_STATUS_UPDATE',
  'Chief Babatunde Alabi (Lead #1)',
  'Status updated from Qualified to Proposal Sent.',
  '102.89.23.14 (Lagos, Nigeria)',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1',
  '2026-03-27T18:30:00Z',
  'Super Admin',
  'SYSTEM_INITIALIZATION',
  'SafeNet Security Command Centre',
  'Core security systems, blog CMS, and social distribution channels initialized.',
  '102.89.23.14 (Lagos, Nigeria)',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792154084806',
  '2026-10-16T12:34:44.806Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_PROVISIONED',
  'System Security Core',
  'First Super Administrator account securely provisioned with PBKDF2-SHA512 encryption.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792154084893',
  '2026-10-16T12:34:44.893Z',
  'Intruder (hacker@example.com)',
  'ADMIN_PROVISIONED',
  'System Security Core',
  'First Super Administrator account securely provisioned with PBKDF2-SHA512 encryption.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792154084927',
  '2026-10-16T12:34:44.927Z',
  'Inquirer (Chief Babatunde Adeleke)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Armed Maritime Security & Fast Patrol Escorts in Apapa Port Complex, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792154119668',
  '2026-10-16T12:35:19.668Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_PROVISIONED',
  'System Security Core',
  'First Super Administrator account securely provisioned with PBKDF2-SHA512 encryption.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792154119775',
  '2026-10-16T12:35:19.775Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Successful authenticated session started with role [super_admin].',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792154129517',
  '2026-10-16T12:35:29.517Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'PASSWORD_RESET_PASSPHRASE',
  'Admin Security Credentials',
  'Password was securely updated using the cryptographic recovery passphrase.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792154129603',
  '2026-10-16T12:35:29.603Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Successful authenticated session started with role [super_admin].',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792154129759',
  '2026-10-16T12:35:29.759Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'PASSWORD_RESET_PASSPHRASE',
  'Admin Security Credentials',
  'Password was securely updated using the cryptographic recovery passphrase.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792260496754',
  '2026-10-17T18:08:16.754Z',
  'Executive Director (owner@safenetsecurityltd.com)',
  'ADMIN_PROVISIONED',
  'System Security Core',
  'First Super Administrator account securely provisioned with PBKDF2-SHA512 encryption.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792260496931',
  '2026-10-17T18:08:16.931Z',
  'Executive Director (owner@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Successful authenticated session started with role [super_admin].',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792261423643-8752',
  '2026-10-17T18:23:43.643Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'INITIAL_PROVISIONING',
  'Core Administrative Identity',
  'First Super Administrator provisioned using PBKDF2-SHA512 (210,000 iterations). Initial setup permanently locked.',
  '127.0.0.1',
  '3ae1fa3effe2861ca5f6bd56c92ceef9f5fd919d5702239a89d030d4dcbcbfe0',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792261452605-3949',
  '2026-10-17T18:24:12.605Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  '2168a5df8203ae0d7d01d2e282031f0453f9bfc7ba8cd17651e68134995f330c',
  '3ae1fa3effe2861ca5f6bd56c92ceef9f5fd919d5702239a89d030d4dcbcbfe0'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792261461773-1441',
  '2026-10-17T18:24:21.773Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  'd9745e7d79918264f01e552938037567216b418470f898bba9223b950b3e0d41',
  '2168a5df8203ae0d7d01d2e282031f0453f9bfc7ba8cd17651e68134995f330c'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792261475153-3706',
  '2026-10-17T18:24:35.153Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'RECOVERY_FAILURE_BAD_PASSPHRASE',
  'Emergency Recovery Key',
  'Invalid recovery passphrase supplied. 2 attempt(s) remaining.',
  '127.0.0.1',
  'f19ba0990480efdb638168fe91d242ab7a5332e823cd7ee5f2df3ae9ab16d8ef',
  'd9745e7d79918264f01e552938037567216b418470f898bba9223b950b3e0d41'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792261480650-2828',
  '2026-10-17T18:24:40.650Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'PASSWORD_RESET_EMERGENCY_RECOVERY',
  'Credential Store',
  'Master password reset via emergency recovery passphrase. All existing active sessions revoked.',
  '127.0.0.1',
  '16f0571d7c778bde3dd196ec0d17b75f1363812310b96640292ef60074a73a3a',
  'f19ba0990480efdb638168fe91d242ab7a5332e823cd7ee5f2df3ae9ab16d8ef'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792261485876-9315',
  '2026-10-17T18:24:45.876Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  'a6cfde79cf9fafbbf6fae9e5f7f40270b34befcdd97cc52f49f27600dcb569ce',
  '16f0571d7c778bde3dd196ec0d17b75f1363812310b96640292ef60074a73a3a'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792261501855',
  '2026-10-17T18:25:01.855Z',
  'Inquirer (Alhaji Musa Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Manned Guarding & Tactical Response in Abuja CBD.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792351254021-2182',
  '2026-10-18T19:20:54.021Z',
  'Unknown (owner@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 2 attempts remaining.',
  '127.0.0.1',
  '9ce75f208827cc92c48806a70f16d38d63e93c66f5061963d8cbca8a8d7db003',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792351266084-5506',
  '2026-10-18T19:21:06.083Z',
  'Capt. Emmanuel Adeleke (Rtd.) (owner@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled.',
  '127.0.0.1',
  '80e4108ba8276c3dbf0004d425397d694d55e45b9020c31dede7773ef5257da9',
  '9ce75f208827cc92c48806a70f16d38d63e93c66f5061963d8cbca8a8d7db003'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792351284741-8469',
  '2026-10-18T19:21:24.741Z',
  'Capt. Emmanuel Adeleke (Rtd.) (owner@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  '64f44df793ea07d5c201a4f851249ee786eaae069c3dc545e70d08096a49f3c4',
  '80e4108ba8276c3dbf0004d425397d694d55e45b9020c31dede7773ef5257da9'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792351284924-7835',
  '2026-10-18T19:21:24.924Z',
  'Capt. Emmanuel Adeleke (Rtd.) (owner@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '94d06ab70ec6a0249d3f290a06dc148c8f3b50f4933eff2eec086538d723ff65',
  '64f44df793ea07d5c201a4f851249ee786eaae069c3dc545e70d08096a49f3c4'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792403156560-4555',
  '2026-10-19T09:45:56.560Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  '367fda006fce748279a6d4b3b511751e8813bf478c4707e9c3f2335465977a11',
  '94d06ab70ec6a0249d3f290a06dc148c8f3b50f4933eff2eec086538d723ff65'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792403156852-1342',
  '2026-10-19T09:45:56.852Z',
  'Capt. Emmanuel Adeleke (Rtd.) (owner@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  'b804f0d36f9d9d2b44e27f84dd10585028593f496fa0f480594755d229e747cb',
  '367fda006fce748279a6d4b3b511751e8813bf478c4707e9c3f2335465977a11'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792403174324-6868',
  '2026-10-19T09:46:14.324Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  '812296509bb4d23a77b81a38e846a44b4588da5561c4a69d98346b5d12aaa629',
  'b804f0d36f9d9d2b44e27f84dd10585028593f496fa0f480594755d229e747cb'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792403174603-6142',
  '2026-10-19T09:46:14.603Z',
  'Capt. Emmanuel Adeleke (Rtd.) (owner@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 3 attempts remaining before lockout.',
  '127.0.0.1',
  'f6ed67233c5ce5342f2b3503b9a523caf83e2ef43f0366bf7b2bc2429dd88d37',
  '812296509bb4d23a77b81a38e846a44b4588da5561c4a69d98346b5d12aaa629'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792405023719-2283',
  '2026-10-19T10:17:03.719Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  'b94d8c086083a72869633fffe416578264a154284ea7f39129570fc12bc0342b',
  'f6ed67233c5ce5342f2b3503b9a523caf83e2ef43f0366bf7b2bc2429dd88d37'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792405023911-9588',
  '2026-10-19T10:17:03.911Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 1 attempts remaining.',
  '127.0.0.1',
  'c0340b93c1af053b69e3066c293acfdeeeeee882cf5b54abaa7fcfc8cd5ab2cd',
  'b94d8c086083a72869633fffe416578264a154284ea7f39129570fc12bc0342b'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792405024428-6802',
  '2026-10-19T10:17:04.428Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (owner@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '127.0.0.1',
  '22eb067cc59ff1ddf7af9acd6f89700124a19da31fcf7040b7e62026fc4bd4b6',
  'c0340b93c1af053b69e3066c293acfdeeeeee882cf5b54abaa7fcfc8cd5ab2cd'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792405024439-4396',
  '2026-10-19T10:17:04.439Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  '67210903b63f3dda4127eeee4c6eb083f890df18a650a73109b8df17497a19a0',
  '22eb067cc59ff1ddf7af9acd6f89700124a19da31fcf7040b7e62026fc4bd4b6'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792405024635-7567',
  '2026-10-19T10:17:04.635Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  'a56a98dc200ef20e05810d75a844fd5ff00a87b642b258cdf21a94b6612c10f2',
  '67210903b63f3dda4127eeee4c6eb083f890df18a650a73109b8df17497a19a0'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792405024883-4234',
  '2026-10-19T10:17:04.883Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  '1b53ff198fc9b90fce53f9546a1a9f755f0148944fa79b9407d1af31060dfdce',
  'a56a98dc200ef20e05810d75a844fd5ff00a87b642b258cdf21a94b6612c10f2'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792405025102-4994',
  '2026-10-19T10:17:05.102Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '04fbdb8f7764ad561da34b5c9d6731dc803b18236293716645bba3efd6c38eec',
  '1b53ff198fc9b90fce53f9546a1a9f755f0148944fa79b9407d1af31060dfdce'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792405025191',
  '2026-10-19T10:17:05.191Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792405025200',
  '2026-10-19T10:17:05.200Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792405025219',
  '2026-10-19T10:17:05.219Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792421643281-8278',
  '2026-10-19T14:54:03.281Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  '403c5cbe310633f55dee9e2a016e17fa32425e797b44b872505f5ecc8f663562',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792421643460-3373',
  '2026-10-19T14:54:03.460Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 1 attempts remaining.',
  '127.0.0.1',
  '5d12a1a23d92094493b9c20e726303364e2a05b97caebfcb441e8aa98b278a47',
  '403c5cbe310633f55dee9e2a016e17fa32425e797b44b872505f5ecc8f663562'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792421643977-3655',
  '2026-10-19T14:54:03.977Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '127.0.0.1',
  'fc334b605910e3d91ed9330d6b74c102d68470fc523afd00258b1b8d61e0872c',
  '5d12a1a23d92094493b9c20e726303364e2a05b97caebfcb441e8aa98b278a47'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792421643987-3943',
  '2026-10-19T14:54:03.987Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  '96973c11da25b1dd9d7a00e2ebfaa5671384a337f539f97c8f5de87fed6f4668',
  'fc334b605910e3d91ed9330d6b74c102d68470fc523afd00258b1b8d61e0872c'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792421644166-8555',
  '2026-10-19T14:54:04.166Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  'c9fd861a5617dcf55dfb7d359d8f8f0bfabb65158ab9b59da59c493e09ca1ae7',
  '96973c11da25b1dd9d7a00e2ebfaa5671384a337f539f97c8f5de87fed6f4668'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792421644413-2727',
  '2026-10-19T14:54:04.413Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  'dc1472ce1e283900b58d662e07517a3a38820601bcc9cbf82a13ec824a08b2e5',
  'c9fd861a5617dcf55dfb7d359d8f8f0bfabb65158ab9b59da59c493e09ca1ae7'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792421644624-7907',
  '2026-10-19T14:54:04.624Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '82bb38867b2114f905ef1c7d2d50a24132af2476975c19d999cc8e81159e5384',
  'dc1472ce1e283900b58d662e07517a3a38820601bcc9cbf82a13ec824a08b2e5'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792421644657',
  '2026-10-19T14:54:04.657Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792421644665',
  '2026-10-19T14:54:04.665Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792421644676',
  '2026-10-19T14:54:04.676Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525560821-4150',
  '2026-10-20T19:46:00.821Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  'bc623e4329c6e3e3c80616d529c53b64f95f897163e0de8248a39c373de1541f',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525560978-6197',
  '2026-10-20T19:46:00.978Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 1 attempts remaining.',
  '127.0.0.1',
  '8a1904e75f7b1ca8cb12c767ff8f5a12c63bae761d6ae1083b207dc946b25242',
  'bc623e4329c6e3e3c80616d529c53b64f95f897163e0de8248a39c373de1541f'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525561143-9837',
  '2026-10-20T19:46:01.143Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '9b684afe0823c6e0904ea87bbd21de112a0dce70edb94513008e223d537b472c',
  '8a1904e75f7b1ca8cb12c767ff8f5a12c63bae761d6ae1083b207dc946b25242'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525561369-4902',
  '2026-10-20T19:46:01.369Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  'a7b0013375f77d41fdd3dfc4698b9afb9061bd977f70e85c577f9a0d8bf89a31',
  '9b684afe0823c6e0904ea87bbd21de112a0dce70edb94513008e223d537b472c'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525561556-9576',
  '2026-10-20T19:46:01.556Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '28a1acb48c68506b284d06fbd83d1bce6feb9c188f4ed466fffefb9ac1c4437b',
  'a7b0013375f77d41fdd3dfc4698b9afb9061bd977f70e85c577f9a0d8bf89a31'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525561583',
  '2026-10-20T19:46:01.583Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525561588',
  '2026-10-20T19:46:01.588Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525561593',
  '2026-10-20T19:46:01.593Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525593966-4504',
  '2026-10-20T19:46:33.966Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  '0bfd2502e5b180015a0ed2150ae837619fe794fbd6d956f5a74608169ff6175c',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525594138-4024',
  '2026-10-20T19:46:34.138Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  'd4094dbb299b14f57056ae7db87b474fb6e12079b2ca85cf9c7f07ad0907dd34',
  '0bfd2502e5b180015a0ed2150ae837619fe794fbd6d956f5a74608169ff6175c'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525594369-9950',
  '2026-10-20T19:46:34.369Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  '262717a38d9d2a9710c3470125f68be00dc58f3c5a5620a2197315fb07ff9524',
  'd4094dbb299b14f57056ae7db87b474fb6e12079b2ca85cf9c7f07ad0907dd34'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525594549-2523',
  '2026-10-20T19:46:34.549Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '98ad4fb3d078b250f199dc48611ada70793cc5ccd6809c9f6ff2145cecf94613',
  '262717a38d9d2a9710c3470125f68be00dc58f3c5a5620a2197315fb07ff9524'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525594568',
  '2026-10-20T19:46:34.568Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525594572',
  '2026-10-20T19:46:34.572Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525594577',
  '2026-10-20T19:46:34.577Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525703781-4492',
  '2026-10-20T19:48:23.781Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  'bc7102219e26752a8988c941bcceb489e8cdad2b910ee07406bb0343ce4a1cfe',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525703944-4578',
  '2026-10-20T19:48:23.944Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 1 attempts remaining.',
  '127.0.0.1',
  '817cab00139bdb4bd3fd07b14c93e35bbb69e57062374aef4a7ed61bfa6f7c43',
  'bc7102219e26752a8988c941bcceb489e8cdad2b910ee07406bb0343ce4a1cfe'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525704424-5466',
  '2026-10-20T19:48:24.424Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '127.0.0.1',
  '5fa79998f48999c2a7743a7cef1f7d5a019d1a671d3ad865c966bf4ac4e17061',
  '817cab00139bdb4bd3fd07b14c93e35bbb69e57062374aef4a7ed61bfa6f7c43'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525704434-1053',
  '2026-10-20T19:48:24.434Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  '28341f8373c869b4088cc099f92a2debdf42e7da27b977a751380a3f1f2f31cd',
  '5fa79998f48999c2a7743a7cef1f7d5a019d1a671d3ad865c966bf4ac4e17061'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525704605-3814',
  '2026-10-20T19:48:24.605Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '612fa906e0b31ab3bda67195f82830295f8875949c72442ee061387da54ef016',
  '28341f8373c869b4088cc099f92a2debdf42e7da27b977a751380a3f1f2f31cd'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525704838-9548',
  '2026-10-20T19:48:24.838Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  'ed09ad7a70e6bc66e8d24ceaa84942ebb4f35631901797cdd57ac64bcab298bd',
  '612fa906e0b31ab3bda67195f82830295f8875949c72442ee061387da54ef016'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525705033-7254',
  '2026-10-20T19:48:25.033Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '5af6b9bafaf7f505708f574aecb25ab05589903e0309e75e19f64e2b60ddd358',
  'ed09ad7a70e6bc66e8d24ceaa84942ebb4f35631901797cdd57ac64bcab298bd'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525705101',
  '2026-10-20T19:48:25.101Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525705113',
  '2026-10-20T19:48:25.113Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525705125',
  '2026-10-20T19:48:25.125Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525746357-3252',
  '2026-10-20T19:49:06.356Z',
  'Unknown (hacker@example.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  'c1216fc0445931334d80be528eb682a3a2fbe873e4c5073af53d2c5fab3fd4c1',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525746388-8787',
  '2026-10-20T19:49:06.388Z',
  'owner@safenetsecurityltd.com',
  'LOGIN_FAILURE_UNKNOWN_USER',
  'Auth Gateway',
  'Failed authentication attempt for non-existent or suspended account. 4 attempts remaining.',
  '127.0.0.1',
  '8a9a73c33ffd13b492f9a5526c3c8401801f2d00d9bedff22147e8f6dbeee845',
  'c1216fc0445931334d80be528eb682a3a2fbe873e4c5073af53d2c5fab3fd4c1'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525746396-8698',
  '2026-10-20T19:49:06.396Z',
  'owner@safenetsecurityltd.com',
  'LOGIN_FAILURE_UNKNOWN_USER',
  'Auth Gateway',
  'Failed authentication attempt for non-existent or suspended account. 3 attempts remaining.',
  '127.0.0.1',
  '9ca46b7454361d114d0c0d16f04b6af3a4dbd12263d7b23a34a00a1749d86704',
  '8a9a73c33ffd13b492f9a5526c3c8401801f2d00d9bedff22147e8f6dbeee845'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525810681-6858',
  '2026-10-20T19:50:10.681Z',
  'Unknown (hacker@example.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  '7d2a3be317624cb1e244333af0fbfc38c08537a8a0797bbe688b143c63fbe180',
  '9ca46b7454361d114d0c0d16f04b6af3a4dbd12263d7b23a34a00a1749d86704'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525810937-4010',
  '2026-10-20T19:50:10.937Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  'cde3031d98d29feb3113e3f703f0a942a8100615d587998ad02498e1c22d6e86',
  '7d2a3be317624cb1e244333af0fbfc38c08537a8a0797bbe688b143c63fbe180'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525811165-1418',
  '2026-10-20T19:50:11.165Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 3 attempts remaining before lockout.',
  '127.0.0.1',
  '0c966d7852ea7ab5c7b8f5a2136b68b8a570c79eb1a07eaf851279d368d9aa37',
  'cde3031d98d29feb3113e3f703f0a942a8100615d587998ad02498e1c22d6e86'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525851735-8849',
  '2026-10-20T19:50:51.735Z',
  'Unknown (hacker@example.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  '120988b823e85e5bfbb3b5a55837024e00abd589f227314de467611a01dc5b53',
  '0c966d7852ea7ab5c7b8f5a2136b68b8a570c79eb1a07eaf851279d368d9aa37'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525851906-1525',
  '2026-10-20T19:50:51.906Z',
  'Unknown (hacker@example.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 1 attempts remaining.',
  '127.0.0.1',
  'd7fa521042cf049fab3069bae12bcee5cb635f313ed789b6594d3876f96ad0ac',
  '120988b823e85e5bfbb3b5a55837024e00abd589f227314de467611a01dc5b53'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525852374-9612',
  '2026-10-20T19:50:52.374Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '127.0.0.1',
  '7c97466eb1831533a5821aa63029f8721d919d0b0c922db11266ff50ea8ebd05',
  'd7fa521042cf049fab3069bae12bcee5cb635f313ed789b6594d3876f96ad0ac'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525852389-4395',
  '2026-10-20T19:50:52.389Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  'd2f51f088f5a47ab1c96648c91f5cecef6ec367a72f1805fe37a20f1da929a19',
  '7c97466eb1831533a5821aa63029f8721d919d0b0c922db11266ff50ea8ebd05'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525852544-3411',
  '2026-10-20T19:50:52.544Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '3f0fcf3bf2cf2c82056f3c707dec6baa6ec9ef0c200007896983c9b1c497b5ae',
  'd2f51f088f5a47ab1c96648c91f5cecef6ec367a72f1805fe37a20f1da929a19'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525852770-3517',
  '2026-10-20T19:50:52.770Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  '46b1af20d8217767ca8d6f80be3e6c9a57cbe3b262a1f6c76ca142874906c1ed',
  '3f0fcf3bf2cf2c82056f3c707dec6baa6ec9ef0c200007896983c9b1c497b5ae'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525863161-4358',
  '2026-10-20T19:51:03.161Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '127.0.0.1',
  'eb6557c3d470401466e8993b5df7a428e9f87fac0714b78ddbff8cdfc9fdc9c9',
  '46b1af20d8217767ca8d6f80be3e6c9a57cbe3b262a1f6c76ca142874906c1ed'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525863334-1612',
  '2026-10-20T19:51:03.334Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 0 attempts remaining.',
  '127.0.0.1',
  '8de3488c2a56d3c6f301fba6af57d37352af17fd5d2a4b52ed11a86516ef0c65',
  'eb6557c3d470401466e8993b5df7a428e9f87fac0714b78ddbff8cdfc9fdc9c9'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525863587-1801',
  '2026-10-20T19:51:03.587Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 3 attempts remaining before lockout.',
  '127.0.0.1',
  '971b23d6523410760ca0b2400d182883e186d42512445d099f0fa2667ec59aa5',
  '8de3488c2a56d3c6f301fba6af57d37352af17fd5d2a4b52ed11a86516ef0c65'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525863821-2887',
  '2026-10-20T19:51:03.821Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 2 attempts remaining before lockout.',
  '127.0.0.1',
  'f92efc4f0d458cedce9108a9abca046e2c0bc0e96584690060b482fc85e937da',
  '971b23d6523410760ca0b2400d182883e186d42512445d099f0fa2667ec59aa5'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525864077-1647',
  '2026-10-20T19:51:04.077Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 1 attempts remaining before lockout.',
  '127.0.0.1',
  'ec0c31b8bf589d83fe37e449e95c2a8d2dff16b380fb5947fa522d8f1b1c48e2',
  'f92efc4f0d458cedce9108a9abca046e2c0bc0e96584690060b482fc85e937da'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525864148',
  '2026-10-20T19:51:04.148Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525864160',
  '2026-10-20T19:51:04.160Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525864173',
  '2026-10-20T19:51:04.173Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525975872-1928',
  '2026-10-20T19:52:55.872Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.1',
  '48f04b85836ec5a7984b2c5264afea4b1e2ed40468fcdec46df5bc6a661d7a05',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525976031-2720',
  '2026-10-20T19:52:56.031Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 2 attempts remaining.',
  '10.0.0.2',
  '5a7761d1a6ce1b3fa21a4c57f2e6208e1fa051cdcca1e9dc42c59b888e10fbc2',
  '48f04b85836ec5a7984b2c5264afea4b1e2ed40468fcdec46df5bc6a661d7a05'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525976496-7772',
  '2026-10-20T19:52:56.496Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '10.0.0.5',
  'f534fdffaa521955d3e56708ac2cdfffbcfe362b39711b4f2015df103f30c048',
  '5a7761d1a6ce1b3fa21a4c57f2e6208e1fa051cdcca1e9dc42c59b888e10fbc2'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525976510-1645',
  '2026-10-20T19:52:56.510Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.8',
  '2b4db754746ee59cc9d03b6e48b3af74c8b7167f81ca1b6c8f370058953375cf',
  'f534fdffaa521955d3e56708ac2cdfffbcfe362b39711b4f2015df103f30c048'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525976711-2630',
  '2026-10-20T19:52:56.711Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  'b048553fea37ddd06e969b5905828aacac86d02ffe6a59aea3a87f5dd47b68f6',
  '2b4db754746ee59cc9d03b6e48b3af74c8b7167f81ca1b6c8f370058953375cf'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525976958-7695',
  '2026-10-20T19:52:56.958Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  '2d3c1a7adcc04ab1fc0ba0e5f15cecf00f2d310505a488dfe2ca3e74c10c35c6',
  'b048553fea37ddd06e969b5905828aacac86d02ffe6a59aea3a87f5dd47b68f6'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525977152-3654',
  '2026-10-20T19:52:57.152Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '2f31c3cce03ffb9853c2c864103e8d9332ad7f51d706a8e361b4638217407063',
  '2d3c1a7adcc04ab1fc0ba0e5f15cecf00f2d310505a488dfe2ca3e74c10c35c6'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525977216',
  '2026-10-20T19:52:57.216Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525977231',
  '2026-10-20T19:52:57.231Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792525977245',
  '2026-10-20T19:52:57.245Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792526029722-2624',
  '2026-10-20T19:53:49.722Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.1',
  '1ad69adedfa79a619c95b88266f9dbb25aab83c189730e56b0e3d1909bbb52f0',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792526029880-6128',
  '2026-10-20T19:53:49.880Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 1 attempts remaining.',
  '10.0.0.2',
  'c7ee25b8913ef62c5a96a6914372f57ed8dd9cfc66f01c267e88c692116de51c',
  '1ad69adedfa79a619c95b88266f9dbb25aab83c189730e56b0e3d1909bbb52f0'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792526030349-4619',
  '2026-10-20T19:53:50.349Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '10.0.0.5',
  '2b5a6d9692f511e366b6af261aa3f7f529ac084815d5e4f205b6367a6e37fdcd',
  'c7ee25b8913ef62c5a96a6914372f57ed8dd9cfc66f01c267e88c692116de51c'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792526030362-5882',
  '2026-10-20T19:53:50.362Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.8',
  'b02a7bf8e7120bde71c5b802d2cc3a88050dd2868cac75f0ebee9f7d9cea709b',
  '2b5a6d9692f511e366b6af261aa3f7f529ac084815d5e4f205b6367a6e37fdcd'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792526030526-5108',
  '2026-10-20T19:53:50.526Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  'ca697498d7cdb78072598604121ded0b2e1715baf90c7311d1215df6ae015147',
  'b02a7bf8e7120bde71c5b802d2cc3a88050dd2868cac75f0ebee9f7d9cea709b'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792526030776-7731',
  '2026-10-20T19:53:50.776Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  'd81383f537c6707c3ab0a409170c8e26efc20fa05dbe24e1caa62f367724e895',
  'ca697498d7cdb78072598604121ded0b2e1715baf90c7311d1215df6ae015147'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792526030981-3949',
  '2026-10-20T19:53:50.981Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '8001743afa25b3a9db4bde4e2fc6e6ea47cf4cdfaf9887f84459103a39e689ec',
  'd81383f537c6707c3ab0a409170c8e26efc20fa05dbe24e1caa62f367724e895'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792526031010',
  '2026-10-20T19:53:51.010Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792526031026',
  '2026-10-20T19:53:51.026Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792526031041',
  '2026-10-20T19:53:51.041Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675054597-3760',
  '2026-10-22T13:17:34.597Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.1',
  '8cc6780184faba313c5b6b900d15b2195959d933821639888e9dde23e3a4556b',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675054779-7935',
  '2026-10-22T13:17:34.779Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 2 attempts remaining.',
  '10.0.0.2',
  '15482e861b9aa012ac4d0652e1d35668367997fc7fdc7c6124634670b3bc05c5',
  '8cc6780184faba313c5b6b900d15b2195959d933821639888e9dde23e3a4556b'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675055322-8578',
  '2026-10-22T13:17:35.322Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '10.0.0.5',
  '94f3a640814c3f846d3f3e6730b6c8650cbb2e303a76d73c52fb965d2469a59e',
  '15482e861b9aa012ac4d0652e1d35668367997fc7fdc7c6124634670b3bc05c5'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675055339-7780',
  '2026-10-22T13:17:35.339Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.8',
  '4d04e8a8545bb989d3d456a086ed39672993768f08b088427cef0230c2b9d285',
  '94f3a640814c3f846d3f3e6730b6c8650cbb2e303a76d73c52fb965d2469a59e'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675055519-2583',
  '2026-10-22T13:17:35.519Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  'ca4361af7ff7860631e6ec740c4deeb9dc751671af08756d02061c06f6f7bb4d',
  '4d04e8a8545bb989d3d456a086ed39672993768f08b088427cef0230c2b9d285'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675055799-1036',
  '2026-10-22T13:17:35.799Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  '18812dc12cb36c325d4d1688fd4860bcc2910970044065fba093034fe17e1aac',
  'ca4361af7ff7860631e6ec740c4deeb9dc751671af08756d02061c06f6f7bb4d'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675056022-6749',
  '2026-10-22T13:17:36.022Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '5b91476c76c030f60359df0e19e0dc588610c111371066ff440c0b81d0846170',
  '18812dc12cb36c325d4d1688fd4860bcc2910970044065fba093034fe17e1aac'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675056069',
  '2026-10-22T13:17:36.069Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675056088',
  '2026-10-22T13:17:36.088Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675056108',
  '2026-10-22T13:17:36.108Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675907063-7487',
  '2026-10-22T13:31:47.063Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.1',
  '4463e24777c9ea22778a92722dff9279bf6f4e69faf559c775132cc3caa67857',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675907240-5567',
  '2026-10-22T13:31:47.240Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 2 attempts remaining.',
  '10.0.0.2',
  'ea0db5fd0e8db69ab6e5ab737b4cfc2b596231c8350159968ea62c7253202d78',
  '4463e24777c9ea22778a92722dff9279bf6f4e69faf559c775132cc3caa67857'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675907758-9614',
  '2026-10-22T13:31:47.758Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '10.0.0.5',
  '6f2b3c0df45d3b82c58a2225751a59aedaa83ef78d806fecc2bb66402eaf7754',
  'ea0db5fd0e8db69ab6e5ab737b4cfc2b596231c8350159968ea62c7253202d78'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675907774-6177',
  '2026-10-22T13:31:47.774Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.8',
  '6fb347f5045fda6bdb779e50b2446da03d384e323ebc977f5432c4fb9e7a9991',
  '6f2b3c0df45d3b82c58a2225751a59aedaa83ef78d806fecc2bb66402eaf7754'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675907945-9310',
  '2026-10-22T13:31:47.945Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '385447bd58c08d99a4e2df85044843d3b77412887e27b88a15977e53d6d0818c',
  '6fb347f5045fda6bdb779e50b2446da03d384e323ebc977f5432c4fb9e7a9991'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675908190-4107',
  '2026-10-22T13:31:48.190Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  'd60cdace917cc211ee69f645d1b2581c6b17f4479f0709e83c37ff098154d4ff',
  '385447bd58c08d99a4e2df85044843d3b77412887e27b88a15977e53d6d0818c'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675908395-4642',
  '2026-10-22T13:31:48.395Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '6ce0124b65479783a8291f7a047122d1f0156b1341646462e3f4bd49ef997624',
  'd60cdace917cc211ee69f645d1b2581c6b17f4479f0709e83c37ff098154d4ff'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675908433',
  '2026-10-22T13:31:48.433Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675908453',
  '2026-10-22T13:31:48.453Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792675908472',
  '2026-10-22T13:31:48.472Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792683515995-5426',
  '2026-10-22T15:38:35.995Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.1',
  'e559afec840f432cb510a5cc9adcc3a9e0e993027eedf73369280f8a7b85b3cd',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792683516179-5965',
  '2026-10-22T15:38:36.179Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 2 attempts remaining.',
  '10.0.0.2',
  '2cf7f105c572af0402fd4e907bc9186be87020f2b609df5ab1c8a4d6a79677d8',
  'e559afec840f432cb510a5cc9adcc3a9e0e993027eedf73369280f8a7b85b3cd'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792683516735-6665',
  '2026-10-22T15:38:36.735Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '10.0.0.5',
  'e6c937c274175c2c3fa94a92d108256e4c8403cc38a82a4c724de942457fc61a',
  '2cf7f105c572af0402fd4e907bc9186be87020f2b609df5ab1c8a4d6a79677d8'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792683516753-3023',
  '2026-10-22T15:38:36.753Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.8',
  'bcf1f1d0141d5be17feb4174b58a1d3379d0b231396e9a327c001070145e821c',
  'e6c937c274175c2c3fa94a92d108256e4c8403cc38a82a4c724de942457fc61a'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792683516948-1960',
  '2026-10-22T15:38:36.948Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '79b6d5afb9dda4c273366fd85a6010d273418b415b221643d541d65e9664f2ce',
  'bcf1f1d0141d5be17feb4174b58a1d3379d0b231396e9a327c001070145e821c'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792683517215-9468',
  '2026-10-22T15:38:37.214Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  '04e5ee9946a59d7cefcdbc11c992860970c84db9509ba8a44340eb57c4e6eac8',
  '79b6d5afb9dda4c273366fd85a6010d273418b415b221643d541d65e9664f2ce'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792683517444-1986',
  '2026-10-22T15:38:37.444Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  'bc31b8fe0c5030746417714f1773c9dfd853066a647d1e00bac4278450494839',
  '04e5ee9946a59d7cefcdbc11c992860970c84db9509ba8a44340eb57c4e6eac8'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792683517479',
  '2026-10-22T15:38:37.479Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792683517500',
  '2026-10-22T15:38:37.500Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792683517525',
  '2026-10-22T15:38:37.525Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792694676874-9670',
  '2026-10-22T18:44:36.874Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.1',
  '2aa85703357f88af5c4f1f9de981b0782aee705e9b0be4b243fc898b058a2f40',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792694677052-3815',
  '2026-10-22T18:44:37.052Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 2 attempts remaining.',
  '10.0.0.2',
  '6ba7908dab9ef222700511aec5d407b6467f9582ba4eb851c3c8b07d3ca98812',
  '2aa85703357f88af5c4f1f9de981b0782aee705e9b0be4b243fc898b058a2f40'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792694677535-6469',
  '2026-10-22T18:44:37.535Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '10.0.0.5',
  'bdb1eeef8642c2a61f57a8901fa33c1b42cf0d92bcbeb29ce3225608bdb8c529',
  '6ba7908dab9ef222700511aec5d407b6467f9582ba4eb851c3c8b07d3ca98812'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792694677551-6029',
  '2026-10-22T18:44:37.551Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.8',
  '85c712b49127b8a4da051314ee81d42512c30de9384aae42e2f7e5b0ad5cc21a',
  'bdb1eeef8642c2a61f57a8901fa33c1b42cf0d92bcbeb29ce3225608bdb8c529'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792694677733-4484',
  '2026-10-22T18:44:37.733Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '7075b0d41317dc6e18a81dab1077b1e364cef7ca81ffdf5f2cc452acad115463',
  '85c712b49127b8a4da051314ee81d42512c30de9384aae42e2f7e5b0ad5cc21a'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792694677995-2421',
  '2026-10-22T18:44:37.995Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  'bb2a33cd2d42c77ad66ec3345d1093bc656a75471db324c11fccc552efdc0c88',
  '7075b0d41317dc6e18a81dab1077b1e364cef7ca81ffdf5f2cc452acad115463'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792694678213-3410',
  '2026-10-22T18:44:38.213Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '8944a18bcff8b2112c814fa319936e64cf36ea8eeec23977f770eaeb4bb8aacb',
  'bb2a33cd2d42c77ad66ec3345d1093bc656a75471db324c11fccc552efdc0c88'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792694678258',
  '2026-10-22T18:44:38.258Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792694678280',
  '2026-10-22T18:44:38.280Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1792694678300',
  '2026-10-22T18:44:38.300Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793097104958-8549',
  '2026-10-27T10:31:44.958Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.1',
  '1813950bbffc6e4992409c16aa1ec84f6f6cc96bfbddd48d4ac3aa7a3c0960b7',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793097105127-5307',
  '2026-10-27T10:31:45.127Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 2 attempts remaining.',
  '10.0.0.2',
  '40bb07dce8ff696a11463a8dd416da9b545b966f01cc5c4d9a5b23f4f850f256',
  '1813950bbffc6e4992409c16aa1ec84f6f6cc96bfbddd48d4ac3aa7a3c0960b7'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793097105620-9442',
  '2026-10-27T10:31:45.620Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '10.0.0.5',
  '189b6af7dbdaa4b3c7fa1c500285cf16496bd8e428351d508e74270ad115e885',
  '40bb07dce8ff696a11463a8dd416da9b545b966f01cc5c4d9a5b23f4f850f256'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793097105639-1147',
  '2026-10-27T10:31:45.639Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.8',
  '920e6fbc5c85050c15d84bda7691082e11f7ca44cc73dfd205a6d3e8d1f99ce5',
  '189b6af7dbdaa4b3c7fa1c500285cf16496bd8e428351d508e74270ad115e885'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793097105824-4739',
  '2026-10-27T10:31:45.824Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '62ad38a890f8e76b6530794fa3aac4ccbba91019e0baf0dbc13798d62f5cde33',
  '920e6fbc5c85050c15d84bda7691082e11f7ca44cc73dfd205a6d3e8d1f99ce5'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793097106074-7746',
  '2026-10-27T10:31:46.074Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  '9fcf069508b6e389c52f64448e5b5bf0d3a60de5a2d058cf8eb4aef655605750',
  '62ad38a890f8e76b6530794fa3aac4ccbba91019e0baf0dbc13798d62f5cde33'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793097106270-8902',
  '2026-10-27T10:31:46.270Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  'ad22c138371e507bdf59b41d97c70bda9c70167393cc543f2bcd663efaabed08',
  '9fcf069508b6e389c52f64448e5b5bf0d3a60de5a2d058cf8eb4aef655605750'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793097106311',
  '2026-10-27T10:31:46.311Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793097106330',
  '2026-10-27T10:31:46.330Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793097106349',
  '2026-10-27T10:31:46.349Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793100466184-6973',
  '2026-10-27T11:27:46.184Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.1',
  '7f678947796fd4ea4c833de14105ecdc7fe8788df314ca71aa2ed511c1a6a110',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793100466366-8075',
  '2026-10-27T11:27:46.366Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 2 attempts remaining.',
  '10.0.0.2',
  '987174a69a27fa4d0b100a72f1874c3d0c2943df038a11aeb29bd6fb1acea78d',
  '7f678947796fd4ea4c833de14105ecdc7fe8788df314ca71aa2ed511c1a6a110'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793100466867-4257',
  '2026-10-27T11:27:46.867Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '10.0.0.5',
  'f08abdba4a46182fa5de87bdd0be6b47ca38311d095e11c050067ff4b09fb116',
  '987174a69a27fa4d0b100a72f1874c3d0c2943df038a11aeb29bd6fb1acea78d'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793100466882-4902',
  '2026-10-27T11:27:46.882Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.8',
  'e203d12ba723b1c589695311f8c4199520949b10d13ea567f581ae8c8c264eaf',
  'f08abdba4a46182fa5de87bdd0be6b47ca38311d095e11c050067ff4b09fb116'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793100467056-5152',
  '2026-10-27T11:27:47.056Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '3db86f5ea90d2e78d7576395ffeb5882fb9d4c4ee0717b0ef10cd352bd1c1bf7',
  'e203d12ba723b1c589695311f8c4199520949b10d13ea567f581ae8c8c264eaf'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793100467299-2571',
  '2026-10-27T11:27:47.299Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  '7acc8ec9ea57c8728d53e4c6e77eb7bebe3af29acf0d2502a41887e22c7db35a',
  '3db86f5ea90d2e78d7576395ffeb5882fb9d4c4ee0717b0ef10cd352bd1c1bf7'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793100467516-4226',
  '2026-10-27T11:27:47.516Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '10e5f7e9d1907c02ed5221a387a82fb042beb80ffbad94da77c399f3e9b01ab3',
  '7acc8ec9ea57c8728d53e4c6e77eb7bebe3af29acf0d2502a41887e22c7db35a'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793100467585',
  '2026-10-27T11:27:47.585Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793100467604',
  '2026-10-27T11:27:47.604Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793100467623',
  '2026-10-27T11:27:47.623Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793107867326-2733',
  '2026-10-27T13:31:07.326Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.1',
  '8a91b9f2ee72fd37681ee05e99e7fa31eaf3e497caa8272215f6aa3bed478f22',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793107867508-9424',
  '2026-10-27T13:31:07.508Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 2 attempts remaining.',
  '10.0.0.2',
  'f91f5c4f3e9c9304bde0b1133240f9a85bf7cb804fff6bf2077e01d23d62ec82',
  '8a91b9f2ee72fd37681ee05e99e7fa31eaf3e497caa8272215f6aa3bed478f22'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793107868027-3893',
  '2026-10-27T13:31:08.027Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '10.0.0.5',
  '4e4c47ba9bbbbea13e93e14b38d1ed097283d7c00bf5b09d162f31d423ed54a7',
  'f91f5c4f3e9c9304bde0b1133240f9a85bf7cb804fff6bf2077e01d23d62ec82'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793107868051-1811',
  '2026-10-27T13:31:08.051Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.8',
  'd32bf44b087baa09b869ef9fbcb51ce3831e9e1052b2eb961b97e3c00fbe5912',
  '4e4c47ba9bbbbea13e93e14b38d1ed097283d7c00bf5b09d162f31d423ed54a7'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793107868230-4515',
  '2026-10-27T13:31:08.230Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '2a9dafb4bb311bfbdacfbc42cb6f207e5157419f89d3f327317450482bbcfe0c',
  'd32bf44b087baa09b869ef9fbcb51ce3831e9e1052b2eb961b97e3c00fbe5912'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793107868486-1220',
  '2026-10-27T13:31:08.486Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  'f2919c083d76d40a03a398355a815be70edb890175312a8246034f5ddc57a91e',
  '2a9dafb4bb311bfbdacfbc42cb6f207e5157419f89d3f327317450482bbcfe0c'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793107868742-7197',
  '2026-10-27T13:31:08.742Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  '5b0d542d2700fb377aceb9faec7a502c50b36eb635fc9530580cf1df4a80d740',
  'f2919c083d76d40a03a398355a815be70edb890175312a8246034f5ddc57a91e'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793107868806',
  '2026-10-27T13:31:08.806Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793107868836',
  '2026-10-27T13:31:08.836Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793107868869',
  '2026-10-27T13:31:08.869Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793116389032-9995',
  '2026-10-27T15:53:09.032Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.1',
  '764019a2ff7f94873338485f9e3f348dcb06ad9fe73c8fa0442e80659a47f75d',
  'GENESIS-SAFENET-SECURE-ANCHOR-000'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793116389217-6303',
  '2026-10-27T15:53:09.217Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_INVALID_SECRET',
  'Security Authorization Gateway',
  'Failed owner recovery attempt with invalid authorization secret. 2 attempts remaining.',
  '10.0.0.2',
  'f652381718d04c3d4c09a48e6bc27f2acd23e0b2630335b9f155879bec084e3a',
  '764019a2ff7f94873338485f9e3f348dcb06ad9fe73c8fa0442e80659a47f75d'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793116389755-2146',
  '2026-10-27T15:53:09.755Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'OWNER_PRIVILEGE_RECOVERY',
  'Super Administrator Account',
  'Owner-level recovery successfully executed using one-time server authorization secret. Previous identity: Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com). All previous sessions revoked. One-time recovery authorization permanently consumed and disabled across all server restarts.',
  '10.0.0.5',
  'dde167cca9caca9fb8dd11bd0fd8649501facaa5648922b02c223d64802eaee6',
  'f652381718d04c3d4c09a48e6bc27f2acd23e0b2630335b9f155879bec084e3a'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793116389775-9677',
  '2026-10-27T15:53:09.775Z',
  'Unknown (intruder@safenetsecurityltd.com)',
  'OWNER_RECOVERY_COMPROMISED_SECRET_REJECTED',
  'Security Authorization Gateway',
  'Attempted use of permanently invalidated/compromised owner recovery secret. Request rejected.',
  '10.0.0.8',
  '67f194ea369c0753b6cc9c0fe533085e4ba81d3cf306facd116d074d06a09d27',
  'dde167cca9caca9fb8dd11bd0fd8649501facaa5648922b02c223d64802eaee6'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793116389979-9809',
  '2026-10-27T15:53:09.979Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  'fb326779ae49e137c1454f77b0967df9241c117bf94ca6b28a8324fa216f0460',
  '67f194ea369c0753b6cc9c0fe533085e4ba81d3cf306facd116d074d06a09d27'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793116390269-3653',
  '2026-10-27T15:53:10.269Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'LOGIN_FAILURE_BAD_PASSWORD',
  'Auth Gateway',
  'Incorrect password supplied. 4 attempts remaining before lockout.',
  '127.0.0.1',
  '0d4e5c7d9c07ccb093157012af96a9b11653b6cf1ca0eea1fba01c4fcacb0e09',
  'fb326779ae49e137c1454f77b0967df9241c117bf94ca6b28a8324fa216f0460'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793116390504-2745',
  '2026-10-27T15:53:10.504Z',
  'Capt. Emmanuel Adeleke (Rtd.) (director@safenetsecurityltd.com)',
  'ADMIN_LOGIN_SUCCESS',
  'Operations Command Console',
  'Authenticated with role [super_admin]. Session established.',
  '127.0.0.1',
  'a125d62bc5b4b54bd497856441e92a6cbae4c4ae9ebde11b4bfacf303a574b1d',
  '0d4e5c7d9c07ccb093157012af96a9b11653b6cf1ca0eea1fba01c4fcacb0e09'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793116390550',
  '2026-10-27T15:53:10.550Z',
  'Inquirer (Dr. Christopher Danjuma)',
  'LEAD_SUBMITTED',
  'Commercial Leads Vault',
  'Quote inquiry received for Offshore Maritime & Vessel Escort Security in Victoria Island, Lagos.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793116390577',
  '2026-10-27T15:53:10.577Z',
  'Client (Engr. Emeka Okonkwo)',
  'ASSESSMENT_COMPLETED',
  'Tactical Threat Evaluations',
  'Facility evaluation generated: Vulnerability score 78/100 (High Priority Vulnerability) for undefined.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO audit_logs (
  id, timestamp, user_identifier, action, target,
  details, ip, hash, prev_hash
) VALUES (
  'audit-1793116390603',
  '2026-10-27T15:53:10.603Z',
  'Candidate (Sergeant Samuel Bamidele (Rtd.))',
  'CANDIDATE_APPLICATION',
  'Recruitment Dossier',
  'Application received for role: Tactical Mobile Patrol Commander.',
  '127.0.0.1',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO migration_metadata (
  id, source_file, record_counts, status
) VALUES (
  'mig-' || TO_CHAR(NOW(), 'YYYYMMDD-HH24MISS'),
  'data/database.json',
  '{"adminUsers":1,"leads":21,"securityAssessments":16,"blogPosts":3,"socialAccounts":5,"socialPublishJobs":4,"jobApplications":16,"careerOpenings":0,"testimonials":3,"auditLogs":193,"sourcePhysicalTotal":300,"deduplicatedUniqueTotal":264}'::jsonb,
  'completed'
);

COMMIT;
