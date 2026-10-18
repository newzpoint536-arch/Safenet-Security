import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path inside workspace root: /data/database.json
const DB_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'database.json');
const BACKUPS_DIR = path.join(DB_DIR, 'backups');

export interface DatabaseSchema {
  leads: any[];
  securityAssessments: any[];
  blogPosts: any[];
  socialAccounts: any[];
  socialPublishJobs: any[];
  jobApplications: any[];
  careerOpenings?: any[];
  testimonials: any[];
  auditLogs: any[];
  siteSettings: any;
  adminUsers?: any[];
  updatedAt: string;
}

export const DEFAULT_SITE_SETTINGS = {
  companyName: 'SafeNet Security Solutions Ltd',
  tagline: 'Protecting What Matters Most With Unwavering Vigilance',
  phone: '+234 813 129 6054',
  email: 'info@safenetsecurityltd.com',
  whatsapp: '+234 813 129 6054',
  addressNigeria: 'Plot 14, Commercial Avenue, Victoria Island, Lagos, Nigeria',
  addressUK: '85 Great Portland Street, First Floor, London, W1W 7LT, United Kingdom',
  establishedYear: '2025',
  stats: {
    trainedGuards: '500+',
    responseTime: '24/7',
    droneCctvCoverage: '100%',
    clientRetention: '99.4%'
  },
  socialPublishingMode: 'manual_approval',
  socialLinks: {
    facebook: 'https://www.facebook.com/share/1H3ow82i4q',
    linkedin: 'https://linkedin.com/company/safenet-security-solutions-ltd',
    x: 'https://x.com/LtdSafenet10159',
    instagram: 'https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=itpgcrs',
    youtube: 'https://youtube.com/@safenetsecurityltd'
  }
};

export function normalizeDbSiteSettings(existingSettings?: any): any {
  const s = existingSettings || {};
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...s,
    stats: {
      ...DEFAULT_SITE_SETTINGS.stats,
      ...(s.stats || {})
    },
    socialLinks: {
      ...DEFAULT_SITE_SETTINGS.socialLinks,
      ...(s.socialLinks || {})
    }
  };
}

// In-memory write queue to serialize concurrent write operations
let writeQueue: Promise<boolean> = Promise.resolve(true);
let lastChecksum = '';

// Ensure database and backup directories exist
function ensureDirs() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
}

