import React, { useState } from 'react';
import { LEADERSHIP_PROFILES, LeadershipProfile } from '../../data/leadershipData';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ChevronDown, 
  Award, 
  ExternalLink, 
  ArrowRight,
  BookOpen,
  Briefcase,
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

        {/* Gallery Grid: Desktop 3 columns then 2 columns, Tablet 2 columns, Mobile 1 column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {LEADERSHIP_PROFILES.map((profile, idx) => {
            const isExpanded = activeProfileId === profile.id;
            // On desktop row 2 (items 4 and 5), offset them so they look balanced
            const isFourthItem = idx === 3;
            const isFifthItem = idx === 4;

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
                  // Enable instant hover expansion on desktop if user prefers hover
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
                } ${isFourthItem ? 'lg:col-start-1 lg:translate-x-12' : ''} ${isFifthItem ? 'lg:col-start-3 lg:-translate-x-12' : ''}`}
              >
                {/* Portrait Header Area */}
                <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-900 via-[#07132c] to-slate-950 overflow-hidden flex items-center justify-center">
                  
                  {profile.image ? (
                    <img 
                      src={profile.image} 
                      alt={`Portrait of ${profile.name}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
                    />
                  ) : (
                    /* Dignified Corporate Executive Crest & Monogram */
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
                      {/* Subtle guilloche security watermarks */}
                      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
                      
                      {/* Monogram Seal */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-2 border-amber-400/50 shadow-2xl flex items-center justify-center group-hover:border-amber-400 transition-colors">
                        <span className="font-display font-extrabold text-2xl sm:text-3xl text-amber-400 tracking-wider">
                          {profile.initials}
                        </span>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-950 border border-amber-400/60 flex items-center justify-center">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                      </div>

                      <div className="relative mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                        SafeNet Directorate
                      </div>
                    </div>
                  )}

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-amber-400 shadow">
                    {profile.category}
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[10px] font-medium text-emerald-400 flex items-center gap-1.5 shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Executive Board</span>
                  </div>
                </div>

                {/* Card Identity & Details */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between bg-white">
                  <div className="space-y-2">
                    
                    {/* Designation Kicker */}
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-900">
                      {profile.designation}
                    </p>

                    {/* Full Name */}
                    <h3 className="text-xl font-display font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                      {profile.name}
                    </h3>

                    {/* Honorific & Credential Summary */}
                    {profile.honorific && (
                      <p className="text-xs text-slate-500 font-medium">
                        {profile.honorific}
                      </p>
                    )}

                    {/* Highlight Badge */}
                    <div className="pt-1">
                      <span className="inline-block text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                        {profile.credentialsBadge}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Expandable Dossier (Smooth 300ms transition) */}
                  <div 
                    className={`grid transition-all duration-300 ease-in-out motion-reduce:transition-none ${
                      isExpanded ? 'grid-rows-[1fr] opacity-100 pt-4 mt-4 border-t border-slate-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'
                    }`}
                  >
                    <div className="overflow-hidden space-y-4">
                      
                      {/* Full Biography Text */}
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                        {profile.bio}
                      </p>

                      {/* Key Competency Points */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-blue-900" />
                          <span>Core Strategic Domains</span>
                        </div>
                        <ul className="space-y-1">
                          {profile.keyHighlights.map((hl, i) => (
                            <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold shrink-0">·</span>
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>

                  {/* Card Footer: View Profile Trigger Indicator */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-900">
                    <span className="group-hover:underline">
                      {isExpanded ? 'Collapse Dossier' : 'View Full Profile & Credentials'}
                    </span>
                    <div className={`w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-blue-100 text-blue-900' : 'text-slate-600'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
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
