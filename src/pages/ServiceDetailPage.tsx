import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Cpu, 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  Phone, 
  ChevronDown,
  Bot,
  Sparkles
} from 'lucide-react';
import { FaqJsonLd } from '../components/seo/FaqJsonLd';

export const ServiceDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { services, navigate, addLead, openAiChatWithPrompt } = useApp();
  const service = services.find(s => s.slug === slug);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Quick Inline Quote State
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLocation, setFormLocation] = useState('Lagos');
  const [formScope, setFormScope] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!service) {
    return (
      <div className="py-20 text-center max-w-xl mx-auto space-y-4">
        <h2 className="text-2xl font-display font-bold text-white">Service Not Found</h2>
        <p className="text-slate-400 text-sm">The requested security capability could not be located in our registry.</p>
        <button
          onClick={() => navigate('/services')}
          className="px-4 py-2 text-xs bg-amber-400 text-slate-950 font-bold rounded"
        >
          View All Services
        </button>
      </div>
    );
  }

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formEmail) return;

    addLead({
      fullName: formName,
      company: formCompany || undefined,
      email: formEmail,
      phone: formPhone,
      location: formLocation,
      industry: 'Commercial / Facility',
      serviceRequired: service.title,
      propertyType: 'Client Specified Facility',
      projectDescription: formScope || `Direct quote inquiry for ${service.title}`,
      urgency: 'immediate',
      preferredContact: 'phone'
    });

    setIsSubmitted(true);
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-16">
      
      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 min-h-[380px] flex items-center p-8 sm:p-12">
          
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${service.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-amber-400">{service.category}</span>
              {service.badge && (
                <>
                  <span className="text-slate-600">·</span>
                  <span className="font-mono text-slate-300">{service.badge}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
              {service.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {service.shortDescription}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="#quote-form"
                className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Request a Quote for This Service</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => navigate('/security-assessment')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-md"
              >
                Facility Risk Assessment
              </button>
              <button
                onClick={() => openAiChatWithPrompt(`What are the key security threats, operational protocols, and equipment requirements for ${service.title} in Nigeria?`)}
                className="px-5 py-2.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 rounded-md inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-amber-400" />
                <span>Consult Sentinel AI</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content & Specs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Deep Dive Specs */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Overview & Problem/Solution Split */}
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-white">
                Operational Overview
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {service.fullDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="bg-red-950/20 border border-red-900/40 rounded-lg p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>The Threat & Vulnerability</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {service.problem}
                  </p>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>The SafeNet Solution</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {service.solution}
                  </p>
                </div>
              </div>
            </div>

            {/* Core Capabilities */}
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-white">
                Engineered Capabilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-900/80 border border-slate-800 rounded-lg p-4">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 leading-relaxed">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment Process */}
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-white">
                Technical Deployment Process
              </h3>
              <div className="space-y-3">
                {service.process.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <div className="w-7 h-7 rounded bg-amber-400/10 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </div>
                    <div className="text-xs text-slate-300 pt-1 leading-relaxed">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology & Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>Hardware & Technology</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {service.technology.map((tech, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Tangible Business Benefits</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {service.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            {service.faqs && service.faqs.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-800">
                {/* JSON-LD Schema Markup for FAQ Rich Snippets in Google */}
                <FaqJsonLd
                  id={`service-${service.slug}`}
                  faqs={service.faqs}
                  pageTitle={`${service.title} Technical & Operational FAQs`}
                  pageUrl={typeof window !== 'undefined' ? window.location.href : `https://safenetsecurityltd.com/services/${service.slug}`}
                />

                <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <span>Technical & Operational FAQs</span>
                </h3>
                <div className="space-y-3">
                  {service.faqs.map((faq, i) => {
                    const isOpen = openFaq === i;
                    return (
                      <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : i)}
                          className="w-full text-left p-4 text-xs font-semibold text-white flex items-center justify-between hover:text-amber-400 transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Direct Quote Card & Contact Assist */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Inline Quote Form */}
            <div id="quote-form" className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 sticky top-28">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400">
                  Express Commercial Inquiry
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  Request a Quote
                </h3>
                <p className="text-xs text-slate-400">
                  Custom deployment for {service.title}.
                </p>
              </div>

              {isSubmitted ? (
                <div className="bg-emerald-950/40 border border-emerald-800 rounded-lg p-4 space-y-2 text-center">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-sm font-bold text-white">Inquiry Received</div>
                  <p className="text-xs text-emerald-200">
                    Our technical security coordinator will contact you via phone within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitQuote} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Chief Adeleke"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      placeholder="e.g. Corporate Holdings Ltd"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+234..."
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="name@corp.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Location in Nigeria
                    </label>
                    <select
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Lagos (Victoria Island / Lekki / Ikoyi)">Lagos (VI / Lekki / Ikoyi)</option>
                      <option value="Lagos (Ikeja / Mainland / Industrial)">Lagos (Ikeja / Industrial)</option>
                      <option value="Abuja (FCT)">Abuja (FCT)</option>
                      <option value="Rivers State (Port Harcourt)">Rivers State (Port Harcourt)</option>
                      <option value="Delta State (Warri / Escravos)">Delta State (Warri / Escravos)</option>
                      <option value="Ogun State (Sagamu / Agbara)">Ogun State (Industrial Zones)</option>
                      <option value="Other Nigerian State">Other Nigerian State</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Facility Scope & Requirements
                    </label>
                    <textarea
                      rows={2}
                      value={formScope}
                      onChange={(e) => setFormScope(e.target.value)}
                      placeholder="e.g. 5-storey building, 12 camera channels, 8 guards needed..."
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-xs transition-colors shadow-md"
                  >
                    Submit Quote Request
                  </button>
                </form>
              )}

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Immediate Assistance:</span>
                <a href="tel:+2348131296054" className="text-amber-400 font-semibold hover:underline">
                  +234 813 129 6054
                </a>
              </div>
            </div>

            {/* AI Security Advisor Context Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>Sentinel AI • {service.title}</span>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our AI security architect is loaded with specialized operational vectors for <span className="text-amber-300 font-semibold">{service.title}</span>. Ask about threat mitigation, deployment standards, and equipment specifications.
              </p>
              <button
                onClick={() => openAiChatWithPrompt(`Provide a prioritized threat breakdown and recommended defense posture for ${service.title} in Nigeria.`)}
                className="w-full py-2 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 hover:text-white text-xs font-semibold rounded flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Evaluate {service.title} Threats</span>
              </button>
            </div>

            {/* Related Industries */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="text-xs uppercase font-semibold tracking-wider text-slate-400">
                Suitable Industry Sectors
              </div>
              <div className="space-y-1.5">
                {service.suitableIndustries.map((ind, i) => (
                  <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
