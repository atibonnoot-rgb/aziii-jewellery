import React from 'react';
import { ArrowRight } from 'lucide-react';

export const MiddleBanner: React.FC = () => {
  return (
    <section className="relative w-full h-[320px] sm:h-[400px] bg-black text-white font-['Jost',sans-serif] overflow-hidden border-y border-neutral-800">
      {/* Background Image with Rings */}
      <img
        src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1920&q=80"
        alt="Jewelry Collection"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-left-center filter brightness-[0.4] contrast-[1.2]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />

      {/* Text Container aligned right/center */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-8 flex items-center justify-end text-right">
        <div className="max-w-lg">
          <p className="text-xs sm:text-sm tracking-[0.3em] text-neutral-300 font-medium uppercase mb-2">
            NEW COLLECTION
          </p>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-[0.15em] text-white uppercase font-['Montserrat',sans-serif] mb-6">
            JEWELRY BY FANBONG
          </h2>

          <a
            href="#bestsellers"
            className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.2em] text-white uppercase border-b border-white/80 pb-1 hover:text-amber-300 hover:border-amber-300 transition-colors"
          >
            <span>SHOP ALL</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
