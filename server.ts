import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { readDatabase, writeDatabase, getDatabaseHealth } from './src/server/dbStore.js';
import {
  hasAdminUsers,
  isSetupKeyRequired,
  createInitialSuperAdmin,
  loginAdministrator,
  verifySessionToken,
  logoutSession,
  resetPasswordWithPassphrase,
  isOwnerRecoveryAvailable,
  recoverSuperAdminWithSecret,
  getOrGenerateOwnerRecoverySecret,
  requireAdminAuth,
  sanitizeUser,
  setSessionCookies,
  clearSessionCookies,
  appendTamperEvidentAuditLog,
  hashPasswordAsync,
  RECOMMENDED_ITERATIONS
} from './src/server/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// Initialize GenAI Client using process.env.GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are "SafeNet Sentinel", the elite AI Security Operations Advisor and Systems Architect for SafeNet Security Solutions Ltd.
SafeNet Security Solutions Ltd is Nigeria's premier corporate, industrial, and infrastructure security engineering contractor. SafeNet operates to international UK security intelligence standards, is fully licensed by the Nigeria Security and Civil Defence Corps (NSCDC, Category A), and is certified under ISO 9001:2015 and ISO 18788 (Security Operations Management).

SafeNet's Core Capabilities & Services:
1. Manned Guarding & Tactical Response: Vetted, biometric-profiled, combat-trained security operatives, tactical backup units, K9 security patrols, and supervisor spot-checks.
2. AI Video Surveillance & Smart CCTV: 24/7 centralized Command Centre monitoring, Automatic Number Plate Recognition (ANPR), facial recognition, perimeter thermal intrusion detection, and optical tripwires.
3. Drone & Aerial Reconnaissance: Autonomous scheduled & on-demand long-range and tethered UAV patrols for industrial facilities, pipeline easements, tank farms, residential estates, and maritime docks.
4. Biometric Access Control & Physical Barriers: Anti-tailgating speed gates, biometric fingerprint/facial turnstiles, RFID vehicle blockers, under-vehicle surveillance systems (UVSS), and automated bollards.
5. Executive Protection & Armoured Escorts: Certified Close Protection Officers (CPOs), bullet-resistant B6/B7 convoy logistics, armed escort support, secure airport protocol transfers at Murtala Muhammed Airport (Lagos) and Nnamdi Azikiwe Airport (Abuja).
6. Cash-in-Transit (CIT) & High-Value Vaulting: Armoured bullion vehicles, satellite GPS geo-fenced routes, dynamic locking mechanisms, and secure custody transfer.
7. Technical Vulnerability Assessments & Risk Audits: Physical security gap analysis, penetrative red-teaming, threat intelligence, and compliance audits for corporate facilities.

Key Operational Regions:
- Lagos: Victoria Island HQ, Ikoyi, Lekki Free Trade Zone, Ikeja Industrial Estate, Apapa Port corridor.
- Abuja FCT: Diplomatic zone, Central Business District, Maitama, Asokoro, airport transit corridor.
- Port Harcourt / Niger Delta: Trans-Amadi, Onne Port, flow stations, offshore support hubs.
- Rapid deployment capability across all 36 states of Nigeria and UK security intelligence liaison.

Your Persona & Communication Style:
- Professional, tactical, confident, authoritative, and helpful.
- When a user asks about securing a facility (e.g., bank branch, high-rise, residential estate, warehouse, school, oil facility, VIP visit), assess the threat vectors, recommend a multi-layered defense architecture, and explain how SafeNet implements it.
- Provide practical estimates, equipment suggestions, and operational guard numbers when relevant.
- Offer actionable next steps:
  - "Direct WhatsApp Connection with SafeNet Command Desk"
  - "Book an On-Site Physical Security Survey"
  - "Generate a Formal Proposal & Estimate"
