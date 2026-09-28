import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Phone, Mail, MapPin, ExternalLink, ArrowRight, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, siteSettings } = useApp();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      {/* Pre-footer Callout Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
              Operational Readiness
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
              Ready to fortify your facility or asset perimeter?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Connect with our senior risk consultants for an on-site vulnerability assessment or customized commercial proposal.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/security-assessment')}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
            >
              Take Security Assessment
            </button>
            <button
              onClick={() => navigate('/request-quote')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-all shadow-md hover:shadow-amber-500/20"
            >
              Request a Quote
            </button>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Foundation */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-slate-950">
                <Shield className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-display font-bold text-lg text-white">SAFENET</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              SafeNet Security Solutions Ltd delivers international best-practice physical and technical defense across Nigeria. Established in 2025 with UK operational standards and Nigerian local expertise.
            </p>
            <div className="pt-2 text-xs space-y-1.5">
              <div className="text-slate-300 font-medium">Head Office (UK):</div>
              <div className="text-slate-400 text-[11px]">{siteSettings.addressUK}</div>
              <div className="text-slate-300 font-medium pt-1">Operations (Nigeria):</div>
              <div className="text-slate-400 text-[11px]">{siteSettings.addressNigeria}</div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/services/cctv-installation-monitoring')} className="hover:text-amber-400 transition-colors">
                  CCTV Installation & Monitoring
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services/drone-surveillance-security')} className="hover:text-amber-400 transition-colors">
                  Drone Surveillance Security
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services/armed-unarmed-security-guards')} className="hover:text-amber-400 transition-colors">
                  Armed & Unarmed Guards
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services/access-control-systems')} className="hover:text-amber-400 transition-colors">
                  Biometric Access Control
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services/maritime-security')} className="hover:text-amber-400 transition-colors">
                  Maritime & Coastal Security
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services/vip-escort-bodyguard-services')} className="hover:text-amber-400 transition-colors">
                  VIP Escort & Close Protection
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services/pipeline-surveillance-security')} className="hover:text-amber-400 transition-colors">
                  Pipeline Surveillance Security
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="text-amber-400 font-medium hover:underline pt-1 inline-flex items-center gap-1">
                  All 16 Services <ArrowRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Industries */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Industries
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/industries/corporate')} className="hover:text-amber-400 transition-colors">
                  Corporate Organizations
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/industries/financial-institutions')} className="hover:text-amber-400 transition-colors">
                  Banks & Financial Institutions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/industries/residential-estates')} className="hover:text-amber-400 transition-colors">
                  Residential Estates & CDAs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/industries/oil-and-gas')} className="hover:text-amber-400 transition-colors">
                  Oil & Gas Facilities
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/industries/maritime')} className="hover:text-amber-400 transition-colors">
                  Maritime & Ports
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/industries/industrial')} className="hover:text-amber-400 transition-colors">
                  Industrial & Manufacturing
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/industries')} className="hover:text-amber-400 transition-colors">
                  Critical Infrastructure
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Resources & About
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-amber-400 transition-colors">
                  About SafeNet Security
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/projects')} className="hover:text-amber-400 transition-colors">
                  Projects & Case Studies
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/blog')} className="hover:text-amber-400 transition-colors">
                  Security Insights & Blog
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/security-assessment')} className="hover:text-amber-400 transition-colors">
                  Interactive Risk Diagnostic
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/licences-compliance')} className="hover:text-amber-400 transition-colors">
                  Licences & Compliance
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-amber-400 transition-colors">
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/careers')} className="hover:text-amber-400 transition-colors">
                  Careers & Recruitment
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="text-slate-400 hover:text-amber-400 inline-flex items-center gap-1.5 transition-colors">
                  <Lock className="w-3 h-3" /> Command Center CMS
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info & Emergency */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Contact & Dispatch
            </h4>
            <div className="space-y-2.5 text-xs">
              <a 
                href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors font-medium"
              >
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{siteSettings.phone}</span>
              </a>

              <a 
                href={`mailto:${siteSettings.email}`}
                className="flex items-center gap-2 hover:text-amber-400 transition-colors truncate"
              >
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{siteSettings.email}</span>
              </a>

              <div className="flex items-start gap-2 pt-1 text-slate-400">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Victoria Island, Lagos & Port Harcourt Operational Hubs</span>
              </div>
            </div>

            <div className="pt-3">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                Official Channels
              </div>
              <div className="flex items-center gap-2.5">
                <a 
                  href={siteSettings.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
                  aria-label="LinkedIn"
                >
                  <span className="text-xs font-bold font-mono">in</span>
                </a>
                <a 
                  href={siteSettings.socialLinks.facebook} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
                  aria-label="Facebook"
                >
                  <span className="text-xs font-bold font-mono">fb</span>
                </a>
                <a 
                  href={siteSettings.socialLinks.x} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
                  aria-label="X / Twitter"
                >
                  <span className="text-xs font-bold font-mono">X</span>
                </a>
                <a 
                  href={siteSettings.socialLinks.instagram} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
                  aria-label="Instagram"
                >
                  <span className="text-xs font-bold font-mono">ig</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} {siteSettings.companyName}. All rights reserved. RC Registered in Nigeria & UK.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/licences-compliance')} className="hover:text-white transition-colors">
              Compliance & Ethics
            </button>
            <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
              Emergency Contact
            </button>
            <button onClick={() => navigate('/admin')} className="text-amber-400 hover:underline">
              CMS Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
