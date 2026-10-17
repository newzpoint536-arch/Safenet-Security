import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SiteSettings,
  HeroSlide,
  Service,
  Industry,
  Project,
  CaseStudy,
  BlogPost,
  SocialAccount,
  SocialPublishJob,
  Lead,
  LeadStatus,
  SecurityAssessmentSubmission,
  CareerOpening,
  JobApplication,
  Testimonial,
  AuditLog,
  SocialPlatform,
  AdminRole,
  AdminUser,
  SystemNotification,
  ProposalBlueprint
} from '../types';
import {
  initialSiteSettings,
  initialHeroSlides,
  initialServices,
  initialIndustries,
  initialProjects,
  initialCaseStudies,
  initialBlogPosts,
  initialSocialAccounts,
  initialSocialPublishJobs,
  initialLeads,
  initialTestimonials,
  initialCareerOpenings,
  initialAuditLogs
} from '../data/initialData';

interface AppContextType {
  // Navigation
  currentPath: string;
  navigate: (path: string) => void;

  // Site Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Content
  heroSlides: HeroSlide[];
  services: Service[];
  industries: Industry[];
  projects: Project[];
  caseStudies: CaseStudy[];
  blogPosts: BlogPost[];
  testimonials: Testimonial[];
  careerOpenings: CareerOpening[];
  jobApplications: JobApplication[];

  // Leads & Submissions
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status' | 'notes'>) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus, note?: string) => void;
  addLeadNote: (leadId: string, text: string) => void;

  // Security Assessment
  securityAssessments: SecurityAssessmentSubmission[];
  addSecurityAssessment: (assessment: Omit<SecurityAssessmentSubmission, 'id' | 'createdAt'>) => void;

  // Careers
  addJobApplication: (app: Omit<JobApplication, 'id' | 'submittedAt' | 'status'>) => void;

  // Blog Management & Social Media Automation
  addBlogPost: (post: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt' | 'views'>, autoDistribute?: boolean) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  // Social Distribution
  socialAccounts: SocialAccount[];
  socialPublishJobs: SocialPublishJob[];
  toggleSocialAccount: (platform: SocialPlatform) => void;
  retrySocialJob: (jobId: string) => Promise<void>;
  updateSocialJobCaption: (jobId: string, caption: string) => void;
  distributePostToSocials: (post: BlogPost) => void;

  // Testimonial Management
  toggleTestimonialPublished: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, target: string, details: string) => void;

  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Role-Based Access Control
  currentRole: AdminRole;
  setCurrentRole: (role: AdminRole) => void;