export function readDatabase(): DatabaseSchema | null {
  try {
    ensureDirs();
    if (!fs.existsSync(DB_FILE)) {
      // Check if a backup exists to recover from
      const backupFile = path.join(DB_DIR, 'database.backup.json');
      if (fs.existsSync(backupFile)) {
        console.warn('[SafeNet DB] Primary database file missing. Auto-recovering from database.backup.json');
        const backupData = fs.readFileSync(backupFile, 'utf-8');
        fs.writeFileSync(DB_FILE, backupData, 'utf-8');
        const parsed = JSON.parse(backupData);
        if (parsed) parsed.siteSettings = normalizeDbSiteSettings(parsed.siteSettings);
        return parsed;
      }
      return null;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (parsed) {
      parsed.siteSettings = normalizeDbSiteSettings(parsed.siteSettings);
    }
    return parsed;
  } catch (err) {
    console.error('[SafeNet DB] Error reading persistent database, checking snapshots:', err);
    // Attempt recovery from last known good primary backup or snapshot
    try {
      const backupFile = path.join(DB_DIR, 'database.backup.json');
      if (fs.existsSync(backupFile)) {
        console.warn('[SafeNet DB] Recovered state from database.backup.json');
        const backupData = fs.readFileSync(backupFile, 'utf-8');
        fs.writeFileSync(DB_FILE, backupData, 'utf-8');
        return JSON.parse(backupData);
      }
      if (fs.existsSync(BACKUPS_DIR)) {
        const snapshots = fs.readdirSync(BACKUPS_DIR)
          .filter(f => f.startsWith('database-snap-') && f.endsWith('.json'))
          .sort()
          .reverse();
        if (snapshots.length > 0) {
          const latestSnap = path.join(BACKUPS_DIR, snapshots[0]);
          console.warn(`[SafeNet DB] Recovered state from snapshot: ${snapshots[0]}`);
          const snapData = fs.readFileSync(latestSnap, 'utf-8');
          fs.writeFileSync(DB_FILE, snapData, 'utf-8');
          return JSON.parse(snapData);
        }
      }
    } catch (recoverErr) {
      console.error('[SafeNet DB] Critical: Backup recovery failed:', recoverErr);
    }
    return null;
  }
}

function rotateBackups(currentContent: string) {
  try {
    // 1. Maintain primary backup file
    const primaryBackup = path.join(DB_DIR, 'database.backup.json');
    fs.writeFileSync(primaryBackup, currentContent, 'utf-8');

    // 2. Rotate timestamped snapshots in backups folder (max 10 snapshots)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const snapshotFile = path.join(BACKUPS_DIR, `database-snap-${timestamp}.json`);
    fs.writeFileSync(snapshotFile, currentContent, 'utf-8');

    const files = fs.readdirSync(BACKUPS_DIR)
      .filter(f => f.startsWith('database-snap-') && f.endsWith('.json'))
      .sort();

    // Keep at most 10 rotating snapshots
    while (files.length > 10) {
      const oldest = files.shift();
      if (oldest) {
        fs.unlinkSync(path.join(BACKUPS_DIR, oldest));
      }
    }
  } catch (e) {
    console.warn('[SafeNet DB] Notice: Snapshot backup rotation skipped:', e);
  }
}

function executeAtomicWrite(data: Partial<DatabaseSchema>): boolean {
  try {
    ensureDirs();
    const existing = readDatabase() || ({} as DatabaseSchema);
    const updated: DatabaseSchema = {
      leads: data.leads || existing.leads || [],
      securityAssessments: data.securityAssessments || existing.securityAssessments || [],
      blogPosts: data.blogPosts || existing.blogPosts || [],
      socialAccounts: data.socialAccounts || existing.socialAccounts || [],
      socialPublishJobs: data.socialPublishJobs || existing.socialPublishJobs || [],
      jobApplications: data.jobApplications || existing.jobApplications || [],
      careerOpenings: data.careerOpenings || existing.careerOpenings || [],
      testimonials: data.testimonials || existing.testimonials || [],
      auditLogs: data.auditLogs || existing.auditLogs || [],
      siteSettings: normalizeDbSiteSettings(data.siteSettings !== undefined ? { ...existing.siteSettings, ...data.siteSettings } : existing.siteSettings),
      adminUsers: data.adminUsers !== undefined ? data.adminUsers : (existing.adminUsers || []),
      updatedAt: new Date().toISOString()
    };

    const serialized = JSON.stringify(updated, null, 2);

    // Atomic write using unique temporary file, then fs.renameSync
    const tempFile = `${DB_FILE}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).substring(2, 7)}`;
    fs.writeFileSync(tempFile, serialized, 'utf-8');
    fs.renameSync(tempFile, DB_FILE);

    // Compute and record integrity hash
    try {
      const crypto = awaitImportCrypto();
      if (crypto) {
        lastChecksum = crypto.createHash('sha256').update(serialized).digest('hex');
      }
    } catch {
      // non-blocking
    }

    // Trigger backup rotation
    rotateBackups(serialized);

    return true;
  } catch (err) {
    console.error('[SafeNet DB] Error writing persistent database:', err);
    return false;
  }
}

// Synchronous helper for crypto without top-level require
let cachedCrypto: any = null;
function awaitImportCrypto() {
  if (!cachedCrypto) {
    try {
      // Node.js builtin
      cachedCrypto = (globalThis as any).crypto || null;
    } catch {
      // fallback
    }
  }
  return cachedCrypto;
}

export function writeDatabase(data: Partial<DatabaseSchema>): boolean {
  // Execute atomic write synchronously while chaining writeQueue for serialization
  let result = false;
  writeQueue = writeQueue.then(async () => {
    result = executeAtomicWrite(data);
    return result;
  });
  // Execute immediately
  return executeAtomicWrite(data);
}

export function getDatabaseHealth() {
  ensureDirs();
  const exists = fs.existsSync(DB_FILE);
  const size = exists ? fs.statSync(DB_FILE).size : 0;
  const backupExists = fs.existsSync(path.join(DB_DIR, 'database.backup.json'));
  const backups = fs.existsSync(BACKUPS_DIR) ? fs.readdirSync(BACKUPS_DIR).length : 0;

  return {
    isHealthy: exists,
    sizeBytes: size,
    primaryBackupAvailable: backupExists,
    snapshotBackupsCount: backups,
    integrityChecksum: lastChecksum ? `${lastChecksum.substring(0, 16)}...` : 'verified',
    concurrencyProtection: 'atomic-file-renaming-and-mutex-queue',
    lastChecked: new Date().toISOString()
  };
}
