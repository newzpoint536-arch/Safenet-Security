import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MapPin, Calendar, CheckCircle2, ArrowRight, Layers } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects, caseStudies, navigate } = useApp();
  const [activeTab, setActiveTab] = useState<'projects' | 'case-studies'>('projects');

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-16">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Operational Track Record</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Featured Deployments & Verified Case Studies
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Real security outcomes executed across commercial towers in Lagos, coastal residential communities in Lekki, offshore terminals, and energy corridors in the Niger Delta.
        </p>

        {/* Tab Toggle */}
        <div className="pt-4 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
              activeTab === 'projects'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            Major Facility Deployments ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('case-studies')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
              activeTab === 'case-studies'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            In-Depth Case Studies ({caseStudies.length})
          </button>
        </div>
      </div>

      {/* Main Content View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'projects' ? (
          <div className="space-y-12">
            {projects.map((proj) => (
              <div 
                key={proj.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900" />
                </div>

                <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="font-semibold text-amber-400">{proj.industry}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        {proj.location}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {proj.date}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-display font-bold text-white leading-snug">
                      {proj.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Scope of Deployment
                      </div>
                      <p className="text-xs text-slate-300 font-mono">
                        {proj.scope}
                      </p>
                    </div>

                    {/* Results achieved */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                        Verified Operational Outcomes
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {proj.results.map((res, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                      {proj.services.map((srv, idx) => (
                        <span key={idx} className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {srv}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => navigate('/request-quote')}
                      className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded transition-colors whitespace-nowrap"
                    >
                      Request Similar Deployment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {caseStudies.map((cs) => (
              <div
                key={cs.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className="font-semibold text-amber-400">{cs.industry}</span>
                      <span>·</span>
                      <span>{cs.location}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                      {cs.title}
                    </h2>
                  </div>
                  <div className="bg-emerald-950/60 border border-emerald-800/80 px-4 py-2 rounded-lg text-emerald-400 font-mono font-bold text-xs sm:text-sm text-center shrink-0">
                    {cs.metric}
                  </div>
                </div>

                {/* 6-Phase Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
                      01. The Challenge
                    </div>
                    <p className="text-slate-300 leading-relaxed">{cs.challenge}</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
                      02. Risk Assessment
                    </div>
                    <p className="text-slate-300 leading-relaxed">{cs.riskAssessment}</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
                      03. Security Strategy
                    </div>
                    <p className="text-slate-300 leading-relaxed">{cs.securityStrategy}</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
                      04. Deployment
                    </div>
                    <p className="text-slate-300 leading-relaxed">{cs.deployment}</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
                      05. Central Monitoring
                    </div>
                    <p className="text-slate-300 leading-relaxed">{cs.monitoring}</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                      06. Final Outcome
                    </div>
                    <p className="text-slate-300 leading-relaxed">{cs.outcome}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    Technology: {cs.technology.join(', ')}
                  </div>
                  <button
                    onClick={() => navigate('/request-quote')}
                    className="font-bold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Schedule Technical Case Briefing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