  // Administrative Authentication & Session
  adminUser: AdminUser | null;
  adminSessionToken: string | null;
  csrfToken: string | null;
  isAdminAuthenticated: boolean;
  adminLoading: boolean;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  setupInitialSuperAdmin: (data: {
    name: string;
    email: string;
    password: string;
    recoveryPassphrase?: string;
    setupKey?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  resetAdminPassword: (
    email: string,
    recoveryPassphrase: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  ownerRecoveryAdmin: (data: {
    recoverySecret: string;
    newEmail: string;
    newName?: string;
    newPassword: string;
    newRecoveryPassphrase?: string;
  }) => Promise<{ success: boolean; error?: string }>;

  // System Notifications
  notifications: SystemNotification[];
  refreshNotifications: () => Promise<void>;

  // Formal Proposal Generation
  generateProposalBlueprint: (data: {
    clientName?: string;
    company?: string;
    facilityType?: string;
    location?: string;
    score?: number;
    riskRating?: string;
    services?: string[];
  }) => Promise<ProposalBlueprint>;

  // AI Security Agent
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  aiChatInitialPrompt: string | null;
  openAiChatWithPrompt: (prompt: string) => void;
  clearAiChatInitialPrompt: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Routing state based on browser URL
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Persistent States
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('safenet_site_settings');
    return saved ? JSON.parse(saved) : initialSiteSettings;
  });

  const [heroSlides] = useState<HeroSlide[]>(initialHeroSlides);
  const [services] = useState<Service[]>(initialServices);
  const [industries] = useState<Industry[]>(initialIndustries);
  const [projects] = useState<Project[]>(initialProjects);
  const [caseStudies] = useState<CaseStudy[]>(initialCaseStudies);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('safenet_blog_posts');
    return saved ? JSON.parse(saved) : initialBlogPosts;
  });

  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(() => {
    const saved = localStorage.getItem('safenet_social_accounts');
    return saved ? JSON.parse(saved) : initialSocialAccounts;
  });

  const [socialPublishJobs, setSocialPublishJobs] = useState<SocialPublishJob[]>(() => {
    const saved = localStorage.getItem('safenet_social_jobs');
    return saved ? JSON.parse(saved) : initialSocialPublishJobs;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('safenet_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [securityAssessments, setSecurityAssessments] = useState<SecurityAssessmentSubmission[]>(() => {
    const saved = localStorage.getItem('safenet_assessments');
    return saved ? JSON.parse(saved) : [];
  });

  const [careerOpenings, setCareerOpenings] = useState<CareerOpening[]>(initialCareerOpenings);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('safenet_applications');
    return saved ? JSON.parse(saved) : [];
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('safenet_testimonials');
    return saved ? JSON.parse(saved) : initialTestimonials;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('safenet_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Security Agent state
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [aiChatInitialPrompt, setAiChatInitialPrompt] = useState<string | null>(null);

  const openAiChatWithPrompt = (prompt: string) => {
    setAiChatInitialPrompt(prompt);
    setIsAiChatOpen(true);
  };

  const clearAiChatInitialPrompt = () => {
    setAiChatInitialPrompt(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Role-Based Access Control State
  const [currentRole, setCurrentRole] = useState<AdminRole>('super_admin');

  // Administrator Authentication State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [adminLoading, setAdminLoading] = useState<boolean>(true);
  
  // adminSessionToken exposed for backwards compatibility if referenced
  const adminSessionToken = csrfToken;
  const isAdminAuthenticated = Boolean(adminUser);

  // System Notifications State
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  const refreshNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      }
    } catch (err) {
      console.warn('Failed to refresh notifications:', err);
    }
  };

  // Helper to sync state to server persistent file store (Protected with HttpOnly session cookie & CSRF header)
  const syncToServer = async () => {
    if (!adminUser) return;
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
      await fetch('/api/db/sync', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          siteSettings,
          blogPosts,
          socialAccounts,
          socialPublishJobs,
          leads,
          securityAssessments,
          jobApplications,
          careerOpenings,
          testimonials,
          auditLogs
        })
      });
    } catch (err) {
      console.warn('Background sync to server store paused:', err);
    }
  };

  // Load database state from server (authenticated receives full CRM via HttpOnly cookie; unauthenticated receives public content)
  const loadServerData = async () => {
    try {
      const res = await fetch('/api/db/state', { 
        credentials: 'include' 
      });
      const json = await res.json();
      if (json && json.seeded && json.data) {
        const d = json.data;
        if (d.siteSettings) setSiteSettings(d.siteSettings);
        if (Array.isArray(d.blogPosts) && d.blogPosts.length > 0) setBlogPosts(d.blogPosts);
        if (Array.isArray(d.socialAccounts) && d.socialAccounts.length > 0) setSocialAccounts(d.socialAccounts);
        if (Array.isArray(d.socialPublishJobs)) setSocialPublishJobs(d.socialPublishJobs);
        if (Array.isArray(d.leads)) setLeads(d.leads);
        if (Array.isArray(d.securityAssessments)) setSecurityAssessments(d.securityAssessments);
        if (Array.isArray(d.jobApplications)) setJobApplications(d.jobApplications);
        if (Array.isArray(d.careerOpenings)) setCareerOpenings(d.careerOpenings);
        if (Array.isArray(d.testimonials)) setTestimonials(d.testimonials);
        if (Array.isArray(d.auditLogs)) setAuditLogs(d.auditLogs);
      }
    } catch (err) {
      console.warn('Server storage connection:', err);
    }
  };

  // On mount: verify existing session via secure HttpOnly cookie
  useEffect(() => {
    // Purge any legacy browser storage tokens to enforce server-managed HttpOnly sessions
    try {
      localStorage.removeItem('safenet_admin_session_token');
      sessionStorage.removeItem('safenet_admin_session_token');
    } catch {}

    fetch('/api/admin/me', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
          setCsrfToken(data.csrfToken || null);
          setCurrentRole(data.user.role);
          loadServerData();
        } else {
          setAdminUser(null);
          setCsrfToken(null);
          loadServerData();
        }
      })
      .catch(() => {
        setAdminUser(null);
        setCsrfToken(null);
        loadServerData();
      })
      .finally(() => {
        setAdminLoading(false);
      });

    refreshNotifications();
  }, []);

  // Admin Login Action (HttpOnly cookie set by server; CSRF token captured in state)
  const loginAdmin = async (emailInput: string, passwordInput: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setAdminUser(data.user);
        setCsrfToken(data.csrfToken || null);
        setCurrentRole(data.user.role);
        await loadServerData();
        showToast(`Welcome back, ${data.user.name}. Authenticated as [${data.user.role.toUpperCase()}].`);
        return { success: true };
      }
      return { success: false, error: data.error || 'Authentication rejected.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login request failed.' };
    }
  };

  // Admin Logout Action (Server clears HttpOnly cookies & revokes session from registry)
  const logoutAdmin = async () => {
    try {
      const headers: Record<string, string> = {};
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
        headers
      });
    } catch (err) {
      console.warn('Logout request failed:', err);
    } finally {
      try {
        localStorage.removeItem('safenet_admin_session_token');
        sessionStorage.removeItem('safenet_admin_session_token');
      } catch {}
      setAdminUser(null);
      setCsrfToken(null);
      navigate('/admin/login');
      showToast('Administrator session safely terminated.');
    }
  };

  // Initial Provisioning Action (Atomic first Super Administrator creation)
  const setupInitialSuperAdmin = async (data: {
    name: string;
    email: string;
    password: string;
    recoveryPassphrase?: string;
    setupKey?: string;
  }) => {
    try {
      const res = await fetch('/api/admin/setup-initial', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok && resData.success && resData.user) {
        setAdminUser(resData.user);
        setCsrfToken(resData.csrfToken || null);
        setCurrentRole(resData.user.role);
        await loadServerData();
        showToast('Super Administrator account provisioned successfully.');
        return { success: true };
      }
      return { success: false, error: resData.error || 'Initial provisioning failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Setup request failed.' };
    }
  };

  // Reset Password Action
  const resetAdminPassword = async (emailInput: string, recoveryPass: string, newPass: string) => {
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          recoveryPassphrase: recoveryPass,
          newPassword: newPass
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Password reset failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password reset request failed.' };
    }
  };

  // Owner Privilege Recovery Action
  const ownerRecoveryAdmin = async (data: {
    recoverySecret: string;
    newEmail: string;
    newName?: string;
    newPassword: string;
    newRecoveryPassphrase?: string;
  }) => {
    try {
      const res = await fetch('/api/admin/owner-recovery', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok && resData.success && resData.user) {
        setAdminUser(resData.user);
        setCsrfToken(resData.csrfToken || null);
        setCurrentRole(resData.user.role);
        await loadServerData();
        showToast('Super Administrator credentials recovered successfully.');
        return { success: true };
      }
      return { success: false, error: resData.error || 'Owner recovery authorization rejected.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Owner recovery request failed.' };
    }
  };

  // Sync to LocalStorage & Server Store
  useEffect(() => {
    localStorage.setItem('safenet_site_settings', JSON.stringify(siteSettings));
    syncToServer();
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('safenet_blog_posts', JSON.stringify(blogPosts));
    syncToServer();
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('safenet_social_accounts', JSON.stringify(socialAccounts));
    syncToServer();
  }, [socialAccounts]);

  useEffect(() => {
    localStorage.setItem('safenet_social_jobs', JSON.stringify(socialPublishJobs));
    syncToServer();
  }, [socialPublishJobs]);

  useEffect(() => {
    localStorage.setItem('safenet_leads', JSON.stringify(leads));
    syncToServer();
    refreshNotifications();
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('safenet_assessments', JSON.stringify(securityAssessments));
    syncToServer();
    refreshNotifications();
  }, [securityAssessments]);

  useEffect(() => {
    localStorage.setItem('safenet_applications', JSON.stringify(jobApplications));
    syncToServer();
    refreshNotifications();
  }, [jobApplications]);

  useEffect(() => {
    localStorage.setItem('safenet_testimonials', JSON.stringify(testimonials));
    syncToServer();
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('safenet_audit_logs', JSON.stringify(auditLogs));
    syncToServer();
  }, [auditLogs]);

  const generateProposalBlueprint = async (data: {
    clientName?: string;
    company?: string;
    facilityType?: string;
    location?: string;
    score?: number;
    riskRating?: string;
    services?: string[];
  }): Promise<ProposalBlueprint> => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
      const res = await fetch('/api/proposals/generate', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const body = await res.json();
        if (body.proposal) return body.proposal;
      }
    } catch (err) {
      console.warn('Backend proposal generation offline, using client fallback:', err);
    }

    // Client fallback blueprint
    const refCode = `SFN-PROP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      referenceCode: refCode,
      generatedDate: new Date().toISOString(),
      client: {
        name: data.clientName || 'Corporate Client',
        company: data.company || 'Enterprise Facility',
        facilityType: data.facilityType || 'Commercial Complex',
        location: data.location || 'Lagos, Nigeria'
      },
      securityIndex: {
        score: data.score ?? 65,
        rating: data.riskRating || 'Moderate Risk'
      },
      recommendedTierArchitecture: [
        {
          tier: 'Tier 1: Perimeter Detection & Aerial Reconnaissance',
          components: ['Thermal IP CCTV with optical tripwires', 'Scheduled autonomous drone patrols', 'Perimeter vibration beam sensors']
        },
        {
          tier: 'Tier 2: Access & Identity Verification',
          components: ['Touchless facial recognition speed gates', 'Automated ANPR vehicle license blockers', 'Visitor digital badge issuance']
        },
        {
          tier: 'Tier 3: Manned Tactical Deterrence & Dispatch',
          components: ['Vetted, NSCDC-certified security officers', '24/7 RFID guard tour attendance wanding', 'Armed mobile supervisor backup in under 60 seconds']
        }
      ],
      recommendedServices: data.services || ['CCTV Installation & Monitoring', 'Armed & Unarmed Security Guards'],
      accreditations: ['NSCDC Category A Licensed', 'ISO 9001:2015 Certified', 'ISO 18788 (Security Operations Management)', 'UK Operational Standards'],
      operationsHQ: 'Plot 14 Commercial Avenue, Victoria Island, Lagos'
    };
  };

  const addAuditLog = (action: string, target: string, details: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      user: 'Super Admin',
      action,
      target,
      details,
      ip: '102.89.23.14 (Lagos, Nigeria)'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings(prev => {
      const updated = { ...prev, ...newSettings };
      addAuditLog('SETTINGS_UPDATE', 'Site Settings', 'Updated company parameters or social automation mode');
      return updated;
    });
    showToast('Site settings updated successfully.');
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'status' | 'notes'>) => {
    const tempId = `lead-${Date.now()}`;
    const newLead: Lead = {
      ...leadData,
      id: tempId,
      createdAt: new Date().toISOString(),
      status: 'new',
      notes: []
    };
    setLeads(prev => [newLead, ...prev]);

    // Dispatch directly to server public ingestion endpoint
    fetch('/api/public/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.lead && data.lead.id) {
          setLeads(prev => prev.map(l => l.id === tempId ? data.lead : l));
        }
      })
      .catch(err => console.warn('Public lead submission fallback to memory:', err));

    showToast('Quote request submitted successfully. Our security coordinator will contact you shortly.');
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus, note?: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updatedNotes = note ? [
          ...lead.notes,
          {
            id: `note-${Date.now()}`,
            author: adminUser?.name || 'Operations Command',
            text: note,
            createdAt: new Date().toISOString()
          }
        ] : lead.notes;
        return { ...lead, status, notes: updatedNotes };
      }
      return lead;
    }));
    addAuditLog('LEAD_STATUS_CHANGED', leadId, `Status transitioned to ${status.toUpperCase()}`);
    showToast(`Lead status updated to ${status}.`);
  };

  const addLeadNote = (leadId: string, text: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          notes: [
            ...lead.notes,
            {
              id: `note-${Date.now()}`,
              author: adminUser?.name || 'Security Officer',
              text,
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return lead;
    }));
    addAuditLog('LEAD_NOTE_ADDED', leadId, text.substring(0, 40) + '...');
    showToast('Internal note saved to lead.');
  };

  const addSecurityAssessment = (data: Omit<SecurityAssessmentSubmission, 'id' | 'createdAt'>) => {
    const tempId = `assessment-${Date.now()}`;
    const newSubmission: SecurityAssessmentSubmission = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString()
    };
    setSecurityAssessments(prev => [newSubmission, ...prev]);

    fetch('/api/public/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.assessment && resData.assessment.id) {
          setSecurityAssessments(prev => prev.map(a => a.id === tempId ? resData.assessment : a));
        }
      })
      .catch(err => console.warn('Public assessment submission fallback to memory:', err));

    // Also automatically create a lead for follow-up
    addLead({
      fullName: data.clientName,
      company: data.clientCompany,
      email: data.clientEmail,
      phone: data.clientPhone,
      location: data.location,
      industry: data.industry,
      serviceRequired: `Assessment Follow-up: ${data.recommendedServices.join(', ')}`,
      propertyType: data.propertyType,
      projectDescription: `Automated assessment calculated ${data.riskRating} (Score: ${data.calculatedScore}/100). Gaps identified: ${data.identifiedGaps.join('; ')}`,
      urgency: data.calculatedScore > 65 ? 'immediate' : '1-2_weeks',
      preferredContact: 'phone'
    });
  };

  const addJobApplication = (app: Omit<JobApplication, 'id' | 'submittedAt' | 'status'>) => {
    const tempId = `app-${Date.now()}`;
    const newApp: JobApplication = {
      ...app,
      id: tempId,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    setJobApplications(prev => [newApp, ...prev]);

    fetch('/api/public/careers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app)
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.application && resData.application.id) {
          setJobApplications(prev => prev.map(a => a.id === tempId ? resData.application : a));
        }
      })
      .catch(err => console.warn('Public career submission fallback to memory:', err));

    showToast('Your job application has been submitted successfully to SafeNet Recruitment.');
  };

  // Social Distribution Engine (Asynchronous & Failure Isolated)
  const distributePostToSocials = (post: BlogPost) => {
    const targetPlatforms: SocialPlatform[] = ['facebook', 'linkedin', 'x', 'instagram'];
    
    targetPlatforms.forEach(platform => {
      const account = socialAccounts.find(a => a.platform === platform);
      if (!account || !account.connected) return;

      const jobId = `job-${Date.now()}-${platform}`;
      const idempotencyKey = `${platform}-${post.slug}-${Date.now()}`;
      
      // Platform specific customized captions
      let caption = '';
      let hashtags: string[] = ['#SafeNetSecurity', '#CorporateSecurity', '#Nigeria'];

      if (platform === 'facebook') {
        caption = `${post.title}\n\n${post.excerpt}\n\nRead the full security brief on our website and request a consultation for your facility.`;
        hashtags = ['#SafeNet', '#NigeriaSecurity', '#FacilityManagement', '#CorporateDefense'];
      } else if (platform === 'linkedin') {
        caption = `Executive Security Briefing: ${post.title}\n\nKey Strategic Takeaway:\n${post.excerpt}\n\nHow is your organization mitigating emerging security risks in Nigeria? Read our operational insight.`;
        hashtags = ['#SecurityManagement', '#CorporateGovernance', '#NigeriaBusiness', '#RiskAdvisory'];
      } else if (platform === 'x') {
        caption = `${post.title.length > 180 ? post.title.substring(0, 175) + '...' : post.title}\n\nRead the complete security brief: https://safenetsecurityltd.com/blog/${post.slug}`;
        hashtags = ['#Security', '#Lagos', '#Nigeria'];
      } else if (platform === 'instagram') {
        caption = `Vigilance in Action: ${post.title}\n\n${post.excerpt.substring(0, 200)}...\n\nTap link in bio to read full analysis.`;
        hashtags = ['#SafeNetSecurity', '#Surveillance', '#DroneSecurity', '#VIPProtection'];
      }

      const newJob: SocialPublishJob = {
        id: jobId,
        postId: post.id,
        postTitle: post.title,
        platform,
        status: siteSettings.socialPublishingMode === 'auto_publish' ? 'published' : 'queued',
        date: new Date().toISOString(),
        postUrl: `https://${platform}.com/safenetsecurityltd/status/${Date.now().toString().slice(-6)}`,
        caption,
        hashtags,
        retryCount: 0,
        idempotencyKey,
        utmParams: {
          source: platform,
          medium: 'social',
          campaign: 'blog',
          content: post.slug
        }
      };

      setSocialPublishJobs(prev => [newJob, ...prev]);
    });

    addAuditLog('SOCIAL_DISTRIBUTION_TRIGGERED', post.title, `Distribution queued across connected accounts.`);
    showToast(`Blog published & social distribution queued for ${post.title}`);
  };

  const addBlogPost = (postData: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt' | 'views'>, autoDistribute = true) => {
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...postData,
      id: `post-${Date.now()}`,
      publishedAt: now,
      updatedAt: now,
      views: 1
    };

    setBlogPosts(prev => [newPost, ...prev]);
    addAuditLog('BLOG_PUBLISHED', newPost.title, `Category: ${newPost.category}`);

    if (autoDistribute && newPost.status === 'published') {
      distributePostToSocials(newPost);
    } else {
      showToast('Blog article saved successfully.');
    }
  };

  const updateBlogPost = (id: string, updatedFields: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedFields, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
    addAuditLog('BLOG_UPDATED', id, 'Article content or metadata updated');
    showToast('Blog post updated.');
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(p => p.id !== id));
    addAuditLog('BLOG_DELETED', id, 'Article deleted by admin');
    showToast('Blog post removed.');
  };

  const toggleSocialAccount = (platform: SocialPlatform) => {
    setSocialAccounts(prev => prev.map(acc => {
      if (acc.platform === platform) {
        const nextState = !acc.connected;
        return {
          ...acc,
          connected: nextState,
          lastSyncedAt: nextState ? new Date().toISOString() : acc.lastSyncedAt
        };
      }
      return acc;
    }));
    addAuditLog('SOCIAL_ACCOUNT_TOGGLED', platform, 'Connection state altered');
    showToast(`${platform.toUpperCase()} connection updated.`);
  };

  const updateSocialJobCaption = (jobId: string, newCaption: string) => {
    setSocialPublishJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return { ...job, caption: newCaption };
      }
      return job;
    }));
    showToast('Social post caption updated.');
  };

  const retrySocialJob = async (jobId: string) => {
    const job = socialPublishJobs.find(j => j.id === jobId);
    if (!job) return;

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (csrfToken) headers['X-CSRF-Token'] = csrfToken;
      const res = await fetch('/api/social/publish', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          jobId: job.id,
          platform: job.platform,
          postTitle: job.postTitle,
          caption: job.caption,
          postUrl: job.postUrl
        })
      });

      const data = await res.json();
      const liveUrl = data?.result?.liveUrl || `https://${job.platform}.com/safenetsecurityltd/status/${Date.now().toString().slice(-6)}`;

      setSocialPublishJobs(prev => prev.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            status: 'published',
            retryCount: j.retryCount + 1,
            date: new Date().toISOString(),
            postUrl: liveUrl
          };
        }
        return j;
      }));
      addAuditLog('SOCIAL_JOB_DISPATCHED', `${job.platform.toUpperCase()} - ${job.postTitle}`, `Status: published via ${data?.result?.mode || 'API'}`);
      showToast(`Social distribution task dispatched to ${job.platform.toUpperCase()} successfully.`);
    } catch (err: any) {
      setSocialPublishJobs(prev => prev.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            status: 'failed',
            errorMessage: err.message || 'API dispatch failed',
            retryCount: j.retryCount + 1
          };
        }
        return j;
      }));
      showToast(`Social dispatch error: ${err.message || 'Failed'}`);
    }
  };

  const toggleTestimonialPublished = (id: string) => {
    setTestimonials(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, published: !t.published };
      }
      return t;
    }));
    addAuditLog('TESTIMONIAL_TOGGLED', id, 'Toggled public visibility');
    showToast('Testimonial status updated.');
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        siteSettings,
        updateSiteSettings,
        heroSlides,
        services,
        industries,
        projects,
        caseStudies,
        blogPosts,
        testimonials,
        careerOpenings,
        jobApplications,
        leads,
        addLead,
        updateLeadStatus,
        addLeadNote,
        securityAssessments,
        addSecurityAssessment,
        addJobApplication,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        socialAccounts,
        socialPublishJobs,
        toggleSocialAccount,
        retrySocialJob,
        updateSocialJobCaption,
        distributePostToSocials,
        toggleTestimonialPublished,
        auditLogs,
        addAuditLog,
        toastMessage,
        showToast,
        isAiChatOpen,
        setIsAiChatOpen,
        aiChatInitialPrompt,
        openAiChatWithPrompt,
        clearAiChatInitialPrompt,
        currentRole,
        setCurrentRole,
        adminUser,
        adminSessionToken,
        csrfToken,
        isAdminAuthenticated,
        adminLoading,
        loginAdmin,
        logoutAdmin,
        setupInitialSuperAdmin,
        resetAdminPassword,
        ownerRecoveryAdmin,
        notifications,
        refreshNotifications,
        generateProposalBlueprint
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
