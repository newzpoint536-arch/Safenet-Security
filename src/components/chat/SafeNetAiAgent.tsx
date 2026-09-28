import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getPageSecurityContext, PageSecurityContext } from '../../data/pageContextMap';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Radio, 
  FileText, 
  AlertCircle,
  ChevronRight,
  Shield,
  Clock,
  Anchor,
  Compass,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  contextPage?: string;
  quickActions?: {
    label: string;
    action: () => void;
    icon?: React.ReactNode;
  }[];
}

export const SafeNetAiAgent: React.FC = () => {
  const { 
    isAiChatOpen, 
    setIsAiChatOpen, 
    aiChatInitialPrompt, 
    clearAiChatInitialPrompt, 
    currentPath, 
    navigate, 
    siteSettings 
  } = useApp();

  // Resolve rich, domain-specific security context for the current page
  const activeContext: PageSecurityContext = useMemo(() => {
    return getPageSecurityContext(currentPath);
  }, [currentPath]);

  // Track previous path to detect in-session page navigations
  const prevPathRef = useRef<string>(currentPath);

  // UI States
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-initial',
      role: 'assistant',
      content: getPageSecurityContext(currentPath).welcomeMessage,
      timestamp: 'Command Initialized',
      contextPage: currentPath
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showThreatDrawer, setShowThreatDrawer] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Format timestamp
  const getTimestamp = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Synchronize context when client browses to a different page
  useEffect(() => {
    if (prevPathRef.current !== currentPath) {
      prevPathRef.current = currentPath;
      
      setMessages(prev => {
        // If user hasn't asked any user questions yet, refresh welcome to match current page
        const hasUserMessages = prev.some(m => m.role === 'user');
        if (!hasUserMessages) {
          return [
            {
              id: `welcome-${Date.now()}`,
              role: 'assistant',
              content: activeContext.welcomeMessage,
              timestamp: getTimestamp(),
              contextPage: currentPath
            }
          ];
        }

        // If conversation is already active, notify client of sector transition
        return [
          ...prev,
          {
            id: `system-switch-${Date.now()}`,
            role: 'system',
            content: `**Sector Shift Detected**: You navigated to **${activeContext.pageTitle}** (${activeContext.pageCategory}). SafeNet Sentinel AI is now prioritizing **${activeContext.threatPriorities[0]}** and related domain threats for upcoming advice.`,
            timestamp: getTimestamp(),
            contextPage: currentPath
          }
        ];
      });
    }
  }, [currentPath, activeContext]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiChatOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isAiChatOpen]);

  // Handle incoming initial prompt from context (e.g. from buttons on site)
  useEffect(() => {
    if (isAiChatOpen && aiChatInitialPrompt) {
      sendMessage(aiChatInitialPrompt);
      clearAiChatInitialPrompt();
    }
  }, [isAiChatOpen, aiChatInitialPrompt]);

  // Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Text to Speech playback
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    // Clean markdown before speaking
    const cleanText = text
      .replace(/[*_#`[\]()]/g, ' ')
      .replace(/\n+/g, '. ')
      .trim();

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 0.98;
    window.speechSynthesis.speak(utterance);
  };

  // Tactical intelligence response generator when remote API is unreachable (e.g., static hosting / offline)
  const generateTacticalFallback = (query: string, context: typeof activeContext): string => {
    const q = query.toLowerCase();
    let domain = 'Corporate & Industrial Defense Architecture';
    let recommendations = [
      'Deploy biometric multi-factor access control and anti-tailgating speed turnstiles at facility entries.',
      'Install 24/7 IP thermal CCTV cameras with automated perimeter boundary detection.',
      'Station vetted, NSCDC Category-A certified armed and unarmed security guards with RFID patrol checkpoint logging.',
      'Connect facility telemetry directly to the SafeNet Victoria Island 24/7 Central Command Desk.'
    ];

    if (q.includes('maritime') || currentPath.includes('maritime') || q.includes('vessel') || q.includes('port') || q.includes('sea') || q.includes('offshore')) {
      domain = 'Offshore & Maritime Security Operations';
      recommendations = [
        'Conduct rigorous ISPS Code audits and certified Port Facility Security Assessments (PFSA).',
        'Deploy armed escort patrol vessels with Nigerian Navy & NIMASA security liaison personnel.',
        'Mount long-range acoustic deterrents (LRAD) and thermal radar surveillance for anti-boarding defense.',
        'Station certified Ship Security Officers (SSO) on offshore platforms and anchorage transfer points.'
      ];
    } else if (q.includes('cctv') || q.includes('camera') || q.includes('monitor') || currentPath.includes('cctv')) {
      domain = 'Surveillance & Central Command Monitoring';
      recommendations = [
        'Install high-definition IP thermal cameras linked to SafeNet 24/7 Central Command Centre.',
        'Deploy AI video analytics including Automatic Number Plate Recognition (ANPR) and facial recognition.',
        'Configure dual-path optical tripwires that alert motorized tactical backup units in under 45 seconds.'
      ];
    } else if (q.includes('drone') || q.includes('aerial') || currentPath.includes('drone')) {
      domain = 'Drone Aerial Surveillance & Reconnaissance';
      recommendations = [
        'Execute autonomous scheduled waypoint sweeps with FLIR thermal night-vision optical payloads.',
        'Provide live encrypted video downlinks to client security control desks and rapid response squads.',
        'Conduct rapid perimeter alarm verifications across sprawling industrial tank farms and pipeline rights-of-way.'
      ];
    } else if (q.includes('vip') || q.includes('escort') || q.includes('bodyguard') || q.includes('armored') || currentPath.includes('vip')) {
      domain = 'VIP Close Protection & Convoy Logistics';
      recommendations = [
        'Assign Close Protection Officers (CPOs) trained to British/UK security intelligence standards.',
        'Deploy certified B6/B7 ballistic armored SUVs with run-flat systems and satellite tracking.',
        'Provide VIP air-to-ground tarmac protocol transfers at Lagos (MMIA) and Abuja (NAIA) airports.'
      ];
    } else if (q.includes('pipeline') || q.includes('oil') || currentPath.includes('pipeline')) {
      domain = 'Pipeline & Energy Infrastructure Security';
      recommendations = [
        'Integrate distributed fiber-optic acoustic sensing (DAS) along pipeline right-of-ways.',
        'Deploy long-range drone patrols combined with riverine tactical intercept boats in the Niger Delta.',
        'Establish community intelligence liaison networks to prevent bunkering and illegal hot-tapping.'
      ];
    }

    return `### SafeNet Sentinel Advisory: ${domain}\n\n**Operational Brief for "${query}":**\nSafeNet Command telemetry has logged your inquiry. Our tactical security architects recommend the following multi-layered protocols:\n\n${recommendations.map(r => `* ${r}`).join('\n')}\n\n***\n\n### Recommended Next Actions:\n* **Book Physical Security Survey:** Contact our engineering team for an on-site facility vulnerability assessment.\n* **24/7 Command Hotline:** Call **+234 813 129 6054** or connect directly via WhatsApp for rapid guard mobilization.`;
  };

  // Send message to server with rich current page context
  const sendMessage = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || isLoading) return;

    setApiError(null);
    const userMessageId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMessageId,
        role: 'user',
        content: trimmed,
        timestamp: getTimestamp(),
        contextPage: currentPath
      }
    ];

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare request payload, excluding system and initial welcome
      const payloadMessages = newMessages
        .filter(m => m.role === 'user' || (m.role === 'assistant' && !m.id.startsWith('welcome-')))
        .map(m => ({
          role: m.role,
          content: m.content,
        }));

      // Ensure at least the user message is present
      if (payloadMessages.length === 0) {
        payloadMessages.push({
          role: 'user',
          content: trimmed
        });
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          // Page title and route for Gemini context-awareness
          pageTitle: activeContext.pageTitle,
          route: currentPath,
          currentPage: currentPath,
          context: {
            pageTitle: activeContext.pageTitle,
            route: currentPath,
            currentPage: currentPath,
            pageCategory: activeContext.pageCategory,
            domain: activeContext.domain,
            threatPriorities: activeContext.threatPriorities,
            pageSummary: activeContext.summary,
          },
        }),
      });

      if (!res.ok) {
        if (res.status === 404) {
          // If remote API returns 404 (e.g., static hosting / missing serverless routing), dispatch tactical intelligence
          const fallbackReply = generateTacticalFallback(trimmed, activeContext);
          const assistantMsg: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: fallbackReply,
            timestamp: getTimestamp(),
            contextPage: currentPath
          };
          setMessages(prev => [...prev, assistantMsg]);
          if (speechEnabled) {
            speakText(fallbackReply);
          }
          return;
        }

        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || 'SafeNet tactical signal acknowledged.';

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: getTimestamp(),
        contextPage: currentPath
      };

      setMessages(prev => [...prev, assistantMsg]);
      if (speechEnabled) {
        speakText(reply);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setApiError(err.message || 'Unable to establish secure transmission with SafeNet Sentinel AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setMessages([
      {
        id: `welcome-reset-${Date.now()}`,
        role: 'assistant',
        content: activeContext.welcomeMessage,
        timestamp: getTimestamp(),
        contextPage: currentPath
      }
    ]);
    setApiError(null);
  };

  // Helper to render markdown styling (bold, bullets, headings)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed break-words">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Headers
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-amber-400 font-bold text-xs sm:text-sm pt-1 uppercase tracking-wider flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                {trimmed.replace('### ', '')}
              </h4>
            );
          }
          if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
            return (
              <h3 key={idx} className="text-white font-extrabold text-sm sm:text-base pt-1.5 border-b border-slate-700/60 pb-1">
                {trimmed.replace(/^#+\s/, '')}
              </h3>
            );
          }

          // Bullet points
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
            const rawText = trimmed.replace(/^(\*|-|•)\s/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1.5 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: parseBold(rawText) }} />
              </div>
            );
          }

          // Numbered lists
          const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1.5 text-slate-200">
                <span className="font-mono text-[11px] font-bold text-amber-400 shrink-0 mt-0.5">
                  {numMatch[1]}.
                </span>
                <span dangerouslySetInnerHTML={{ __html: parseBold(numMatch[2]) }} />
              </div>
            );
          }

          // Standard paragraph
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: parseBold(trimmed) }} />
          );
        })}
      </div>
    );
  };

  // Safe bold text replacement
  const parseBold = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-amber-300 not-italic font-medium">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-amber-400 px-1 py-0.5 rounded text-[11px] font-mono">$1</code>');
  };

  const isMaritimePage = currentPath.includes('maritime');

  return (
    <>
      {/* Persistent Floating Trigger Button (Bottom Right) */}
      {!isAiChatOpen && (
        <div className="fixed bottom-6 right-22 sm:right-24 z-40">
          <button
            onClick={() => setIsAiChatOpen(true)}
            className="group relative flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-900/95 hover:bg-slate-900 border border-amber-400/60 hover:border-amber-400 text-white rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/50"
            aria-label={`Open SafeNet Sentinel AI Security Advisor for ${activeContext.pageTitle}`}
          >
            {/* Glowing Tactical Ring */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 opacity-40 group-hover:opacity-80 blur-[3px] transition duration-300"></span>
            
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-bold shadow-inner">
              {isMaritimePage ? (
                <Anchor className="w-5 h-5 stroke-[2.3]" />
              ) : (
                <Bot className="w-5 h-5 stroke-[2.3]" />
              )}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>

            <div className="relative hidden sm:flex flex-col text-left pr-1">
              <span className="text-xs font-extrabold tracking-tight text-white flex items-center gap-1">
                SafeNet Sentinel
                <Sparkles className="w-3 h-3 text-amber-400" />
              </span>
              <span className="text-[9.5px] font-mono font-medium text-emerald-400 tracking-wider truncate max-w-[140px] uppercase">
                {activeContext.pageTitle.slice(0, 16)} Context
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Interactive AI Chat Console / Drawer */}
      {isAiChatOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 ease-in-out flex flex-col shadow-2xl border border-slate-700/80 bg-slate-950/98 backdrop-blur-xl ${
            isExpanded
              ? 'inset-2 sm:inset-6 sm:max-w-4xl sm:mx-auto rounded-2xl'
              : 'bottom-2 sm:bottom-6 right-2 sm:right-6 w-[calc(100vw-1rem)] sm:w-[480px] h-[660px] max-h-[92vh] rounded-2xl'
          }`}
        >
          {/* Tactical Top Bar */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 rounded-t-2xl flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
                {isMaritimePage ? (
                  <Anchor className="w-5 h-5 stroke-[2.3]" />
                ) : (
                  <Bot className="w-5 h-5 stroke-[2.3]" />
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                    SafeNet Sentinel AI
                    <span className="text-[9.5px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded uppercase">
                      Gemini 3.8
                    </span>
                  </h3>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">
                    {activeContext.pageTitle} • Grounded Advisory
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              {/* Voice toggle */}
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                title={speechEnabled ? 'Mute AI voice output' : 'Enable voice read-out'}
                className={`p-1.5 rounded hover:text-white hover:bg-slate-800 transition-colors ${
                  speechEnabled ? 'text-amber-400 bg-amber-400/10' : ''
                }`}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Reset */}
              <button
                onClick={handleResetChat}
                title="Restart conversation"
                className="p-1.5 rounded hover:text-white hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Expand / Minimize */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore window size' : 'Expand window'}
                className="hidden sm:block p-1.5 rounded hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                onClick={() => setIsAiChatOpen(false)}
                title="Close AI Assistant"
                className="p-1.5 rounded hover:text-white hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Page Context Radar Banner */}
          <div className="bg-slate-900/80 border-b border-slate-800 px-3.5 py-2 text-[10.5px] font-mono shrink-0 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-400 shrink-0">Context:</span>
                <span className="text-amber-400 font-bold truncate">
                  {activeContext.pageTitle}
                </span>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="text-emerald-400 text-[10px] hidden sm:inline truncate">
                  {activeContext.badgeLabel}
                </span>
              </div>

              {/* Threat priorities dropdown toggle */}
              <button
                onClick={() => setShowThreatDrawer(!showThreatDrawer)}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 flex items-center gap-1 shrink-0 border border-slate-700 transition-colors"
                title="View prioritized threat vectors for this page"
              >
                <span>Threats ({activeContext.threatPriorities.length})</span>
                {showThreatDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Collapsible Threat Priority Breakdown */}
            {showThreatDrawer && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1.5 animate-fadeIn">
                <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Prioritized Threat Vectors for {activeContext.pageTitle}:</span>
                </div>
                <div className="space-y-1 pl-1">
                  {activeContext.threatPriorities.map((threat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sendMessage(`How does SafeNet counter this specific threat for ${activeContext.pageTitle}: "${threat}"?`);
                        setShowThreatDrawer(false);
                      }}
                      className="w-full text-left text-[11px] text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 px-2 py-1 rounded flex items-center justify-between group transition-colors"
                    >
                      <span className="truncate pr-2">• {threat}</span>
                      <span className="text-[10px] text-amber-400 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0">
                        <span>Consult</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-100 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant';
              const isSystem = m.role === 'system';

              // System Notification (e.g. page transition)
              if (isSystem) {
                return (
                  <div key={m.id} className="py-1 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-[11px] leading-relaxed flex items-start gap-2">
                    <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div dangerouslySetInnerHTML={{ __html: parseBold(m.content) }} />
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mb-1 px-1">
                    {isAssistant ? (
                      <>
                        <Shield className="w-3 h-3 text-amber-400" />
                        <span className="font-semibold text-slate-300">SafeNet Sentinel</span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                        {m.contextPage && (
                          <>
                            <span>•</span>
                            <span className="text-amber-400/80">{activeContext.pageTitle}</span>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <span>Client Transmission</span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`relative group max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                      isAssistant
                        ? 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-tl-sm'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-sm selection:bg-slate-950 selection:text-white'
                    }`}
                  >
                    {isAssistant ? (
                      renderFormattedContent(m.content)
                    ) : (
                      <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap">
                        {m.content}
                      </p>
                    )}

                    {/* Copy Button */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(m.id, m.content)}
                        className={`p-1 rounded text-[10px] ${
                          isAssistant
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                        title="Copy message"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Assistant Contextual Follow-up Actions */}
                  {isAssistant && !m.id.startsWith('welcome-') && (
                    <div className="flex flex-wrap items-center gap-2 mt-2 ml-1">
                      <button
                        onClick={() => {
                          setIsAiChatOpen(false);
                          navigate('/request-quote');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 rounded transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Request Formal Proposal</span>
                      </button>

                      <a
                        href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello SafeNet Operations, I consulted with Sentinel AI regarding ${activeContext.pageTitle} security. I would like to speak directly with an operations officer.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/30 rounded transition-colors"
                      >
                        <Radio className="w-3 h-3 text-emerald-400" />
                        <span>Dispatch on WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Contextual Starter Suggestion Chips (Dynamically tailored to active page) */}
            {messages.filter(m => m.role !== 'system').length <= 2 && (
              <div className="pt-2 pb-1 space-y-2">
                <div className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Recommended for {activeContext.pageTitle}:</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">Click to inquire</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeContext.starterPrompts.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(item.prompt)}
                      className="text-left p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-400/50 transition-all text-xs group"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-white group-hover:text-amber-400 mb-1">
                        <span>{item.icon}</span>
                        <span className="truncate">{item.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                        {item.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2 text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-mono font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <span>Analyzing {activeContext.pageTitle} threat vectors & tactics...</span>
                  </div>
                  <div className="mt-2 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* API Error Notification */}
            {apiError && (
              <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="font-semibold text-white">Transmission Interruption</div>
                  <div className="text-[11px] text-red-300">{apiError}</div>
                  <button
                    onClick={() => {
                      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
                      if (lastUserMsg) sendMessage(lastUserMsg.content);
                    }}
                    className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1 pt-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retry Last Signal</span>
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Threat Vector Shortcuts Strip */}
          <div className="bg-slate-900/60 border-t border-slate-800/80 px-3 py-1.5 overflow-x-auto whitespace-nowrap flex items-center gap-1.5 scrollbar-none text-[10.5px]">
            <span className="text-slate-500 font-mono flex items-center gap-1 shrink-0">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>Prioritize:</span>
            </span>
            {activeContext.threatPriorities.slice(0, 3).map((threat, idx) => {
              const shortLabel = threat.split(',')[0].split('&')[0].trim();
              return (
                <button
                  key={idx}
                  onClick={() => sendMessage(`Evaluate defense tactics against ${threat} for our ${activeContext.pageTitle} operations.`)}
                  className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-400/40 shrink-0 transition-colors"
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>

          {/* Quick Assessment Bridge Ribbon */}
          <div className="bg-slate-900/40 border-t border-slate-800/80 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3 h-3 text-amber-400" />
              Need an on-site security survey?
            </span>
            <button
              onClick={() => {
                setIsAiChatOpen(false);
                navigate('/security-assessment');
              }}
              className="text-amber-400 hover:text-amber-300 font-semibold hover:underline flex items-center gap-0.5"
            >
              Interactive Security Audit &rarr;
            </button>
          </div>

          {/* Input Console */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 rounded-b-2xl shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="relative flex items-end gap-2"
            >
              <div className="relative flex-1 bg-slate-950 border border-slate-700/80 rounded-xl focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all overflow-hidden">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isMaritimePage 
                      ? 'Ask Sentinel AI about Gulf of Guinea piracy, ISPS code, escort boats...' 
                      : `Ask Sentinel AI about ${activeContext.pageTitle.toLowerCase()}, threats, or tactical solutions...`
                  }
                  rows={2}
                  disabled={isLoading}
                  className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none resize-none disabled:opacity-50"
                />

                {/* Speech Dictation Button */}
                <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    title={isListening ? 'Stop listening' : 'Dictate security question'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isListening
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="h-10 px-4 bg-amber-400 hover:bg-amber-300 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-bold rounded-xl flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0"
                title={`Transmit inquiry to SafeNet Sentinel (${activeContext.pageTitle} Focus)`}
              >
                <Send className="w-4 h-4 stroke-[2.4]" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1.5 px-1">
              <span>Shift+Enter for new line • Enter to transmit</span>
              <span className="text-amber-400/80">{activeContext.domain}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
