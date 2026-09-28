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
SafeNet Security Solutions Ltd is Nigeria's premier corporate, industrial, and infrastructure security engineering contractor. SafeNet operates to international UK security intelligence standards, is fully licensed by the Nigeria Security and Civil Defence Corps (NSCDC, Category A), and is certified under ISO 9001:2015 and ISO 18788 (Security Operations Management).`;

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
    const { facilityType, location, size, threats, currentMeasures } = req.body || {};

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

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.6,
        },
      });
    } catch (primaryErr: any) {
      console.warn('Gemini 3.8 Flash busy, falling back to gemini-3.1-flash-lite:', primaryErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.6,
        },
      });
    }

    return res.status(200).json({ assessment: response.text });
  } catch (error: any) {
    console.error('Error in /api/assess-security handler:', error);
    return res.status(500).json({ error: error.message || 'Failed to complete security assessment.' });
  }
}
