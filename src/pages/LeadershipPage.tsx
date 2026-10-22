import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LeadershipSection } from '../components/team/LeadershipSection';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  Mail, 
  Building2, 
  Lock,
  FileCheck
} from 'lucide-react';

export const LeadershipPage: React.FC = () => {
  const { siteSettings, navigate } = useApp();

  useEffect(() => {
    document.title = 'Executive Directorate & Leadership — SafeNet Security Solutions Ltd';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Leadership Hero Banner */}
      <div className="relative py-16 sm:py-20 lg:py-24 border-b border-slate-800 overflow-hidden bg-slate-950">
        
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>SafeNet Security Solutions Ltd · Directorate</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15]">
              Executive Directorate & Senior Leadership
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Our board and executive leadership unite British criminal psychology, UK investigative governance, ASIS-certified engineering expertise, and seasoned Nigerian security operations to deliver zero-compromise protection for critical infrastructure, corporate assets, and personnel.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NSCDC Category A Licensed</span>
              </div>
              <span className="text-slate-700">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ASIS International Certified</span>
              </div>
              <span className="text-slate-700">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ISPON & NIIS Registered</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Interactive Leadership Gallery */}
      <LeadershipSection isHomePage={false} showHeaderCta={false} />

      {/* Corporate Governance & Directorate Charter */}
      <div className="py-16 sm:py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Governance Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              The SafeNet Directorate Standards of Practice
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every member of our senior management is bound by international compliance codes, anti-corruption policies, and strict non-disclosure obligations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-display font-bold text-white">
                Intelligence-Led Accountability
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct supervision by PhD criminal investigators ensures that operational protocols exceed standard industry guard deployment, prioritizing pre-incident deterrence and forensic audit readiness.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-amber-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-display font-bold text-white">
                Dual-Jurisdiction Regulatory Rigor
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Led by our UK- and Nigerian-qualified Legal & Strategy directorate, our contracts, guard indemnities, and guard force regulations comply with international labor conventions and Nigerian statutory codes.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-amber-400">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-display font-bold text-white">
                Field-Tested Engineering Standards
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Engineered surveillance, pipeline intrusion detection, and maritime security craft are vetted by certified mechanical engineers and ASIS security specialists before client deployment.
              </p>
            </div>

          </div>

          {/* Direct Directorate Contact CTA Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-950 border border-blue-500/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 max-w-2xl">
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                Engage Our Executive Directorate on Strategic Security Mandates
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                For confidential enterprise evaluations, critical infrastructure security audits, or maritime defense briefings, our executive leadership is available for consultation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('/contact')}
                className="px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Direct Directorate Inquiry
              </button>
              <button
                onClick={() => navigate('/request-quote')}
                className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Request Enterprise Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
