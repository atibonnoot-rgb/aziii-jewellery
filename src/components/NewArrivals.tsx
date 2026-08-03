import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye, ArrowRightLeft, Star } from 'lucide-react';
import { Product } from '../types';
import { DiamondIcon } from './DiamondIcon';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { formatPrice } from '../lib/currency';

interface NewArrivalsProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
}

function SkeletonCard() {
  return (
    <div className="bg-[#181818] border border-neutral-800 flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-neutral-800" />
      <div className="p-3.5 space-y-2">
        <div className="h-2 w-10 bg-neutral-700 rounded" />
        <div className="h-2.5 w-full bg-neutral-700 rounded" />
        <div className="h-2.5 w-2/3 bg-neutral-700 rounded" />
        <div className="h-2.5 w-12 bg-neutral-700 rounded mt-2" />
      </div>
    </div>
  );
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({
  products,
  loading,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  wishlistIds,
}) => {
  const { get } = useSiteSettings();
  return (
    <section id="newarrivals" className="w-full bg-[#121212] py-16 text-white font-['Jost',sans-serif]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] text-white uppercase font-['Montserrat',sans-serif] mb-2">
            NEW ARRIVALS
          </h2>

          <div className="flex justify-center my-2">
            <DiamondIcon className="w-3.5 h-3.5 text-white/80" />
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-xl mx-auto mt-2">
            {get('newarrivals_subtitle') || 'This unique jewelry is handcrafted on the beautiful island of Nantucket using fine silver and semi precious stones.'}
          </p>
        </div>

        {/* 5-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : products.length === 0
            ? (
                <div className="col-span-5 text-center py-12 text-neutral-500 text-sm">
                  No new arrivals yet. Add products via the admin panel.
                </div>
              )
            : products.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="group bg-[#181818] border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Clickable image → product page */}
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="relative w-full aspect-square bg-neutral-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Hover Actions Bar */}
                        <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-sm py-2 px-2 flex items-center justify-center space-x-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
                            className="text-neutral-300 hover:text-white transition-colors p-1"
                            title="Add to Cart"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); onToggleWishlist(product); }}
                            className={`transition-colors p-1 ${isWishlisted ? 'text-amber-400' : 'text-neutral-300 hover:text-white'}`}
                            title="Add to Wishlist"
                          >
                            <Heart className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <button onClick={(e) => e.preventDefault()} className="text-neutral-300 hover:text-white transition-colors p-1" title="Compare">
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); onQuickView(product); }}
                            className="text-neutral-300 hover:text-white transition-colors p-1"
                            title="Quick View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </Link>

                    {/* Info Container — also clickable */}
                    <Link to={`/product/${product.id}`} className="p-3.5 flex flex-col flex-grow justify-between bg-[#181818] hover:bg-[#1e1e1e] transition-colors">
                      <div>
                        <span className="text-[9px] tracking-widest text-neutral-500 uppercase font-medium">
                          {product.category}
                        </span>
                        <h3 className="text-[11px] font-semibold tracking-wider text-neutral-200 mt-1 uppercase line-clamp-2 leading-tight group-hover:text-white transition-colors">
                          {product.name}
                        </h3>
                      </div>

                      <div className="mt-3">
                        <div className="text-xs font-semibold text-white">
                          {formatPrice(product.price)}
                        </div>
                        <div className="flex items-center space-x-1 mt-1 text-amber-400 text-[9px]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-neutral-400 text-[9px] ml-0.5">(5.0)</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};
