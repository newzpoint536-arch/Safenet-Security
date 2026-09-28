import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';

export const LatestBlogSection: React.FC = () => {
  const { blogPosts, navigate } = useApp();
  const publishedPosts = blogPosts.filter(p => p.status === 'published').slice(0, 3);

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Security Intelligence & Operations
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Latest Briefings & Executive Insights
            </h2>
            <p className="text-sm text-slate-400">
              Expert commentary on emerging threats, physical perimeter defense, surveillance technology, and risk management in Nigeria.
            </p>
          </div>

          <button
            onClick={() => navigate('/blog')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 shrink-0 group"
          >
            <span>Visit Blog & Publications</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publishedPosts.map((post) => {
            const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <article
                key={post.id}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  {/* Featured Image */}
                  <div className="relative aspect-video overflow-hidden bg-slate-950">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  </div>

                  <div className="p-6 space-y-3">
                    {/* Zero-Pill Metadata Line */}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-amber-400">{post.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formattedDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.readingTime}</span>
                    </div>

                    <h3 className="text-base font-display font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-slate-300">{post.author.name}</span>
                  <span className="text-amber-400 font-semibold group-hover:underline flex items-center gap-1">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
