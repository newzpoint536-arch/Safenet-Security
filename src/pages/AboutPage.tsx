import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Globe, Award, CheckCircle, ArrowRight, MapPin, Eye, Lock, Target, Users } from 'lucide-react';
import imgCommand from '../assets/images/hero_nigerian_security_command_1790574276695.jpg';
import imgGuards from '../assets/images/hero_nigerian_corporate_guards_1790574288138.jpg';

export const AboutPage: React.FC = () => {
  const { siteSettings, navigate } = useApp();

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-20">
      
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Shield className="w-4 h-4" />
            <span>Corporate Foundation & Identity</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            About SafeNet Security Solutions Ltd
          </h1>
          <p className="text-base text-slate-300 leading-relaxed font-normal">
            SafeNet Security Solutions Ltd is a fully incorporated, professionally managed corporate security company established in {siteSettings.establishedYear}. With our head office in the United Kingdom and operational branches across Nigeria, we bridge international security best practices with deep Nigerian operational knowledge.
          </p>
        </div>
      </div>

      {/* Strategic Foundation Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              UK Governance Coupled With Nigerian Operational Mastery
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Operating in Nigeria requires far more than theoretical guidelines; it demands an intricate understanding of regional dynamics, community engagement, and practical logistics. SafeNet was founded to eliminate the disconnect between foreign security consultants who lack local roots, and conventional local security providers who lack international discipline.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              We deliver reliable, innovative, and professional security solutions protecting lives, properties, and commercial assets through strictly vetted personnel, deployed surveillance technology, and unyielding supervisory excellence.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="space-y-1">
                <div className="text-xs uppercase font-semibold tracking-wider text-amber-400">
                  Head Office
                </div>
                <div className="text-sm text-white font-medium">London, United Kingdom</div>
                <div className="text-xs text-slate-400">{siteSettings.addressUK}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs uppercase font-semibold tracking-wider text-amber-400">
                  Operational Hub
                </div>
                <div className="text-sm text-white font-medium">Lagos, Nigeria</div>
                <div className="text-xs text-slate-400">{siteSettings.addressNigeria}</div>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-slate-800 shadow-2xl">
            <img 
              src={imgCommand} 
              alt="SafeNet Command Room Operators in Nigeria"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-300 bg-slate-950/80 backdrop-blur-md p-3 rounded border border-slate-800">
              Central Monitoring Station in Lagos coordinating multi-site CCTV feeds, drone telemetry, and armed response dispatch.
            </div>
          </div>

        </div>
      </div>

      {/* Mission, Vision & Core Values */}
      <div className="bg-slate-900 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 space-y-4">
              <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center text-amber-400">
                <Target className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">
                Our Mission
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                To deliver dependable, technology-driven, and highly professional corporate security solutions that empower commercial institutions, families, and critical industries in Nigeria to thrive without fear of disruption.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 space-y-4">
              <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center text-amber-400">
                <Eye className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">
                Our Vision
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                To be the undisputed benchmark of security integrity, operational responsiveness, and surveillance innovation in West Africa, recognized for unwavering vigilance and corporate trust.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 space-y-4">
              <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center text-amber-400">
                <Lock className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">
                Core Values
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Vigilance</strong> — Proactive detection over reactive panic.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Integrity</strong> — Total transparency and ethical accountability.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Innovation</strong> — Integrating drones, AI, and biometrics.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Dignity</strong> — Respect for our officers and the clients we guard.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Operational Approach: The 4 Pillars */}
      <div id="our-approach" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Methodology & Standards
          </span>
          <h2 className="text-3xl font-display font-extrabold text-white">
            How We Enforce Operational Discipline
          </h2>
          <p className="text-xs text-slate-400">
            Every deployment follows standardized operational protocols audited by our UK and Nigerian leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="text-amber-400 font-mono text-sm font-bold">01. Vetting & Profiling</div>
            <h4 className="text-sm font-display font-bold text-white">100% Criminal Background Checks</h4>
            <p className="text-xs text-slate-400">Multi-tier screening including fingerprinted criminal record verification, community guarantors, and psychological suitability checks.</p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="text-amber-400 font-mono text-sm font-bold">02. Academy Training</div>
            <h4 className="text-sm font-display font-bold text-white">UK-Modeled Curriculum</h4>
            <p className="text-xs text-slate-400">Intensive practical academies covering access control, threat de-escalation, CPR & first aid, fire prevention, and digital incident reporting.</p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="text-amber-400 font-mono text-sm font-bold">03. Electronic Oversight</div>
            <h4 className="text-sm font-display font-bold text-white">RFID Patrol Verification</h4>
            <p className="text-xs text-slate-400">Guards must scan digital NFC checkpoints every 30 minutes. Missed scans trigger automated alerts at our 24/7 central command.</p>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="text-amber-400 font-mono text-sm font-bold">04. Armed Response Staging</div>
            <h4 className="text-sm font-display font-bold text-white">Dedicated Patrol Units</h4>
            <p className="text-xs text-slate-400">Staged mobile intervention units stationed across commercial zones, ready to provide immediate armed backup to static guards.</p>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-display font-bold text-white">
              Discuss Your Security Program With Our Leadership
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Connect directly with our operations directorate for an in-depth security consultation.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => navigate('/contact')}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700"
            >
              Contact SafeNet
            </button>
            <button
              onClick={() => navigate('/request-quote')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md shadow-md"
            >
              Request a Quote
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
