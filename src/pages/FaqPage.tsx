import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ShieldCheck, 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Shield, 
  FileCheck2, 
  Eye, 
  Anchor, 
  UserCheck, 
  Layers
} from 'lucide-react';
import { COMPREHENSIVE_FAQS, SiteFaqItem } from '../data/faqData';
import { FaqJsonLd } from '../components/seo/FaqJsonLd';

export const FAQPage: React.FC = () => {
  const { navigate, openAiChatWithPrompt } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>(COMPREHENSIVE_FAQS[0]?.id || null);

  // Canonical Schema.org FAQPage JSON-LD structured data payload
  const faqPageSchema = useMemo(() => {
    const pageUrl = typeof window !== 'undefined' 
      ? (window.location.origin + window.location.pathname) 
      : 'https://safenetsecurityltd.com/faq';

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: 'Frequently Asked Questions | SafeNet Security Solutions',
      description: 'Comprehensive operational clarifications regarding NSCDC Category A licensing, guard vetting protocols, 24/7 CCTV power resilience, autonomous drone patrols, and Gulf of Guinea maritime escort frameworks.',
      url: pageUrl,
      mainEntity: COMPREHENSIVE_FAQS.map((faq: SiteFaqItem) => ({
        '@type': 'Question',
        name: faq.question.trim(),
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer.trim()
        }
      }))
    };
  }, []);

  // Update Page Title, Meta description, Canonical URL and OpenGraph for Google Rich Results
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Frequently Asked Questions (FAQ) | SafeNet Security Solutions';

    const faqDescription = 'Review operational answers regarding SafeNet Security NSCDC Category A licensing, guard vetting protocols, 24/7 CCTV surveillance, and offshore maritime escorts.';
    const pageCanonicalUrl = typeof window !== 'undefined' 
      ? (window.location.origin + window.location.pathname) 
      : 'https://safenetsecurityltd.com/faq';

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : null;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', faqDescription);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonicalLink ? canonicalLink.getAttribute('href') : null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', pageCanonicalUrl);

    // OpenGraph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Frequently Asked Questions (FAQ) | SafeNet Security Solutions');

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', faqDescription);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', pageCanonicalUrl);

    // Twitter Card Tags
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.setAttribute('name', 'twitter:card');
      document.head.appendChild(twitterCard);
    }
    twitterCard.setAttribute('content', 'summary_large_image');

    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', 'Frequently Asked Questions (FAQ) | SafeNet Security Solutions');

    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta');
      twitterDesc.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDesc);
    }
    twitterDesc.setAttribute('content', faqDescription);

    // Inject JSON-LD directly into document.head for automated Googlebot and crawler verification
    const headScriptId = 'faqpage-schema-head-jsonld';
    let headScript = document.getElementById(headScriptId) as HTMLScriptElement | null;
    if (!headScript) {
      headScript = document.createElement('script');
      headScript.id = headScriptId;
      headScript.type = 'application/ld+json';
      document.head.appendChild(headScript);
    }
    headScript.textContent = JSON.stringify(faqPageSchema, null, 2);

    return () => {
      document.title = originalTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute('content', prevDesc);
      }
      if (canonicalLink && prevCanonical) {
        canonicalLink.setAttribute('href', prevCanonical);
      }
      const el = document.getElementById(headScriptId);
      if (el) {
        el.remove();
      }
    };
  }, [faqPageSchema]);

  const categories = [
    { id: 'all', label: 'All Questions', icon: Layers },
    { id: 'compliance', label: 'Licensing & NSCDC', icon: FileCheck2 },
    { id: 'guarding', label: 'Manned Guarding', icon: ShieldCheck },
    { id: 'surveillance', label: 'Surveillance & AI', icon: Eye },
    { id: 'maritime', label: 'Maritime & Offshore', icon: Anchor },
    { id: 'executive', label: 'Executive Protection', icon: UserCheck },
    { id: 'general', label: 'Contracts & Engagements', icon: Shield },
  ];

  // Filter FAQs based on active category and user search query for UI display
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return COMPREHENSIVE_FAQS.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;
      return (
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  // Canonical JSON-LD FAQs list (complete schema markup for Google search results and rich snippets)
  const canonicalJsonLdFaqs = useMemo(() => {
    return COMPREHENSIVE_FAQS.map((f) => ({
      question: f.question,
      answer: f.answer,
    }));
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleAskSentinel = (questionPrompt?: string) => {
    const prompt = questionPrompt
      ? `Regarding our security requirements: "${questionPrompt}". Can you clarify SafeNet's operational protocols, standards, and deployment options?`
      : 'I have a specific operational security question regarding SafeNet’s services and guard deployment. Can you assist me?';
    openAiChatWithPrompt(prompt);
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-12">
      {/* Schema.org FAQPage JSON-LD Structured Data for Google Rich Snippets */}
      <script
        id="faq-jsonld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageSchema, null, 2)
        }}
      />

      <FaqJsonLd 
        id="general-faq-page"
        faqs={canonicalJsonLdFaqs}
        pageTitle="Frequently Asked Questions | SafeNet Security Solutions"
        description="Comprehensive operational clarifications regarding NSCDC Category A licensing, guard vetting protocols, 24/7 CCTV power resilience, autonomous drone patrols, and Gulf of Guinea maritime escort frameworks."
        pageUrl={typeof window !== 'undefined' ? window.location.href : 'https://safenetsecurityltd.com/faq'}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Breadcrumb & Titles */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Operational & Technical Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Essential operational clarifications regarding NSCDC Category A licensing, guard vetting protocols, 
            24/7 CCTV power resilience, autonomous drone patrols, and Gulf of Guinea maritime escort frameworks.
          </p>
        </div>

        {/* Real-Time FAQ Search Box */}
        <div className="max-w-2xl mx-auto relative">
          <div className="relative">
            <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g., vetting, power outage, piracy, B6 armored, NSCDC)..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-slate-900/90 border-amber-500/50 shadow-md'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-400">
                        {faq.categoryLabel}
                      </span>
                      <h2 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {faq.question}
                      </h2>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                      <ChevronDown
                        className={`w-4 h-4 text-amber-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 bg-slate-950/40 space-y-3">
                      <p>{faq.answer}</p>
                      
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                        {faq.relatedServiceSlug && (
                          <button
                            onClick={() => navigate(`/services/${faq.relatedServiceSlug}`)}
                            className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium"
                          >
                            <span>Explore related service specifications</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleAskSentinel(faq.question)}
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-white"
                        >
                          <Bot className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ask Sentinel AI for deeper assessment</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center space-y-4 bg-slate-900/30 rounded-xl border border-slate-800">
              <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No questions matched "{searchQuery}"</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Can't find what you're looking for? Our 24/7 AI Sentinel agent can answer specific technical questions instantly.
                </p>
              </div>
              <button
                onClick={() => handleAskSentinel(searchQuery)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>Ask Sentinel AI About "{searchQuery}"</span>
              </button>
            </div>
          )}
        </div>

        {/* Sentinel AI Callout Banner */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Bot className="w-4 h-4" />
              <span>Unanswered Technical Questions?</span>
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-white">
              Consult SafeNet Sentinel AI Advisor
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Sentinel AI analyzes facility dimensions, security vulnerabilities, guard complements, and equipment layouts in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleAskSentinel()}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open AI Consultation</span>
            </button>
            <button
              onClick={() => navigate('/request-quote')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700"
            >
              Request Formal Proposal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FaqPage = FAQPage;
export default FAQPage;
