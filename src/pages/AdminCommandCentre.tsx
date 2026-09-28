import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  BarChart3, 
  Users, 
  FileText, 
  Share2, 
  Cpu, 
  Briefcase, 
  Settings, 
  Activity, 
  Plus, 
  Check, 
  X, 
  RefreshCw, 
  ExternalLink, 
  Clock, 
  Send, 
  Edit3, 
  Trash2, 
  AlertCircle,
  Eye,
  Lock,
  ChevronRight,
  Filter
} from 'lucide-react';
import { BlogPost, LeadStatus, SocialPlatform } from '../types';

export const AdminCommandCentre: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    leads,
    updateLeadStatus,
    addLeadNote,
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    socialAccounts,
    socialPublishJobs,
    toggleSocialAccount,
    retrySocialJob,
    distributePostToSocials,
    securityAssessments,
    jobApplications,
    testimonials,
    toggleTestimonialPublished,
    auditLogs,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'blog' | 'social' | 'assessments' | 'careers' | 'settings' | 'audit'>('overview');

  // New Blog Post Form State
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState('Corporate Security');
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogTags, setNewBlogTags] = useState('Corporate Security, Lagos, Vigilance');
  const [newBlogAuthor, setNewBlogAuthor] = useState('Capt. Emmanuel Adeleke (Rtd.)');
  const [newBlogReadingTime, setNewBlogReadingTime] = useState('5 min read');
  const [autoDistributeSocial, setAutoDistributeSocial] = useState(true);
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);

  // Lead Modal / Note State
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leadNoteInput, setLeadNoteInput] = useState('');

  // Settings State
  const [settingsPhone, setSettingsPhone] = useState(siteSettings.phone);
  const [settingsEmail, setSettingsEmail] = useState(siteSettings.email);
  const [settingsWhatsApp, setSettingsWhatsApp] = useState(siteSettings.whatsapp);
  const [settingsTrainedGuards, setSettingsTrainedGuards] = useState(siteSettings.stats.trainedGuards);
  const [settingsResponseTime, setSettingsResponseTime] = useState(siteSettings.stats.responseTime);
  const [settingsSocialMode, setSettingsSocialMode] = useState<'manual_approval' | 'auto_publish'>(siteSettings.socialPublishingMode);

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogContent) return;

    const slug = newBlogTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    addBlogPost(
      {
        slug,
        title: newBlogTitle,
        category: newBlogCategory,
        excerpt: newBlogExcerpt || newBlogContent.substring(0, 160) + '...',
        content: newBlogContent,
        featuredImage: blogPosts[0]?.featuredImage || '',
        author: {
          name: newBlogAuthor,
          role: 'Operations & Strategy Directorate'
        },
        tags: newBlogTags.split(',').map(t => t.trim()),
        readingTime: newBlogReadingTime || '5 min read',
        status: 'published',
        seoTitle: `${newBlogTitle} — SafeNet Security Solutions`,
        seoDescription: newBlogExcerpt || newBlogTitle,
        relatedServices: ['cctv-installation-monitoring', 'corporate-security']
      },
      autoDistributeSocial
    );

    setNewBlogTitle('');
    setNewBlogExcerpt('');
    setNewBlogContent('');
    setIsCreatingBlog(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      phone: settingsPhone,
      email: settingsEmail,
      whatsapp: settingsWhatsApp,
      stats: {
        ...siteSettings.stats,
        trainedGuards: settingsTrainedGuards,
        responseTime: settingsResponseTime
      },
      socialPublishingMode: settingsSocialMode
    });
  };

  const handleAddNoteToLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !leadNoteInput.trim()) return;
    addLeadNote(selectedLeadId, leadNoteInput.trim());
    setLeadNoteInput('');
  };

  return (
    <div className="py-8 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Command Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Lock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                  SafeNet Command Centre CMS
                </h1>
                <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                  Live Operations
                </span>
              </div>
              <div className="text-xs text-slate-400">
                UK & Nigerian Administrative Directorate · Authorized Personnel Only
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Social Automation Mode:</span>
            <span className={`font-mono font-bold ${siteSettings.socialPublishingMode === 'auto_publish' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {siteSettings.socialPublishingMode === 'auto_publish' ? 'AUTO-PUBLISH' : 'MANUAL APPROVAL'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-semibold scrollbar-none">
          {[
            { id: 'overview', label: 'Command Overview', icon: BarChart3 },
            { id: 'leads', label: `Commercial Leads (${leads.length})`, icon: Users },
            { id: 'blog', label: `Blog Publications (${blogPosts.length})`, icon: FileText },
            { id: 'social', label: `Social Distribution (${socialPublishJobs.length})`, icon: Share2 },
            { id: 'assessments', label: `Security Audits (${securityAssessments.length})`, icon: Cpu },
            { id: 'careers', label: `Recruitment (${jobApplications.length})`, icon: Briefcase },
            { id: 'settings', label: 'Site Settings', icon: Settings },
            { id: 'audit', label: `Audit Log (${auditLogs.length})`, icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Active Commercial Leads</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-mono-numbers text-3xl font-extrabold text-white">
                  {leads.length}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span>●</span> {leads.filter(l => l.status === 'new').length} New Uncontacted Inquiries
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Diagnostic Audits</span>
                  <Cpu className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-mono-numbers text-3xl font-extrabold text-white">
                  {securityAssessments.length}
                </div>
                <div className="text-[11px] text-slate-400">
                  Interactive Risk Evaluations
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Published Articles</span>
                  <FileText className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-mono-numbers text-3xl font-extrabold text-white">
                  {blogPosts.filter(p => p.status === 'published').length}
                </div>
                <div className="text-[11px] text-slate-400">
                  Indexed with full SEO schemas
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Social Distributions</span>
                  <Share2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-mono-numbers text-3xl font-extrabold text-white">
                  {socialPublishJobs.length}
                </div>
                <div className="text-[11px] text-emerald-400">
                  {socialPublishJobs.filter(j => j.status === 'published').length} Successfully Distributed
                </div>
              </div>
            </div>

            {/* Quick Action Tables Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Leads */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-display font-bold text-white">
                    Latest Inbound Proposals
                  </h3>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {leads.slice(0, 4).map(lead => (
                    <div
                      key={lead.id}
                      onClick={() => { setSelectedLeadId(lead.id); setActiveTab('leads'); }}
                      className="bg-slate-950 border border-slate-800/80 hover:border-amber-400/40 p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{lead.fullName}</div>
                        <div className="text-slate-400 text-[11px]">{lead.serviceRequired}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        lead.status === 'new' ? 'bg-amber-400/20 text-amber-300' :
                        lead.status === 'proposal' ? 'bg-blue-400/20 text-blue-300' :
                        lead.status === 'won' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Distribution Status */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-display font-bold text-white">
                    Social Distribution Channels
                  </h3>
                  <button
                    onClick={() => setActiveTab('social')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Manage Queue &rarr;
                  </button>
                </div>
                <div className="space-y-3">
                  {socialAccounts.map(account => (
                    <div
                      key={account.platform}
                      className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold uppercase text-white font-mono">{account.platform}</span>
                        <span className="text-slate-400 text-[11px]">({account.handle})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[11px] flex items-center gap-1 ${account.connected ? 'text-emerald-400' : 'text-slate-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${account.connected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                          {account.connected ? 'Connected (OAuth)' : 'Disconnected'}
                        </span>
                        <button
                          onClick={() => toggleSocialAccount(account.platform)}
                          className="text-[11px] text-amber-400 hover:underline"
                        >
                          Toggle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMMERCIAL LEADS CRM */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-white">
                  Commercial Inquiries & Quote Proposals CRM
                </h2>
                <p className="text-xs text-slate-400">Track and manage client pipelines from initial request to contract execution.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Leads Table */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Client / Company</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {leads.map(lead => (
                        <tr
                          key={lead.id}
                          onClick={() => setSelectedLeadId(lead.id)}
                          className={`cursor-pointer transition-colors ${
                            selectedLeadId === lead.id ? 'bg-amber-400/10' : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{lead.fullName}</div>
                            <div className="text-slate-400 text-[11px]">{lead.company || lead.location}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-slate-200 max-w-[180px] truncate">{lead.serviceRequired}</div>
                            <div className="text-slate-500 text-[10px] font-mono">{lead.propertyType}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                            <div>{lead.phone}</div>
                            <div className="text-slate-500 text-[10px]">{lead.email}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={lead.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-amber-400 font-mono"
                            >
                              <option value="new">NEW</option>
                              <option value="contacted">CONTACTED</option>
                              <option value="qualified">QUALIFIED</option>
                              <option value="proposal">PROPOSAL</option>
                              <option value="won">WON</option>
                              <option value="lost">LOST</option>
                              <option value="archived">ARCHIVED</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedLeadId(lead.id); }}
                              className="text-amber-400 hover:underline font-semibold"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lead Detail Panel */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                {selectedLead ? (
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-slate-800">
                      <div className="text-[10px] uppercase font-mono text-amber-400">Lead Record #{selectedLead.id.slice(-6)}</div>
                      <h3 className="text-lg font-display font-bold text-white">{selectedLead.fullName}</h3>
                      <div className="text-xs text-slate-400">{selectedLead.company || 'Private Principal'} · {selectedLead.location}</div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400">Direct Phone:</span>{' '}
                        <a href={`tel:${selectedLead.phone}`} className="text-amber-400 font-mono hover:underline">{selectedLead.phone}</a>
                      </div>
                      <div>
                        <span className="text-slate-400">Email:</span>{' '}
                        <a href={`mailto:${selectedLead.email}`} className="text-white font-mono hover:underline">{selectedLead.email}</a>
                      </div>
                      <div>
                        <span className="text-slate-400">Service:</span>{' '}
                        <span className="text-white font-medium">{selectedLead.serviceRequired}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Urgency:</span>{' '}
                        <span className="text-white font-medium uppercase font-mono">{selectedLead.urgency}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Description:</span>
                        <div className="mt-1 p-2 bg-slate-950 rounded text-slate-300 text-[11px] leading-relaxed border border-slate-800">
                          {selectedLead.projectDescription}
                        </div>
                      </div>
                    </div>

                    {/* Lead Notes */}
                    <div className="pt-3 border-t border-slate-800 space-y-3">
                      <div className="text-xs font-semibold text-white">Internal Duty Notes</div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedLead.notes.length === 0 ? (
                          <div className="text-[11px] text-slate-500 italic">No notes logged yet.</div>
                        ) : (
                          selectedLead.notes.map(n => (
                            <div key={n.id} className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300 space-y-1">
                              <div>{n.text}</div>
                              <div className="text-[9px] text-slate-500 font-mono">
                                {n.author} · {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <form onSubmit={handleAddNoteToLead} className="space-y-2">
                        <input
                          type="text"
                          value={leadNoteInput}
                          onChange={(e) => setLeadNoteInput(e.target.value)}
                          placeholder="Log follow-up action or site visit..."
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <button
                          type="submit"
                          className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded border border-slate-700"
                        >
                          Save Internal Note
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-slate-500">
                    Select a lead from the table to view contact details, notes, and quote requirements.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BLOG CMS & EDITOR */}
        {activeTab === 'blog' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-white">
                  Security Publications & Blog CMS
                </h2>
                <p className="text-xs text-slate-400">
                  Publish authoritative articles with 1-click automatic distribution to Facebook, LinkedIn, X, and Instagram.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingBlog(!isCreatingBlog)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5"
              >
                {isCreatingBlog ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isCreatingBlog ? 'Close Editor' : 'Write New Article'}</span>
              </button>
            </div>

            {/* Creation Form Modal / Card */}
            {isCreatingBlog && (
              <form onSubmit={handleCreateBlog} className="bg-slate-900 border border-slate-700 rounded-xl p-6 sm:p-8 space-y-4">
                <div className="text-sm font-display font-bold text-white pb-2 border-b border-slate-800">
                  Compose Security Intelligence Briefing
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                      placeholder="e.g. Countering Kidnapping in Transit: Strategic Guidelines for Nigerian Executives"
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                    <select
                      value={newBlogCategory}
                      onChange={(e) => setNewBlogCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Corporate Security">Corporate Security</option>
                      <option value="Security Technology">Security Technology</option>
                      <option value="Executive Protection">Executive Protection</option>
                      <option value="Maritime Security">Maritime Security</option>
                      <option value="Risk Management">Risk Management</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Short Excerpt (Used for Social Hook & Meta Description)</label>
                  <input
                    type="text"
                    value={newBlogExcerpt}
                    onChange={(e) => setNewBlogExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence executive takeaway..."
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Article Prose Content *</label>
                  <textarea
                    rows={8}
                    required
                    value={newBlogContent}
                    onChange={(e) => setNewBlogContent(e.target.value)}
                    placeholder="Write your article. Use '### Heading' for subheadings and paragraphs separated by new lines..."
                    className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={newBlogAuthor}
                      onChange={(e) => setNewBlogAuthor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Reading Time</label>
                    <input
                      type="text"
                      value={newBlogReadingTime}
                      onChange={(e) => setNewBlogReadingTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={newBlogTags}
                      onChange={(e) => setNewBlogTags(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoDistributeSocial}
                      onChange={(e) => setAutoDistributeSocial(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>Automatically queue & generate posts for connected Social Media accounts</span>
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingBlog(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-400 text-xs rounded hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish & Distribute</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Existing Posts Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Published</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {blogPosts.map(post => (
                    <tr key={post.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-bold text-white max-w-sm truncate">
                        {post.title}
                      </td>
                      <td className="py-3.5 px-4 text-amber-400 font-medium">
                        {post.category}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {post.author.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => distributePostToSocials(post)}
                          className="text-amber-400 hover:underline font-semibold"
                          title="Broadcast to connected social networks"
                        >
                          Broadcast
                        </button>
                        <button
                          onClick={() => deleteBlogPost(post.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SOCIAL MEDIA AUTOMATION ENGINE */}
        {activeTab === 'social' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-bold text-white">
                  Social Distribution Engine & Queue
                </h2>
                <p className="text-xs text-slate-400">
                  Failure-isolated, asynchronous social distribution. Individual platform retries with idempotency protection.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Publishing Mode:</span>
                <button
                  onClick={() => updateSiteSettings({ socialPublishingMode: siteSettings.socialPublishingMode === 'auto_publish' ? 'manual_approval' : 'auto_publish' })}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                    siteSettings.socialPublishingMode === 'auto_publish'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  {siteSettings.socialPublishingMode === 'auto_publish' ? 'AUTO-PUBLISH (ACTIVE)' : 'MANUAL APPROVAL (ACTIVE)'}
                </button>
              </div>
            </div>

            {/* Social Accounts Connections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {socialAccounts.map(acc => (
                <div key={acc.platform} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase font-mono text-white">{acc.displayName}</span>
                    <span className={`w-2 h-2 rounded-full ${acc.connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{acc.handle}</div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className={acc.connected ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                      {acc.connected ? 'OAuth Active' : 'Disconnected'}
                    </span>
                    <button
                      onClick={() => toggleSocialAccount(acc.platform)}
                      className="text-amber-400 hover:underline font-semibold"
                    >
                      {acc.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Publishing Log / Queue */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-display font-bold text-white">
                  Social Distribution Queue & Publishing Logs
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {socialPublishJobs.length} Operations Logged
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Article</th>
                      <th className="py-3 px-4">Platform</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">UTM Parameters</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {socialPublishJobs.map(job => (
                      <tr key={job.id} className="hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">
                          {job.postTitle}
                        </td>
                        <td className="py-3.5 px-4 uppercase font-mono font-bold text-slate-300">
                          {job.platform}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            job.status === 'published' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            job.status === 'queued' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            job.status === 'failed' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400">
                          utm_source={job.utmParams.source}&utm_medium={job.utmParams.medium}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {job.status !== 'published' && (
                            <button
                              onClick={() => retrySocialJob(job.id)}
                              className="text-amber-400 hover:underline font-semibold"
                            >
                              Approve / Publish
                            </button>
                          )}
                          {job.postUrl && (
                            <a
                              href={job.postUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-white"
                              title="View post link"
                            >
                              <ExternalLink className="w-3.5 h-3.5 inline" />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY AUDITS / ASSESSMENTS */}
        {activeTab === 'assessments' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                Interactive Security Diagnostic Submissions
              </h2>
              <p className="text-xs text-slate-400">Review calculated vulnerability scores and identified gaps submitted by facility managers.</p>
            </div>

            <div className="space-y-4">
              {securityAssessments.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
                  No automated diagnostic assessments completed yet.
                </div>
              ) : (
                securityAssessments.map(sub => (
                  <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                      <div>
                        <div className="text-[10px] font-mono text-amber-400 uppercase">Assessment #{sub.id.slice(-6)}</div>
                        <h3 className="text-base font-display font-bold text-white">{sub.clientName} ({sub.clientCompany || 'Corporate Principal'})</h3>
                        <div className="text-xs text-slate-400">{sub.propertyType} · {sub.location}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono-numbers text-2xl font-bold text-amber-400">{sub.calculatedScore}/100</div>
                        <span className={`text-[11px] font-bold ${sub.riskRating === 'Critical Risk' ? 'text-red-400' : 'text-amber-400'}`}>
                          {sub.riskRating}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-[11px] font-semibold uppercase text-slate-400 mb-1">Identified Vulnerability Gaps:</div>
                        <ul className="space-y-1 text-slate-300">
                          {sub.identifiedGaps.map((g, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-red-400">•</span>
                              <span>{g}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold uppercase text-slate-400 mb-1">Recommended Solutions:</div>
                        <ul className="space-y-1 text-emerald-300">
                          {sub.recommendedServices.map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <div>Contact: {sub.clientPhone} · {sub.clientEmail}</div>
                      <span className="font-mono text-[11px]">{new Date(sub.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: CAREERS & RECRUITMENT */}
        {activeTab === 'careers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                Job Applicants & Guard Candidates
              </h2>
              <p className="text-xs text-slate-400">Manage candidate resumes, vetting status, and academy interview scheduling.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              {jobApplications.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No applicants registered in this recruitment cycle.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Applicant</th>
                      <th className="py-3 px-4">Role Applied</th>
                      <th className="py-3 px-4">Experience</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {jobApplications.map(app => (
                      <tr key={app.id} className="hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-bold text-white">{app.applicantName}</td>
                        <td className="py-3.5 px-4 text-amber-400 font-medium">{app.jobTitle}</td>
                        <td className="py-3.5 px-4 text-slate-300">{app.experienceYears}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{app.applicantPhone}</td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300">
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: SITE SETTINGS & BRAND CONTENT */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 max-w-3xl animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                CMS Site Parameters & Contact Channels
              </h2>
              <p className="text-xs text-slate-400">
                Update verified company numbers, email addresses, and key statistics across all pages without redeploying code.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Primary Phone Number
                </label>
                <input
                  type="text"
                  value={settingsPhone}
                  onChange={(e) => setSettingsPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={settingsEmail}
                  onChange={(e) => setSettingsEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  WhatsApp Dispatch Number
                </label>
                <input
                  type="text"
                  value={settingsWhatsApp}
                  onChange={(e) => setSettingsWhatsApp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Social Publishing Workflow
                </label>
                <select
                  value={settingsSocialMode}
                  onChange={(e) => setSettingsSocialMode(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="manual_approval">Mode 1: Manual Approval (Generate & Review First)</option>
                  <option value="auto_publish">Mode 2: Auto-Publish (Queue & Broadcast Immediately)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Homepage Stat: Trained Personnel
                </label>
                <input
                  type="text"
                  value={settingsTrainedGuards}
                  onChange={(e) => setSettingsTrainedGuards(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Homepage Stat: Response Commitment
                </label>
                <input
                  type="text"
                  value={settingsResponseTime}
                  onChange={(e) => setSettingsResponseTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-all shadow-md"
              >
                Save Site Settings
              </button>
            </div>
          </form>
        )}

        {/* TAB 8: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-display font-bold text-white">
                System Security & Administrative Audit Log
              </h2>
              <p className="text-xs text-slate-400">Chronological tamper-evident audit trail of all administrative and publishing actions.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Target</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">Origin IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-amber-400 font-bold">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-white">
                        {log.target}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {log.details}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[10px]">
                        {log.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
