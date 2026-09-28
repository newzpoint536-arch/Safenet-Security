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
  SocialPlatform
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
  retrySocialJob: (jobId: string) => void;
  distributePostToSocials: (post: BlogPost) => void;

  // Testimonial Management
  toggleTestimonialPublished: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, target: string, details: string) => void;

  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;

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

  const [careerOpenings] = useState<CareerOpening[]>(initialCareerOpenings);
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

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('safenet_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('safenet_blog_posts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem('safenet_social_accounts', JSON.stringify(socialAccounts));
  }, [socialAccounts]);

  useEffect(() => {
    localStorage.setItem('safenet_social_jobs', JSON.stringify(socialPublishJobs));
  }, [socialPublishJobs]);

  useEffect(() => {
    localStorage.setItem('safenet_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('safenet_assessments', JSON.stringify(securityAssessments));
  }, [securityAssessments]);

  useEffect(() => {
    localStorage.setItem('safenet_applications', JSON.stringify(jobApplications));
  }, [jobApplications]);

  useEffect(() => {
    localStorage.setItem('safenet_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('safenet_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

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
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      notes: []
    };
    setLeads(prev => [newLead, ...prev]);
    addAuditLog('NEW_LEAD', newLead.fullName, `Lead captured for service: ${newLead.serviceRequired}`);
    showToast('Quote request submitted successfully. Our security coordinator will contact you shortly.');
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus, note?: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updatedNotes = note ? [
          ...lead.notes,
          {
            id: `note-${Date.now()}`,
            author: 'Operations Command',
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
              author: 'Security Officer',
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
    const newSubmission: SecurityAssessmentSubmission = {
      ...data,
      id: `assessment-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSecurityAssessments(prev => [newSubmission, ...prev]);
    // Also create a lead automatically
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
    addAuditLog('ASSESSMENT_COMPLETED', data.clientName, `Calculated ${data.riskRating}`);
  };

  const addJobApplication = (app: Omit<JobApplication, 'id' | 'submittedAt' | 'status'>) => {
    const newApp: JobApplication = {
      ...app,
      id: `app-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    setJobApplications(prev => [newApp, ...prev]);
    addAuditLog('JOB_APPLICATION', app.jobTitle, `Applicant: ${app.applicantName}`);
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

  const retrySocialJob = (jobId: string) => {
    setSocialPublishJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          status: 'published',
          retryCount: job.retryCount + 1,
          date: new Date().toISOString(),
          postUrl: `https://${job.platform}.com/safenetsecurityltd/status/${Date.now().toString().slice(-6)}`
        };
      }
      return job;
    }));
    addAuditLog('SOCIAL_JOB_RETRY', jobId, 'Retried and published successfully');
    showToast('Social distribution task retried and published successfully.');
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
        clearAiChatInitialPrompt
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
