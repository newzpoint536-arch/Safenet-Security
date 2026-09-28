import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Phone, Mail, MessageSquare, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';

export const RequestQuotePage: React.FC = () => {
  const { services, addLead, siteSettings } = useApp();

  // Pre-fill service from URL if passed as ?service=...
  const [serviceRequired, setServiceRequired] = useState('Armed & Unarmed Security Guards');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('Lagos (Victoria Island / Ikoyi / Lekki)');
  const [industry, setIndustry] = useState('Corporate Organizations');
  const [propertyType, setPropertyType] = useState('Commercial High-Rise Tower');
  const [projectDescription, setProjectDescription] = useState('');
  const [urgency, setUrgency] = useState<'immediate' | '1-2_weeks' | '1-3_months' | 'exploratory'>('immediate');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'email' | 'whatsapp'>('phone');
  
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const srvParam = params.get('service');
    if (srvParam) {
      setServiceRequired(srvParam);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    addLead({
      fullName,
      company: company || undefined,
      email,
      phone,
      whatsapp: whatsapp || phone,
      location,
      industry,
      serviceRequired,
      propertyType,
      projectDescription: projectDescription || 'Standard commercial security quote request.',
      urgency,
      preferredContact
    });

    setIsSuccess(true);
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-12">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Confidential Commercial Proposal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
          Request a Security Quote
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Provide your operational parameters below. Our senior security coordinators in Lagos and Port Harcourt will formulate a comprehensive, transparent deployment proposal.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Container */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            
            {isSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">
                  Proposal Request Logged
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, {fullName}. Your requirement for <strong>{serviceRequired}</strong> has been transferred to our active operations dispatch desk. A senior security consultant will contact you via {preferredContact}.
                </p>
                <div className="pt-4 flex justify-center gap-4 text-xs">
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-amber-400 hover:underline font-semibold"
                  >
                    Submit Another Inquiry
                  </button>
                  <a
                    href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
                    className="text-white hover:text-amber-400 font-semibold"
                  >
                    Call Operations Desk
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Contact Particulars */}
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider pb-2 border-b border-slate-800">
                    01. Contact Particulars
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Chief Adeleke / Engr. Okon"
                        className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Company / Estate / Organization
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Apex Holdings / Lekki Estate CDA"
                        className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.ng"
                        className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Scope & Service Selection */}
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider pb-2 border-b border-slate-800">
                    02. Scope & Service Selection
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Primary Service Required *
                      </label>
                      <select
                        value={serviceRequired}
                        onChange={(e) => setServiceRequired(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                        <option value="Integrated Multi-Service Security Package">
                          Integrated Multi-Service Security Package
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Facility Location in Nigeria *
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Lagos (Victoria Island / Ikoyi / Lekki)">Lagos (Victoria Island / Ikoyi / Lekki)</option>
                        <option value="Lagos (Ikeja / Mainland / Industrial)">Lagos (Ikeja / Mainland / Industrial)</option>
                        <option value="Abuja (FCT / Central Area)">Abuja (FCT / Central Area)</option>
                        <option value="Rivers State (Port Harcourt / Onne)">Rivers State (Port Harcourt / Onne)</option>
                        <option value="Delta State (Warri / Escravos)">Delta State (Warri / Escravos)</option>
                        <option value="Ogun State (Sagamu / Agbara)">Ogun State (Industrial Corridors)</option>
                        <option value="Other Nigerian State">Other Nigerian State</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Industry Sector
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Corporate Organizations">Corporate Organizations</option>
                        <option value="Banks & Financial Institutions">Banks & Financial Institutions</option>
                        <option value="Residential Estates">Residential Estates & CDAs</option>
                        <option value="Oil & Gas Facilities">Oil & Gas Facilities</option>
                        <option value="Maritime & Ports">Maritime & Ports</option>
                        <option value="Industrial & Manufacturing">Industrial & Manufacturing</option>
                        <option value="Hospitality & Leisure">Hospitality & Leisure</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Property / Facility Scale
                      </label>
                      <input
                        type="text"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        placeholder="e.g. 10-storey tower / 40-hectare estate"
                        className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Project Description & Special Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Specify required number of personnel, cameras, armed escort details, or existing security challenges..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Urgency & Preferences */}
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider pb-2 border-b border-slate-800">
                    03. Deployment Timeline & Contact Method
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Deployment Urgency
                      </label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="immediate">Immediate (Within 48–72 Hours)</option>
                        <option value="1-2_weeks">1 to 2 Weeks</option>
                        <option value="1-3_months">1 to 3 Months (Budgeting / Tender)</option>
                        <option value="exploratory">Exploratory / Initial Assessment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Preferred Contact Channel
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setPreferredContact('phone')}
                          className={`p-2 rounded border text-center transition-all ${
                            preferredContact === 'phone'
                              ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          Phone
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreferredContact('whatsapp')}
                          className={`p-2 rounded border text-center transition-all ${
                            preferredContact === 'whatsapp'
                              ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreferredContact('email')}
                          className={`p-2 rounded border text-center transition-all ${
                            preferredContact === 'email'
                              ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          Email
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-md transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <span>Submit Commercial Quote Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            )}

          </div>

          {/* Right Column: Direct Help & Dispatch */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="text-xs uppercase font-semibold text-amber-400 tracking-wider">
                Direct Operations Link
              </div>
              <h3 className="text-base font-display font-bold text-white">
                Require Immediate Deployment?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                If your requirement is urgent or involves an active security vulnerability, call our 24/7 commercial duty coordinator directly.
              </p>

              <div className="pt-2 space-y-2">
                <a
                  href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{siteSettings.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>WhatsApp Commercial Team</span>
                </a>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Our Guarantee
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Strict confidentiality & non-disclosure protection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Transparent itemized billing with zero hidden costs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>On-site physical site survey scheduled within 48 hours.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
