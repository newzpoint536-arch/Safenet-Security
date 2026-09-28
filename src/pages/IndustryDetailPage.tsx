import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  Users, 
  Clock, 
  ArrowRight, 
  CheckCircle 
} from 'lucide-react';

export const IndustryDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { industries, navigate } = useApp();
  const industry = industries.find(ind => ind.slug === slug);

  if (!industry) {
    return (
      <div className="py-20 text-center max-w-xl mx-auto space-y-4">
        <h2 className="text-2xl font-display font-bold text-white">Sector Not Found</h2>
        <p className="text-slate-400 text-sm">The requested industry defense profile does not exist.</p>
        <button
          onClick={() => navigate('/industries')}
          className="px-4 py-2 text-xs bg-amber-400 text-slate-950 font-bold rounded"
        >
          View All Industries
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-16">
      
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Building2 className="w-4 h-4" />
          <span>Sector Security Blueprint</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
          {industry.name} Security Architecture
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          {industry.tagline} — {industry.description}
        </p>
      </div>

      {/* The 6-Stage Defense Paradigm: Threat -> Risk -> Solution -> Technology -> Personnel -> Response */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. Threat */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
              <ShieldAlert className="w-4 h-4" />
              <span>01. The Threat Profile</span>
            </div>
            <h3 className="text-base font-display font-bold text-white">
              Specific Vectors Faced
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {industry.threat}
            </p>
          </div>

          {/* 2. Commercial Risk */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>02. Commercial & Operational Risk</span>
            </div>
            <h3 className="text-base font-display font-bold text-white">
              Potential Consequences
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {industry.risk}
            </p>
          </div>

          {/* 3. The SafeNet Solution */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>03. Engineered Solution</span>
            </div>
            <h3 className="text-base font-display font-bold text-white">
              Protective Philosophy
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {industry.solution}
            </p>
          </div>

          {/* 4. Technology Deployed */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Cpu className="w-4 h-4" />
              <span>04. Integrated Technology</span>
            </div>
            <h3 className="text-base font-display font-bold text-white">
              Hardware & Systems
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {industry.technology.map((t, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Personnel Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Users className="w-4 h-4" />
              <span>05. Personnel Requirements</span>
            </div>
            <h3 className="text-base font-display font-bold text-white">
              Officer Caliber & Attire
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {industry.personnel}
            </p>
          </div>

          {/* 6. Tactical Response */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Clock className="w-4 h-4" />
              <span>06. Intervention & Dispatch</span>
            </div>
            <h3 className="text-base font-display font-bold text-white">
              Emergency Escalation
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {industry.response}
            </p>
          </div>

        </div>
      </div>

      {/* Quote Callout Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-display font-bold text-white">
              Fortify Your {industry.name} Operations
            </h3>
            <p className="text-xs text-slate-400">
              Our sector specialists are prepared to review your facility blueprints or schedule an on-site physical survey.
            </p>
          </div>
          <button
            onClick={() => navigate(`/request-quote?industry=${encodeURIComponent(industry.name)}`)}
            className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <span>Request {industry.name} Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
