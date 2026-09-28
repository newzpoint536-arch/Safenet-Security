import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { IndustriesPage } from './pages/IndustriesPage';
import { IndustryDetailPage } from './pages/IndustryDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SecurityAssessmentPage } from './pages/SecurityAssessmentPage';
import { RequestQuotePage } from './pages/RequestQuotePage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostDetailPage } from './pages/BlogPostDetailPage';
import { CareersPage } from './pages/CareersPage';
import { LicencesCompliancePage } from './pages/LicencesCompliancePage';
import { ContactPage } from './pages/ContactPage';
import { AdminCommandCentre } from './pages/AdminCommandCentre';

import { ShieldAlert, ArrowLeft } from 'lucide-react';

const RouterContent: React.FC = () => {
  const { currentPath, navigate, toastMessage } = useApp();

  const renderRoute = () => {
    // Strip trailing slash for consistent matching
    const cleanPath = currentPath.length > 1 && currentPath.endsWith('/') 
      ? currentPath.slice(0, -1) 
      : currentPath;

    // Home
    if (cleanPath === '/' || cleanPath === '') {
      return <HomePage />;
    }

    // About
    if (cleanPath === '/about') {
      return <AboutPage />;
    }

    // Services Catalog
    if (cleanPath === '/services') {
      return <ServicesPage />;
    }

    // Service Detail: /services/[slug]
    if (cleanPath.startsWith('/services/')) {
      const slug = cleanPath.replace('/services/', '');
      return <ServiceDetailPage slug={slug} />;
    }

    // Industries Catalog
    if (cleanPath === '/industries') {
      return <IndustriesPage />;
    }

    // Industry Detail: /industries/[slug]
    if (cleanPath.startsWith('/industries/')) {
      const slug = cleanPath.replace('/industries/', '');
      return <IndustryDetailPage slug={slug} />;
    }

    // Projects & Case Studies
    if (cleanPath === '/projects' || cleanPath === '/case-studies') {
      return <ProjectsPage />;
    }

    // Security Assessment
    if (cleanPath === '/security-assessment') {
      return <SecurityAssessmentPage />;
    }

    // Request a Quote
    if (cleanPath === '/request-quote' || cleanPath === '/quote') {
      return <RequestQuotePage />;
    }

    // Blog
    if (cleanPath === '/blog') {
      return <BlogPage />;
    }

    // Blog Post Detail: /blog/[slug]
    if (cleanPath.startsWith('/blog/')) {
      const slug = cleanPath.replace('/blog/', '');
      return <BlogPostDetailPage slug={slug} />;
    }

    // Careers
    if (cleanPath === '/careers') {
      return <CareersPage />;
    }

    // Licences & Compliance
    if (cleanPath === '/licences-compliance' || cleanPath === '/compliance') {
      return <LicencesCompliancePage />;
    }

    // Contact
    if (cleanPath === '/contact') {
      return <ContactPage />;
    }

    // Admin Command Centre
    if (cleanPath === '/admin' || cleanPath === '/cms') {
      return <AdminCommandCentre />;
    }

    // 404 Not Found Page
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4 space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 mx-auto">
          <ShieldAlert className="w-8 h-8 stroke-[2]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-extrabold text-white">404 — Protocol Undefined</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            The requested destination does not exist within the SafeNet Security perimeter.
          </p>
        </div>
        <div className="flex justify-center gap-4 text-xs">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Command Center</span>
          </button>
          <button
            onClick={() => navigate('/services')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-semibold"
          >
            View Services
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Universal Header */}
      <Header />

      {/* Main Routed View */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* Universal Footer */}
      <Footer />

      {/* Floating WhatsApp Quick Connect Widget */}
      <FloatingWhatsApp />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 border border-amber-400/60 text-white text-xs px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 max-w-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="flex-1 leading-snug">{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <RouterContent />
    </AppProvider>
  );
}
