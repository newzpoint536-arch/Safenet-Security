import React, { useState } from 'react';
import { LEADERSHIP_PROFILES, LeadershipProfile } from '../../data/leadershipData';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ChevronDown, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface LeadershipSectionProps {
  isHomePage?: boolean;
  showHeaderCta?: boolean;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({ 
  isHomePage = false,
  showHeaderCta = true 
}) => {
  const { navigate } = useApp();
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  const toggleProfile = (id: string) => {
    setActiveProfileId((prev) => (prev === id ? null : id));
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleProfile(id);
    }
  };

  const renderProfileCard = (profile: LeadershipProfile) => {
    const isExpanded = activeProfileId === profile.id;

    return (
      <div
        key={profile.id}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-label={`${profile.name}, ${profile.designation}. Press Enter to view full biography.`}
        onKeyDown={(e) => handleKeyDown(e, profile.id)}
        onClick={() => toggleProfile(profile.id)}
        onMouseEnter={() => {
          if (window.matchMedia('(hover: hover)').matches) {
            setActiveProfileId(profile.id);
          }
        }}
        onMouseLeave={() => {
          if (window.matchMedia('(hover: hover)').matches) {
            setActiveProfileId(null);
          }
        }}
        className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-900 ${
          isExpanded 
            ? 'border-blue-900/40 shadow-xl ring-1 ring-blue-900/10' 
            : 'border-slate-200/90 shadow-sm hover:shadow-lg hover:border-slate-300'
        }`}
      >
        {/* Prominent Official Portrait Area */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-slate-100 overflow-hidden">
          <img 
            src={profile.image} 
            alt={`Official portrait of ${profile.name}`}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transform-none"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Card Identity & Unabridged Biography */}
        <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between bg-white space-y-4">
          <div className="space-y-1.5">
            {/* Designation */}
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-900">
              {profile.designation}
            </p>

            {/* Full Name */}
            <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
              {profile.name}
            </h3>
          </div>

          {/* Interactive Expandable Biography Dossier (Smooth 300ms transition) */}
          <div 
            className={`grid transition-all duration-300 ease-in-out motion-reduce:transition-none ${
              isExpanded ? 'grid-rows-[1fr] opacity-100 pt-3 border-t border-slate-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Card Footer: View Profile Trigger Indicator */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-900">
            <span className="group-hover:underline">
              {isExpanded ? 'Collapse Profile' : 'View Profile'}
            </span>
            <div className={`w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-blue-100 text-blue-900' : 'text-slate-600'}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <section 
      id="leadership"
      className="py-16 sm:py-20 lg:py-24 bg-slate-50 text-slate-900 border-t border-slate-200"
      aria-label="Executive Leadership & Management Team"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-900 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Executive Directorate & Governance</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
              Our Leadership Team
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              SafeNet Security Solutions Ltd is directed by an exceptional cadre of UK-trained criminal investigators, doctorate-level psychologists, ASIS-certified security engineers, and legal compliance authorities dedicated to unwavering operational integrity across Nigeria.
            </p>
          </div>

          {isHomePage && showHeaderCta && (
            <div className="shrink-0">
              <button
                onClick={() => navigate('/leadership')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-900"
              >
                <span>Full Leadership Profiles</span>
                <ArrowRight className="w-4 h-4 text-amber-600" />
              </button>
            </div>
          )}
        </div>

        {/* Gallery Grid: Row 1 (3 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {LEADERSHIP_PROFILES.slice(0, 3).map((profile) => renderProfileCard(profile))}
        </div>

        {/* Gallery Grid: Row 2 (2 cards centered on desktop) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto gap-8 items-start">
          {LEADERSHIP_PROFILES.slice(3, 5).map((profile) => renderProfileCard(profile))}
        </div>

        {/* Operational Governance Guarantee Footer */}
        <div className="mt-14 sm:mt-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-display font-bold text-slate-900">
                Direct Directorate Oversight on Every Security Contract
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Our executive board actively reviews tactical threat assessments, client escalations, and guard training curriculums.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Contact Leadership
            </button>
            <button
              onClick={() => navigate('/request-quote')}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Request Executive Proposal
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