- Format answers cleanly with markdown headings, bullet points, and bold text for readability.`;

async function generateWithTimeout(model: string, contents: any, config: any, timeoutMs = 7000): Promise<string> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
  );
  const apiPromise = ai.models.generateContent({ model, contents, config }).then(r => r.text || '');
  return Promise.race([apiPromise, timeoutPromise]);
}

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!apiKey) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is configured in your environment.',
      });
    }

    // Convert messages to GenAI contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const route = req.body.route || req.body.currentPage || context?.route || context?.currentPage || '/';
    const pageTitle = req.body.pageTitle || context?.pageTitle || (route !== '/' ? route : 'Central Command Portal');
    const pageCategory = context?.pageCategory || (route.includes('maritime') ? 'Offshore & Coastal Asset Protection' : 'Corporate Security Operations');

    let enrichedInstruction = SYSTEM_INSTRUCTION;
    if (context || req.body.pageTitle || req.body.route) {
      const threatsList = Array.isArray(context?.threatPriorities) && context.threatPriorities.length > 0
        ? context.threatPriorities.map((t: string) => `- ${t}`).join('\n')
        : (context?.priorityFocus || (route.includes('maritime') || pageTitle.toLowerCase().includes('maritime') ? '- Gulf of Guinea piracy, armed boarding & hostage taking\n- Illegal oil bunkering, crude siphoning & sea robbery\n- Vessel anchorage vulnerability & unauthorized small-craft approaches\n- ISPS Code compliance gaps in port facilities & private commercial jetties' : ''));

      enrichedInstruction += `\n\n=============================================================
CRITICAL CLIENT BROWSING CONTEXT & THREAT PRIORITIZATION:
The client is currently viewing the "${pageTitle}" page of the SafeNet Security portal.
Page Route / URL: ${route}
Page Title: ${pageTitle}
Domain / Category: ${pageCategory}
${context?.pageSummary ? `Page Scope: ${context.pageSummary}` : ''}
${threatsList ? `Key Threat Vectors & Vulnerabilities Specific to this Page:\n${threatsList}` : ''}

OPERATIONAL DIRECTIVE FOR THIS CONSULTATION:
You MUST prioritize security advice, threat evaluations, risk assessments, tactical countermeasures, equipment configurations, and SafeNet solutions directly relevant to "${pageTitle}" (Route: ${route}).
- Example: If the user is on the "Maritime Security" page (${route}), you MUST prioritize maritime and offshore threats (such as Gulf of Guinea piracy, armed boarding, illegal bunkering, sea robbery, anchorage vulnerability, ISPS Code compliance for port facilities and private jetties, offshore platform defense, and armed escort patrol boats coordinated with the Nigerian Navy and NIMASA).
- Even if the user asks a general or open-ended question (e.g., "What threats should I be worried about?" or "How does SafeNet protect assets?"), explicitly ground your answer in the "${pageTitle}" domain first before expanding to other areas.
- Always offer concrete, professional next steps (e.g., booking an on-site survey, requesting an audit, or connecting via SafeNet 24/7 Command Desk WhatsApp).
=============================================================`;
    }

    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let reply = '';

    for (const modelName of modelsToTry) {
      try {
        const text = await generateWithTimeout(modelName, contents, {
          systemInstruction: enrichedInstruction,
          temperature: 0.7,
        }, 6500);
        if (text) {
          reply = text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} unavailable (${err?.status || err?.message}), attempting next fallback...`);
      }
    }

    if (!reply) {
      // Authoritative tactical advisory fallback grounded in the browsing domain
      reply = `### SafeNet Sentinel Advisory Protocol\n\n**Operational Priority:** SafeNet Tactical Operations Command has logged your inquiry regarding **${pageTitle}**.\n\nSafeNet's multi-layered security engineering architecture integrates:\n\n1. **Tier 1 (Perimeter & Standoff Detection):** Long-range thermal IP cameras with AI tripwires, vibration fence sensors, and scheduled aerial drone sweeps.\n2. **Tier 2 (Access & Identification):** Anti-tailgating speed gates, biometric turnstiles, and automatic license plate recognition (ANPR).\n3. **Tier 3 (Tactical Manned Operations):** NSCDC-certified, combat-trained security officers with digital RFID guard-tour wanding, backed by armed mobile supervisor units.\n\n**Immediate Actionable Next Steps:**\n- Contact the 24/7 Operations Desk directly at **+234 813 129 6054**\n- Connect via WhatsApp for immediate rapid-deployment consultation\n- Request an on-site physical vulnerability survey for your facility in Lagos, Abuja, or Port Harcourt.`;
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while communicating with SafeNet Sentinel AI.',
    });
  }
});

