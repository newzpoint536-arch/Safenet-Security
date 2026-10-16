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
  testimonials: any[];
  auditLogs: any[];
  siteSettings: any;
  updatedAt: string;
}

// In-memory write queue to serialize concurrent write operations
let writeQueue: Promise<void> = Promise.resolve();

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
        console.warn('Primary database file missing. Recovering from database.backup.json');
        const backupData = fs.readFileSync(backupFile, 'utf-8');
        fs.writeFileSync(DB_FILE, backupData, 'utf-8');
        return JSON.parse(backupData);
      }
      return null;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading persistent database:', err);
    // Attempt recovery from last known good backup
    try {
      const backupFile = path.join(DB_DIR, 'database.backup.json');
      if (fs.existsSync(backupFile)) {
        console.warn('Attempting emergency recovery from database.backup.json');
        const backupData = fs.readFileSync(backupFile, 'utf-8');
        return JSON.parse(backupData);
      }
    } catch (recoverErr) {
      console.error('Critical: Backup recovery also failed:', recoverErr);
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
    console.warn('Notice: Snapshot backup rotation skipped:', e);
  }
}

export function writeDatabase(data: Partial<DatabaseSchema>): boolean {
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
      testimonials: data.testimonials || existing.testimonials || [],
      auditLogs: data.auditLogs || existing.auditLogs || [],
      siteSettings: data.siteSettings || existing.siteSettings || {},
      updatedAt: new Date().toISOString()
    };

    const serialized = JSON.stringify(updated, null, 2);

    // Atomic write using unique temporary file, then rename
    const tempFile = `${DB_FILE}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 7)}`;
    fs.writeFileSync(tempFile, serialized, 'utf-8');
    fs.renameSync(tempFile, DB_FILE);

    // Trigger backup rotation asynchronously
    rotateBackups(serialized);

    return true;
  } catch (err) {
    console.error('Error writing persistent database:', err);
    return false;
  }
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
    lastChecked: new Date().toISOString()
  };
}
