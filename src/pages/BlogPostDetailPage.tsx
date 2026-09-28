import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

export const BlogPostDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { blogPosts, services, navigate, showToast } = useApp();
  const post = blogPosts.find(p => p.slug === slug);
  const [copied, setCopied] = useState(false);

  if (!post) {
    return (
      <div className="py-20 text-center max-w-xl mx-auto space-y-4">
        <h2 className="text-2xl font-display font-bold text-white">Article Not Found</h2>
        <p className="text-slate-400 text-sm">The requested security analysis is unavailable.</p>
        <button
          onClick={() => navigate('/blog')}
          className="px-4 py-2 text-xs bg-amber-400 text-slate-950 font-bold rounded"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(post.title);

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Article URL copied to clipboard.');
    setTimeout(() => setCopied(false), 3000);
  };

  const relatedServicesList = services.filter(s => post.relatedServices.includes(s.slug));

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="py-12 bg-slate-950 text-slate-100 space-y-12">
      
      {/* Top Breadcrumb & Return */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Security Insights</span>
        </button>
      </div>

      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Zero-Pill Header Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-amber-400">{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{formattedDate}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.2] text-balance">
          {post.title}
        </h1>

        {/* Author Bio Line */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-display font-bold text-white leading-tight">
                {post.author.name}
              </div>
              <div className="text-xs text-slate-400">
                {post.author.role}
              </div>
            </div>
          </div>

          {/* Social Share Group */}
          <div className="flex items-center gap-2">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&utm_source=linkedin&utm_medium=social`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded bg-slate-900 border border-slate-800 hover:text-amber-400 text-slate-300 text-xs transition-colors"
              title="Share on LinkedIn"
            >
              in
            </a>
            <a
              href={`https://x.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}&utm_source=x&utm_medium=social`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded bg-slate-900 border border-slate-800 hover:text-amber-400 text-slate-300 text-xs transition-colors"
              title="Share on X"
            >
              X
            </a>
            <a
              href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded bg-slate-900 border border-slate-800 hover:text-emerald-400 text-slate-300 text-xs transition-colors"
              title="Share on WhatsApp"
            >
              WA
            </a>
            <button
              onClick={copyShareLink}
              className="p-2 rounded bg-slate-900 border border-slate-800 hover:text-white text-slate-300 text-xs transition-colors flex items-center gap-1"
              title="Copy link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

      </div>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          <img
            src={post.featuredImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Prose Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-invert prose-amber max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
          {post.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-xl sm:text-2xl font-display font-bold text-white pt-4 pb-1 border-b border-slate-800">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
              return (
                <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg space-y-2 text-xs sm:text-sm">
                  {paragraph.split('\n').map((line, lIdx) => (
                    <div key={lIdx} className="leading-normal">
                      {line}
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <p key={idx} className="text-slate-300 font-normal leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="pt-8 mt-12 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Tags:</span>
          {post.tags.map((tag, i) => (
            <span key={i} className="text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Embedded Contextual Conversion Engine */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-xl p-8 space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider">
              Take Action on These Insights
            </span>
            <h3 className="text-xl font-display font-bold text-white">
              Need a Professional Security Assessment for Your Facility?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              SafeNet security advisors are available across Lagos, Abuja, and Port Harcourt to evaluate your perimeter, camera systems, and guard deployment.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/security-assessment')}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-all shadow-md"
            >
              Start Free Security Assessment
            </button>
            <button
              onClick={() => navigate('/request-quote')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded border border-slate-700 transition-colors"
            >
              Request a Commercial Quote
            </button>
          </div>
        </div>

        {/* Related Services */}
        {relatedServicesList.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-800 space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Related Security Capabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedServicesList.map(srv => (
                <div
                  key={srv.id}
                  onClick={() => navigate(`/services/${srv.slug}`)}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-400/40 p-4 rounded-lg cursor-pointer transition-colors group flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-400">
                      {srv.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">
                      {srv.category}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </article>
  );
};
