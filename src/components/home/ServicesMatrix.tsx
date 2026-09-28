import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';
import { Camera, Shield, UserCheck, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ServicesMatrix: React.FC = () => {
  const { services, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Surveillance Systems');

  const categories: { name: ServiceCategory; icon: React.ElementType }[] = [
    { name: 'Surveillance Systems', icon: Camera },
    { name: 'Physical Security', icon: Shield },
    { name: 'Executive / Specialist Protection', icon: UserCheck },
    { name: 'Security Consulting', icon: Briefcase },
  ];

  const filteredServices = services.filter(s => s.category === selectedCategory);

  return (
    <section className="py-20 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Operational Defense Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Comprehensive Security Architecture
            </h2>
            <p className="text-sm text-slate-400">
              Combining cutting-edge surveillance technology, vetted Nigerian personnel, and specialist tactical intervention across 16 verified domains.
            </p>
          </div>

          <button
            onClick={() => navigate('/services')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 shrink-0 group"
          >
            <span>Explore All 16 Service Lines</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Tabs (Segmented Buttons - compliant with zero-pill rule) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/60">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = cat.name === selectedCategory;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2]" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-lg p-6 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="space-y-4">
                {/* Clean unboxed category header */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-amber-400/90">{service.category}</span>
                  {service.badge && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-display font-bold text-white group-hover:text-amber-400 transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {service.shortDescription}
                </p>

                {/* Key Capabilities */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="text-[11px] uppercase font-semibold tracking-wider text-slate-400">
                    Core Capabilities
                  </div>
                  <ul className="space-y-1.5">
                    {service.capabilities.slice(0, 2).map((cap, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => navigate(`/services/${service.slug}`)}
                  className="font-semibold text-slate-300 group-hover:text-white flex items-center gap-1 hover:underline"
                >
                  <span>Technical Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => navigate(`/request-quote?service=${encodeURIComponent(service.title)}`)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200 rounded font-medium transition-colors"
                >
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
