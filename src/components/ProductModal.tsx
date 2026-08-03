import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-['Jost',sans-serif]">
      <div className="relative w-full max-w-3xl bg-[#181818] border border-neutral-800 rounded-sm overflow-hidden text-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Side */}
          <div className="bg-white p-8 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full max-h-[320px] object-contain"
            />
          </div>

          {/* Details Side */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-medium">
                {product.category}
              </span>

              <h2 className="text-lg font-bold tracking-wider text-white uppercase font-['Montserrat',sans-serif] mt-1 mb-2">
                {product.name}
              </h2>

              {/* Price & Rating */}
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-neutral-500 line-through text-sm">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <div className="flex items-center text-amber-400 text-xs ml-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="text-neutral-400 text-xs ml-1">(5.0)</span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6">
                Handcrafted luxury piece rendered in fine palladium finish and semi-precious stones. Designed for timeless durability and brilliant reflections.
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-xs font-semibold uppercase text-neutral-400">QTY:</span>
                <div className="flex items-center border border-neutral-700 bg-[#121212]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm text-neutral-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm text-neutral-400 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-2 hover:bg-neutral-200 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`w-full py-2.5 border text-xs font-semibold uppercase tracking-[0.15em] flex items-center justify-center space-x-2 transition-colors ${
                  isWishlisted
                    ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                    : 'border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-amber-400' : ''}`} />
                <span>{isWishlisted ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}</span>
              </button>

              {/* Trust Badges */}
              <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-2">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Authentic Certified</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Free Express Delivery</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
