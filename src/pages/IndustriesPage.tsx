import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Landmark, 
  Home, 
  Flame, 
  Ship, 
  Factory, 
  Utensils, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';

export const IndustriesPage: React.FC = () => {
  const { industries, navigate } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return Building2;
      case 'Landmark': return Landmark;
      case 'Home': return Home;
      case 'Flame': return Flame;
      case 'Ship': return Ship;
      case 'Factory': return Factory;
      case 'Utensils': return Utensils;
      default: return Zap;
    }
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-16">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Tailored Sector Security Architectures</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Specialized Industry Defense Solutions
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Every commercial sector in Nigeria faces distinct physical and criminal risks. SafeNet customizes threat modeling, hardware deployment, personnel profiles, and tactical intervention protocols for each operating environment.
        </p>
      </div>

      {/* Industries Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((industry) => {
            const Icon = getIcon(industry.iconName);
            return (
              <div
                key={industry.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-8 flex flex-col justify-between space-y-6 transition-all hover:shadow-xl group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 stroke-[2]" />
                      </div>
                      <h2 className="text-xl font-display font-bold text-white group-hover:text-amber-400 transition-colors">
                        {industry.name}
                      </h2>
                    </div>
                  </div>

                  <p className="text-xs text-amber-400/90 font-medium">
                    {industry.tagline}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {industry.description}
                  </p>

                  {/* Threat -> Solution breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-red-400 flex items-center gap-1.5 uppercase">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>Primary Threat</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed">{industry.threat}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 uppercase">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Engineered Solution</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed">{industry.solution}</p>
                    </div>
                  </div>

                  {/* Technology badges */}
                  <div className="pt-3 border-t border-slate-800/60">
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                      Deployed Technologies
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                      {industry.technology.map((tech, i) => (
                        <span key={i} className="bg-slate-950 px-2.5 py-1 rounded text-[11px] border border-slate-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => navigate(`/industries/${industry.slug}`)}
                    className="font-semibold text-amber-400 group-hover:underline flex items-center gap-1"
                  >
                    <span>Read Sector Security Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigate(`/request-quote?industry=${encodeURIComponent(industry.name)}`)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200 rounded font-medium transition-colors"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
