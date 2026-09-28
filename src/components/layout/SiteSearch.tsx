import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  X, 
  Shield, 
  Briefcase, 
  BookOpen, 
  CornerDownLeft, 
  Sparkles, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Bot
} from 'lucide-react';
import { Service, CaseStudy, BlogPost } from '../../types';

export type SearchCategoryFilter = 'all' | 'services' | 'case-studies' | 'blog';

export interface SearchResultItem {
  id: string;
  type: 'service' | 'case-study' | 'blog';
  title: string;
  subtitle: string;
  snippet: string;
  badge: string;
  badgeColor: string;
  meta: string[];
  route: string;
  originalItem: Service | CaseStudy | BlogPost;
}

export interface SiteSearchProps {
  /** If provided, modal visibility is controlled externally */
  isOpen?: boolean;
  /** Callback when modal requests closing */
  onClose?: () => void;
  /** Callback when modal is opened */
  onOpen?: () => void;
  /** Visual variant for the navigation trigger button */
  variant?: 'nav' | 'compact' | 'icon' | 'modal-only';
  /** Custom trigger element or function */
  trigger?: React.ReactNode | ((openModal: () => void) => React.ReactNode);
  /** Additional CSS classes for trigger wrapper */
  className?: string;
  /** Additional CSS classes for trigger button */
  buttonClassName?: string;
  /** Placeholder for search input inside modal */
  placeholder?: string;
  /** Enable global keyboard shortcut (Cmd+K / Ctrl+K / slash) */
  enableShortcut?: boolean;
}

const POPULAR_SUGGESTIONS = [
  'Maritime Security',
  'CCTV & Thermal Monitoring',
  'Drone Aerial Reconnaissance',
  'ISPS Code Compliance',
  'Pipeline Surveillance',
  'Manned Guarding Force',
  'VIP Armored Escort (B6)',
  'Access Control Systems',
  'Victoria Island HQ'
];

