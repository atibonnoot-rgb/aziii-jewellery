import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye, ArrowRightLeft, Star } from 'lucide-react';
import { Product } from '../types';
import { DiamondIcon } from './DiamondIcon';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { formatPrice } from '../lib/currency';

interface BestSellersProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  wishlistIds: string[];
}

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="bg-[#181818] border border-neutral-800 flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-neutral-800" />
      <div className="p-4 space-y-2">
        <div className="h-2 w-12 bg-neutral-700 rounded" />
        <div className="h-3 w-full bg-neutral-700 rounded" />
        <div className="h-3 w-3/4 bg-neutral-700 rounded" />
        <div className="h-3 w-16 bg-neutral-700 rounded mt-3" />
      </div>
    </div>
  );
}

export const BestSellers: React.FC<BestSellersProps> = ({
  products,
  loading,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  wishlistIds,
}) => {
  const { get } = useSiteSettings();
  const [activeTab, setActiveTab] = useState<'BRACELETS' | 'RINGS' | 'EARRINGS' | 'PENDANTS'>('BRACELETS');

  // Touch and mouse drag sliding state
  const tabsRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeftState(tabsRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    tabsRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleTabClick = (tab: 'BRACELETS' | 'RINGS' | 'EARRINGS' | 'PENDANTS', e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDragging) return;
    setActiveTab(tab);
    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  // Filter by type when products are loaded; show all during loading
  const filtered = loading
    ? []
    : products.filter((p) => {
        const typeNormalized = p.type.toLowerCase();
        if (activeTab === 'BRACELETS') return typeNormalized === 'bracelet';
        if (activeTab === 'RINGS') return typeNormalized === 'ring';
        if (activeTab === 'EARRINGS') return typeNormalized === 'earrings';
        if (activeTab === 'PENDANTS') return typeNormalized === 'pendant';
        return false;
      });

  // If no products match the tab, displayed is empty (we'll render a placeholder below)
  const displayed = filtered;

  return (
    <section id="bestsellers" className="w-full bg-[#121212] py-16 text-white font-['Jost',sans-serif]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] text-white uppercase font-['Montserrat',sans-serif] mb-2">
            BEST SELLERS
          </h2>

          <div className="flex justify-center my-2">
            <DiamondIcon className="w-3.5 h-3.5 text-white/80" />
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-xl mx-auto mt-2">
            {get('bestsellers_subtitle') || 'This unique jewelry is handcrafted on the beautiful island of Nantucket using fine silver and semi precious stones.'}
          </p>

          {/* Filter Tabs with Touch & Mouse Drag Sliding */}
          <div className="relative max-w-full mt-6">
            {/* Scrollable Container */}
            <div
              ref={tabsRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="flex items-center justify-start sm:justify-center space-x-3 overflow-x-auto no-scrollbar touch-pan-x py-2 px-2 select-none scroll-smooth cursor-grab active:cursor-grabbing w-full"
            >
              {(['BRACELETS', 'RINGS', 'EARRINGS', 'PENDANTS'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={(e) => handleTabClick(tab, e)}
                  className={`shrink-0 px-5 py-2 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-full transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-white text-black font-bold shadow-md scale-105'
                      : 'bg-transparent text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : displayed.length === 0
            ? (
                <div className="col-span-4 text-center py-12 text-neutral-500 text-sm">
                  No best selling {activeTab.toLowerCase()} featured yet.
                </div>
              )
            : displayed.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="group bg-[#181818] border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Clickable image → product page */}
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="relative w-full aspect-square bg-neutral-100 flex items-center justify-center overflow-hidden">
                        {/* Badge */}
                        {product.badge && (
                          <div className="absolute top-3 left-3 z-10">
                            {product.badge === 'NEW' ? (
                              <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase">
                                NEW
                              </span>
                            ) : (
                              <span className="bg-black text-white text-[10px] font-bold w-9 h-9 rounded-full flex items-center justify-center">
                                {product.badge}
                              </span>
                            )}
                          </div>
                        )}

                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Hover Actions Bar — buttons stop propagation so they don't navigate */}
                        <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-sm py-2 px-4 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
                            className="text-neutral-300 hover:text-white transition-colors p-1.5"
                            title="Add to Cart"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); onToggleWishlist(product); }}
                            className={`transition-colors p-1.5 ${isWishlisted ? 'text-amber-400' : 'text-neutral-300 hover:text-white'}`}
                            title="Add to Wishlist"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                          <button
                            onClick={(e) => e.preventDefault()}
                            className="text-neutral-300 hover:text-white transition-colors p-1.5" title="Compare">
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); onQuickView(product); }}
                            className="text-neutral-300 hover:text-white transition-colors p-1.5"
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Link>

                    {/* Info Section — also clickable */}
                    <Link to={`/product/${product.id}`} className="p-4 flex flex-col flex-grow justify-between bg-[#181818] hover:bg-[#1e1e1e] transition-colors">
                      <div>
                        <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-medium">
                          {product.category}
                        </span>
                        <h3 className="text-xs font-semibold tracking-wider text-neutral-200 mt-1 uppercase line-clamp-2 leading-snug group-hover:text-white transition-colors">
                          {product.name}
                        </h3>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center space-x-2 text-xs font-semibold">
                          <span className="text-white">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-neutral-500 line-through text-[11px]">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 mt-1 text-amber-400 text-[10px]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-neutral-400 text-[10px] ml-1">(5.0)</span>
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
