import React from 'react';
import { useApp } from '../../context/AppContext';
import { Globe2, ShieldCheck, Zap, Laptop, FileCheck, Users, ArrowRight } from 'lucide-react';
import imgGuards from '../../assets/images/hero_nigerian_corporate_guards_1790574288138.jpg';

export const WhyChooseUs: React.FC = () => {
  const { navigate } = useApp();

  const reasons = [
    {
      title: 'UK Rigor + Nigerian Operational Reality',
      description: 'Headquartered in London with full executive and operational hubs in Lagos and Port Harcourt. We enforce international standards tailored specifically to local security contexts.',
      icon: Globe2
    },
    {
      title: 'Vetted & Dignified Personnel',
      description: 'Comprehensive criminal vetting, psychological evaluations, and continuous training academies ensure guards who are vigilant, polite, and proud of their calling.',
      icon: Users
    },
    {
      title: 'Intelligent Surveillance Technology',
      description: 'We do not sell isolated hardware. We integrate thermal drone surveillance, IP CCTV networks, and biometric turnstiles with our 24/7 central monitoring station.',
      icon: Laptop
    },
    {
      title: 'Unannounced Day & Night Supervision',
      description: 'Supervisory mobile squads conduct randomized site inspections 24/7, keeping static guards sharp and testing perimeter alert channels continuously.',
      icon: Zap
    },
    {
      title: 'Transparent Electronic Verification',
      description: 'Guards verify patrol routes using RFID electronic wands. Facility managers receive daily time-stamped incident and attendance logs with zero guesswork.',
      icon: FileCheck
    },
    {
      title: 'Rapid Armed Response Coordination',
      description: 'Strategic deployment of armed response vehicles across major commercial clusters ensures immediate intervention in the event of confirmed intrusion.',
      icon: ShieldCheck
    }
  ];

  return (
    <section className="py-20 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              The SafeNet Distinction
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Why Corporate Leaders Entrust Their Protection to SafeNet
            </h2>
          </div>
          <div className="lg:col-span-4 text-xs text-slate-400">
            In an operating environment where security failures carry devastating financial and human costs, SafeNet delivers unwavering operational discipline.
          </div>
        </div>

        {/* Bento Grid with Authentic Nigerian Imagery and Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Authentic Photography Anchor */}
          <div className="lg:col-span-5 relative rounded-xl overflow-hidden min-h-[380px] lg:min-h-full border border-slate-800">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${imgGuards})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-400">
                Frontline Excellence
              </span>
              <h3 className="text-lg font-display font-bold text-white leading-snug">
                Impeccably Attired Nigerian Corporate Security Officers
              </h3>
              <p className="text-xs text-slate-300">
                Providing welcoming executive reception while maintaining zero-compromise vigilance at headquarters across Lagos, Abuja, and Port Harcourt.
              </p>
            </div>
          </div>

          {/* Right Column: 6 Structured Reasons */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reasons.map((r, idx) => {
              const Icon = r.icon;
              return (
                <div 
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-3 hover:border-amber-400/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-amber-400">
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h4 className="text-sm font-display font-bold text-white">
                    {r.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {r.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
