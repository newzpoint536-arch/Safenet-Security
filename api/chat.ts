import { GoogleGenAI } from '@google/genai';

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

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { messages, context } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!apiKey) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables.',
      });
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const route = req.body?.route || req.body?.currentPage || context?.route || context?.currentPage || '/';
    const pageTitle = req.body?.pageTitle || context?.pageTitle || (route !== '/' ? route : 'Central Command Portal');
    const pageCategory = context?.pageCategory || (route.includes('maritime') ? 'Offshore & Coastal Asset Protection' : 'Corporate Security Operations');

    let enrichedInstruction = SYSTEM_INSTRUCTION;
    if (context || req.body?.pageTitle || req.body?.route) {
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
=============================================================`;
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: enrichedInstruction,
          temperature: 0.7,
        },
      });
    } catch (primaryErr: any) {
      console.warn('Gemini 3.8 Flash busy, falling back to gemini-3.1-flash-lite:', primaryErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: {
          systemInstruction: enrichedInstruction,
          temperature: 0.7,
        },
      });
    }

    const reply = response.text || 'SafeNet Command has received your signal. Please elaborate on your security requirements.';
    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Error in /api/chat handler:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while communicating with SafeNet Sentinel AI.',
    });
  }
}
