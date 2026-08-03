import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Folder } from 'lucide-react';
import type { PopularCategory } from '../lib/dynamicContentApi';

interface PopularCategoriesProps {
  categories: PopularCategory[];
  loading: boolean;
}

export const PopularCategories: React.FC<PopularCategoriesProps> = ({ categories, loading }) => {
  const [startIndex, setStartIndex] = useState(0);

  const prevCategory = () => {
    setStartIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  const nextCategory = () => {
    setStartIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  };

  // Limit display to 3 categories at a time if they have many categories
  const displayed = categories.slice(startIndex, startIndex + 3);
  if (displayed.length < 3 && categories.length >= 3) {
    const overflow = 3 - displayed.length;
    displayed.push(...categories.slice(0, overflow));
  }

  return (
    <section id="categories" className="w-full bg-[#121212] py-16 text-white font-['Jost',sans-serif] border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title & Nav Arrows */}
        <div className="relative text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-white uppercase font-['Montserrat',sans-serif]">
            POPULAR CATEGORIES
          </h2>

          {categories.length > 3 && (
            <>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden sm:block">
                <button
                  onClick={prevCategory}
                  className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                  aria-label="Previous category"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:block">
                <button
                  onClick={nextCategory}
                  className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                  aria-label="Next category"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#181818] border border-neutral-800 p-8 flex flex-col items-center text-center animate-pulse"
              >
                <div className="w-28 h-28 rounded-full bg-neutral-800 mb-6" />
                <div className="h-4 w-32 bg-neutral-800 mb-2 rounded" />
                <div className="h-3 w-24 bg-neutral-800 rounded" />
              </div>
            ))
          ) : categories.length === 0 ? (
            <div className="col-span-3 text-center py-12 bg-[#181818] border border-neutral-800/50">
              <Folder className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-400 text-xs">No popular categories created yet</p>
            </div>
          ) : (
            displayed.map((cat) => {
              // Determine path based on dynamic database filters
              let linkPath = '/';
              if (cat.filter_type) {
                linkPath = `/collection/type/${cat.filter_type}`;
              } else if (cat.filter_cat) {
                linkPath = `/collection/category/${cat.filter_cat}`;
              }

              return (
                <Link
                  key={cat.id}
                  to={linkPath}
                  className="bg-[#181818] border border-neutral-800 hover:border-neutral-700 p-8 flex flex-col items-center text-center group cursor-pointer transition-all duration-300"
                >
                  {/* Circular Thumbnail Image */}
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-neutral-900 border border-neutral-700 mb-6 group-hover:border-white transition-colors flex items-center justify-center">
                    <img
                      src={cat.image_url}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <h3 className="text-sm font-bold tracking-[0.15em] text-white uppercase font-['Montserrat',sans-serif] mb-1 group-hover:text-amber-400 transition-colors">
                    {cat.title}
                  </h3>

                  {cat.subtitle && (
                    <p className="text-xs text-neutral-400 font-light tracking-wide">
                      {cat.subtitle}
                    </p>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
