import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RefreshCw,
  ArrowLeft,
  Minus,
  Plus,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { getProductById } from '../lib/productsApi';
import { useCart } from '../context/CartContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import type { Product } from '../types';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    cart, wishlist,
    addToCart, updateCartQuantity, removeFromCart,
    toggleWishlist, removeFromWishlist,
    isCartOpen, isWishlistOpen,
    openCart, closeCart, openWishlist, closeWishlist,
  } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedFlash, setAddedFlash] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isWishlisted = wishlist.some((p) => p.id === id);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setImageLoaded(false);
    getProductById(id)
      .then(setProduct)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Product not found.')
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 2000);
  };

  const handleSearch = (query: string) => {
    if (query) navigate(`/?search=${encodeURIComponent(query)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col font-['Jost',sans-serif]">
        <Header
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          onOpenCart={openCart}
          onOpenWishlist={openWishlist}
          onSearch={handleSearch}
        />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-neutral-500 text-xs tracking-widest uppercase">Loading product…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col font-['Jost',sans-serif]">
        <Header
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          onOpenCart={openCart}
          onOpenWishlist={openWishlist}
          onSearch={handleSearch}
        />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <AlertCircle className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
            <p className="text-white font-semibold mb-2 tracking-wider uppercase text-sm">
              Product Not Found
            </p>
            <p className="text-neutral-500 text-xs mb-6">{error}</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase bg-white text-black hover:bg-neutral-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col text-white font-['Jost',sans-serif] selection:bg-amber-400 selection:text-black">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onOpenCart={openCart}
        onOpenWishlist={openWishlist}
        onSearch={handleSearch}
      />

      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="border-b border-neutral-800 bg-[#0e0e0e]">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-[10px] tracking-widest text-neutral-500 uppercase">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="hover:text-white transition-colors cursor-default">{product.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neutral-300 truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>

        {/* Product Layout */}
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* ── LEFT: Image Panel ── */}
            <div className="relative">
              {/* Back button */}
              <button
                onClick={() => navigate(-1)}
                className="absolute top-0 left-0 z-10 flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-neutral-500 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>

              <div className="mt-8 relative bg-white aspect-square flex items-center justify-center overflow-hidden shadow-2xl">
                {/* Discount Badge */}
                {discount && discount > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-bold w-10 h-10 rounded-full flex items-center justify-center">
                    -{discount}%
                  </div>
                )}
                {product.badge && !discount && (
                  <div className="absolute top-4 left-4 z-10 bg-black text-white text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase">
                    {product.badge}
                  </div>
                )}

                {!imageLoaded && (
                  <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>

              {/* Trust Badges below image */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { icon: ShieldCheck, label: 'Authentic', sub: 'Certified Genuine' },
                  { icon: Truck, label: 'Free Delivery', sub: 'Orders over $100' },
                  { icon: RefreshCw, label: 'Easy Returns', sub: '30-Day Policy' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="bg-[#181818] border border-neutral-800 p-3 flex flex-col items-center text-center gap-1.5"
                  >
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-semibold text-white tracking-wider uppercase">{label}</span>
                    <span className="text-[9px] text-neutral-500">{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Info Panel ── */}
            <div className="flex flex-col justify-center">
              {/* Category + Type tags */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] tracking-[0.25em] text-neutral-500 uppercase border border-neutral-700 px-2 py-0.5">
                  {product.category}
                </span>
                <span className="text-[9px] tracking-[0.25em] text-neutral-600 uppercase">
                  {product.type}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.12em] text-white uppercase font-['Montserrat',sans-serif] leading-tight mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-neutral-400 text-xs">(5.0) · 24 reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-neutral-800">
                <span className="text-3xl font-bold text-white">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-neutral-500 line-through text-lg">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {discount && discount > 0 && (
                  <span className="text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2 py-0.5">
                    SAVE {discount}%
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}
              {!product.description && (
                <p className="text-sm text-neutral-500 leading-relaxed mb-6 italic">
                  Handcrafted luxury jewelry piece — refined for timeless elegance and exceptional brilliance.
                </p>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-semibold">Qty:</span>
                <div className="flex items-center border border-neutral-700 bg-[#181818]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-[10px] text-neutral-600">In Stock</span>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                {/* Add to Cart */}
                <button
                  id="add-to-cart-btn"
                  onClick={handleAddToCart}
                  className={`w-full py-4 font-bold text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2 transition-all duration-200 ${
                    addedFlash
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-black hover:bg-amber-400 hover:text-black active:scale-[0.99]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {addedFlash ? '✓ Added to Cart!' : `Add to Cart · $${(product.price * quantity).toFixed(2)}`}
                </button>

                {/* Wishlist */}
                <button
                  id="wishlist-btn"
                  onClick={() => toggleWishlist(product)}
                  className={`w-full py-3.5 text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 border transition-colors ${
                    isWishlisted
                      ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                      : 'border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-amber-400' : ''}`} />
                  {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Separator + SKU */}
              <div className="mt-6 pt-5 border-t border-neutral-800 flex flex-col gap-1.5 text-[10px] text-neutral-600 tracking-wider">
                <span>SKU: AZ-{product.id.slice(0, 8).toUpperCase()}</span>
                <span>Category: {product.category} · {product.type}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Persistent Cart & Wishlist Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={closeWishlist}
        wishlistProducts={wishlist}
        onRemoveWishlist={removeFromWishlist}
        onAddToCart={(p) => addToCart(p, 1)}
      />
    </div>
  );
}
