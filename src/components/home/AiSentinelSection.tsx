import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Radio, 
  ChevronRight, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  Send 
} from 'lucide-react';

export const AiSentinelSection: React.FC = () => {
  const { setIsAiChatOpen, openAiChatWithPrompt, navigate } = useApp();
  const [quickQuery, setQuickQuery] = useState('');

  const sampleScenarios = [
    {
      title: 'Victoria Island Corporate HQ',
      location: 'VI, Lagos',
      badge: 'Corporate',
      prompt: 'Provide a multi-layered security plan for a 12-storey corporate banking HQ in Victoria Island, Lagos, including speed gates, AI CCTV, and guard shifts.',
    },
    {
      title: 'Port Harcourt Oil & Gas Terminal',
      location: 'Rivers State',
      badge: 'Industrial',
      prompt: 'What are the required perimeter intrusion detection, thermal drone patrol, and armed response protocols for an oil & gas logistics hub in Port Harcourt?',
    },
    {
      title: 'Diplomatic Convoy MMIA Airport Transit',
      location: 'Lagos & Abuja',
      badge: 'VIP Escort',
      prompt: 'How does SafeNet coordinate B6 armored vehicle transit and close protection detail from Murtala Muhammed Airport to Ikoyi for visiting executives?',
    }
  ];

  const handleLaunch = (promptText?: string) => {
    const textToSend = promptText || quickQuery || 'How can SafeNet design a tailored security system for my commercial facility in Nigeria?';
    openAiChatWithPrompt(textToSend);
  };

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-800 text-slate-100 relative overflow-hidden">
      {/* Background Radar Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-amber-500/10 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-emerald-500/10 rounded-full pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Operations Intelligence</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Consult <span className="text-amber-400">SafeNet Sentinel AI</span> in Real Time
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Our state-of-the-art AI Security Architect models physical risk matrices, evaluates facility vulnerabilities, calculates guard-to-space ratios, and formulates tactical defense packages 24/7.
          </p>
        </div>

        {/* Interactive Tactical Console Preview */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Terminal Features & Live Scenarios */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Terminal className="w-4 h-4" />
                  <span>INTELLIGENCE CORE: ONLINE</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sub-second Response</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
                  Select a live operational case study to audit:
                </div>

                <div className="space-y-2.5">
                  {sampleScenarios.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLaunch(item.prompt)}
                      className="w-full text-left p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/60 transition-all group flex items-center justify-between cursor-pointer"
                    >
                      <div className="space-y-1 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {item.prompt}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>NSCDC Aligned Protocols</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Guard Force Calculator</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant Dispatch Escalate</span>
                </div>
              </div>
            </div>

            {/* Right: Custom Inquiry Box & Call to Action */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Direct Advisor Uplink</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  Have a specific facility or security challenge?
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Type your question below to initiate an immediate advisory session with Sentinel AI.
                </p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLaunch();
                }}
                className="space-y-3"
              >
                <div className="relative">
                  <textarea
                    rows={3}
                    value={quickQuery}
                    onChange={(e) => setQuickQuery(e.target.value)}
                    placeholder="e.g. How many guards and CCTV cameras are required for a 3-acre factory in Ikeja Industrial Estate?"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Launch Sentinel AI Consultation</span>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAiChatOpen(true)}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Bot className="w-3.5 h-3.5 text-amber-400" />
                    <span>Open Live Assistant Console</span>
                  </button>
                </div>
              </form>

              <div className="text-[10px] text-center text-slate-500 font-mono">
                Encrypted &amp; Confidential • Direct Escalation to 24/7 Human Dispatch
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