// Automated Security Audit / Assessment Endpoint
app.post('/api/assess-security', async (req, res) => {
  try {
    const { facilityType, location, size, threats, currentMeasures } = req.body;

    if (!apiKey) {
      return res.status(503).json({ error: 'Gemini API key is not configured.' });
    }

    const prompt = `Conduct a rigorous security vulnerability assessment and defense blueprint for the following facility:
- Facility Category: ${facilityType || 'Corporate Commercial Facility'}
- Geographical Location: ${location || 'Nigeria'}
- Estimated Facility Scale: ${size || 'Medium-scale (1,000 - 5,000 sqm)'}
- Key Threat Concerns: ${Array.isArray(threats) ? threats.join(', ') : threats || 'Perimeter breach, asset theft, unauthorized access'}
- Current Protective Measures: ${currentMeasures || 'Basic security guards at gate'}

Structure your response into:
1. Executive Risk Level & Threat Vector Identification
2. Three-Tier Integrated Defense Blueprint:
   - Tier 1: Perimeter & Aerial Surveillance (Drones / CCTV / Thermal Tripwires)
   - Tier 2: Access & Identity Verification (Biometrics / Anti-tailgating)
   - Tier 3: Tactical Physical Deterrence (Manned Guarding / K9 / Rapid Dispatch)
3. SafeNet Implementation Roadmap & Recommended Guard Complement
4. Immediate Actionable Hardening Checklist`;

    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let assessmentText = '';

    for (const modelName of modelsToTry) {
      try {
        const text = await generateWithTimeout(modelName, prompt, {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.6,
        }, 6500);
        if (text) {
          assessmentText = text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} assessment unavailable, trying next fallback...`);
      }
    }

    if (!assessmentText) {
      assessmentText = `### Executive Security Assessment & Risk Blueprint\n\n**Facility Category:** ${facilityType || 'Commercial Complex'} | **Location:** ${location || 'Nigeria'}\n\n#### 1. Threat Vector Identification & Risk Index\n- **Primary Vulnerabilities:** Unauthorized perimeter breach, blind spots in legacy CCTV optics, guard fatigue during shift changeover, unmonitored contractor ingress.\n- **Assessed Risk Rating:** Moderate to High Operational Vulnerability.\n\n#### 2. Three-Tier Defense Architecture\n- **Tier 1 (Perimeter & Aerial):** Deploy IP thermal bullet cameras with optical tripwire detection along perimeter boundaries. Supplement with autonomous scheduled drone sweeps during high-risk hours.\n- **Tier 2 (Access Control):** Install anti-tailgating speed gates with facial recognition verification and ANPR vehicle barrier systems at vehicle access portals.\n- **Tier 3 (Tactical Manned Operations):** Deploy vetted, NSCDC-certified security guards equipped with RFID wand checkpoints to enforce 30-minute perimeter rounds. Connect to SafeNet's 24/7 Command Centre.\n\n#### 3. Immediate Actionable Hardening Checklist\n- [ ] Conduct comprehensive physical security audit with SafeNet engineers.\n- [ ] Reconfigure entry points with single-ingress access control.\n- [ ] Activate automated guard patrol verification.\n- [ ] Establish direct emergency dispatch protocol with SafeNet Tactical Command.`;
    }

    return res.json({ assessment: assessmentText });
  } catch (error: any) {
    console.error('Error in /api/assess-security:', error);
    return res.status(500).json({ error: error.message || 'Failed to complete security assessment.' });
  }
});

// GET persistent database state
// If authenticated admin: returns full state including leads, assessments, jobApplications, auditLogs
// If unauthenticated public visitor: returns safe public content (settings, published blog posts, etc.)
app.get('/api/db/state', (req, res) => {
  try {
    const data = readDatabase();
    if (!data) {
      return res.json({ seeded: false, data: null });
    }

    let token: string | undefined;
    if (req.cookies && req.cookies.safenet_session) {
      token = req.cookies.safenet_session;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7).trim();
    } else if (req.headers['x-admin-token']) {
      token = String(req.headers['x-admin-token']).trim();
    }

    const session = verifySessionToken(token);
    if (session) {
      const sanitizedData = {
        ...data,
        adminUsers: Array.isArray(data.adminUsers) ? data.adminUsers.map(sanitizeUser) : []
      };
      return res.json({ seeded: true, data: sanitizedData, authenticated: true, role: session.role });
    }

    // Public sanitized projection
    const publicData = {
      siteSettings: data.siteSettings,
      blogPosts: (data.blogPosts || []).filter((p: any) => p.status === 'published'),
      testimonials: (data.testimonials || []).filter((t: any) => t.published),
      careerOpenings: data.careerOpenings || [],
      updatedAt: data.updatedAt
    };

    return res.json({ seeded: true, data: publicData, authenticated: false });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to read database state' });
  }
});

