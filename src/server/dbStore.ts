import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path inside workspace root: /data/database.json
const DB_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'database.json');

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

// Ensure database directory exists
function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

export function readDatabase(): DatabaseSchema | null {
  try {
    ensureDbDir();
    if (!fs.existsSync(DB_FILE)) {
      return null;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading persistent database:', err);
    return null;
  }
}

export function writeDatabase(data: Partial<DatabaseSchema>): boolean {
  try {
    ensureDbDir();
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

    // Atomic write using temp file
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(updated, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('Error writing persistent database:', err);
    return false;
  }
}
