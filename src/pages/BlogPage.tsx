import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ArrowRight, BookOpen, Clock, Calendar, User, Tag } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const { blogPosts, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Corporate Security',
    'Security Technology',
    'Executive Protection',
    'Maritime Security',
    'Risk Management'
  ];

  const publishedPosts = blogPosts.filter(p => p.status === 'published');

  const filteredPosts = publishedPosts.filter(post => {
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-12">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <BookOpen className="w-4 h-4" />
          <span>Security Insights & Intelligence</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          SafeNet Briefings & Operational Insights
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          In-depth analyses on physical perimeter hardening, drone surveillance operations, corporate risk mitigation, and executive security strategies across Nigeria.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search insights & tags..."
              className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
            <div className="text-slate-400 text-sm">No briefings match your search criteria.</div>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <article
                  key={post.id}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden flex flex-col justify-between cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div>
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

                      <h2 className="text-lg font-display font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium text-slate-300 truncate max-w-[160px]">
                      {post.author.name}
                    </span>
                    <span className="text-amber-400 font-semibold group-hover:underline flex items-center gap-1 shrink-0">
                      Read Briefing <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