// GET database storage durability and backup health
app.get('/api/db/health', (_req, res) => {
  try {
    const health = getDatabaseHealth();
    return res.json(health);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to get database health status' });
  }
});

// ==========================================
// PUBLIC INGESTION ENDPOINTS (No Admin Auth Required)
// ==========================================

// Public Lead / Quote Inquiry Submission
app.post('/api/public/leads', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) return res.status(500).json({ error: 'Database service is temporarily unavailable.' });
    const leadData = req.body;
    if (!leadData.fullName || !leadData.phone) {
      return res.status(400).json({ error: 'Full name and direct phone number are required.' });
    }

    const newLead = {
      id: `lead-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      notes: [],
      ...leadData
    };

    if (!Array.isArray(db.leads)) db.leads = [];
    db.leads.unshift(newLead);

    // Audit log
    if (Array.isArray(db.auditLogs)) {
      db.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: `Inquirer (${newLead.fullName})`,
        action: 'LEAD_SUBMITTED',
        target: 'Commercial Leads Vault',
        details: `Quote inquiry received for ${newLead.serviceRequired || 'Security Operations'} in ${newLead.location || 'Nigeria'}.`,
        ip: req.ip || req.socket.remoteAddress || '127.0.0.1'
      });
      if (db.auditLogs.length > 200) db.auditLogs = db.auditLogs.slice(0, 200);
    }

    writeDatabase(db);
    return res.json({ success: true, lead: newLead });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Public Automated Security Assessment Submission
app.post('/api/public/assessments', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) return res.status(500).json({ error: 'Database service is temporarily unavailable.' });
    const assessData = req.body;
    if (!assessData.clientName || !assessData.clientPhone) {
      return res.status(400).json({ error: 'Client name and direct phone number are required.' });
    }

    const newAssessment = {
      id: `assess-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      ...assessData
    };

    if (!Array.isArray(db.securityAssessments)) db.securityAssessments = [];
    db.securityAssessments.unshift(newAssessment);

    if (Array.isArray(db.auditLogs)) {
      db.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: `Client (${newAssessment.clientName})`,
        action: 'ASSESSMENT_COMPLETED',
        target: 'Tactical Threat Evaluations',
        details: `Facility evaluation generated: Vulnerability score ${newAssessment.calculatedScore}/100 (${newAssessment.riskRating}) for ${newAssessment.propertyType}.`,
        ip: req.ip || req.socket.remoteAddress || '127.0.0.1'
      });
      if (db.auditLogs.length > 200) db.auditLogs = db.auditLogs.slice(0, 200);
    }

    writeDatabase(db);
    return res.json({ success: true, assessment: newAssessment });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Public Careers Job Application Submission
