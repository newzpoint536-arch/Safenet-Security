import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  ChevronDown, 
  Menu, 
  X, 
  Phone, 
  FileText, 
  Sliders, 
  Lock,
  Camera,
  Users,
  Compass,
  Building2,
  Anchor,
  Cpu,
  Bot,
  Sparkles,
  Search
} from 'lucide-react';
import { SiteSearch } from './SiteSearch';

export const Header: React.FC = () => {
  const { currentPath, navigate, siteSettings, setIsAiChatOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [industriesDropdown, setIndustriesDropdown] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const [resourcesDropdown, setResourcesDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcut to trigger sitewide search (Cmd+K / Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }
      // Slash shortcut when not typing in an input/textarea
      if (
        e.key === '/' && 
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesDropdown(false);
      }
      if (industriesRef.current && !industriesRef.current.contains(e.target as Node)) {
        setIndustriesDropdown(false);
      }
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutDropdown(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAll = () => {
    setServicesDropdown(false);
    setIndustriesDropdown(false);
    setAboutDropdown(false);
    setResourcesDropdown(false);
    setMobileMenuOpen(false);
  };

  const handleNav = (path: string) => {
    navigate(path);
    closeAll();
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      {/* Top Bar Contract: Zone 1 (Brand) — Zone 2 (Nav Links) — Zone 3 (Primary Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark with icon */}
        <button 
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded p-1"
        >
          <div className="w-10 h-10 rounded bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md group-hover:scale-105 transition-transform duration-200">
            <Shield className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-white leading-tight">
              SAFENET
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-amber-400 leading-none">
              SECURITY SOLUTIONS
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          
          <button 
            onClick={() => handleNav('/')}
            className={`transition-colors py-2 ${isActive('/') ? 'text-amber-400 font-semibold' : 'hover:text-white'}`}
          >
            Home
          </button>

          {/* Services Mega Dropdown */}
          <div className="relative" ref={servicesRef}>
            <button 
              onClick={() => setServicesDropdown(!servicesDropdown)}
              onMouseEnter={() => setServicesDropdown(true)}
              className={`flex items-center gap-1.5 py-2 transition-colors ${isActive('/services') ? 'text-amber-400 font-semibold' : 'hover:text-white'}`}
              aria-expanded={servicesDropdown}
            >
              <span>Services</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdown ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {servicesDropdown && (
              <div 
                onMouseLeave={() => setServicesDropdown(false)}
                className="absolute left-1/2 -translate-x-1/2 mt-1 w-[780px] bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl p-6 grid grid-cols-2 gap-6 z-50"
              >
                <div>
                  <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-amber-400">
                    <Camera className="w-4 h-4" />
                    <span>Surveillance Systems</span>
                  </div>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <button onClick={() => handleNav('/services/cctv-installation-monitoring')} className="text-left w-full hover:text-amber-400 transition-colors py-1">
                        <div className="font-medium text-white">CCTV Installation & Monitoring</div>
                        <div className="text-slate-400 text-[11px]">24/7 central monitoring & IP thermal optics</div>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNav('/services/drone-surveillance-security')} className="text-left w-full hover:text-amber-400 transition-colors py-1">
                        <div className="font-medium text-white">Drone Surveillance Security</div>
                        <div className="text-slate-400 text-[11px]">Autonomous aerial sweeps & night reconnaissance</div>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNav('/services/access-control-systems')} className="text-left w-full hover:text-amber-400 transition-colors py-1">
                        <div className="font-medium text-white">Access Control Systems</div>
                        <div className="text-slate-400 text-[11px]">Biometrics, speed turnstiles & smart visitor verification</div>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNav('/services/alarm-system-installation')} className="text-left w-full hover:text-amber-400 transition-colors py-1">
                        <div className="font-medium text-white">Alarm System Installation</div>
                        <div className="text-slate-400 text-[11px]">Dual-path intruder beams & vibration perimeter cables</div>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNav('/services/vehicle-tracking-gps-fleet-management')} className="text-left w-full hover:text-amber-400 transition-colors py-1">
                        <div className="font-medium text-white">Vehicle Tracking / GPS Fleet</div>
                        <div className="text-slate-400 text-[11px]">Satellite fleet telematics & remote immobilization</div>
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-amber-400">
                    <Shield className="w-4 h-4" />
                    <span>Physical & Specialist Security</span>
                  </div>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <button onClick={() => handleNav('/services/armed-unarmed-security-guards')} className="text-left w-full hover:text-amber-400 transition-colors py-1">
                        <div className="font-medium text-white">Armed & Unarmed Security Guards</div>
                        <div className="text-slate-400 text-[11px]">Vetted, disciplined personnel with electronic RFID patrol wands</div>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNav('/services/corporate-security')} className="text-left w-full hover:text-amber-400 transition-colors py-1">
                        <div className="font-medium text-white">Corporate Security Management</div>
                        <div className="text-slate-400 text-[11px]">Suited concierge and executive headquarters defense</div>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNav('/services/vip-escort-bodyguard-services')} className="text-left w-full hover:text-amber-400 transition-colors py-1">
                        <div className="font-medium text-white">VIP Escort / Close Protection</div>
                        <div className="text-slate-400 text-[11px]">B6/B7 armored SUVs, police liaison & advance reconnaissance</div>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNav('/services/maritime-security')} className="text-left w-full hover:text-amber-400 transition-colors py-1">
                        <div className="font-medium text-white">Maritime & Offshore Security</div>
                        <div className="text-slate-400 text-[11px]">ISPS code audits, coastal patrol craft & terminal defense</div>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNav('/services/pipeline-surveillance-security')} className="text-left w-full hover:text-amber-400 transition-colors py-1">
                        <div className="font-medium text-white">Pipeline Surveillance Security</div>
                        <div className="text-slate-400 text-[11px]">Fiber acoustic sensing & long-range drone interdiction</div>
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="col-span-2 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    Looking for independent audits or personnel academies?
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => handleNav('/services/security-consulting')} className="text-amber-400 hover:underline font-medium">
                      Security Consulting
                    </button>
                    <button onClick={() => handleNav('/services/advanced-specialist-security-training')} className="text-amber-400 hover:underline font-medium">
                      Specialist Training
                    </button>
                    <button onClick={() => handleNav('/services')} className="text-white hover:text-amber-400 font-medium">
                      View All 16 Services &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Industries Dropdown */}
          <div className="relative" ref={industriesRef}>
            <button 
              onClick={() => setIndustriesDropdown(!industriesDropdown)}
              onMouseEnter={() => setIndustriesDropdown(true)}
              className={`flex items-center gap-1.5 py-2 transition-colors ${isActive('/industries') ? 'text-amber-400 font-semibold' : 'hover:text-white'}`}
            >
              <span>Industries</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${industriesDropdown ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {industriesDropdown && (
              <div 
                onMouseLeave={() => setIndustriesDropdown(false)}
                className="absolute left-1/2 -translate-x-1/2 mt-1 w-64 bg-slate-900 border border-slate-700/80 rounded-lg shadow-xl p-3 space-y-1 z-50"
              >
                <button onClick={() => handleNav('/industries/corporate')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Corporate Organizations
                </button>
                <button onClick={() => handleNav('/industries/financial-institutions')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Banks & Financial Institutions
                </button>
                <button onClick={() => handleNav('/industries/residential-estates')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Residential Estates & CDAs
                </button>
                <button onClick={() => handleNav('/industries/oil-and-gas')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Oil & Gas Facilities
                </button>
                <button onClick={() => handleNav('/industries/maritime')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Maritime & Offshore Terminals
                </button>
                <button onClick={() => handleNav('/industries/industrial')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Industrial & Manufacturing
                </button>
                <button onClick={() => handleNav('/industries')} className="text-left w-full px-3 py-2 text-xs rounded font-semibold text-amber-400 border-t border-slate-800 mt-1 pt-2">
                  Explore All Industries &rarr;
                </button>
              </div>
            )}
          </div>

          {/* About Dropdown */}
          <div className="relative" ref={aboutRef}>
            <button 
              onClick={() => setAboutDropdown(!aboutDropdown)}
              onMouseEnter={() => setAboutDropdown(true)}
              className={`flex items-center gap-1.5 py-2 transition-colors ${isActive('/about') ? 'text-amber-400 font-semibold' : 'hover:text-white'}`}
            >
              <span>About</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aboutDropdown ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {aboutDropdown && (
              <div 
                onMouseLeave={() => setAboutDropdown(false)}
                className="absolute left-1/2 -translate-x-1/2 mt-1 w-56 bg-slate-900 border border-slate-700/80 rounded-lg shadow-xl p-3 space-y-1 z-50"
              >
                <button onClick={() => handleNav('/about')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  About SafeNet Security
                </button>
                <button onClick={() => handleNav('/about#why-choose-us')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Why Choose Us
                </button>
                <button onClick={() => handleNav('/about#how-we-work')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Our 4-Step Approach
                </button>
                <button onClick={() => handleNav('/licences-compliance')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Licences & Compliance
                </button>
                <button onClick={() => handleNav('/projects')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Projects & Case Studies
                </button>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div className="relative" ref={resourcesRef}>
            <button 
              onClick={() => setResourcesDropdown(!resourcesDropdown)}
              onMouseEnter={() => setResourcesDropdown(true)}
              className={`flex items-center gap-1.5 py-2 transition-colors ${isActive('/blog') || isActive('/security-assessment') || isActive('/careers') ? 'text-amber-400 font-semibold' : 'hover:text-white'}`}
            >
              <span>Resources</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${resourcesDropdown ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {resourcesDropdown && (
              <div 
                onMouseLeave={() => setResourcesDropdown(false)}
                className="absolute left-1/2 -translate-x-1/2 mt-1 w-60 bg-slate-900 border border-slate-700/80 rounded-lg shadow-xl p-3 space-y-1 z-50"
              >
                <button onClick={() => handleNav('/blog')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Security Insights & Blog
                </button>
                <button onClick={() => handleNav('/security-assessment')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Interactive Security Assessment
                </button>
                <button onClick={() => handleNav('/faq')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Frequently Asked Questions (FAQ)
                </button>
                <button onClick={() => handleNav('/careers')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Careers & Recruitment
                </button>
                <button onClick={() => handleNav('/contact')} className="text-left w-full px-3 py-2 text-xs rounded hover:bg-slate-800 text-white hover:text-amber-400 transition-colors">
                  Contact SafeNet
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => handleNav('/contact')}
            className={`transition-colors py-2 ${isActive('/contact') ? 'text-amber-400 font-semibold' : 'hover:text-white'}`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions & Search */}
        <div className="hidden sm:flex items-center gap-2">
          {/* SiteSearch Component integrated into Header navigation */}
          <SiteSearch 
            isOpen={isSearchOpen} 
            onOpen={() => setIsSearchOpen(true)}
            onClose={() => setIsSearchOpen(false)} 
            variant="nav"
          />

          <button
            onClick={() => setIsAiChatOpen(true)}
            title="Launch SafeNet Sentinel AI Security Advisor"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-300 hover:text-amber-200 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 rounded-md transition-all shadow-sm group cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Sentinel AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

          <button
            onClick={() => handleNav('/admin')}
            title="Command Centre Management"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 rounded-md border border-slate-800 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Command CMS</span>
          </button>

          <button 
            onClick={() => handleNav('/request-quote')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-md transition-all shadow-sm hover:shadow-amber-500/20 whitespace-nowrap cursor-pointer"
          >
            Request a Quote
          </button>
        </div>

        {/* Mobile Menu Toggle & Search */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md focus:outline-none"
            aria-label="Open Sitewide Search"
            title="Search sitewide (⌘K)"
          >
            <Search className="w-5 h-5 text-amber-400" />
          </button>
          <button 
            onClick={() => handleNav('/request-quote')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 rounded transition-all whitespace-nowrap"
          >
            Quote
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 max-h-[85vh] overflow-y-auto">
          {/* AI Advisor Mobile Quick Launch */}
          <button
            onClick={() => {
              setIsAiChatOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-500/15 to-emerald-500/10 border border-amber-400/40 rounded-xl text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  SafeNet Sentinel AI
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">Live Tactical Advisor</div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold uppercase">
              Launch &rarr;
            </span>
          </button>

          {/* Sitewide Search Mobile Trigger */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsSearchOpen(true);
            }}
            className="w-full flex items-center justify-between p-3 bg-slate-900 border border-slate-800 hover:border-amber-400/40 rounded-xl text-left transition-colors"
          >
            <div className="flex items-center gap-2.5 text-slate-300 text-xs font-medium">
              <Search className="w-4 h-4 text-amber-400" />
              <span>Search services, case studies, blog...</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ⌘K
            </span>
          </button>

          <div className="flex flex-col space-y-1 text-sm font-medium">
            <button onClick={() => handleNav('/')} className="text-left py-2 px-3 rounded hover:bg-slate-900 text-white">
              Home
            </button>
            <button onClick={() => handleNav('/services')} className="text-left py-2 px-3 rounded hover:bg-slate-900 text-white">
              Services Overview
            </button>
            <div className="pl-4 space-y-1 text-xs text-slate-400">
              <button onClick={() => handleNav('/services/cctv-installation-monitoring')} className="block py-1 hover:text-amber-400">CCTV Installation & Monitoring</button>
              <button onClick={() => handleNav('/services/drone-surveillance-security')} className="block py-1 hover:text-amber-400">Drone Surveillance</button>
              <button onClick={() => handleNav('/services/armed-unarmed-security-guards')} className="block py-1 hover:text-amber-400">Manned Security Guards</button>
              <button onClick={() => handleNav('/services/maritime-security')} className="block py-1 hover:text-amber-400">Maritime Security</button>
              <button onClick={() => handleNav('/services/vip-escort-bodyguard-services')} className="block py-1 hover:text-amber-400">VIP Escort & Close Protection</button>
            </div>
            <button onClick={() => handleNav('/industries')} className="text-left py-2 px-3 rounded hover:bg-slate-900 text-white">
              Industries Served
            </button>
            <button onClick={() => handleNav('/about')} className="text-left py-2 px-3 rounded hover:bg-slate-900 text-white">
              About SafeNet
            </button>
            <button onClick={() => handleNav('/security-assessment')} className="text-left py-2 px-3 rounded hover:bg-slate-900 text-amber-400 font-semibold">
              Interactive Security Assessment
            </button>
            <button onClick={() => handleNav('/faq')} className="text-left py-2 px-3 rounded hover:bg-slate-900 text-white">
              Frequently Asked Questions (FAQ)
            </button>
            <button onClick={() => handleNav('/blog')} className="text-left py-2 px-3 rounded hover:bg-slate-900 text-white">
              Security Insights & Blog
            </button>
            <button onClick={() => handleNav('/careers')} className="text-left py-2 px-3 rounded hover:bg-slate-900 text-white">
              Careers
            </button>
            <button onClick={() => handleNav('/contact')} className="text-left py-2 px-3 rounded hover:bg-slate-900 text-white">
              Contact SafeNet
            </button>
            <button onClick={() => handleNav('/admin')} className="text-left py-2 px-3 rounded bg-slate-900 text-amber-400 font-mono-numbers">
              Command CMS Portal
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <a 
              href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`} 
              className="flex items-center gap-2 text-xs text-slate-300 py-1"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{siteSettings.phone}</span>
            </a>
            <button 
              onClick={() => handleNav('/request-quote')}
              className="w-full py-2.5 text-center font-semibold text-slate-950 bg-amber-400 rounded-md text-xs"
            >
              Request a Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
