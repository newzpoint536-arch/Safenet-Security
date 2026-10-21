import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Radio, 
  ArrowRight,
  Maximize2
} from 'lucide-react';

export const CinematicHeroSlider: React.FC = () => {
  const { heroSlides, navigate } = useApp();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const SLIDE_DURATION = 6500; // 6.5s per slide

  // Autoplay and progress bar interval
  useEffect(() => {
    if (!isPlaying) return;

    const intervalStep = 50; // update progress every 50ms
    const increment = (intervalStep / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlideIndex((old) => (old + 1) % heroSlides.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPlaying, heroSlides.length]);

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setProgress(0);
  };

  const goToSlide = (idx: number) => {
    setCurrentSlideIndex(idx);
    setProgress(0);
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  const currentSlide = heroSlides[currentSlideIndex] || heroSlides[0];

  return (
    <section 
      className="relative w-full h-[620px] sm:h-[680px] lg:h-[740px] bg-slate-950 overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="SafeNet Corporate Security Capabilities Showcase"
    >
      {/* Background Slides with Ken Burns / Fade Transitions */}
      {heroSlides.map((slide, idx) => {
        const isActive = idx === currentSlideIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Image with subtle slow zoom when active */}
            <div 
              className={`w-full h-full bg-cover bg-center transition-transform duration-7000 ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Measured Scrim & Gradient Overlays for WCAG AA readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
            
            {/* Subtle Security Grid Pattern */}
            <div className="absolute inset-0 bg-security-grid opacity-30 pointer-events-none" />
          </div>
        );
      })}

      {/* Decorative Radar Corner Element (Quiet HUD styling) */}
      <div className="hidden xl:block absolute top-8 right-8 z-20 pointer-events-none opacity-40">
        <div className="relative w-28 h-28 rounded-full border border-amber-500/30 p-2">
          <div className="w-full h-full rounded-full border border-dashed border-amber-500/20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></div>
          </div>
          <div className="absolute inset-0 rounded-full radar-sweep pointer-events-none"></div>
        </div>
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-12 lg:py-16">
        
        {/* Top Capability Category Tag */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{currentSlide.themeTag}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            UK Rigor + Nigerian Local Execution
          </span>
        </div>

        {/* Main Heading and CTA Area */}
        <div className="max-w-3xl space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest font-bold text-amber-400/90">
              {currentSlide.eyebrow}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15] text-balance">
              {currentSlide.headline}
            </h1>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
            {currentSlide.description}
          </p>

          {/* Action Button Row */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate(currentSlide.cta1Link)}
              className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-md transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 whitespace-nowrap"
            >
              <span>{currentSlide.cta1Text}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate(currentSlide.cta2Link)}
              className="px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 active:scale-98 rounded-md transition-all whitespace-nowrap"
            >
              {currentSlide.cta2Text}
            </button>
          </div>
        </div>

        {/* Bottom Control Bar: Progress indicators, Slide numbering & Controls */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          
          {/* Slide Indicator Dots with Active Progress */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {heroSlides.map((slide, idx) => {
              const isActive = idx === currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`group relative h-1.5 rounded-full transition-all duration-300 ${
                    isActive ? 'w-12 bg-slate-800' : 'w-5 bg-slate-800/80 hover:bg-slate-700'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${slide.eyebrow}`}
                >
                  {isActive && (
                    <span 
                      className="absolute inset-0 bg-amber-400 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Slide Numbers & Play/Pause Controls */}
          <div className="flex items-center gap-4 text-slate-400">
            <div className="font-mono-numbers text-xs tracking-wider">
              <span className="text-white font-bold">0{currentSlideIndex + 1}</span>
              <span className="text-slate-600"> / </span>
              <span>0{heroSlides.length}</span>
            </div>

            <div className="flex items-center gap-1 border border-slate-800 rounded bg-slate-900/80 p-0.5">
              <button
                onClick={handlePrev}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                aria-label={isPlaying ? 'Pause Autoplay' : 'Resume Autoplay'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              <button
                onClick={handleNext}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