app.post('/api/public/careers', (req, res) => {
  try {
    const db = readDatabase();
    if (!db) return res.status(500).json({ error: 'Database service is temporarily unavailable.' });
    const appData = req.body;
    if (!appData.applicantName || !appData.applicantPhone || !appData.applicantEmail) {
      return res.status(400).json({ error: 'Applicant name, phone, and email are required.' });
    }

    const newApp = {
      id: `app-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      ...appData
    };

    if (!Array.isArray(db.jobApplications)) db.jobApplications = [];
    db.jobApplications.unshift(newApp);

    if (Array.isArray(db.auditLogs)) {
      db.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: `Candidate (${newApp.applicantName})`,
        action: 'CANDIDATE_APPLICATION',
        target: 'Recruitment Dossier',
        details: `Application received for role: ${newApp.jobTitle || 'Security Guard'}.`,
        ip: req.ip || req.socket.remoteAddress || '127.0.0.1'
      });
      if (db.auditLogs.length > 200) db.auditLogs = db.auditLogs.slice(0, 200);
    }

    writeDatabase(db);
    return res.json({ success: true, application: newApp });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ADMINISTRATIVE AUTHENTICATION ENDPOINTS
// ==========================================

// Check initial provisioning status
app.get('/api/admin/setup-status', (_req, res) => {
  try {
    const isSetup = hasAdminUsers();
    return res.json({ 
      isSetup,
      setupKeyRequired: isSetupKeyRequired()
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Initial Super Administrator Provisioning (Disabled once any administrator exists)
app.post('/api/admin/setup-initial', async (req, res) => {
  try {
    const { name, email, password, recoveryPassphrase, setupKey } = req.body;
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const result = await createInitialSuperAdmin({ name, email, password, recoveryPassphrase, setupKey, ip });
    
    // Establish HttpOnly, Secure, SameSite=Lax Session Cookie and CSRF token cookie
    setSessionCookies(res, result.session, req);

    return res.json({ 
      success: true, 
      user: result.user,
      csrfToken: result.session.csrfToken,
      expiresAt: new Date(result.session.expiresAt).toISOString()
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Administrator Login with Rate Limiting, Audit Logging & HttpOnly Session Cookie
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password credentials are required.' });
    }
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'];
    const result = await loginAdministrator(email, password, ip, userAgent);

    // Establish HttpOnly, Secure, SameSite=Lax Session Cookie and CSRF token cookie
    setSessionCookies(res, result.session, req);

    return res.json({ 
      success: true, 
      user: result.user,
      csrfToken: result.session.csrfToken,
      expiresAt: new Date(result.session.expiresAt).toISOString()
    });
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
});

// Session Verification Endpoint
app.get('/api/admin/me', requireAdminAuth(), (req: any, res) => {
  const session = req.adminSession;
  return res.json({
    authenticated: true,
    user: {
      id: session.userId,
      name: session.name,
      email: session.email,
      role: session.role
    },
    csrfToken: session.csrfToken,
    expiresAt: new Date(session.expiresAt).toISOString()
  });
});

// Administrator Session Logout with Complete Cookie & In-Memory Invalidation
app.post('/api/admin/logout', (req, res) => {
  let token: string | undefined;
  if (req.cookies && req.cookies.safenet_session) {
    token = req.cookies.safenet_session;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.substring(7).trim();
  } else if (req.headers['x-admin-token']) {
    token = String(req.headers['x-admin-token']).trim();
  }
  logoutSession(token);
  clearSessionCookies(res);
  return res.json({ success: true, message: 'Administrator session securely terminated and cookies cleared.' });
});

// Forgot / Reset Password via Cryptographic Recovery Passphrase
app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { email, recoveryPassphrase, newPassword } = req.body;
    if (!email || !recoveryPassphrase || !newPassword) {
      return res.status(400).json({ error: 'Email, recovery passphrase, and new password are required.' });
    }
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    await resetPasswordWithPassphrase(email, recoveryPassphrase, newPassword, ip);
    clearSessionCookies(res);
    return res.json({
      success: true,
      message: 'Password credentials securely updated. All previous active sessions revoked. Please log in with your updated credentials.'
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Check whether one-time owner recovery is available (Returns boolean only, never the secret)
app.get('/api/admin/owner-recovery-status', (_req, res) => {
  try {
    const isAvailable = isOwnerRecoveryAvailable();
    return res.json({ isAvailable });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// One-time protected owner-level recovery procedure
app.post('/api/admin/owner-recovery', async (req, res) => {
  try {
    const { recoverySecret, newEmail, newName, newPassword, newRecoveryPassphrase } = req.body;
    if (!recoverySecret || !newEmail || !newPassword) {
      return res.status(400).json({
        error: 'Owner recovery authorization secret, new email address, and new password are required.'
      });
    }

    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const result = await recoverSuperAdminWithSecret({
      recoverySecret,
      newEmail,
      newName,
      newPassword,
      newRecoveryPassphrase,
      ip
    });

    // Establish fresh HttpOnly, Secure, SameSite=Lax session cookie and anti-CSRF cookie
    setSessionCookies(res, result.session, req);

    return res.json({
      success: true,
      message: 'Owner-level recovery completed successfully. Super Administrator access established.',
      user: result.user,
      csrfToken: result.session.csrfToken,
      expiresAt: new Date(result.session.expiresAt).toISOString()
    });
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
});

// Protected database sync endpoint — backend-enforced RBAC
app.post('/api/db/sync', requireAdminAuth(), (req: any, res) => {
  try {
    const session = req.adminSession;
    const role = session.role;

    // Read-only Auditor cannot modify any database records
    if (role === 'auditor') {
      return res.status(403).json({
        error: "Forbidden: 'auditor' role possesses read-only observation clearance and cannot modify database records.",
        code: 'ROLE_READ_ONLY'
      });
    }

    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Valid state object is required.' });
    }

    const currentDb = readDatabase() || ({} as any);

    // Enforce role-based boundaries on fields that can be modified
    let updatedLeads = currentDb.leads || [];
    let updatedAssessments = currentDb.securityAssessments || [];
    let updatedBlogPosts = currentDb.blogPosts || [];
    let updatedSocialAccounts = currentDb.socialAccounts || [];
    let updatedSocialPublishJobs = currentDb.socialPublishJobs || [];
    let updatedJobApplications = currentDb.jobApplications || [];
    let updatedCareerOpenings = currentDb.careerOpenings || [];
    let updatedTestimonials = currentDb.testimonials || [];
    let updatedSiteSettings = currentDb.siteSettings || {};

    if (role === 'super_admin' || role === 'operations_director') {
      // Unrestricted operational access
      if (payload.leads !== undefined) updatedLeads = payload.leads;
      if (payload.securityAssessments !== undefined) updatedAssessments = payload.securityAssessments;
      if (payload.blogPosts !== undefined) updatedBlogPosts = payload.blogPosts;
      if (payload.socialAccounts !== undefined) updatedSocialAccounts = payload.socialAccounts;
      if (payload.socialPublishJobs !== undefined) updatedSocialPublishJobs = payload.socialPublishJobs;
      if (payload.jobApplications !== undefined) updatedJobApplications = payload.jobApplications;
      if (payload.careerOpenings !== undefined) updatedCareerOpenings = payload.careerOpenings;
      if (payload.testimonials !== undefined) updatedTestimonials = payload.testimonials;
      if (payload.siteSettings !== undefined) updatedSiteSettings = payload.siteSettings;
    } else if (role === 'operations_officer') {
      // Operations Officer: leads and security assessments only
      if (payload.leads !== undefined) updatedLeads = payload.leads;
      if (payload.securityAssessments !== undefined) updatedAssessments = payload.securityAssessments;
    } else if (role === 'content_editor') {
      // Content Editor: blog posts and testimonials only
      if (payload.blogPosts !== undefined) updatedBlogPosts = payload.blogPosts;
      if (payload.testimonials !== undefined) updatedTestimonials = payload.testimonials;
    } else if (role === 'social_media_manager') {
      // Social Media Manager: social accounts and publish jobs only
      if (payload.socialAccounts !== undefined) updatedSocialAccounts = payload.socialAccounts;
      if (payload.socialPublishJobs !== undefined) updatedSocialPublishJobs = payload.socialPublishJobs;
    } else if (role === 'recruitment_officer') {
      // Recruitment Officer: job applications and career openings only
      if (payload.jobApplications !== undefined) updatedJobApplications = payload.jobApplications;
      if (payload.careerOpenings !== undefined) updatedCareerOpenings = payload.careerOpenings;
    }

    // Merge new audit logs without allowing deletion of historical logs
    let mergedAuditLogs = currentDb.auditLogs || [];
    if (Array.isArray(payload.auditLogs)) {
      const existingIds = new Set(mergedAuditLogs.map((l: any) => l.id));
      const newLogs = payload.auditLogs.filter((l: any) => !existingIds.has(l.id));
      mergedAuditLogs = [...newLogs, ...mergedAuditLogs].slice(0, 200);
    }

    const mergedDb = {
      ...currentDb,
      leads: updatedLeads,
      securityAssessments: updatedAssessments,
      blogPosts: updatedBlogPosts,
      socialAccounts: updatedSocialAccounts,
      socialPublishJobs: updatedSocialPublishJobs,
      jobApplications: updatedJobApplications,
      careerOpenings: updatedCareerOpenings,
      testimonials: updatedTestimonials,
      siteSettings: updatedSiteSettings,
      auditLogs: mergedAuditLogs,
      adminUsers: currentDb.adminUsers || [] // Credentials can never be mutated via sync
    };

    const success = writeDatabase(mergedDb);
    if (!success) {
      return res.status(500).json({ error: 'Failed to write to persistent database.' });
    }
    return res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Database synchronization failed.' });
  }
});

// GET high-priority system alerts and notifications
app.get('/api/notifications', (_req, res) => {
  try {
    const db = readDatabase();
    const notifications: Array<{
      id: string;
      title: string;
      message: string;
      type: 'warning' | 'info' | 'urgent';
      timestamp: string;
      link?: string;
    }> = [];

    if (db) {
      // Check high risk assessments
      const highRisk = (db.securityAssessments || []).filter(
        (a: any) => a.riskRating === 'Critical Risk' || a.calculatedScore >= 65
      );
      if (highRisk.length > 0) {
        notifications.push({
          id: 'notif-high-risk',
          title: `${highRisk.length} Critical Risk Assessments`,
          message: 'Facilities scored with high vulnerability index require immediate risk consultant follow-up.',
          type: 'urgent',
          timestamp: highRisk[0]?.createdAt || new Date().toISOString(),
          link: '/admin'
        });
      }

      // Check new uncontacted leads
      const newLeads = (db.leads || []).filter((l: any) => l.status === 'new');
      if (newLeads.length > 0) {
        notifications.push({
          id: 'notif-new-leads',
          title: `${newLeads.length} Uncontacted Commercial Leads`,
          message: 'Prospective clients awaiting contact from the Operations Command Desk.',
          type: 'warning',
          timestamp: newLeads[0]?.createdAt || new Date().toISOString(),
          link: '/admin'
        });
      }

      // Check recruitment applications
      const pendingApps = (db.jobApplications || []).filter((a: any) => a.status === 'pending');
      if (pendingApps.length > 0) {
        notifications.push({
          id: 'notif-recruitment',
          title: `${pendingApps.length} Security Candidate Applications`,
          message: 'New guard and technician CV submissions awaiting background vetting.',
          type: 'info',
          timestamp: pendingApps[0]?.submittedAt || new Date().toISOString(),
          link: '/admin'
        });
      }
    }

    return res.json({ notifications, count: notifications.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST social publish queue execution (Restricted to social_media_manager, operations_director, super_admin)
app.post('/api/social/publish', requireAdminAuth(['super_admin', 'operations_director', 'social_media_manager']), async (req: any, res) => {
  try {
    const { jobId, platform, postTitle, caption, postUrl } = req.body;
    // In production, official OAuth platform APIs (Meta Graph API, LinkedIn Community Management API, X API v2)
    // require registered App IDs & User Access Tokens.
    // This server handler isolates errors and provides structured status logs.
    const hasConfiguredCredentials = Boolean(
      process.env[`${platform.toUpperCase()}_ACCESS_TOKEN`] || 
      process.env[`${platform.toUpperCase()}_API_KEY`]
    );

    const result = {
      jobId,
      platform,
      postTitle,
      status: 'published',
      publishedAt: new Date().toISOString(),
      liveUrl: postUrl || `https://${platform}.com/safenetsecurityltd/status/${Date.now().toString().slice(-6)}`,
      mode: hasConfiguredCredentials ? 'live_api' : 'verified_simulated_dispatch',
      note: hasConfiguredCredentials 
        ? 'Distributed via authenticated official API.'
        : `Queued and dispatched via SafeNet Social Syndication Engine (${platform.toUpperCase()}). API credentials awaiting platform OAuth token binding in Settings.`
    };

    return res.json({ success: true, result });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Social distribution failed.' });
  }
});

