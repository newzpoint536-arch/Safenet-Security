import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, X, Send, ShieldCheck, Clock, Radio, Activity } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { siteSettings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('Quote Request');
  const [userMsg, setUserMsg] = useState('');

  const cleanPhone = siteSettings.whatsapp.replace(/[^0-9]/g, '');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMessage = encodeURIComponent(
      `Hello SafeNet Security Solutions,\n\nI would like to inquire about: ${selectedTopic}.\n${userMsg ? `Details: ${userMsg}\n` : ''}\nPlease let me know the next steps.`
    );
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${finalMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Popover Card */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* 24/7 Security Status Header Bar */}
          <div className="bg-slate-950 border-b border-emerald-900/60 px-3.5 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider font-semibold text-emerald-400">
                <span>Security Status:</span>
                <span className="text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-1.5 py-0.5 rounded text-[9.5px] font-bold">
                  24/7 Active &amp; Responsive
                </span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>&lt; 3 Min Dispatch</span>
            </div>
          </div>

          {/* Brand Operations Bar */}
          <div className="bg-emerald-700 px-4 py-3 flex items-center justify-between text-white shadow-inner">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-800/90 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  SafeNet Command Desk
                  <span className="text-[9px] font-semibold bg-emerald-900/80 text-emerald-200 px-1.5 py-0.2 rounded border border-emerald-600/50 uppercase">
                    Verified
                  </span>
                </div>
                <div className="text-[10.5px] text-emerald-100 flex items-center gap-1.5 mt-0.5">
                  <Activity className="w-3 h-3 text-emerald-300 animate-pulse" />
                  <span>Operations Control Center (Nigeria &amp; UK)</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded hover:bg-emerald-800/60 transition-colors"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 bg-slate-950/70 text-xs text-slate-300 border-b border-slate-800 flex items-start gap-2">
            <Radio className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Direct Client Dispatch: </span>
              Connect immediately with a SafeNet senior operations officer for emergency deployment, guarding, or technical assessments.
            </div>
          </div>

          <form onSubmit={handleSend} className="p-4 space-y-3 bg-slate-900">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Inquiry Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option value="Quote Request">Request a Security Quote</option>
                <option value="Manned Guarding Deployment">Manned Guarding Deployment</option>
                <option value="Drone / CCTV Installation">Drone / CCTV Systems Installation</option>
                <option value="Maritime / Offshore Protection">Maritime / Offshore Protection</option>
                <option value="Executive Close Protection / VIP Escort">Executive VIP Escort Services</option>
                <option value="Urgent Security Consultation">Urgent Security Consultation</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Facility / Location (Optional)
              </label>
              <input
                type="text"
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                placeholder="e.g. 10-storey commercial building in VI, Lagos"
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Connect on WhatsApp Live</span>
              <Send className="w-3.5 h-3.5" />
            </button>

            <div className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Direct operational hotline: <strong className="text-slate-200">{siteSettings.whatsapp}</strong></span>
            </div>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/50 cursor-pointer relative"
        aria-label="Open WhatsApp live chat"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-slate-900"></span>
        </span>
        <MessageSquare className="w-6 h-6 stroke-[2.2]" />
      </button>
    </div>
  );
};