export const SiteSearch: React.FC<SiteSearchProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onOpen: controlledOnOpen,
  variant = 'nav',
  trigger,
  className = '',
  buttonClassName = '',
  placeholder = 'Search SafeNet services, verified case studies, security insights...',
  enableShortcut = true
}) => {
  const { 
    services, 
    caseStudies, 
    blogPosts, 
    navigate, 
    openAiChatWithPrompt 
  } = useApp();

  // Internal open state for uncontrolled usage
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isModalOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleOpen = useCallback(() => {
    if (isControlled) {
      controlledOnOpen?.();
    } else {
      setInternalIsOpen(true);
    }
  }, [isControlled, controlledOnOpen]);

  const handleClose = useCallback(() => {
    if (isControlled) {
      controlledOnClose?.();
    } else {
      setInternalIsOpen(false);
    }
  }, [isControlled, controlledOnClose]);

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategoryFilter>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Global custom event listener so any button can open site search
  useEffect(() => {
    const handleCustomOpen = () => handleOpen();
    window.addEventListener('open-site-search', handleCustomOpen);
    return () => window.removeEventListener('open-site-search', handleCustomOpen);
  }, [handleOpen]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K and /)
  useEffect(() => {
    if (!enableShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isModalOpen) {
          handleClose();
        } else {
          handleOpen();
        }
        return;
      }
      // Slash key when not typing in an input or textarea
      if (
        e.key === '/' && 
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        handleOpen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableShortcut, isModalOpen, handleOpen, handleClose]);

  // Reset & focus input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 70);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  // Escape key listener when modal is open
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleClose]);

  // Index and normalize searchable data across Services, Case Studies, and Blog Posts
  const allResults = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();

    // 1. Services
    const serviceItems: SearchResultItem[] = (services || [])
      .filter((s) => {
        if (!q) return true;
        return (
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.fullDescription.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.capabilities?.some((c) => c.toLowerCase().includes(q)) ||
          s.technology?.some((t) => t.toLowerCase().includes(q)) ||
          s.suitableIndustries?.some((ind) => ind.toLowerCase().includes(q)) ||
          s.solution?.toLowerCase().includes(q)
        );
      })
      .map((s) => ({
        id: `service-${s.id}`,
        type: 'service',
        title: s.title,
        subtitle: s.category,
        snippet: s.shortDescription,
        badge: 'Service',
        badgeColor: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
        meta: [s.category, `${s.capabilities?.length || 0} capabilities`],
        route: `/services/${s.slug}`,
        originalItem: s
      }));

    // 2. Case Studies
    const caseStudyItems: SearchResultItem[] = (caseStudies || [])
      .filter((cs) => {
        if (!q) return true;
        return (
          cs.title.toLowerCase().includes(q) ||
          cs.industry?.toLowerCase().includes(q) ||
          cs.location?.toLowerCase().includes(q) ||
          cs.challenge?.toLowerCase().includes(q) ||
          cs.securityStrategy?.toLowerCase().includes(q) ||
          cs.outcome?.toLowerCase().includes(q) ||
          cs.metric?.toLowerCase().includes(q) ||
          cs.technology?.some((t) => t.toLowerCase().includes(q))
        );
      })
      .map((cs) => ({
        id: `case-study-${cs.id}`,
        type: 'case-study',
        title: cs.title,
        subtitle: `${cs.industry} · ${cs.location}`,
        snippet: cs.challenge.length > 140 ? `${cs.challenge.slice(0, 140)}...` : cs.challenge,
        badge: 'Case Study',
        badgeColor: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
        meta: [cs.industry, cs.location, cs.metric].filter(Boolean),
        route: '/case-studies',
        originalItem: cs
      }));

    // 3. Blog Posts
    const blogItems: SearchResultItem[] = (blogPosts || [])
      .filter((post) => {
        if (!q) return true;
        return (
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q) ||
          post.category.toLowerCase().includes(q) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
          post.author?.name?.toLowerCase().includes(q) ||
          post.seoTitle?.toLowerCase().includes(q) ||
          post.seoDescription?.toLowerCase().includes(q)
        );
      })
      .map((post) => ({
        id: `blog-${post.id}`,
        type: 'blog',
        title: post.title,
        subtitle: `${post.category} · By ${post.author?.name || 'SafeNet Intelligence'}`,
        snippet: post.excerpt,
        badge: 'Blog / Intel',
        badgeColor: 'border-sky-500/50 bg-sky-500/10 text-sky-300',
        meta: [post.category, post.readingTime, post.publishedAt].filter(Boolean),
        route: `/blog/${post.slug}`,
        originalItem: post
      }));

    return [...serviceItems, ...caseStudyItems, ...blogItems];
  }, [query, services, caseStudies, blogPosts]);

  // Counts by category
  const counts = useMemo(() => {
    return {
      all: allResults.length,
      services: allResults.filter((r) => r.type === 'service').length,
      'case-studies': allResults.filter((r) => r.type === 'case-study').length,
      blog: allResults.filter((r) => r.type === 'blog').length
    };
  }, [allResults]);

  // Filtered results based on selected tab
  const filteredResults = useMemo(() => {
    if (activeCategory === 'all') return allResults;
    if (activeCategory === 'services') return allResults.filter((r) => r.type === 'service');
    if (activeCategory === 'case-studies') return allResults.filter((r) => r.type === 'case-study');
    if (activeCategory === 'blog') return allResults.filter((r) => r.type === 'blog');
    return allResults;
  }, [allResults, activeCategory]);

  // Reset selected index when tab or query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults.length, activeCategory]);

  const scrollSelectedIntoView = (index: number) => {
    if (!resultsContainerRef.current) return;
    const items = resultsContainerRef.current.querySelectorAll('[data-result-item]');
    const targetItem = items[index] as HTMLElement;
    if (targetItem) {
      targetItem.scrollIntoView({ block: 'nearest' });
    }
  };

  const selectItem = (item: SearchResultItem) => {
    handleClose();
    navigate(item.route);
  };

  const handleAskAi = (promptText: string) => {
    handleClose();
    if (openAiChatWithPrompt) {
      openAiChatWithPrompt(
        `Provide comprehensive security advice and recommended countermeasures regarding: "${promptText}". What solutions and deployment blueprints does SafeNet offer for this?`
      );
    }
  };

  // Keyboard navigation within results
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : prev));
      scrollSelectedIntoView(selectedIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      scrollSelectedIntoView(selectedIndex - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        selectItem(filteredResults[selectedIndex]);
      } else if (query.trim()) {
        handleAskAi(query);
      }
    }
  };

  const highlightMatch = (text: string, search: string) => {
    if (!search.trim()) return text;
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-amber-400/30 text-amber-200 font-semibold px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const modalContent = isModalOpen ? (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 sm:pt-20 transition-all duration-200"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Sitewide Security Search"
      >
        {/* Search Bar Header */}
        <div className="relative border-b border-slate-800 bg-slate-950/60 p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none font-medium"
            autoComplete="off"
            spellCheck="false"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-400 bg-slate-800/80 px-2 py-1 rounded border border-slate-700 shrink-0">
            <span>ESC</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            title="Close search modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters Bar */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Filter:</span>
          </span>

          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeCategory === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
            }`}
          >
            <span>All Results</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeCategory === 'all' ? 'bg-slate-900/30 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
            }`}>
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('services')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeCategory === 'services'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
            }`}
          >
            <Shield className="w-3 h-3 text-amber-400" />
            <span>Services</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeCategory === 'services' ? 'bg-slate-900/30 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
            }`}>
              {counts.services}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('case-studies')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeCategory === 'case-studies'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
            }`}
          >
            <Briefcase className="w-3 h-3 text-emerald-400" />
            <span>Case Studies</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeCategory === 'case-studies' ? 'bg-slate-900/30 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
            }`}>
              {counts['case-studies']}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('blog')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeCategory === 'blog'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
            }`}
          >
            <BookOpen className="w-3 h-3 text-sky-400" />
            <span>Blog & Insights</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeCategory === 'blog' ? 'bg-slate-900/30 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
            }`}>
              {counts.blog}
            </span>
          </button>
        </div>

        {/* Results Container / Suggested Searches */}
        <div 
          ref={resultsContainerRef}
          className="max-h-[58vh] overflow-y-auto divide-y divide-slate-800/80 p-2 sm:p-3"
        >
          {/* Default state when user hasn't typed anything yet */}
          {!query.trim() && (
            <div className="py-4 px-3 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>Popular Security Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SUGGESTIONS.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQuery(sug)}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-750 hover:text-amber-300 text-slate-300 rounded-lg border border-slate-700/70 transition-all text-left flex items-center gap-1.5 cursor-pointer"
                    >
                      <Search className="w-3 h-3 text-slate-400" />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    navigate('/services');
                  }}
                  className="p-3 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 rounded-xl text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="text-xs font-bold text-white">Full Services Catalog</div>
                  <div className="text-[11px] text-slate-400">16 certified defense services</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    navigate('/case-studies');
                  }}
                  className="p-3 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="text-xs font-bold text-white">Verified Case Studies</div>
                  <div className="text-[11px] text-slate-400">Field audits & client metrics</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    navigate('/blog');
                  }}
                  className="p-3 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 rounded-xl text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <BookOpen className="w-4 h-4 text-sky-400" />
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="text-xs font-bold text-white">Security Intelligence</div>
                  <div className="text-[11px] text-slate-400">Threat vectors & advisories</div>
                </button>
              </div>

              {/* AI Sentinel Prompt Option */}
              <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      Need custom risk evaluation?
                      <Sparkles className="w-3 h-3 text-amber-400" />
                    </div>
                    <div className="text-[11px] text-slate-300">Sentinel AI provides instant multi-layered blueprints for any facility.</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    if (openAiChatWithPrompt) {
                      openAiChatWithPrompt('Provide a tactical risk assessment and recommend an integrated defense blueprint for our facility in Nigeria.');
                    }
                  }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Launch Sentinel AI
                </button>
              </div>
            </div>
          )}

          {/* Results list when query is active */}
          {query.trim() && filteredResults.length > 0 && (
            <div className="space-y-1.5 p-1">
              {filteredResults.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    data-result-item
                    onClick={() => selectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-slate-800/90 border-amber-500/60 shadow-md'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {item.type === 'service' && <Shield className="w-4 h-4 text-amber-400 shrink-0" />}
                        {item.type === 'case-study' && <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {item.type === 'blog' && <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />}

                        <h4 className="text-sm font-bold text-white truncate">
                          {highlightMatch(item.title, query)}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                        <CornerDownLeft className={`w-3.5 h-3.5 transition-opacity ${isSelected ? 'opacity-100 text-amber-400' : 'opacity-0'}`} />
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-2 font-medium">
                      <span>{item.subtitle}</span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {highlightMatch(item.snippet, query)}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
                      {item.meta.map((m, idx) => (
                        <span key={idx} className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No results empty state */}
          {query.trim() && filteredResults.length === 0 && (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">No security protocols found for "{query}"</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try adjusting your search terms, filtering by "All Results", or consult our 24/7 AI tactical operations agent.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleAskAi(query)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask Sentinel AI about "{query}"</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-slate-300">↑↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-slate-300">↵</kbd>
              <span>Select</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-slate-300">ESC</kbd>
              <span>Close</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 font-mono">
            <Shield className="w-3.5 h-3.5 text-amber-500/80" />
            <span>SafeNet Verified Operational Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Navigation Trigger Button (only if not modal-only) */}
      {variant !== 'modal-only' && (
        <div className={`relative inline-flex items-center ${className}`}>
          {trigger ? (
            typeof trigger === 'function' ? trigger(handleOpen) : (
              <div onClick={handleOpen} className="cursor-pointer">
                {trigger}
              </div>
            )
          ) : variant === 'icon' ? (
            <button
              type="button"
              onClick={handleOpen}
              aria-label="Open Sitewide Search (⌘K)"
              title="Search services, case studies, intelligence (⌘K)"
              className={`p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md focus:outline-none transition-colors cursor-pointer ${buttonClassName}`}
            >
              <Search className="w-5 h-5 text-amber-400" />
            </button>
          ) : variant === 'compact' ? (
            <button
              type="button"
              onClick={handleOpen}
              aria-label="Search sitewide"
              title="Search services, case studies, intelligence (⌘K)"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 rounded-md border border-slate-800 transition-colors cursor-pointer ${buttonClassName}`}
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span>Search</span>
              <kbd className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">⌘K</kbd>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpen}
              aria-label="Open Sitewide Search (⌘K)"
              title="Search services, case studies, intelligence (⌘K)"
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 rounded-md border border-slate-800 hover:border-slate-700 transition-colors shadow-sm cursor-pointer group ${buttonClassName}`}
            >
              <Search className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden xl:inline text-slate-300">Search sitewide...</span>
              <span className="xl:hidden text-slate-300">Search</span>
              <kbd className="hidden md:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 group-hover:text-slate-200">
                ⌘K
              </kbd>
            </button>
          )}
        </div>
      )}

      {/* Overlay Modal (Mounted via Portal directly to body for unclipped layout) */}
      {typeof document !== 'undefined' && modalContent
        ? createPortal(modalContent, document.body)
        : modalContent}
    </>
  );
};

export default SiteSearch;
