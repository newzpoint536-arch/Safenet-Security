import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

export const InteractiveAssessmentTeaser: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section className="py-16 bg-slate-950 border-t border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-xl p-8 sm:p-12 relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Cpu className="w-4 h-4" />
                <span>Interactive Facility Diagnostic</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                How Vulnerable Is Your Facility Right Now?
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Take our 2-minute diagnostic audit. Evaluate perimeter fencing, electronic CCTV gaps, access control bottlenecks, and guard patrol verification against international security benchmarks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Calculated Risk Score</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Identified Vulnerability Gaps</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tailored Defense Blueprint</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => navigate('/security-assessment')}
                className="w-full py-3.5 px-6 font-bold text-xs sm:text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <span>Launch Security Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/request-quote')}
                className="w-full py-3 px-6 font-semibold text-xs text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors text-center"
              >
                Direct Commercial Quote
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
