import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Building, 
  Eye, 
  Lock, 
  Users, 
  FileText,
  Bot,
  Sparkles
} from 'lucide-react';

export const SecurityAssessmentPage: React.FC = () => {
  const { addSecurityAssessment, navigate, openAiChatWithPrompt } = useApp();

  const [step, setStep] = useState(1);

  // Form Fields
  const [propertyType, setPropertyType] = useState('Commercial Multi-Storey Tower');
  const [industry, setIndustry] = useState('Corporate Organizations');
  const [location, setLocation] = useState('Lagos (Victoria Island / Ikoyi / Lekki)');
  const [facilitiesCount, setFacilitiesCount] = useState('1 Facility');
  
  const [existingPersonnel, setExistingPersonnel] = useState('In-house guards without digital patrol logging');
  const [cctvCoverage, setCctvCoverage] = useState('Partial analog CCTV without central monitoring');
  const [accessControl, setAccessControl] = useState('Manual visitor notebook at gate');
  const [alarmSystems, setAlarmSystems] = useState('No active perimeter alarm or panic buttons');
  const [fleetSize, setFleetSize] = useState('1–5 Executive/Operational Vehicles');
  
  const [primaryConcerns, setPrimaryConcerns] = useState<string[]>([
    'Unauthorized visitor intrusion',
    'Guard sleeping on night shifts'
  ]);

  // Contact details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCompany, setClientCompany] = useState('');

  // Results State
  const [isCalculated, setIsCalculated] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);
  const [riskRating, setRiskRating] = useState<'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk'>('Moderate Risk');
  const [identifiedGaps, setIdentifiedGaps] = useState<string[]>([]);
  const [recommendedServices, setRecommendedServices] = useState<string[]>([]);

  const toggleConcern = (concern: string) => {
    if (primaryConcerns.includes(concern)) {
      setPrimaryConcerns(primaryConcerns.filter(c => c !== concern));
    } else {
      setPrimaryConcerns([...primaryConcerns, concern]);
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) return;

    let score = 25; // baseline vulnerability score
    const gaps: string[] = [];
    const recs: string[] = [];

    // Personnel vulnerability
    if (existingPersonnel.includes('No dedicated guards') || existingPersonnel.includes('In-house guards')) {
      score += 20;
      gaps.push('Lack of digital patrol verification and unannounced night supervision');
      recs.push('Armed & Unarmed Security Guards with RFID Patrol Verification');
    }

    // CCTV vulnerability
    if (cctvCoverage.includes('No CCTV') || cctvCoverage.includes('Partial analog')) {
      score += 25;
      gaps.push('Perimeter blind spots and absence of 24/7 centralized monitoring station connection');
      recs.push('CCTV Installation & Monitoring with AI Tripwire Analytics');
    }

    // Access control vulnerability
    if (accessControl.includes('Manual visitor notebook') || accessControl.includes('Open gate')) {
      score += 20;
      gaps.push('Unvetted visitor access and tailgating risks at main entrance');
      recs.push('Access Control Systems (Biometric Speed Gates & ANPR Vehicle Barriers)');
    }

    // Alarm vulnerability
    if (alarmSystems.includes('No active perimeter alarm')) {
      score += 15;
      gaps.push('Zero active laser or vibration warning prior to physical wall breaches');
      recs.push('Alarm System Installation with Dual-Path Cellular Uplinks');
    }

    // Concerns multiplier
    if (primaryConcerns.length >= 3) {
      score += 10;
    }

    const finalScore = Math.min(95, score);
    let rating: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk' = 'Moderate Risk';
    if (finalScore >= 75) rating = 'Critical Risk';
    else if (finalScore >= 55) rating = 'High Risk';
    else if (finalScore >= 35) rating = 'Moderate Risk';
    else rating = 'Low Risk';

    setCalculatedScore(finalScore);
    setRiskRating(rating);
    setIdentifiedGaps(gaps);
    setRecommendedServices(recs);
    setIsCalculated(true);

    // Save to AppContext & Leads CRM
    addSecurityAssessment({
      clientName,
      clientEmail,
      clientPhone,
      clientCompany,
      propertyType,
      industry,
      location,
      facilitiesCount,
      existingPersonnel,
      cctvCoverage,
      accessControl,
      alarmSystems,
      fleetSize,
      primaryRiskConcerns: primaryConcerns,
      calculatedScore: finalScore,
      riskRating: rating,
      identifiedGaps: gaps,
      recommendedServices: recs
    });
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-12">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Cpu className="w-4 h-4" />
          <span>Interactive Risk Diagnostic Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
          Facility Security & Threat Assessment
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Evaluate physical security gaps, CCTV blind spots, gate access bottlenecks, and response readiness across your Nigerian commercial or residential property.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isCalculated ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-8">
            
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs">
              <span className="font-semibold text-amber-400">Step 0{step} of 03</span>
              <span className="text-slate-400">
                {step === 1 && 'Facility Profile'}
                {step === 2 && 'Existing Defenses & Systems'}
                {step === 3 && 'Concerns & Diagnostic Report'}
              </span>
            </div>

            {/* STEP 1: Facility Profile */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Property / Facility Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Commercial Multi-Storey Tower">Commercial Multi-Storey Tower (Headquarters / Corporate)</option>
                    <option value="Gated Residential Estate">Gated Residential Estate / CDA Community</option>
                    <option value="Bank Branch / Cash Depot">Bank Branch / Cash Depot / Financial Center</option>
                    <option value="Industrial Factory / Manufacturing Plant">Industrial Factory / Manufacturing Plant</option>
                    <option value="Warehouse / Logistics Fulfillment Center">Warehouse / Logistics Fulfillment Center</option>
                    <option value="Oil & Gas Terminal / Tank Farm">Oil & Gas Terminal / Tank Farm / Pipeline Right-of-Way</option>
                    <option value="Private Luxury Residence / Villa">Private Luxury Residence / Villa</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Industry Sector
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Corporate Organizations">Corporate Organizations</option>
                      <option value="Banks & Financial Institutions">Banks & Financial Institutions</option>
                      <option value="Residential Estates">Residential Estates & CDAs</option>
                      <option value="Oil & Gas Facilities">Oil & Gas Facilities</option>
                      <option value="Maritime & Ports">Maritime & Ports</option>
                      <option value="Industrial & Manufacturing">Industrial & Manufacturing</option>
                      <option value="Hospitality & Leisure">Hospitality & Leisure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Location in Nigeria
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Lagos (Victoria Island / Ikoyi / Lekki)">Lagos (Victoria Island / Ikoyi / Lekki)</option>
                      <option value="Lagos (Ikeja / Mainland / Industrial)">Lagos (Ikeja / Mainland / Industrial)</option>
                      <option value="Abuja (FCT / Central Area)">Abuja (FCT / Central Area)</option>
                      <option value="Rivers State (Port Harcourt / Onne)">Rivers State (Port Harcourt / Onne)</option>
                      <option value="Delta State (Warri / Coastal)">Delta State (Warri / Coastal)</option>
                      <option value="Ogun State (Sagamu / Agbara Industrial)">Ogun State (Industrial Zones)</option>
                      <option value="Other Nigerian State">Other Nigerian State</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Number of Facilities / Sites to Secure
                  </label>
                  <select
                    value={facilitiesCount}
                    onChange={(e) => setFacilitiesCount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="1 Single Facility">1 Single Facility</option>
                    <option value="2 to 5 Facilities">2 to 5 Facilities</option>
                    <option value="6 to 20 Dispersed Branches">6 to 20 Dispersed Branches</option>
                    <option value="Over 20 Facilities Nationwide">Over 20 Facilities Nationwide</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all flex items-center gap-2"
                  >
                    <span>Proceed to Defense Systems</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Defenses & Electronic Systems */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Current Guarding Setup
                  </label>
                  <select
                    value={existingPersonnel}
                    onChange={(e) => setExistingPersonnel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="No dedicated guards currently">No dedicated security guards currently</option>
                    <option value="In-house guards without digital patrol logging">In-house security guards without digital patrol logging</option>
                    <option value="External contractor guards (unreliable supervision / poor attendance)">External contractor guards (unreliable supervision / poor attendance)</option>
                    <option value="Professional security company with electronic RFID verification">Professional security company with electronic RFID verification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    CCTV Surveillance Status
                  </label>
                  <select
                    value={cctvCoverage}
                    onChange={(e) => setCctvCoverage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="No CCTV cameras installed">No CCTV cameras installed</option>
                    <option value="Partial analog CCTV without central monitoring">Partial analog CCTV without central monitoring</option>
                    <option value="IP cameras installed but local recording only (no live oversight)">IP cameras installed but local recording only (no live oversight)</option>
                    <option value="Full enterprise AI cameras linked to 24/7 central monitoring station">Full enterprise AI cameras linked to 24/7 central monitoring station</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Access Control & Visitor Verification
                  </label>
                  <select
                    value={accessControl}
                    onChange={(e) => setAccessControl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Open gate / manual visitor notebook at gate">Open gate / manual visitor notebook paper register</option>
                    <option value="RFID keycards only (frequent badge sharing / tailgating)">RFID keycards only (frequent badge sharing / tailgating)</option>
                    <option value="Touchless biometric facial recognition & anti-tailgating turnstiles">Touchless biometric facial recognition & anti-tailgating turnstiles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Perimeter Intrusion Alarm Systems
                  </label>
                  <select
                    value={alarmSystems}
                    onChange={(e) => setAlarmSystems(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="No active perimeter alarm or panic buttons">No active perimeter alarm or panic buttons</option>
                    <option value="Local sirens only (not connected to rapid response dispatch)">Local sirens only (not connected to rapid response dispatch)</option>
                    <option value="Dual-path monitored perimeter beams & silent duress buttons">Dual-path monitored perimeter beams & silent duress buttons</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all flex items-center gap-2"
                  >
                    <span>Proceed to Final Risk Evaluation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Concerns & Contact Details */}
            {step === 3 && (
              <form onSubmit={handleCalculate} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Select Your Primary Security Concerns (Check all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      'Unauthorized visitor intrusion',
                      'Guard sleeping on night shifts',
                      'Perimeter wall breach & blind spots',
                      'Armed robbery / violent home invasion',
                      'Internal employee / contractor theft',
                      'Executive kidnapping during transit',
                      'Lack of emergency response backup',
                      'Slow visitor verification bottlenecks'
                    ].map((concern) => (
                      <button
                        type="button"
                        key={concern}
                        onClick={() => toggleConcern(concern)}
                        className={`text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                          primaryConcerns.includes(concern)
                            ? 'bg-amber-400/10 border-amber-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{concern}</span>
                        {primaryConcerns.includes(concern) && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <div className="text-xs font-semibold text-white uppercase tracking-wider">
                    Recipient Information for Official Diagnostic Report
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Chief Adeleke"
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Company / Organization (Optional)
                      </label>
                      <input
                        type="text"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                        placeholder="e.g. Apex Holdings Ltd"
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Direct Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+234..."
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-lg flex items-center gap-2"
                  >
                    <span>Generate Risk Diagnostic Report</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

          </div>
        ) : (
          /* RESULT REPORT VIEW */
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-8 animate-in fade-in duration-300">
            
            <div className="text-center space-y-2 pb-6 border-b border-slate-800">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Assessment Results for {clientName} ({clientCompany || propertyType})
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                Calculated Facility Threat Profile
              </h2>
            </div>

            {/* Score & Rating Pill-less Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="text-xs uppercase font-semibold text-slate-400">
                  Overall Vulnerability Index
                </div>
                <div className="font-mono-numbers text-5xl font-black text-white mt-1">
                  {calculatedScore}<span className="text-2xl text-slate-500">/100</span>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-800 sm:pl-8 space-y-1">
                <div className="text-xs uppercase font-semibold text-slate-400">
                  Assigned Risk Rating
                </div>
                <div className={`text-2xl font-display font-black ${
                  riskRating === 'Critical Risk' ? 'text-red-400' :
                  riskRating === 'High Risk' ? 'text-amber-400' :
                  riskRating === 'Moderate Risk' ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {riskRating}
                </div>
                <div className="text-xs text-slate-400">
                  Facility: {propertyType} · {location}
                </div>
              </div>
            </div>

            {/* Identified Gaps */}
            <div className="space-y-3">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Critical Vulnerabilities Identified</span>
              </h3>
              <div className="space-y-2">
                {identifiedGaps.map((gap, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800/80 p-3 rounded text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Solutions */}
            <div className="space-y-3">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Recommended SafeNet Solutions</span>
              </h3>
              <div className="space-y-2">
                {recommendedServices.map((svc, i) => (
                  <div key={i} className="bg-slate-950 border border-slate-800/80 p-3 rounded text-xs text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{svc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-slate-400 leading-relaxed italic border-t border-slate-800 pt-4">
              * Note: This preliminary automated score is an indicative diagnostic based on user-supplied criteria. It does not replace an official on-site Physical Security Vulnerability Assessment (PSVA) conducted by SafeNet certified security consultants.
            </p>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => { setIsCalculated(false); setStep(1); }}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Retake Diagnostic
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const prompt = `I just conducted a facility vulnerability diagnostic on SafeNet:
- Facility: ${propertyType} (${industry}) located in ${location}
- Vulnerability Score: ${calculatedScore}/100 (${riskRating})
- Identified Gaps: ${identifiedGaps.join(', ')}
- Recommended Systems: ${recommendedServices.join(', ')}
Could you formulate a detailed tactical deployment roadmap, guard shift structure, and prioritized hardening recommendations for my facility?`;
                    openAiChatWithPrompt(prompt);
                  }}
                  className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-amber-400/40 text-amber-300 font-bold text-xs sm:text-sm rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>Audit With Sentinel AI</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  onClick={() => navigate('/request-quote')}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded transition-all shadow-md cursor-pointer"
                >
                  Request Priority Site Survey & Quote
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
