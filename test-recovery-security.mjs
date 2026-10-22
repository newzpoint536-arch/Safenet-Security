import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const BASE_URL = 'http://localhost:3000';
const VAULT_FILE = path.resolve('data/.owner_recovery_vault');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSecurityRemediationTests() {
  await wait(1000); // Give server time to boot
  const results = [];
  function record(name, passed, details) {
    results.push({ name, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark}: ${name} -> ${details}`);
  }

  console.log('\n======================================================');
  console.log(' SAFENET: OWNER RECOVERY SECURITY REMEDIATION SUITE');
  console.log('======================================================\n');

  // Ensure recovery is freshly armed before testing
  try {
    execSync('node scripts/generate-recovery-secret.mjs', { stdio: 'pipe' });
  } catch (e) {
    console.warn('Notice: Setup recovery generation:', e);
  }

  // TEST 1: Compromised/Blacklisted key permanently rejected
  // Verifies the server-side invalidation registry without storing or exposing compromised plaintext secrets
  const testRevokedSecret = 'SFN-REVOKED-TEST-KEY-' + crypto.randomBytes(16).toString('hex').toUpperCase();
  const testRevokedHash = crypto.createHash('sha256').update(testRevokedSecret).digest('hex');
  const dbBefore = JSON.parse(fs.readFileSync('data/database.json', 'utf8'));
  if (!dbBefore.securityState) dbBefore.securityState = {};
  if (!dbBefore.securityState.invalidatedSecretHashes) {
    dbBefore.securityState.invalidatedSecretHashes = [];
  }
  if (!dbBefore.securityState.invalidatedSecretHashes.includes(testRevokedHash)) {
    dbBefore.securityState.invalidatedSecretHashes.push(testRevokedHash);
    fs.writeFileSync('data/database.json', JSON.stringify(dbBefore, null, 2), 'utf8');
  }

  const compRes = await fetch(`${BASE_URL}/api/admin/owner-recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.2.0.1' },
    body: JSON.stringify({
      recoverySecret: testRevokedSecret,
      newEmail: 'hacker@example.com',
      newPassword: 'StrongPassword123!'
    })
  });
  const compJson = await compRes.json();
  record(
    'Compromised / Blacklisted Key Rejection',
    compRes.status === 403 && compJson.error && compJson.error.includes('permanently invalidated'),
    `Status: ${compRes.status}, Error: "${compJson.error}"`
  );

  // TEST 2: Arbitrary invalid key rejected
  const badKeyRes = await fetch(`${BASE_URL}/api/admin/owner-recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.2.0.2' },
    body: JSON.stringify({
      recoverySecret: 'SFN-REC-INVALID-FAKE-KEY-1234567890',
      newEmail: 'hacker@example.com',
      newPassword: 'StrongPassword123!'
    })
  });
  const badKeyJson = await badKeyRes.json();
  record(
    'Invalid Secret Rejection',
    badKeyRes.status === 403 && badKeyJson.error && badKeyJson.error.includes('Invalid owner recovery authorization secret'),
    `Status: ${badKeyRes.status}, Error: "${badKeyJson.error}"`
  );

  // TEST 3: Recovery status endpoint returns boolean only, never exposes secret
  const statusRes = await fetch(`${BASE_URL}/api/admin/owner-recovery-status`);
  const statusJson = await statusRes.json();
  const keysInStatus = Object.keys(statusJson);
  record(
    'Recovery Status Safe Response',
    statusJson.isAvailable === true && keysInStatus.length === 1 && keysInStatus[0] === 'isAvailable',
    `Keys returned: ${JSON.stringify(keysInStatus)}, isAvailable: ${statusJson.isAvailable}`
  );

  // TEST 4: Protected server vault contains replacement secret
  const vaultExists = fs.existsSync(VAULT_FILE);
  const secretFromVault = vaultExists ? fs.readFileSync(VAULT_FILE, 'utf8').trim() : '';
  record(
    'Server Vault File Presence & Protection',
    vaultExists && secretFromVault.startsWith('SFN-REC-'),
    `Vault file exists: ${vaultExists}, starts with prefix: ${secretFromVault.startsWith('SFN-REC-')}`
  );

  // TEST 5: Perform recovery with the newly generated replacement secret
  const newAdminEmail = 'director@safenetsecurityltd.com';
  const newAdminPass = 'EnterpriseSecurity2026!#';
  const recoverRes = await fetch(`${BASE_URL}/api/admin/owner-recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.2.0.5' },
    body: JSON.stringify({
      recoverySecret: secretFromVault,
      newEmail: newAdminEmail,
      newName: 'Capt. Emmanuel Adeleke (Rtd.)',
      newPassword: newAdminPass,
      newRecoveryPassphrase: 'SafeNet-Alpha-Command-2026'
    })
  });
  const recoverJson = await recoverRes.json();
  const setCookieHeader = recoverRes.headers.get('set-cookie') || '';
  const hasSessionCookie = setCookieHeader.includes('safenet_session') && setCookieHeader.includes('HttpOnly');
  record(
    'Authorized Owner Recovery Execution',
    recoverRes.status === 200 && recoverJson.success === true && hasSessionCookie,
    `Status: ${recoverRes.status}, Success: ${recoverJson.success}, HttpOnly Cookie set: ${hasSessionCookie}`
  );

  // TEST 6: Verify vault file was immediately unlinked/destroyed upon use
  const vaultStillExists = fs.existsSync(VAULT_FILE);
  record(
    'Vault File Destruction Upon Use',
    !vaultStillExists,
    `Vault file exists after consumption: ${vaultStillExists}`
  );

  // TEST 7: Verify database securityState is now persistently disabled
  const dbAfter = JSON.parse(fs.readFileSync('data/database.json', 'utf8'));
  const isNowDisabled = dbAfter.securityState && dbAfter.securityState.ownerRecoveryDisabled === true;
  const isHashCleared = dbAfter.securityState && dbAfter.securityState.recoverySecretHash === undefined;
  record(
    'Persistent Disablement in Database',
    isNowDisabled && isHashCleared,
    `ownerRecoveryDisabled: ${isNowDisabled}, recoverySecretHash cleared: ${isHashCleared}`
  );

  // TEST 8: Verify recovery-status is now false
  const statusAfterRes = await fetch(`${BASE_URL}/api/admin/owner-recovery-status`);
  const statusAfterJson = await statusAfterRes.json();
  record(
    'Recovery Status After Consumption',
    statusAfterJson.isAvailable === false,
    `isAvailable: ${statusAfterJson.isAvailable}`
  );

  // TEST 9: Verify secret reuse is strictly rejected
  const reuseRes = await fetch(`${BASE_URL}/api/admin/owner-recovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.2.0.8' },
    body: JSON.stringify({
      recoverySecret: secretFromVault,
      newEmail: 'intruder@safenetsecurityltd.com',
      newPassword: 'StrongPassword123!'
    })
  });
  const reuseJson = await reuseRes.json();
  record(
    'Secret Reuse Prevention',
    reuseRes.status === 403,
    `Status: ${reuseRes.status}, Error: "${reuseJson.error}"`
  );

  // TEST 10: Verify login with newly recovered credentials
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.2.0.10' },
    body: JSON.stringify({
      email: newAdminEmail,
      password: newAdminPass
    })
  });
  const loginJson = await loginRes.json();
  const loginCookies = loginRes.headers.get('set-cookie') || '';
  record(
    'Login With Recovered Credentials',
    loginRes.status === 200 && loginJson.success === true && loginCookies.includes('safenet_session'),
    `Status: ${loginRes.status}, User: ${loginJson.user?.email}`
  );

  // TEST 11: Verify bad password rejection on the new credentials
  const badLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.2.0.11' },
    body: JSON.stringify({
      email: newAdminEmail,
      password: 'WrongPassword999!'
    })
  });
  const badLoginJson = await badLoginRes.json();
  record(
    'Incorrect Password Rejection',
    badLoginRes.status === 401 && badLoginJson.error && badLoginJson.error.includes('attempt(s) remaining'),
    `Status: ${badLoginRes.status}, Error: "${badLoginJson.error}"`
  );

  // TEST 12: Verify data integrity preservation (leads, settings, blog, audit logs)
  const dbFinal = JSON.parse(fs.readFileSync('data/database.json', 'utf8'));
  const superAdmin = dbFinal.adminUsers?.find(u => u.role === 'super_admin');
  const leadsCount = dbFinal.leads?.length || 0;
  const blogCount = dbFinal.blogPosts?.length || 0;
  const auditLogsCount = dbFinal.auditLogs?.length || 0;
  record(
    'Existing Records & Audit History Preservation',
    leadsCount > 0 && blogCount > 0 && auditLogsCount > 0 && superAdmin?.email === newAdminEmail,
    `SuperAdmin: "${superAdmin?.name} (${superAdmin?.email})", Leads: ${leadsCount}, BlogPosts: ${blogCount}, AuditLogs: ${auditLogsCount}`
  );

  // TEST 13: Verify public siteSettings completeness
  const stateRes = await fetch(`${BASE_URL}/api/db/state`);
  const stateJson = await stateRes.json();
  const siteSettings = stateJson?.data?.siteSettings;
  const hasLinkedin = Boolean(siteSettings?.socialLinks?.linkedin);
  record(
    'siteSettings Completeness & Resilience',
    hasLinkedin && Boolean(siteSettings?.companyName),
    `companyName: "${siteSettings?.companyName}", linkedin: "${siteSettings?.socialLinks?.linkedin}"`
  );

  // Re-arm recovery for production readiness
  try {
    execSync('node scripts/generate-recovery-secret.mjs', { stdio: 'pipe' });
  } catch (e) {
    console.warn('Notice: Final recovery secret generation:', e);
  }

  // Summary
  const passed = results.filter(r => r.passed).length;
  console.log('\n======================================================');
  console.log(` SUMMARY: ${passed} / ${results.length} Security Tests Passed`);
  console.log('======================================================\n');
}

runSecurityRemediationTests();
