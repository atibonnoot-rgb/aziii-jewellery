import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export const DealsOfDay: React.FC = () => {
  // Timer state starting at 10 days, 12 hours, 45 mins, 15 secs
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 12,
    minutes: 45,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full py-20 bg-black text-white font-['Jost',sans-serif] overflow-hidden border-y border-neutral-800">
      {/* Background Image with Rings */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1920&q=80"
          alt="Deals of the Day Rings"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
      </div>

      {/* Content Center */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-sm tracking-[0.3em] font-semibold text-neutral-300 uppercase mb-2">
          DEALS OF THE DAY
        </h3>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-[0.15em] text-white uppercase font-['Montserrat',sans-serif] mb-8">
          UPTO 60% OFF
        </h2>

        {/* Circular Countdown Timers */}
        <div className="flex justify-center items-center gap-3 sm:gap-6 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-white/60 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="text-base sm:text-xl font-bold font-['Montserrat',sans-serif]">{timeLeft.days}</span>
            </div>
            <span className="text-[10px] tracking-widest text-neutral-400 mt-2 uppercase font-medium">DAY</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-white/60 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="text-base sm:text-xl font-bold font-['Montserrat',sans-serif]">{timeLeft.hours}</span>
            </div>
            <span className="text-[10px] tracking-widest text-neutral-400 mt-2 uppercase font-medium">HOUR</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-white/60 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="text-base sm:text-xl font-bold font-['Montserrat',sans-serif]">{timeLeft.minutes}</span>
            </div>
            <span className="text-[10px] tracking-widest text-neutral-400 mt-2 uppercase font-medium">MIN</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-white/60 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="text-base sm:text-xl font-bold font-['Montserrat',sans-serif]">{timeLeft.seconds}</span>
            </div>
            <span className="text-[10px] tracking-widest text-neutral-400 mt-2 uppercase font-medium">SEC</span>
          </div>
        </div>

        {/* SHOP ALL Button */}
        <a
          href="#newarrivals"
          className="inline-flex items-center space-x-2 text-xs font-bold tracking-[0.2em] text-white uppercase border-b-2 border-white pb-1 hover:text-amber-300 hover:border-amber-300 transition-colors"
        >
          <span>SHOP ALL</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};