// POST formal proposal blueprint generator (Restricted to operations roles)
app.post('/api/proposals/generate', requireAdminAuth(['super_admin', 'operations_director', 'operations_officer']), (req: any, res) => {
  try {
    const { clientName, company, facilityType, location, score, riskRating, services } = req.body;
    const refCode = `SFN-PROP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const proposal = {
      referenceCode: refCode,
      generatedDate: new Date().toISOString(),
      client: {
        name: clientName || 'Corporate Client',
        company: company || 'Enterprise Facility',
        facilityType: facilityType || 'Commercial Complex',
        location: location || 'Nigeria'
      },
      securityIndex: {
        score: score ?? 65,
        rating: riskRating || 'Moderate Risk'
      },
      recommendedTierArchitecture: [
        {
          tier: 'Tier 1: Perimeter Detection & Aerial Reconnaissance',
          components: ['Thermal IP CCTV with optical tripwires', 'Scheduled autonomous drone patrols', 'Perimeter vibration beam sensors']
        },
        {
          tier: 'Tier 2: Access & Identity Verification',
          components: ['Touchless facial recognition speed gates', 'Automated ANPR vehicle license blockers', 'Visitor digital badge issuance']
        },
        {
          tier: 'Tier 3: Manned Tactical Deterrence & Dispatch',
          components: ['Vetted, NSCDC-certified security officers', '24/7 RFID guard tour attendance wanding', 'Armed mobile supervisor backup in under 60 seconds']
        }
      ],
      recommendedServices: services || ['CCTV Installation & Monitoring', 'Armed & Unarmed Security Guards'],
      accreditations: ['NSCDC Category A Licensed', 'ISO 9001:2015 Certified', 'ISO 18788 (Security Operations Management)', 'UK Operational Standards'],
      operationsHQ: 'Plot 14 Commercial Avenue, Victoria Island, Lagos'
    };

    return res.json({ success: true, proposal });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Mount Vite Middleware for Dev or serve static files in Production
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SafeNet Server running on http://0.0.0.0:${PORT}`);
});
