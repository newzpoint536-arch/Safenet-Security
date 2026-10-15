import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ArrowRight, Shield, BookOpen, Clock, Calendar, User, Tag, Sparkles, Filter, ChevronRight } from 'lucide-react';

interface BlogPageProps {
  initialCategory?: string;
  initialTag?: string;
}

export const BlogPage: React.FC<BlogPageProps> = ({ initialCategory, initialTag }) => {
  const { blogPosts, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedTag, setSelectedTag] = useState<string | null>(initialTag || null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
    if (initialTag) {
      setSelectedTag(initialTag);
    }
  }, [initialCategory, initialTag]);

  const categories = [
    'All',
    'Corporate Security',
    'Security Technology',
    'Executive Protection',
    'Maritime Security',
    'Risk Management'
  ];

  const publishedPosts = blogPosts.filter(p => p.status === 'published');

  // Featured post: first post or highest viewed
  const featuredPost = publishedPosts[0];

  // All available unique tags
  const allTags = Array.from(new Set(publishedPosts.flatMap(p => p.tags || [])));

  const filteredPosts = publishedPosts.filter(post => {
    const matchesCat = selectedCategory === 'All' || 
      post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesTag = !selectedTag || 
      post.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());
    const matchesSearch = !searchQuery.trim() || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesTag && matchesSearch;
  });

  return (
    <div className="py-12 bg-slate-950 text-slate-100 space-y-12">
      
      {/* Header & Editorial Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <Shield className="w-4 h-4" />
          <span>Strategic Risk Advisory & Threat Intelligence</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight">
          SAFENET SECURITY INTELLIGENCE
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Rigorous threat analyses, physical perimeter engineering guidelines, surveillance blueprints, and executive risk advisories from SafeNet's Nigerian operational commanders and UK-trained security specialists.
        </p>
      </div>

      {/* Featured Briefing Hero Card (when not searching/filtered by tag) */}
      {featuredPost && selectedCategory === 'All' && !selectedTag && !searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            onClick={() => navigate(`/blog/${featuredPost.slug}`)}
            className="group relative bg-slate-900 border border-slate-800 hover:border-amber-400/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-950">
              <img
                src={featuredPost.featuredImage}
                alt={featuredPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span className="text-amber-400 font-bold uppercase tracking-wider">Featured Briefing</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredPost.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredPost.readingTime}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white group-hover:text-amber-400 transition-colors leading-tight">
                  {featuredPost.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold text-xs">
                    {featuredPost.author.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">
                      {featuredPost.author.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Read Briefing</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (cat === 'All') {
                    navigate('/blog');
                  } else {
                    navigate(`/blog/category/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'))}`);
                  }
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search intelligence & threat vectors..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

        </div>

        {/* Tag Cloud Filter Bar */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3" /> Filter Tag:
            </span>
            {selectedTag && (
              <button
                onClick={() => {
                  setSelectedTag(null);
                  navigate('/blog');
                }}
                className="px-2.5 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded text-[11px] font-bold flex items-center gap-1"
              >
                <span>#{selectedTag}</span>
                <span className="text-xs">&times;</span>
              </button>
            )}
            {allTags.slice(0, 8).map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(tag);
                  navigate(`/blog/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`);
                }}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  selectedTag?.toLowerCase() === tag.toLowerCase()
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <div className="text-slate-400 text-sm">No briefings match your search criteria.</div>
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedTag(null); setSearchQuery(''); navigate('/blog'); }}
              className="px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded hover:bg-amber-300 transition-colors"
            >
              Reset All Filters
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
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden flex flex-col justify-between cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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

                      <h3 className="text-lg font-display font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-amber-400 font-bold">
                        {post.author.name.charAt(0)}
                      </div>
                      <span className="text-[11px] truncate max-w-[130px]">{post.author.name}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                      <span>Read Brief</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Advisory & Security Diagnostic Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              Executive Security Advisory
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Evaluate your corporate perimeter against emerging threats.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Use our interactive facility diagnostic to identify CCTV blind spots, gate access bottlenecks, and response readiness, or book an on-site audit with SafeNet certified risk assessors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => navigate('/security-assessment')}
              className="w-full sm:w-auto px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md text-center"
            >
              Take Free Security Assessment
            </button>
            <button
              onClick={() => navigate('/request-quote')}
              className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-lg border border-slate-700 transition-colors text-center"
            >
              Request Commercial Proposal
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
