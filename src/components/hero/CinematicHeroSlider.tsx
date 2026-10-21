import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export const CinematicHeroSlider: React.FC = () => {
  const { heroSlides, navigate } = useApp();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const touchStartXRef = useRef<number | null>(null);

  const SLIDE_DURATION = 6500;

  // Safely handle an empty slide collection.
  const currentSlide = heroSlides[currentSlideIndex] ?? heroSlides[0];

  // Autoplay and progress tracking.
  useEffect(() => {
    if (!isPlaying || heroSlides.length <= 1) return;

    const intervalStep = 50;
    const increment = (intervalStep / SLIDE_DURATION) * 100;

    const timer = window.setInterval(() => {
      setProgress((previousProgress) => {
        if (previousProgress + increment >= 100) {
          setCurrentSlideIndex(
            (previousIndex) => (previousIndex + 1) % heroSlides.length
          );

          return 0;
        }

        return previousProgress + increment;
      });
    }, intervalStep);

    return () => window.clearInterval(timer);
  }, [isPlaying, heroSlides.length]);

  // Navigate to the next slide.
  const handleNext = () => {
    if (heroSlides.length <= 1) return;

    setCurrentSlideIndex(
      (previousIndex) => (previousIndex + 1) % heroSlides.length
    );

    setProgress(0);
  };

  // Navigate to the previous slide.
  const handlePrev = () => {
    if (heroSlides.length <= 1) return;

    setCurrentSlideIndex(
      (previousIndex) =>
        (previousIndex - 1 + heroSlides.length) % heroSlides.length
    );

    setProgress(0);
  };

  // Navigate directly to a selected slide.
  const goToSlide = (index: number) => {
    if (index < 0 || index >= heroSlides.length) return;

    setCurrentSlideIndex(index);
    setProgress(0);
  };

  // Support touch gestures on mobile devices.
  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartXRef.current === null) return;

    const touchEndX = event.changedTouches[0]?.clientX;

    if (touchEndX === undefined) {
      touchStartXRef.current = null;
      return;
    }

    const difference = touchStartXRef.current - touchEndX;

    if (difference > 50) {
      handleNext();
    } else if (difference < -50) {
      handlePrev();
    }

    touchStartXRef.current = null;
  };

  // Gracefully handle missing slide data.
  if (!currentSlide) {
    return (
      <section
        className="flex min-h-[500px] items-center justify-center bg-[#030712] px-6 text-center text-slate-300"
        aria-label="Security capabilities showcase"
      >
        <p>Hero content is currently unavailable.</p>
      </section>
    );
  }

  const slideNumber = String(currentSlideIndex + 1).padStart(2, '0');
  const totalSlides = String(heroSlides.length).padStart(2, '0');

  return (
    <section
      className="
        relative isolate w-full overflow-hidden bg-[#030712]
        min-h-[620px] h-[680px] lg:h-[740px]
        select-none
      "
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="SafeNet Corporate Security Capabilities Showcase"
    >
      {/* ======================================================
          BACKGROUND SLIDES
          Brighter images with softer cinematic overlays.
      ====================================================== */}

      {heroSlides.map((slide, index) => {
        const isActive = index === currentSlideIndex;

        return (
          <div
            key={slide.id}
            aria-hidden="true"
            className={`
              absolute inset-0 overflow-hidden
              transition-opacity duration-1000 ease-in-out
              ${
                isActive
                  ? 'z-0 opacity-100'
                  : 'pointer-events-none z-[-1] opacity-0'
              }
            `}
          >
            {/* Background image with improved brightness and colour. */}
            <div
              className={`
                absolute inset-0
                bg-cover bg-center bg-no-repeat
                transition-transform duration-[6500ms] ease-out
                ${
                  isActive
                    ? 'scale-110'
                    : 'scale-100'
                }
              `}
              style={{
                backgroundImage: `url("${slide.image}")`,
                filter: 'brightness(1.16) saturate(1.12) contrast(1.03)',
                willChange: isActive ? 'transform' : 'auto',
              }}
            />

            {/* Primary gradient:
                The left remains dark enough for text,
                while the right reveals substantially more of the image. */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-r
                from-[#030712]/65
                via-[#030712]/35
                to-[#030712]/10
              "
            />

            {/* Secondary gradient:
                A softer bottom shadow anchors the content and controls. */}
            <div
              className="
                absolute inset-0
                bg-gradient-to-t
                from-[#030712]/75
                via-[#030712]/10
                to-[#030712]/15
              "
            />

            {/* Subtle central blend for a cinematic appearance. */}
            <div
              className="
                absolute inset-0
                bg-[radial-gradient(ellipse_at_55%_40%,transparent_15%,rgba(3,7,18,0.18)_100%)]
              "
            />

            {/* Fine security grid. */}
            <div
              className="
                bg-security-grid
                pointer-events-none absolute inset-0
                opacity-20
              "
            />
          </div>
        );
      })}

      {/* ======================================================
          DECORATIVE RADAR
      ====================================================== */}

      <div className="pointer-events-none absolute right-8 top-8 z-10 hidden xl:block">
        <div className="relative h-28 w-28 rounded-full border border-amber-400/35 p-2">
          <div className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-amber-400/25">
            <div className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.8)] animate-ping" />
          </div>

          <div className="radar-sweep pointer-events-none absolute inset-0 rounded-full" />

          <div className="absolute inset-5 rounded-full border border-amber-400/10" />
        </div>
      </div>

      {/* ======================================================
          HERO CONTENT
      ====================================================== */}

      <div
        className="
          relative z-10 mx-auto flex h-full max-w-7xl
          flex-col justify-between
          px-5 py-10
          sm:px-8 sm:py-12
          lg:px-12 lg:py-14
        "
      >
        {/* Top identification bar. */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/20 bg-slate-950/25 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300 sm:text-xs">
              {currentSlide.themeTag}
            </span>
          </div>

          <span className="hidden h-4 w-px bg-white/20 sm:block" />

          <span className="hidden text-xs font-medium tracking-wide text-slate-200/90 sm:block">
            UK Rigor <span className="mx-1 text-amber-400">+</span>
            Nigerian Local Execution
          </span>
        </div>

        {/* Main heading and calls to action. */}
        <div className="my-8 max-w-3xl sm:my-10">
          {/* Eyebrow. */}
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-amber-400 sm:w-12" />

            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber-300 sm:text-xs">
              {currentSlide.eyebrow}
            </p>
          </div>

          {/* Main heading. */}
          <h1
            key={`heading-${currentSlide.id}`}
            className="
              max-w-3xl
              text-4xl font-extrabold
              leading-[1.08] tracking-[-0.045em]
              text-white
              drop-shadow-[0_2px_18px_rgba(0,0,0,0.25)]
              sm:text-5xl
              lg:text-6xl
              xl:text-7xl
              [text-wrap:balance]
            "
          >
            {currentSlide.headline}
          </h1>

          {/* Decorative heading underline. */}
          <div className="mt-5 flex items-center gap-2">
            <span className="h-1 w-14 rounded-full bg-amber-400" />
            <span className="h-1 w-5 rounded-full bg-amber-400/40" />
            <span className="h-1 w-2 rounded-full bg-white/30" />
          </div>

          {/* Description. */}
          <p
            key={`description-${currentSlide.id}`}
            className="
              mt-5 max-w-2xl
              text-sm font-normal leading-7
              text-slate-100
              drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]
              sm:text-base sm:leading-8
              lg:text-lg
            "
          >
            {currentSlide.description}
          </p>

          {/* Call-to-action buttons. */}
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Primary CTA. */}
            <button
              type="button"
              onClick={() => navigate(currentSlide.cta1Link)}
              className="
                group inline-flex min-h-12 items-center justify-center gap-3
                rounded-lg border border-amber-300/80
                bg-amber-400 px-5 py-3
                text-xs font-extrabold uppercase tracking-wide text-slate-950
                shadow-[0_6px_25px_rgba(245,158,11,0.16)]
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-amber-200 hover:bg-amber-300
                hover:shadow-[0_10px_35px_rgba(245,158,11,0.28)]
                active:translate-y-0
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-amber-300
                focus-visible:ring-offset-2
                focus-visible:ring-offset-slate-950
                sm:px-6 sm:text-sm
              "
            >
              <span>{currentSlide.cta1Text}</span>

              <ArrowRight
                className="
                  h-4 w-4
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              />
            </button>

            {/* Secondary CTA. */}
            <button
              type="button"
              onClick={() => navigate(currentSlide.cta2Link)}
              className="
                inline-flex min-h-12 items-center justify-center
                rounded-lg border border-white/25
                bg-slate-950/35 px-5 py-3
                text-xs font-bold uppercase tracking-wide text-white
                shadow-sm backdrop-blur-md
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-amber-300/60
                hover:bg-slate-900/65 hover:text-amber-200
                active:translate-y-0
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-amber-300
                focus-visible:ring-offset-2
                focus-visible:ring-offset-slate-950
                sm:px-6 sm:text-sm
              "
            >
              {currentSlide.cta2Text}
            </button>
          </div>
        </div>

        {/* ====================================================
            SLIDER CONTROLS
        ==================================================== */}

        <div
          className="
            flex flex-col gap-5
            border-t border-white/20
            pt-5
            sm:flex-row sm:items-center sm:justify-between
          "
        >
          {/* Slide indicators. */}
          <div
            className="flex items-center gap-2 overflow-x-auto py-1"
            aria-label="Choose a hero slide"
          >
            {heroSlides.map((slide, index) => {
              const isActive = index === currentSlideIndex;

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}: ${slide.eyebrow}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`
                    group relative h-1.5 shrink-0 overflow-hidden rounded-full
                    transition-all duration-300
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-amber-300
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-slate-950
                    ${
                      isActive
                        ? 'w-12 bg-white/30'
                        : 'w-5 bg-white/25 hover:bg-white/50'
                    }
                  `}
                >
                  {isActive && (
                    <span
                      className="
                        absolute inset-y-0 left-0 rounded-full
                        bg-amber-400
                      "
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Slide number and navigation buttons. */}
          <div className="flex items-center justify-between gap-5 sm:justify-end">
            <div
              className="font-mono-numbers whitespace-nowrap text-xs tracking-wider"
              aria-label={`Slide ${currentSlideIndex + 1} of ${heroSlides.length}`}
            >
              <span className="font-bold text-amber-300">
                {slideNumber}
              </span>

              <span className="mx-2 text-white/40">/</span>

              <span className="text-slate-300">
                {totalSlides}
              </span>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-white/20 bg-slate-950/40 p-1 shadow-lg backdrop-blur-md">
              {/* Previous slide. */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={heroSlides.length <= 1}
                className="
                  rounded-md p-2 text-slate-200
                  transition-colors
                  hover:bg-white/10 hover:text-amber-300
                  disabled:cursor-not-allowed disabled:opacity-40
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-amber-300
                "
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Pause or resume autoplay. */}
              <button
                type="button"
                onClick={() => setIsPlaying((playing) => !playing)}
                className="
                  rounded-md p-2 text-slate-200
                  transition-colors
                  hover:bg-white/10 hover:text-amber-300
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-amber-300
                "
                aria-label={isPlaying ? 'Pause autoplay' : 'Resume autoplay'}
                aria-pressed={!isPlaying}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
              </button>

              {/* Next slide. */}
              <button
                type="button"
                onClick={handleNext}
                disabled={heroSlides.length <= 1}
                className="
                  rounded-md p-2 text-slate-200
                  transition-colors
                  hover:bg-white/10 hover:text-amber-300
                  disabled:cursor-not-allowed disabled:opacity-40
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-amber-300
                "
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
