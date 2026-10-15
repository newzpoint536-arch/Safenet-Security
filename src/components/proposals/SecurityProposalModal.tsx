import React, { useRef } from 'react';
import { 
  Shield, 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Building2, 
  Check, 
  FileCheck2,
  Lock
} from 'lucide-react';
import { ProposalBlueprint } from '../../types';

interface SecurityProposalModalProps {
  proposal: ProposalBlueprint;
  onClose: () => void;
}

export const SecurityProposalModal: React.FC<SecurityProposalModalProps> = ({ proposal, onClose }) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(proposal.generatedDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Top Action Bar (hidden on print) */}
        <div className="print:hidden bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-amber-400 flex items-center justify-center text-slate-950">
              <FileCheck2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Official Security Diagnostic Proposal</div>
              <div className="text-[10px] text-slate-400 font-mono">Ref: {proposal.referenceCode}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Proposal Document Body */}
        <div 
          ref={printAreaRef}
          className="p-8 sm:p-12 bg-white text-slate-900 space-y-8 print:p-0 print:m-0 print:bg-white print:text-black"
        >
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                  <Shield className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="font-display font-black text-2xl tracking-tight text-slate-950">
                  SAFENET
                </div>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
                SECURITY SOLUTIONS LTD
              </div>
              <div className="text-[11px] text-slate-600 max-w-sm pt-1">
                Nigeria Operational HQ: Plot 14, Commercial Avenue, Victoria Island, Lagos.<br />
                UK Liaison: 85 Great Portland St, London, W1W 7LT.<br />
                Licence: NSCDC Category A · ISO 9001:2015 · ISO 18788 Certified
              </div>
            </div>

            <div className="sm:text-right space-y-1 text-xs">
              <div className="text-[10px] font-mono uppercase font-bold text-slate-500">Proposal Document Code</div>
              <div className="font-mono text-base font-black text-slate-900">{proposal.referenceCode}</div>
              <div className="text-slate-600">Date Generated: {formattedDate}</div>
              <div className="text-slate-600 font-semibold text-emerald-700">Validity: 30 Calendar Days</div>
            </div>
          </div>

          {/* Client & Facility Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Target Client</span>
              <div className="font-bold text-slate-900 text-sm">{proposal.client.name}</div>
              <div className="text-slate-700">{proposal.client.company}</div>
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Site & Facility Profile</span>
              <div className="font-bold text-slate-900 text-sm">{proposal.client.facilityType}</div>
              <div className="text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{proposal.client.location}</span>
              </div>
            </div>
          </div>

          {/* Vulnerability Index Score Badge */}
          <div className="p-4 rounded-xl border-2 border-slate-900 bg-amber-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                Facility Security Vulnerability Index (PSVA Diagnostic)
              </div>
              <div className="text-xl font-display font-black text-slate-950 mt-0.5">
                Calculated Rating: <span className={
                  proposal.securityIndex.rating === 'Critical Risk' ? 'text-red-700' :
                  proposal.securityIndex.rating === 'High Risk' ? 'text-amber-700' : 'text-slate-900'
                }>{proposal.securityIndex.rating}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-4xl font-mono font-black text-slate-950">
                {proposal.securityIndex.score}
              </span>
              <span className="text-slate-500 text-lg font-bold">/100</span>
            </div>
          </div>

          {/* 3-Tier Integrated Defense Architecture */}
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-base text-slate-950 border-b border-slate-200 pb-2">
              Integrated Multi-Tier Protective Architecture
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {proposal.recommendedTierArchitecture.map((tier, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                      0{idx + 1}
                    </span>
                    <span>{tier.tier}</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-slate-700">
                    {tier.components.map((comp, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Operational Compliment */}
          <div className="space-y-3">
            <h3 className="font-display font-extrabold text-sm text-slate-950">
              Contracted Services & Operational Capabilities
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {proposal.recommendedServices.map((svc, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 border border-slate-300 rounded font-semibold text-slate-800">
                  {svc}
                </span>
              ))}
            </div>
          </div>

          {/* Legal, Accreditations & Sign-Off Block */}
          <div className="pt-6 border-t-2 border-slate-900 space-y-6 text-xs text-slate-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="font-bold text-slate-900 block mb-1">Corporate Accreditations & Licensing:</span>
                <ul className="space-y-1 text-[11px]">
                  {proposal.accreditations.map((acc, aIdx) => (
                    <li key={aIdx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{acc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Terms & Deployment Notice:</span>
                <p className="text-[11px] leading-relaxed">
                  Preliminary quotation subject to mandatory physical site confirmation by SafeNet technical surveyors. Mobilization window: 72 hours from contract execution and site induction.
                </p>
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-8 grid grid-cols-2 gap-12 text-center text-xs">
              <div className="border-t border-slate-400 pt-2">
                <div className="font-bold text-slate-900">Capt. Emmanuel Adeleke (Rtd.)</div>
                <div className="text-[11px] text-slate-500">Director of Operations & Tactical Command</div>
                <div className="text-[10px] text-slate-400">SafeNet Security Solutions Ltd</div>
              </div>

              <div className="border-t border-slate-400 pt-2">
                <div className="font-bold text-slate-900">Dr. Alistair Finch / Barr. Chinyere Okafor</div>
                <div className="text-[11px] text-slate-500">Directorate of Legal & ISO Compliance</div>
                <div className="text-[10px] text-slate-400">SafeNet Security Solutions Ltd</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
