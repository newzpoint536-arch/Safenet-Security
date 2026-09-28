import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, FileCheck, CheckCircle2, Award, Landmark, Plane, Anchor, Lock } from 'lucide-react';

export const LicencesCompliancePage: React.FC = () => {
  const { siteSettings, navigate } = useApp();

  const complianceStandards = [
    {
      title: 'Corporate Incorporation (UK & Nigeria)',
      institution: 'Corporate Affairs Commission (CAC) & UK Companies House',
      description: 'Fully incorporated private limited company registered in the United Kingdom and Nigeria, established in 2025.',
      icon: Landmark
    },
    {
      title: 'Private Security Regulatory Compliance',
      institution: 'Nigeria Security and Civil Defence Corps (NSCDC)',
      description: 'Licensed and compliant with federal private guard company regulations, mandatory staff vetting, and operational oversight.',
      icon: ShieldCheck
    },
    {
      title: 'Commercial Drone Flight Clearances',
      institution: 'Nigerian Civil Aviation Authority (NCAA)',
      description: 'Operations executed by certified drone pilots holding valid Remote Pilot Licenses (RPL), with authorized industrial airspace clearances.',
      icon: Plane
    },
    {
      title: 'Maritime & Port Facility Security (ISPS)',
      institution: 'International Maritime Organization (IMO) / NIMASA / Nigerian Navy',
      description: 'Adherence to International Ship and Port Facility Security (ISPS) Code for coastal terminals, escort vessels, and offshore jetties.',
      icon: Anchor
    },
    {
      title: 'Data Privacy & Surveillance Ethics',
      institution: 'Nigeria Data Protection Commission (NDPC / NDPR)',
      description: 'Strict handling of CCTV video retention, biometric facial templates, and access logs adhering to NDPR and international privacy standards.',
      icon: Lock
    },
    {
      title: 'Occupational Health & Safety (HSE)',
      institution: 'Federal Ministry of Labour & International OSHA Guidelines',
      description: 'Zero-harm policy encompassing tactical body armor certification, trauma first aid kits on every site, and continuous fire drills.',
      icon: Award
    }
  ];

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-16">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <FileCheck className="w-4 h-4" />
          <span>Regulatory Integrity & Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
          Licences, Accreditations & Compliance
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          SafeNet Security Solutions Ltd operates under strict corporate governance, federal licensing, and international compliance across the United Kingdom and Nigeria.
        </p>
      </div>

      {/* Standards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complianceStandards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="text-base font-display font-bold text-white">
                    {item.title}
                  </h3>
                  <div className="text-xs font-semibold text-amber-400/90 font-mono">
                    {item.institution}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Verified & Current</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Corporate Verification Notice */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-display font-bold text-white">
            Official Due Diligence & Vendor Registration
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Enterprise procurement departments, banking boards, and oil & gas operators may request our official Certificate of Incorporation, Tax Clearance, Pension Compliance (PENCOM), Industrial Training Fund (ITF) documentation, and public liability insurance schedules during vendor onboarding.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors"
            >
              Request Compliance Dossier
            </button>
            <button
              onClick={() => navigate('/request-quote')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded border border-slate-700"
            >
              Initiate Commercial Tender
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
