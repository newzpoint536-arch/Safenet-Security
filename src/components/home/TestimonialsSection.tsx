import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Quote, MapPin } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useApp();
  const publishedTestimonials = testimonials.filter(t => t.published);

  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Verified Client Endorsements
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Trusted by Commercial Towers, Residential Estates & Energy Terminals
          </h2>
          <p className="text-sm text-slate-400">
            Hear directly from Nigerian facility managers, estate leaders, and logistics directors who rely on SafeNet for daily operational vigilance.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {publishedTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-950 border border-slate-800 rounded-lg p-6 flex flex-col justify-between space-y-6 relative hover:border-slate-700 transition-colors"
            >
              <div className="space-y-4">
                {/* Rating stars and quote mark */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-700 stroke-[1.5]" />
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{t.testimonial}"
                </p>
              </div>

              {/* Author attribution - clean unboxed layout */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-sm font-display font-bold text-white">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-amber-400/90 font-medium">
                    {t.position}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {t.organization}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span>{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
