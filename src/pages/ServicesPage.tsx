import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceCategory } from '../types';
import { 
  Camera, 
  Shield, 
  UserCheck, 
  Briefcase, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Surveillance Systems',
    'Physical Security',
    'Executive / Specialist Protection',
    'Security Consulting'
  ];

  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesQuery = 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.capabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-12">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Shield className="w-4 h-4" />
          <span>Full Capabilities Inventory</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Commercial, Surveillance & Specialist Security Services
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl font-normal leading-relaxed">
          SafeNet Security Solutions Ltd provides end-to-end protective architecture spanning physical manned guarding, autonomous drone patrols, 24/7 CCTV surveillance, biometric access, and offshore maritime defense across Nigeria.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services & tech..."
              className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="text-slate-400 text-sm">No security services match your search filter.</div>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-lg p-6 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl group"
              >
                <div className="space-y-4">
                  {/* Category and badge */}
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

                  {/* Capabilities List */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="text-[11px] uppercase font-semibold tracking-wider text-slate-400">
                      Key Highlights
                    </div>
                    <ul className="space-y-1.5">
                      {service.capabilities.slice(0, 3).map((cap, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => navigate(`/services/${service.slug}`)}
                    className="font-semibold text-slate-300 group-hover:text-white flex items-center gap-1 hover:underline"
                  >
                    <span>Full Specifications</span>
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
        )}
      </div>

      {/* Bottom Consultation Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-display font-bold text-white">
              Unsure which combination of services your facility requires?
            </h3>
            <p className="text-xs text-slate-400">
              Our certified security engineers will conduct an objective Physical Security Vulnerability Assessment (PSVA).
            </p>
          </div>
          <button
            onClick={() => navigate('/security-assessment')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shrink-0"
          >
            Launch Security Assessment
          </button>
        </div>
      </div>

    </div>
  );
};
