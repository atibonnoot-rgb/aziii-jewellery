import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Calendar, User, MessageSquare, ChevronRight } from 'lucide-react';
import { getBlogById, type BlogPost } from '../lib/blogsApi';
import { useCart } from '../context/CartContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';

export default function BlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cart, wishlist, openCart, openWishlist, isCartOpen, isWishlistOpen, closeCart, closeWishlist, updateCartQuantity, removeFromCart, removeFromWishlist, addToCart } = useCart();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getBlogById(id)
      .then(setBlog)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSearch = (query: string) => {
    if (query) navigate(`/?search=${encodeURIComponent(query)}`);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Dec 09 2017';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
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
            <p className="text-neutral-500 text-xs tracking-widest uppercase">Loading article…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
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
              Article Not Found
            </p>
            <p className="text-neutral-500 text-xs mb-6">{error}</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase bg-white text-black hover:bg-neutral-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col font-['Jost',sans-serif]">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onOpenCart={openCart}
        onOpenWishlist={openWishlist}
        onSearch={handleSearch}
      />

      <main className="flex-grow pb-16">
        {/* Breadcrumb */}
        <div className="border-b border-neutral-800 bg-[#0e0e0e]">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 text-[10px] tracking-widest text-neutral-500 uppercase">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="hover:text-white transition-colors cursor-default">Blog</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neutral-300 truncate max-w-[200px]">{blog.title}</span>
          </div>
        </div>

        <article className="max-w-3xl mx-auto px-4 py-10">
          {/* Header */}
          <header className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-neutral-500 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold tracking-[0.15em] text-white uppercase font-['Montserrat',sans-serif] mb-4 leading-snug">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-4">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>By {blog.author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(blog.created_at)}</span>
              </span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] bg-neutral-900 overflow-hidden mb-8 border border-neutral-800">
            <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
          </div>

          {/* Article Text */}
          <div className="prose prose-invert prose-sm max-w-none text-neutral-300 leading-relaxed space-y-6">
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </main>

      <Footer />

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
