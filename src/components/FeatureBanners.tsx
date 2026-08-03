import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const FeatureBanners: React.FC = () => {
  const { get } = useSiteSettings();

  const banners = [
    {
      title: 'BRACELETS',
      description: 'Lorem ipsum dolor sit amet conse ctetur adipiscing elit, sed do eiusmod',
      image: get('banner_bracelets_image'),
      link: '/collection/type/bracelet'
    },
    {
      title: 'RINGS',
      description: 'Lorem ipsum dolor sit amet conse ctetur adipiscing elit, sed do eiusmod',
      image: get('banner_rings_image'),
      link: '/collection/type/ring'
    },
    {
      title: 'EARRINGS',
      description: 'Lorem ipsum dolor sit amet conse ctetur adipiscing elit, sed do eiusmod',
      image: get('banner_earrings_image'),
      link: '/collection/type/earrings'
    },
    {
      title: 'PENDANTS',
      description: 'Lorem ipsum dolor sit amet conse ctetur adipiscing elit, sed do eiusmod',
      image: get('banner_pendants_image'),
      link: '/collection/type/pendant'
    }
  ];

  return (
    <section className="w-full bg-[#121212] py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {banners.map((item, index) => (
          <div
            key={index}
            className="group relative h-[360px] overflow-hidden bg-neutral-900 flex flex-col justify-end border border-neutral-800 hover:border-neutral-700 transition-all"
          >
            {/* Background Image */}
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.75] group-hover:brightness-[0.85]"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content Box */}
            <div className="relative z-10 p-6 text-center flex flex-col items-center">
              <h3 className="text-xl font-bold tracking-[0.2em] text-white uppercase font-['Montserrat',sans-serif] mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-300 font-light max-w-xs leading-relaxed mb-4">
                {item.description}
              </p>
              <Link
                to={item.link}
                className="text-xs font-semibold tracking-[0.2em] text-white uppercase border-b border-white/60 hover:border-white pb-0.5 hover:text-amber-200 transition-colors"
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
