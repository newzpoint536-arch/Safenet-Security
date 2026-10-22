import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.resolve(__dirname, '../data/database.json');
const BACKUP_FILE = path.resolve(__dirname, '../data/database.backup.json');
const VAULT_FILE = path.resolve(__dirname, '../data/.owner_recovery_vault');
const COMPROMISED_KEY_HASH = 'e76c0fa479a69a997bf2471eda535fc217ab94c5166432b5b25344440b0acdbc';

const pbkdf2Async = util.promisify(crypto.pbkdf2);
const ITERATIONS = 210000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

async function generateRecoveryAuthorization() {
  if (!fs.existsSync(DB_FILE)) {
    console.error('Database file not found at:', DB_FILE);
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  const invalidated = new Set(db.securityState?.invalidatedSecretHashes || []);
  invalidated.add(COMPROMISED_KEY_HASH);

  // 1. Generate high-entropy 256-bit cryptographically secure recovery secret
  const rawSecret = 'SFN-REC-' + crypto.randomBytes(32).toString('hex').toUpperCase();

  // 2. Derive PBKDF2-SHA512 hash with unique 32-byte salt and 210,000 iterations
  const salt = crypto.randomBytes(32).toString('hex');
  const derivedKey = await pbkdf2Async(rawSecret, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  const hash = derivedKey.toString('hex');

  // 3. Store ONLY the protected representation in the persistent database
  db.securityState = {
    ownerRecoveryDisabled: false,
    ownerRecoveryDisabledAt: undefined,
    ownerRecoveryDisabledReason: undefined,
    recoverySecretHash: hash,
    recoverySecretSalt: salt,
    recoverySecretIterations: ITERATIONS,
    invalidatedSecretHashes: Array.from(invalidated)
  };

  db.updatedAt = new Date().toISOString();

  // Atomically write database
  const serialized = JSON.stringify(db, null, 2);
  const tempDb = `${DB_FILE}.tmp.${process.pid}.${Date.now()}`;
  fs.writeFileSync(tempDb, serialized, 'utf-8');
  fs.renameSync(tempDb, DB_FILE);
  fs.writeFileSync(BACKUP_FILE, serialized, 'utf-8');

  // 4. Write raw secret to restricted local vault file on server (chmod 0600)
  fs.writeFileSync(VAULT_FILE, rawSecret, { encoding: 'utf-8', mode: 0o600 });
  try {
    fs.chmodSync(VAULT_FILE, 0o600);
  } catch {}

  // 5. Clean up any legacy token files
  const legacyTokenFile = path.resolve(__dirname, '../data/.owner_recovery_token');
  if (fs.existsSync(legacyTokenFile)) {
    try { fs.unlinkSync(legacyTokenFile); } catch {}
  }

  // NOTE: Per security policy, we NEVER print or log the raw secret to stdout or logs.
  console.log('[SafeNet Security] New cryptographically secure owner recovery secret generated.');
  console.log('[SafeNet Security] Protected representation (PBKDF2-SHA512, 210k iterations) stored in database.');
  console.log('[SafeNet Security] Secret written to protected vault file at /data/.owner_recovery_vault (mode 0600).');
  console.log('[SafeNet Security] The secret was not printed to console or logs.');
}

generateRecoveryAuthorization().catch(err => {
  console.error('[SafeNet Security] Generation failed:', err);
  process.exit(1);
});
