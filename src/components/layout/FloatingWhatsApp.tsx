import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, X, Send, ShieldCheck } from 'lucide-react';

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
          <div className="bg-emerald-700 px-4 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight">SafeNet Security Operations</div>
                <div className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  Active Response Team (Nigeria)
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-slate-950/60 text-xs text-slate-300 border-b border-slate-800">
            Welcome to SafeNet Security Solutions Ltd. Connect directly with our operations dispatch or senior security advisors via WhatsApp.
          </div>

          <form onSubmit={handleSend} className="p-4 space-y-3 bg-slate-900">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Inquiry Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
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
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span>Start WhatsApp Conversation</span>
              <Send className="w-3.5 h-3.5" />
            </button>

            <div className="text-[10px] text-center text-slate-400">
              Direct line: {siteSettings.whatsapp}
            </div>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/50"
        aria-label="Open WhatsApp live chat"
      >
        <MessageSquare className="w-6 h-6 stroke-[2.2]" />
      </button>
    </div>
  );
};
