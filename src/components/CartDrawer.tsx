import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { formatPrice } from '../lib/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm font-['Jost',sans-serif]">
      <div className="w-full max-w-md bg-[#181818] h-full flex flex-col justify-between text-white border-l border-neutral-800 shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-200" />
            <h2 className="text-sm font-bold tracking-[0.2em] font-['Montserrat',sans-serif] uppercase">
              YOUR SHOPPING BAG ({items.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3 text-neutral-500">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-1" />
              <p className="text-xs uppercase tracking-wider">Your shopping bag is empty.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center space-x-4 bg-[#121212] p-3 border border-neutral-800"
              >
                <div className="w-16 h-16 bg-white p-1 flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white uppercase truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {formatPrice(item.product.price)}
                  </p>

                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center border border-neutral-700 bg-neutral-900">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 text-[11px] font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs font-bold text-white text-right">
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-6 border-t border-neutral-800 bg-[#121212] space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-400 uppercase tracking-widest text-xs">SUBTOTAL</span>
            <span className="font-bold text-lg font-['Montserrat',sans-serif]">
              {formatPrice(totalAmount)}
            </span>
          </div>

          <p className="text-[10px] text-neutral-500 text-center">
            Taxes & shipping calculated at checkout
          </p>

          <button
            disabled={items.length === 0}
            onClick={() => alert('Proceeding to Checkout!')}
            className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-[0.25em] flex items-center justify-center space-x-2 hover:bg-neutral-200 disabled:opacity-50 transition-colors"
          >
            <span>PROCEED TO CHECKOUT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
