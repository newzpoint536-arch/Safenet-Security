import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, MapPin, CheckCircle2, ArrowRight, ShieldCheck, X, FileText, Send } from 'lucide-react';
import { CareerOpening } from '../types';

export const CareersPage: React.FC = () => {
  const { careerOpenings, addJobApplication } = useApp();
  const [selectedJob, setSelectedJob] = useState<CareerOpening | null>(null);

  // Application Modal State
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [experienceYears, setExperienceYears] = useState('2–4 Years');
  const [coverNote, setCoverNote] = useState('');
  const [resumeName, setResumeName] = useState('Curriculum_Vitae.pdf');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleApply = (job: CareerOpening) => {
    setSelectedJob(job);
    setAppliedSuccess(false);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !applicantName || !applicantEmail || !applicantPhone) return;

    addJobApplication({
      jobSlug: selectedJob.slug,
      jobTitle: selectedJob.title,
      applicantName,
      applicantEmail,
      applicantPhone,
      experienceYears,
      coverNote,
      resumeFileName: resumeName
    });

    setAppliedSuccess(true);
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-16">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Briefcase className="w-4 h-4" />
          <span>Professional Security Careers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
          Join the SafeNet Security Force
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          We pride ourselves on offering the most disciplined training, dignified compensation, and merit-based career progression in the Nigerian private security sector.
        </p>
      </div>

      {/* Benefits of Joining */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-2">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">01. Dignity & Fair Compensation</div>
            <h3 className="text-base font-display font-bold text-white">Competitive Remuneration</h3>
            <p className="text-xs text-slate-400">Guaranteed timely salary payments, medical insurance support, and performance bonuses.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-2">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">02. World-Class Training</div>
            <h3 className="text-base font-display font-bold text-white">Continuous Academies</h3>
            <p className="text-xs text-slate-400">UK-certified modules covering advanced physical defense, tactical first-aid, and electronics.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-2">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">03. Career Advancement</div>
            <h3 className="text-base font-display font-bold text-white">Merit-Based Growth</h3>
            <p className="text-xs text-slate-400">Promotions from static guard to control room controller, patrol supervisor, and operations chief.</p>
          </div>
        </div>
      </div>

      {/* Open Vacancies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-2xl font-display font-bold text-white">
          Active Vacancies Across Nigeria
        </h2>

        <div className="space-y-6">
          {careerOpenings.map((job) => (
            <div
              key={job.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="font-semibold text-amber-400">{job.department}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {job.location}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-slate-300">{job.employmentType}</span>
                </div>

                <h3 className="text-xl font-display font-bold text-white">
                  {job.title}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div>
                    <div className="text-[11px] font-semibold uppercase text-slate-400 mb-1">
                      Key Responsibilities:
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {job.responsibilities.slice(0, 2).map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-400">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold uppercase text-slate-400 mb-1">
                      Minimum Criteria:
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {job.requirements.slice(0, 2).map((req, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => handleApply(job)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Apply for Position</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  SafeNet Recruitment Portal
                </span>
                <h3 className="text-lg font-display font-bold text-white">
                  Apply: {selectedJob.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {appliedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-display font-bold text-white">Application Submitted</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thank you, {applicantName}. Your credentials for the <strong>{selectedJob.title}</strong> role have been sent to SafeNet Human Resources. Qualified candidates will be called for screening.
                </p>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Samuel Olawale"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+234..."
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Years of Relevant Security / Technical Experience
                  </label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Entry Level / Academy Trainee">Entry Level / Academy Trainee (SSCE / OND)</option>
                    <option value="1–2 Years">1 to 2 Years Private Security Experience</option>
                    <option value="3–5 Years">3 to 5 Years Senior Guard / Supervisor</option>
                    <option value="Over 5 Years / Military/Police Background">Over 5 Years / Ex-Military / Police Background</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Upload Resume / CV Document Name
                  </label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <input
                      type="text"
                      value={resumeName}
                      onChange={(e) => setResumeName(e.target.value)}
                      className="bg-transparent flex-1 focus:outline-none text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Brief Statement of Qualification
                  </label>
                  <textarea
                    rows={2}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Mention previous stations, certifications, or heights/physical traits..."
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-all shadow-md flex items-center gap-2"
                  >
                    <span>Submit Application</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
