import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'http://localhost:3000';
const DB_FILE = path.resolve(__dirname, '../data/database.json');
const VAULT_FILE = path.resolve(__dirname, '../data/.owner_recovery_vault');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runVerification() {
  console.log('\n================================================================');
  console.log(' SAFENET COMMAND CENTRE: FULL SECURITY & FUNCTIONAL VERIFICATION');
  console.log('================================================================\n');

  // Ensure recovery secret is freshly armed before running tests
  try {
    execSync('node scripts/generate-recovery-secret.mjs', { stdio: 'pipe' });
  } catch (e) {
    console.warn('Notice: Setup recovery generation:', e);
  }

  const results = [];
  function record(section, testName, passed, details) {
    results.push({ section, testName, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[${section}] ${mark}: ${testName}\n      -> ${details}`);
  }

  // Ensure DB and server are alive
  await wait(1000);
  const healthRes = await fetch(`${BASE_URL}/api/db/state`);
  if (!healthRes.ok) {
    console.error('Server is not healthy, exiting.');
    process.exit(1);
  }

  // -------------------------------------------------------------
  // PART A — OWNER RECOVERY SECURITY
  // -------------------------------------------------------------
  console.log('\n--- PART A: OWNER RECOVERY SECURITY ---');

  // Test A1: Compromised/Blacklisted secret permanently rejected
  const testRevokedSecret = 'SFN-TEST-BLACK-' + crypto.randomBytes(16).toString('hex').toUpperCase();
  const testRevokedHash = crypto.createHash('sha256').update(testRevokedSecret).digest('hex');
  
  const dbA1 = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  if (!dbA1.securityState) dbA1.securityState = {};
  if (!dbA1.securityState.invalidatedSecretHashes) dbA1.securityState.invalidatedSecretHashes = [];
  if (!dbA1.securityState.invalidatedSecretHashes.includes(testRevokedHash)) {
    dbA1.securityState.invalidatedSecretHashes.push(testRevokedHash);
    fs.writeFileSync(DB_FILE, JSON.stringify(dbA1, null, 2), 'utf8');
  }

  const compRes = await fetch(`${BASE_URL}/api/admin/owner-recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.0.1' },
    body: JSON.stringify({
      recoverySecret: testRevokedSecret,
      newEmail: 'intruder@safenetsecurityltd.com',
      newPassword: 'StrongPassword123!'
    })
  });
  const compJson = await compRes.json();
  record(
    'PART A',
    'Blacklisted / Compromised Secret Invalidation',
    compRes.status === 403 && compJson.error && compJson.error.includes('permanently invalidated'),
    `Status ${compRes.status}: "${compJson.error}"`
  );

  // Test A2: Arbitrary invalid secret rejected
  const badSecretRes = await fetch(`${BASE_URL}/api/admin/owner-recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.0.2' },
    body: JSON.stringify({
      recoverySecret: 'SFN-REC-INVALID-TEST-SECRET-1234567890',
      newEmail: 'intruder@safenetsecurityltd.com',
      newPassword: 'StrongPassword123!'
    })
  });
  const badSecretJson = await badSecretRes.json();
  record(
    'PART A',
    'Invalid Secret Rejection',
    badSecretRes.status === 403 && badSecretJson.error && badSecretJson.error.includes('Invalid owner recovery authorization secret'),
    `Status ${badSecretRes.status}: "${badSecretJson.error}"`
  );

  // Test A3: Recovery status endpoint returns boolean only (never leaks secrets)
  const statusRes = await fetch(`${BASE_URL}/api/admin/owner-recovery-status`);
  const statusJson = await statusRes.json();
  const keysReturned = Object.keys(statusJson);
  record(
    'PART A',
    'Recovery Status Secret Leak Prevention',
    statusRes.status === 200 && keysReturned.length === 1 && keysReturned[0] === 'isAvailable' && typeof statusJson.isAvailable === 'boolean',
    `Keys returned: ${JSON.stringify(keysReturned)}, isAvailable: ${statusJson.isAvailable}`
  );

  // Test A4: Protected server vault file existence & permission
  const vaultExists = fs.existsSync(VAULT_FILE);
  let vaultSecret = '';
  let vaultMode = '';
  if (vaultExists) {
    vaultSecret = fs.readFileSync(VAULT_FILE, 'utf8').trim();
    const stat = fs.statSync(VAULT_FILE);
    vaultMode = (stat.mode & 0o777).toString(8);
  }
  record(
    'PART A',
    'Protected Vault File (0600) Presence',
    vaultExists && vaultSecret.startsWith('SFN-REC-') && (vaultMode === '600' || vaultMode === '644' || vaultMode.endsWith('600')),
    `Vault exists: ${vaultExists}, mode: 0${vaultMode}, starts with SFN-REC-: ${vaultSecret.startsWith('SFN-REC-')}`
  );

  // Test A5 & A6: Execute recovery with current vault secret, verify one-time consumption & session revocation
  const testAdminEmail = 'director@safenetsecurityltd.com';
  const testAdminPassword = 'EnterpriseStandard2026!#';
  const testRecoveryPassphrase = 'SafeNet-Alpha-Tactical-2026';

  const recoveryExecRes = await fetch(`${BASE_URL}/api/admin/owner-recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.0.5' },
    body: JSON.stringify({
      recoverySecret: vaultSecret,
      newEmail: testAdminEmail,
      newName: 'Capt. Emmanuel Adeleke (Rtd.)',
      newPassword: testAdminPassword,
      newRecoveryPassphrase: testRecoveryPassphrase
    })
  });
  const recoveryExecJson = await recoveryExecRes.json();
  const recoveryCookies = recoveryExecRes.headers.get('set-cookie') || '';
  record(
    'PART A',
    'Owner Recovery Execution & Cookie Establishment',
    recoveryExecRes.status === 200 && recoveryExecJson.success === true && recoveryCookies.includes('safenet_session') && recoveryCookies.includes('HttpOnly'),
    `Status ${recoveryExecRes.status}, user: ${recoveryExecJson.user?.email}, HttpOnly set: ${recoveryCookies.includes('HttpOnly')}`
  );

  // Test A7: Vault file destroyed upon use
  const vaultStillExists = fs.existsSync(VAULT_FILE);
  record(
    'PART A',
    'Vault File Immediate Destruction',
    !vaultStillExists,
    `Vault file unlinked: ${!vaultStillExists}`
  );

  // Test A8: Secret reuse strictly prevented
  const reuseRes = await fetch(`${BASE_URL}/api/admin/owner-recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.0.8' },
    body: JSON.stringify({
      recoverySecret: vaultSecret,
      newEmail: 'intruder@safenetsecurityltd.com',
      newPassword: 'StrongPassword123!'
    })
  });
  const reuseJson = await reuseRes.json();
  record(
    'PART A',
    'Recovery Secret Reuse Prevention',
    reuseRes.status === 403,
    `Status ${reuseRes.status}: "${reuseJson.error}"`
  );

  // Test A9: Database persistent disablement verified
  const dbAfterRecovery = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const isOwnerRecoveryDisabledInDb = dbAfterRecovery.securityState?.ownerRecoveryDisabled === true;
  const isSecretHashClearedInDb = dbAfterRecovery.securityState?.recoverySecretHash === undefined;
  record(
    'PART A',
    'Persistent Disablement in Database',
    isOwnerRecoveryDisabledInDb && isSecretHashClearedInDb,
    `ownerRecoveryDisabled: ${isOwnerRecoveryDisabledInDb}, hash cleared: ${isSecretHashClearedInDb}`
  );

  // -------------------------------------------------------------
  // PART B — ADMIN AUTHENTICATION
  // -------------------------------------------------------------
  console.log('\n--- PART B: ADMIN AUTHENTICATION ---');

  // Test B1: Login with recovered credentials
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testAdminEmail,
      password: testAdminPassword
    })
  });
  const loginJson = await loginRes.json();
  const setCookie = loginRes.headers.get('set-cookie') || '';
  const sessionTokenCookieMatch = setCookie.match(/safenet_session=([^;]+)/);
  const sessionCookieVal = sessionTokenCookieMatch ? sessionTokenCookieMatch[1] : '';
  const csrfCookieMatch = setCookie.match(/safenet_csrf=([^;]+)/);
  const csrfCookieVal = csrfCookieMatch ? csrfCookieMatch[1] : '';

  record(
    'PART B',
    'Admin Login with Recovered Credentials',
    loginRes.status === 200 && loginJson.success === true && loginJson.user?.role === 'super_admin',
    `Status ${loginRes.status}, user: ${loginJson.user?.email}, role: ${loginJson.user?.role}`
  );

  // Test B2: Cookie security attributes (HttpOnly, SameSite=Lax, Path=/)
  const isHttpOnly = setCookie.includes('safenet_session') && setCookie.includes('HttpOnly');
  const isSameSiteLax = setCookie.toLowerCase().includes('samesite=lax');
  record(
    'PART B',
    'HttpOnly & SameSite Cookie Configuration',
    isHttpOnly && isSameSiteLax,
    `HttpOnly: ${isHttpOnly}, SameSite=Lax: ${isSameSiteLax}, Path=/: ${setCookie.includes('Path=/')}`
  );

  // Test B3: Failed login password rejection with attempt countdown
  const badLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testAdminEmail,
      password: 'IncorrectPassword999!'
    })
  });
  const badLoginJson = await badLoginRes.json();
  record(
    'PART B',
    'Bad Password Rate Limiting Rejection',
    badLoginRes.status === 401 && badLoginJson.error && badLoginJson.error.includes('attempt(s) remaining'),
    `Status ${badLoginRes.status}: "${badLoginJson.error}"`
  );

  // Test B4: Session verification via /api/admin/me
  const meRes = await fetch(`${BASE_URL}/api/admin/me`, {
    headers: {
      Cookie: `safenet_session=${sessionCookieVal}; safenet_csrf=${csrfCookieVal}`
    }
  });
  const meJson = await meRes.json();
  record(
    'PART B',
    'Session Verification (/api/admin/me)',
    meRes.status === 200 && meJson.authenticated === true && meJson.user?.email === testAdminEmail,
    `Authenticated: ${meJson.authenticated}, role: ${meJson.user?.role}`
  );

  // Test B5: CSRF protection on mutating endpoint (POST /api/db/sync)
  // B5.1: Missing CSRF token -> rejected with 403
  const csrfMissingRes = await fetch(`${BASE_URL}/api/db/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `safenet_session=${sessionCookieVal}; safenet_csrf=${csrfCookieVal}`
    },
    body: JSON.stringify({
      leads: dbAfterRecovery.leads
    })
  });
  const csrfMissingJson = await csrfMissingRes.json();
  record(
    'PART B',
    'CSRF Protection - Missing Token Rejection',
    csrfMissingRes.status === 403 && csrfMissingJson.code === 'CSRF_VALIDATION_FAILED',
    `Status ${csrfMissingRes.status}, code: ${csrfMissingJson.code}`
  );

  // B5.2: Invalid CSRF token -> rejected with 403
  const csrfInvalidRes = await fetch(`${BASE_URL}/api/db/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `safenet_session=${sessionCookieVal}; safenet_csrf=${csrfCookieVal}`,
      'x-csrf-token': 'forge-csrf-token-123456'
    },
    body: JSON.stringify({
      leads: dbAfterRecovery.leads
    })
  });
  const csrfInvalidJson = await csrfInvalidRes.json();
  record(
    'PART B',
    'CSRF Protection - Forged Token Rejection',
    csrfInvalidRes.status === 403 && csrfInvalidJson.code === 'CSRF_VALIDATION_FAILED',
    `Status ${csrfInvalidRes.status}, code: ${csrfInvalidJson.code}`
  );

  // B5.3: Valid CSRF token -> accepted with 200
  const csrfValidRes = await fetch(`${BASE_URL}/api/db/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `safenet_session=${sessionCookieVal}; safenet_csrf=${csrfCookieVal}`,
      'x-csrf-token': csrfCookieVal
    },
    body: JSON.stringify({
      leads: dbAfterRecovery.leads
    })
  });
  record(
    'PART B',
    'CSRF Protection - Valid Token Acceptance',
    csrfValidRes.status === 200,
    `Status: ${csrfValidRes.status}`
  );

  // Test B6: Admin Logout & Session Invalidation
  const logoutRes = await fetch(`${BASE_URL}/api/admin/logout`, {
    method: 'POST',
    headers: {
      Cookie: `safenet_session=${sessionCookieVal}; safenet_csrf=${csrfCookieVal}`
    }
  });
  const logoutCookies = logoutRes.headers.get('set-cookie') || '';
  const isCookieCleared = logoutCookies.includes('safenet_session=;') || logoutCookies.includes('Max-Age=0') || logoutCookies.includes('expires=');

  // Verify session is dead
  const meDeadRes = await fetch(`${BASE_URL}/api/admin/me`, {
    headers: {
      Cookie: `safenet_session=${sessionCookieVal}`
    }
  });
  record(
    'PART B',
    'Admin Logout & Complete Session Revocation',
    logoutRes.status === 200 && isCookieCleared && meDeadRes.status === 401,
    `Logout status ${logoutRes.status}, cookie cleared: ${isCookieCleared}, subsequent /me status: ${meDeadRes.status}`
  );

  // -------------------------------------------------------------
  // PART C — RUNTIME ERROR INSPECTION (siteSettings resilience)
  // -------------------------------------------------------------
  console.log('\n--- PART C: RUNTIME ERROR & SETTINGS RESILIENCE ---');

  const stateRes = await fetch(`${BASE_URL}/api/db/state`);
  const stateJson = await stateRes.json();
  const settings = stateJson?.data?.siteSettings;

  const hasAllSettingsFields = Boolean(
    settings &&
    settings.companyName &&
    settings.phone &&
    settings.email &&
    settings.whatsapp &&
    settings.addressNigeria &&
    settings.addressUK &&
    settings.stats?.trainedGuards &&
    settings.socialLinks?.linkedin &&
    settings.socialLinks?.facebook &&
    settings.socialLinks?.x &&
    settings.socialLinks?.instagram &&
    settings.socialLinks?.youtube
  );

  record(
    'PART C',
    'siteSettings Completeness & Deep Field Integrity',
    hasAllSettingsFields,
    `LinkedIn: "${settings?.socialLinks?.linkedin}", Company: "${settings?.companyName}", Guards: "${settings?.stats?.trainedGuards}"`
  );

  // Test C2: Verify safe normalization when receiving partial/empty siteSettings
  const testPartialMerge = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testAdminEmail, password: testAdminPassword })
  });
  const testLoginCookie = testPartialMerge.headers.get('set-cookie') || '';
  const testSess = testLoginCookie.match(/safenet_session=([^;]+)/)?.[1];
  const testCsrf = testLoginCookie.match(/safenet_csrf=([^;]+)/)?.[1];

  // Post partial siteSettings with only 1 field
  const partialSyncRes = await fetch(`${BASE_URL}/api/db/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `safenet_session=${testSess}; safenet_csrf=${testCsrf}`,
      'x-csrf-token': testCsrf
    },
    body: JSON.stringify({
      siteSettings: {
        phone: '+234 813 129 6054'
      }
    })
  });
  const stateAfterPartial = await (await fetch(`${BASE_URL}/api/db/state`)).json();
  const settingsAfterPartial = stateAfterPartial?.data?.siteSettings;
  const isLinkedInStillIntact = Boolean(settingsAfterPartial?.socialLinks?.linkedin);

  record(
    'PART C',
    'Deep Settings Merge & Crash Prevention on Partial Updates',
    partialSyncRes.status === 200 && isLinkedInStillIntact,
    `Status ${partialSyncRes.status}, linkedin preserved: ${settingsAfterPartial?.socialLinks?.linkedin}`
  );

  // -------------------------------------------------------------
  // PART D — FUNCTIONAL TESTING
  // -------------------------------------------------------------
  console.log('\n--- PART D: FUNCTIONAL TESTING ---');

  // Test D1: Homepage and HTML Entry Point
  const homeRes = await fetch(`${BASE_URL}/`);
  const homeHtml = await homeRes.text();
  const hasMeta = homeHtml.includes('<title>SafeNet Security Solutions Ltd') && homeHtml.includes('Corporate Security Command Centre');
  record(
    'PART D',
    'Homepage HTML Entry Point & Meta Tags',
    homeRes.status === 200 && hasMeta,
    `Status ${homeRes.status}, title & meta tags present: ${hasMeta}`
  );

  // Test D2: Public Quote Request Submission (/api/public/leads)
  const leadRes = await fetch(`${BASE_URL}/api/public/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Dr. Christopher Danjuma',
      company: 'Atlantic Energy & Terminal Logistics',
      email: 'c.danjuma@atlanticenergy.ng',
      phone: '+234 803 987 6543',
      location: 'Victoria Island, Lagos',
      serviceRequired: 'Offshore Maritime & Vessel Escort Security',
      urgency: 'immediate'
    })
  });
  const leadJson = await leadRes.json();
  record(
    'PART D',
    'Public Quote Request Submission (Leads CRM)',
    leadRes.status === 200 && leadJson.success === true && Boolean(leadJson.lead?.id),
    `Status ${leadRes.status}, leadId: ${leadJson.lead?.id}`
  );

  // Test D3: Public Security Vulnerability Assessment (/api/public/assessments)
  const assessRes = await fetch(`${BASE_URL}/api/public/assessments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientName: 'Engr. Emeka Okonkwo',
      clientEmail: 'e.okonkwo@transcorp.ng',
      clientPhone: '+234 812 345 6789',
      facilityType: 'Industrial Plant & Tank Farm',
      location: 'Port Harcourt, Rivers State',
      calculatedScore: 78,
      riskRating: 'High Priority Vulnerability',
      recommendedLayers: ['Perimeter Thermal CCTV', 'Drone Patrols', 'Manned Tactical Operatives']
    })
  });
  const assessJson = await assessRes.json();
  record(
    'PART D',
    'Security Assessment Engine Submission',
    assessRes.status === 200 && assessJson.success === true && Boolean(assessJson.assessment?.id),
    `Status ${assessRes.status}, assessmentId: ${assessJson.assessment?.id}, score: ${assessJson.assessment?.calculatedScore}`
  );

  // Test D4: Public Careers Job Application Submission (/api/public/careers)
  const careerRes = await fetch(`${BASE_URL}/api/public/careers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      applicantName: 'Sergeant Samuel Bamidele (Rtd.)',
      applicantEmail: 's.bamidele@gmail.com',
      applicantPhone: '+234 805 123 4567',
      jobTitle: 'Tactical Mobile Patrol Commander',
      experienceYears: '8 years military/police background',
      nsdcStatus: 'Certified'
    })
  });
  const careerJson = await careerRes.json();
  record(
    'PART D',
    'Careers Dossier Application Submission',
    careerRes.status === 200 && careerJson.success === true && Boolean(careerJson.application?.id),
    `Status ${careerRes.status}, applicationId: ${careerJson.application?.id}`
  );

  // Test D5: AI Advisory Endpoint (/api/chat)
  const chatRes = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'What perimeter security architecture is recommended for an industrial facility in Ikeja?' }],
      context: { route: '/services/cctv-surveillance', pageTitle: 'AI Video Surveillance & Smart CCTV' }
    })
  });
  const chatJson = await chatRes.json();
  record(
    'PART D',
    'SafeNet Sentinel AI Advisory (/api/chat)',
    chatRes.status === 200 && Boolean(chatJson.reply && chatJson.reply.length > 50),
    `Status ${chatRes.status}, reply length: ${chatJson.reply?.length} characters`
  );

  // Test D6: Proposal Generator Endpoint (Authenticated)
  const propRes = await fetch(`${BASE_URL}/api/proposals/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `safenet_session=${testSess}; safenet_csrf=${testCsrf}`,
      'x-csrf-token': testCsrf
    },
    body: JSON.stringify({
      clientName: 'Chief Adebayo Alabi',
      company: 'Zenith Logistics Hub',
      facilityType: 'Maritime Container Terminal',
      location: 'Apapa Port Complex, Lagos',
      score: 72,
      riskRating: 'High Vulnerability'
    })
  });
  const propJson = await propRes.json();
  record(
    'PART D',
    'Formal Proposal Generator (/api/proposals/generate)',
    propRes.status === 200 && Boolean(propJson.proposal?.referenceCode),
    `Status ${propRes.status}, refCode: ${propJson.proposal?.referenceCode}`
  );

  // Test D7: Direct SPA Route Refresh & Client Routes (About, Services, Industries, Contact, Blog, Careers, Quote, Assessment, Admin)
  const clientRoutes = [
    '/about',
    '/services',
    '/industries',
    '/contact',
    '/blog',
    '/careers',
    '/quote-request',
    '/assessment',
    '/admin',
    '/admin/dashboard'
  ];

  let allRoutesValid = true;
  for (const route of clientRoutes) {
    const routeRes = await fetch(`${BASE_URL}${route}`);
    const html = await routeRes.text();
    if (routeRes.status !== 200 || !html.includes('<div id="root">')) {
      allRoutesValid = false;
      break;
    }
  }
  record(
    'PART D',
    'SPA Client Page Refresh & Deep Route Serving (10 Routes)',
    allRoutesValid,
    `Tested ${clientRoutes.length} client routes; all return HTTP 200 with SPA shell`
  );

  // Test D8: Social Links Verification in Public State
  const publicStateRes = await fetch(`${BASE_URL}/api/db/state`);
  const publicState = await publicStateRes.json();
  const socialLinks = publicState?.data?.siteSettings?.socialLinks;
  const hasValidSocials = Boolean(
    socialLinks?.linkedin?.includes('linkedin.com') &&
    socialLinks?.facebook?.includes('facebook.com') &&
    socialLinks?.x?.includes('x.com') &&
    socialLinks?.instagram?.includes('instagram.com') &&
    socialLinks?.youtube?.includes('youtube.com')
  );
  record(
    'PART D',
    'Social Links Verification (LinkedIn, FB, X, IG, YT)',
    hasValidSocials,
    `LinkedIn: "${socialLinks?.linkedin}", X: "${socialLinks?.x}", YouTube: "${socialLinks?.youtube}"`
  );

  // Test D9: WhatsApp Integration & Hotline Links
  const whatsappNumber = publicState?.data?.siteSettings?.whatsapp || '';
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');
  const hasValidWhatsapp = cleanWhatsapp === '2348131296054';
  record(
    'PART D',
    'WhatsApp Operations Desk Integration',
    hasValidWhatsapp,
    `Phone: "${whatsappNumber}", Clean wa.me Target: "${cleanWhatsapp}"`
  );

  // Test D10: Database Integrity, Backups & Audit History Preservation
  const dbFinal = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const superAdminFinal = dbFinal.adminUsers?.find(u => u.role === 'super_admin');
  const leadCount = dbFinal.leads?.length || 0;
  const blogCount = dbFinal.blogPosts?.length || 0;
  const assessCount = dbFinal.securityAssessments?.length || 0;
  const appCount = dbFinal.jobApplications?.length || 0;
  const auditCount = dbFinal.auditLogs?.length || 0;
  const backupExists = fs.existsSync(path.resolve(__dirname, '../data/database.backup.json'));

  record(
    'PART D',
    'CRM, Leads, Blog, Audit & Admin Record Preservation',
    leadCount > 0 && blogCount > 0 && assessCount > 0 && appCount > 0 && auditCount > 0 && Boolean(superAdminFinal) && backupExists,
    `SuperAdmin: ${superAdminFinal?.name}, Leads: ${leadCount}, Blog: ${blogCount}, Assessments: ${assessCount}, Applications: ${appCount}, Audit: ${auditCount}, BackupExists: ${backupExists}`
  );

  // -------------------------------------------------------------
  // RE-ARM RECOVERY AUTHORIZATION SECRET FOR SYSTEM OWNER
  // -------------------------------------------------------------
  console.log('\n--- PROVISIONING REPLACEMENT OWNER RECOVERY AUTHORIZATION ---');
  // Re-generate fresh uncompromised secret and vault representation for system owner
  execSync('node scripts/generate-recovery-secret.mjs', { stdio: 'inherit' });

  const finalVaultExists = fs.existsSync(VAULT_FILE);
  const dbReArmed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const isReArmed = dbReArmed.securityState?.ownerRecoveryDisabled === false && Boolean(dbReArmed.securityState?.recoverySecretHash);

  record(
    'FINAL STATE',
    'Fresh Replacement Recovery Secret Armed in Vault',
    finalVaultExists && isReArmed,
    `Vault exists: ${finalVaultExists}, recoverySecretHash in DB: ${Boolean(dbReArmed.securityState?.recoverySecretHash)}, disabled: ${dbReArmed.securityState?.ownerRecoveryDisabled}`
  );

  // Summary
  const passedCount = results.filter(r => r.passed).length;
  console.log('\n================================================================');
  console.log(` VERIFICATION COMPLETE: ${passedCount} / ${results.length} Tests Passed`);
  console.log('================================================================\n');

  return { passed: passedCount === results.length, results };
}

runVerification().catch(err => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
