import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Clock, Eye, Award } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const { siteSettings } = useApp();

  const stats = [
    {
      label: 'Trained Security Officers',
      value: siteSettings.stats.trainedGuards,
      description: 'Vetted, disciplined Nigerian personnel operating to UK security standards',
      icon: Shield
    },
    {
      label: 'Emergency Response Readiness',
      value: siteSettings.stats.responseTime,
      description: 'Central monitoring dispatch & staged mobile patrol squads',
      icon: Clock
    },
    {
      label: 'Active Perimeter Coverage',
      value: siteSettings.stats.droneCctvCoverage,
      description: 'Continuous thermal drone reconnaissance and AI-driven CCTV systems',
      icon: Eye
    },
    {
      label: 'Client Retention Rate',
      value: siteSettings.stats.clientRetention,
      description: 'Verifiable corporate, banking, residential & maritime trust',
      icon: Award
    }
  ];

  return (
    <section className="bg-slate-900 border-y border-slate-800 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="flex flex-col space-y-2 border-l-2 border-amber-500/60 pl-4"
              >
                <div className="flex items-center gap-2 text-amber-400">
                  <Icon className="w-4 h-4 stroke-[2]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </span>
                </div>
                <div className="font-mono-numbers font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                  {stat.value}
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
