import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteSettings, addLead } = useApp();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    addLead({
      fullName: name,
      company: company || undefined,
      email,
      phone,
      location: 'Lagos / National',
      industry: 'General Inquiry',
      serviceRequired: 'Direct Contact Inquiry',
      propertyType: 'Unspecified Facility',
      projectDescription: message || 'Inquiry sent via general contact form.',
      urgency: 'immediate',
      preferredContact: 'phone'
    });

    setSent(true);
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-16">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Phone className="w-4 h-4" />
          <span>Operational Operations & Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
          Connect With SafeNet Security
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Contact our 24/7 central dispatch desk, request an on-site physical survey, or speak directly with our senior security consultants in Lagos or London.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info & Hubs */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Primary Contact Cards */}
            <div className="space-y-4">
              <h2 className="text-xl font-display font-bold text-white">
                Direct Communications
              </h2>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <a
                  href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">24/7 Operations Desk</div>
                    <div className="text-sm font-bold font-mono">{siteSettings.phone}</div>
                  </div>
                </a>

                <div className="border-t border-slate-800/80 pt-3">
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                      <Mail className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-semibold">Corporate Email</div>
                      <div className="text-sm font-bold font-mono truncate">{siteSettings.email}</div>
                    </div>
                  </a>
                </div>

                <div className="border-t border-slate-800/80 pt-3">
                  <a
                    href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-white hover:text-emerald-400 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase font-semibold">WhatsApp Dispatch</div>
                      <div className="text-sm font-bold font-mono text-emerald-400">{siteSettings.whatsapp}</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Regional Hub Locations */}
            <div className="space-y-4">
              <h2 className="text-xl font-display font-bold text-white">
                Operational Offices
              </h2>

              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase">
                    <MapPin className="w-4 h-4" />
                    <span>Lagos Operational Hub (Nigeria)</span>
                  </div>
                  <div className="text-xs text-white font-medium">{siteSettings.addressNigeria}</div>
                  <p className="text-[11px] text-slate-400">
                    Central Monitoring Station, Drone Operations Hub & Quick Intervention Dispatch.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase">
                    <MapPin className="w-4 h-4" />
                    <span>London Global Headquarters (UK)</span>
                  </div>
                  <div className="text-xs text-white font-medium">{siteSettings.addressUK}</div>
                  <p className="text-[11px] text-slate-400">
                    Executive Governance, Specialist Training Standards & International Risk Advisory.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Direct Communications
              </span>
              <h2 className="text-2xl font-display font-bold text-white">
                Send an Inquiry to SafeNet Directorate
              </h2>
              <p className="text-xs text-slate-400">
                Responses delivered within 2 hours during normal operational windows.
              </p>
            </div>

            {sent ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-display font-bold text-white">Message Transmitted</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, {name}. Your inquiry has been routed to our senior duty coordinator.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-4 py-2 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chief Adeleke"
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Corporate Tower Ltd"
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234..."
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Message / Security Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your property, personnel needs, CCTV installation or specialist advisory requirement..."
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Transmit Security Inquiry</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
