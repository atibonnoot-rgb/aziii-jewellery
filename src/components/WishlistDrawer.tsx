import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm font-['Jost',sans-serif]">
      <div className="w-full max-w-md bg-[#181818] h-full flex flex-col justify-between text-white border-l border-neutral-800 shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-amber-200 fill-amber-200" />
            <h2 className="text-sm font-bold tracking-[0.2em] font-['Montserrat',sans-serif] uppercase">
              WISHLIST ({wishlistProducts.length})
            </h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3 text-neutral-500">
              <Heart className="w-12 h-12 mx-auto stroke-1" />
              <p className="text-xs uppercase tracking-wider">Your wishlist is empty.</p>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center space-x-4 bg-[#121212] p-3 border border-neutral-800"
              >
                <div className="w-16 h-16 bg-white p-1 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white uppercase truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    ${product.price.toFixed(2)}
                  </p>

                  <div className="flex items-center space-x-3 mt-2">
                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveWishlist(product.id);
                      }}
                      className="text-[10px] font-bold tracking-wider uppercase text-white bg-neutral-800 px-2.5 py-1 hover:bg-white hover:text-black transition-colors flex items-center space-x-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Cart</span>
                    </button>

                    <button
                      onClick={() => onRemoveWishlist(product.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-800 bg-[#121212]">
          <button
            onClick={onClose}
            className="w-full py-3 bg-neutral-800 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-700 transition-colors"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    </div>
  );
};
