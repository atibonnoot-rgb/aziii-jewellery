import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { HeroSlide } from '../lib/dynamicContentApi';

interface HeroBannerProps {
  slides: HeroSlide[];
  loading: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ slides, loading }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const prevSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Touch swipe handling
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || slides.length <= 1) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide, slides.length]);

  if (loading) {
    return (
      <div className="w-full h-[520px] md:h-[620px] bg-black flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-neutral-500 text-xs tracking-widest uppercase">Loading luxury showcase…</p>
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[520px] md:h-[620px] bg-black overflow-hidden font-['Jost',sans-serif] select-none"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Dark Vignette Overlay */}
          <img
            src={slide.image_url}
            alt={slide.title}
            className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

          {/* Centered Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 sm:px-20 md:px-28 max-w-5xl mx-auto">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.15em] text-white uppercase font-['Montserrat',sans-serif] mb-4 drop-shadow-md">
              {slide.title}
            </h1>
            
            {slide.description && (
              <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-light tracking-widest max-w-xl leading-relaxed mb-8 uppercase font-['Jost',sans-serif]">
                {slide.description}
              </p>
            )}

            <a
              href={slide.link || '#bestsellers'}
              className="inline-block px-8 py-3 text-xs font-semibold tracking-[0.25em] text-white uppercase border border-white hover:bg-white hover:text-black transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
            >
              SHOP NOW
            </a>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/60 hover:text-white transition-all transform hover:scale-125 focus:outline-none drop-shadow-md"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 stroke-[1.75]" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/60 hover:text-white transition-all transform hover:scale-125 focus:outline-none drop-shadow-md"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 stroke-[1.75]" />
          </button>

          {/* Slider Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
