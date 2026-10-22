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
  'f9d1c9e6a9e8463816fe3136a9997b48b482608a8159ed1e84abccb631446102',
  '911be5ead1a481bd82271eb751a2173a48d5ef8f61d60ce33695fe3217208189d2ad307e0f623b3a10ce7618f17a2671b120c04954d3c6ddecb20dd72741af64',
  210000,
  '9113528b5767c9ed3f4ccd48d4437a6146efe2db946211055860bd8ea3cc1156cd62c9914799a5234f4bc5f8210ca116fcf257851bbf1d53a273ac11cecfc604',
  '82ecbd852135e2860a26d33ca4fd960e3f195ad57ae81848f9fee613badae29f',
  210000,
  '2026-10-17T18:23:43.636Z',
  '2026-10-19T14:54:04.623Z',
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
  'd3b4d21a5ffee3b8ba815cc1f8b9b9e1ee21d5718adc8af6ae5c131a37961d6fca0dd7fe433cc549e312266d2235e059563eea6caa8a946e6d7f69af7f827151',
  '7fc057e7279f62fa05911f6bc97cc60cfba6cf972e20e7312797b85475d9baef',
  210000,
  '["e76c0fa479a69a997bf2471eda535fc217ab94c5166432b5b25344440b0acdbc","46284fb269b2a48900e9e43be0ad8caf157847c277d37dc0a51637fec99ab279","96f26daff167847a897be23fc477a511ac87dfab587e52963511c291611a3e64","a3d6dbf72a3079b9aa8af413d8f1c2d1966ea6c38c4346c22e1a838d4062eb94","dca4a8aabe9488d792e6c074c864849d1140e87195724e85d198a8f6b68af2ab"]'::jsonb,
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
  token_expiry, auto_publish, last_synced_at
) VALUES (
  'facebook',
  'Facebook Page',
  'SafeNet Security Solutions Ltd',
  true,
  '2026-09-30T00:00:00Z',
  true,
  '2026-03-27T20:00:00Z'
)
ON CONFLICT (platform) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  handle = EXCLUDED.handle,
  connected = EXCLUDED.connected,
  auto_publish = EXCLUDED.auto_publish,
  last_synced_at = EXCLUDED.last_synced_at;


INSERT INTO social_accounts (
  platform, display_name, handle, connected,
  token_expiry, auto_publish, last_synced_at
) VALUES (
  'linkedin',
  'LinkedIn Corporate',
  'SafeNet Security Solutions Ltd',
  true,
  '2026-10-15T00:00:00Z',
  true,
  '2026-03-27T20:00:00Z'
)
ON CONFLICT (platform) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  handle = EXCLUDED.handle,
  connected = EXCLUDED.connected,
  auto_publish = EXCLUDED.auto_publish,
  last_synced_at = EXCLUDED.last_synced_at;


INSERT INTO social_accounts (
  platform, display_name, handle, connected,
  token_expiry, auto_publish, last_synced_at
) VALUES (
  'x',
  'X / Twitter Official',
  '@safenet_sec',
  true,
  '2026-11-01T00:00:00Z',
  true,
  '2026-03-27T20:00:00Z'
)
ON CONFLICT (platform) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  handle = EXCLUDED.handle,
  connected = EXCLUDED.connected,
  auto_publish = EXCLUDED.auto_publish,
  last_synced_at = EXCLUDED.last_synced_at;


INSERT INTO social_accounts (
  platform, display_name, handle, connected,
  token_expiry, auto_publish, last_synced_at
) VALUES (
  'instagram',
  'Instagram Business',
  '@safenetsecurityltd',
  true,
  '2026-08-20T00:00:00Z',
  false,
  '2026-03-27T20:00:00Z'
)
ON CONFLICT (platform) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  handle = EXCLUDED.handle,
  connected = EXCLUDED.connected,
  auto_publish = EXCLUDED.auto_publish,
  last_synced_at = EXCLUDED.last_synced_at;


INSERT INTO social_accounts (
  platform, display_name, handle, connected,
  token_expiry, auto_publish, last_synced_at
) VALUES (
  'youtube',
  'YouTube Channel',
  'SafeNet Security Solutions',
  false,
  '',
  false,
  '2026-10-20T19:44:38.249Z'
)
ON CONFLICT (platform) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  handle = EXCLUDED.handle,
  connected = EXCLUDED.connected,
  auto_publish = EXCLUDED.auto_publish,
  last_synced_at = EXCLUDED.last_synced_at;


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
  id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792421644676-3124',
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
  id, job_slug, job_title, applicant_name, applicant_email,
  applicant_phone, experience_years, cover_note, resume_file_name,
  status, nsdc_status, submitted_at
) VALUES (
  'app-1792405025219-1861',
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


INSERT INTO migration_metadata (
  id, source_file, record_counts, status
) VALUES (
  'mig-' || TO_CHAR(NOW(), 'YYYYMMDD-HH24MISS'),
  'data/database.json',
  '{"adminUsers":1,"leads":7,"securityAssessments":2,"blogPosts":3,"socialAccounts":5,"socialPublishJobs":4,"jobApplications":2,"testimonials":3,"auditLogs":48}'::jsonb,
  'completed'
);

COMMIT;
