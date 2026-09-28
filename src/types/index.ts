export type ServiceCategory = 
  | 'Surveillance Systems' 
  | 'Physical Security' 
  | 'Executive / Specialist Protection' 
  | 'Security Consulting';

export interface Service {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  problem: string;
  solution: string;
  capabilities: string[];
  process: string[];
  technology: string[];
  benefits: string[];
  suitableIndustries: string[];
  faqs: { question: string; answer: string }[];
  image: string;
  badge?: string;
}

export interface Industry {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  threat: string;
  risk: string;
  solution: string;
  technology: string[];
  personnel: string;
  response: string;
  iconName: string;
  description: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  industry: string;
  location: string;
  services: string[];
  image: string;
  description: string;
  scope: string;
  technology: string[];
  deployment: string;
  results: string[];
  date: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  industry: string;
  location: string;
  challenge: string;
  riskAssessment: string;
  securityStrategy: string;
  deployment: string;
  technology: string[];
  monitoring: string;
  outcome: string;
  metric: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  status: 'published' | 'draft' | 'scheduled';
  seoTitle: string;
  seoDescription: string;
  relatedServices: string[];
  views: number;
}

export type SocialPlatform = 'facebook' | 'linkedin' | 'x' | 'instagram' | 'youtube';

export interface SocialAccount {
  platform: SocialPlatform;
  displayName: string;
  handle: string;
  connected: boolean;
  tokenExpiry: string;
  autoPublish: boolean;
  lastSyncedAt: string;
  avatarUrl?: string;
}

export interface SocialPublishJob {
  id: string;
  postId: string;
  postTitle: string;
  platform: SocialPlatform;
  status: 'queued' | 'processing' | 'published' | 'failed' | 'retrying';
  date: string;
  postUrl?: string;
  caption: string;
  hashtags: string[];
  errorMessage?: string;
  retryCount: number;
  idempotencyKey: string;
  utmParams: {
    source: string;
    medium: string;
    campaign: string;
    content: string;
  };
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost' | 'archived';

export interface LeadNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  whatsapp?: string;
  location: string;
  industry: string;
  serviceRequired: string;
  propertyType: string;
  projectDescription: string;
  urgency: 'immediate' | '1-2_weeks' | '1-3_months' | 'exploratory';
  preferredContact: 'phone' | 'email' | 'whatsapp';
  status: LeadStatus;
  createdAt: string;
  notes: LeadNote[];
  estimatedValue?: string;
}

export interface SecurityAssessmentSubmission {
  id: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany?: string;
  propertyType: string;
  industry: string;
  location: string;
  facilitiesCount: string;
  existingPersonnel: string;
  cctvCoverage: string;
  accessControl: string;
  alarmSystems: string;
  fleetSize: string;
  primaryRiskConcerns: string[];
  calculatedScore: number;
  riskRating: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk';
  identifiedGaps: string[];
  recommendedServices: string[];
}

export interface CareerOpening {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Contract' | 'Rotational';
  requirements: string[];
  responsibilities: string[];
  active: boolean;
}

export interface JobApplication {
  id: string;
  jobSlug: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  experienceYears: string;
  coverNote?: string;
  resumeFileName: string;
  status: 'pending' | 'reviewing' | 'interviewed' | 'offered' | 'rejected';
  submittedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  organization: string;
  testimonial: string;
  rating: number;
  published: boolean;
  location: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: string;
  description: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
  image: string;
  themeTag: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp: string;
  addressNigeria: string;
  addressUK: string;
  establishedYear: string;
  stats: {
    trainedGuards: string;
    responseTime: string;
    droneCctvCoverage: string;
    clientRetention: string;
  };
  socialPublishingMode: 'manual_approval' | 'auto_publish';
  socialLinks: {
    facebook: string;
    linkedin: string;
    x: string;
    instagram: string;
    youtube: string;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  details: string;
  ip: string;
}
