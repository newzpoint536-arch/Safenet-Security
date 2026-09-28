import React from 'react';
import { useApp } from '../../context/AppContext';
import { PhoneCall, FileSearch, ShieldCheck, Activity, ArrowRight } from 'lucide-react';

export const OperationalProcess: React.FC = () => {
  const { navigate } = useApp();

  const steps = [
    {
      number: '01',
      title: 'Initial Consultation & Needs Assessment',
      icon: PhoneCall,
      description: 'We listen to your operational footprint, threat history, and commercial objectives. Our senior advisors define scope, compliance criteria, and preliminary security parameters.',
      timeline: 'Within 24 Hours'
    },
    {
      number: '02',
      title: 'Comprehensive Risk Assessment & Site Survey',
      icon: FileSearch,
      description: 'Certified physical security consultants conduct an on-site physical vulnerability assessment (PSVA), analyzing ingress routes, blind spots, lighting, and electronic access vulnerabilities.',
      timeline: 'Days 2–4'
    },
    {
      number: '03',
      title: 'Customized Security Plan & Deployment',
      icon: ShieldCheck,
      description: 'We engineer tailored standing operating procedures (SOPs), install certified hardware, and deploy strictly vetted, uniformed security officers equipped with digital patrol verification wands.',
      timeline: 'Days 5–7'
    },
    {
      number: '04',
      title: 'Ongoing Monitoring, Supervision & Continuous Improvement',
      icon: Activity,
      description: 'Continuous 24/7 central command monitoring, unannounced supervisory inspections, weekly digital attendance reporting, and quarterly risk reviews to adapt to emerging threats.',
      timeline: 'Continuous 24/7'
    }
  ];

  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Standard Operating Procedure
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            How SafeNet Protects Your Operations
          </h2>
          <p className="text-sm text-slate-400">
            A disciplined, four-phase deployment methodology ensuring seamless integration, total accountability, and proactive threat deterrence.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-slate-950/80 border border-slate-800 rounded-lg p-6 relative flex flex-col justify-between hover:border-amber-500/40 transition-colors group"
              >
                {/* Step indicator header */}
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                    <span className="font-mono-numbers text-2xl font-black text-amber-400">
                      {step.number}
                    </span>
                    <div className="w-9 h-9 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-amber-400 transition-colors">
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="text-base font-display font-bold text-white mb-2 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">{step.timeline}</span>
                  <span className="text-amber-400/80 font-medium">Phase {idx + 1}</span>
                </div>
              </div>
            );
          })}

        </div>

        {/* Bottom Action */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/request-quote')}
            className="px-6 py-3 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-md hover:shadow-amber-500/20 inline-flex items-center gap-2"
          >
            <span>Initiate Phase 01: Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
