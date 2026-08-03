import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, ShoppingBag, Heart, Eye, ArrowRightLeft, Star } from 'lucide-react';
import { getProducts } from '../lib/productsApi';
import { useCart } from '../context/CartContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { ProductModal } from '../components/ProductModal';
import type { Product } from '../types';
import { formatPrice } from '../lib/currency';

export default function CategoryPage() {
  const { filterType, filterValue } = useParams<{ filterType: string; filterValue: string }>();
  const navigate = useNavigate();
  const { cart, wishlist, addToCart, toggleWishlist, openCart, openWishlist, isCartOpen, isWishlistOpen, closeCart, closeWishlist, updateCartQuantity, removeFromCart, removeFromWishlist } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistIds = wishlist.map((w) => w.id);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts()
      .then((allProducts) => {
        // Filter by either type or category
        const filtered = allProducts.filter((p) => {
          if (filterType === 'type') {
            return p.type.toLowerCase() === filterValue?.toLowerCase();
          }
          if (filterType === 'category') {
            return p.category.toLowerCase() === filterValue?.toLowerCase();
          }
          return true;
        });
        setProducts(filtered);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filterType, filterValue]);

  const handleSearch = (query: string) => {
    if (query) navigate(`/?search=${encodeURIComponent(query)}`);
  };

  const titleText = filterValue ? `${filterValue.replace('_', ' ')}` : 'Category';

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col font-['Jost',sans-serif]">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onOpenCart={openCart}
        onOpenWishlist={openWishlist}
        onSearch={handleSearch}
      />

      <main className="flex-grow">
        {/* Banner with title */}
        <div className="relative py-16 bg-[#1a1a1a] border-b border-neutral-800 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-neutral-500 hover:text-white transition-colors mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Storefront
            </Link>
            <h1 className="text-3xl font-bold tracking-[0.25em] uppercase text-white font-['Montserrat',sans-serif] mt-2">
              {titleText}
            </h1>
            <p className="text-xs text-neutral-500 uppercase tracking-widest mt-2">
              Explore our curated selection of luxury pieces
            </p>
          </div>
        </div>

        {/* Catalog grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-neutral-500 text-xs tracking-widest uppercase">Loading items…</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 p-8 text-center max-w-md mx-auto my-10">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-400 text-sm font-semibold uppercase tracking-wider">Failed to load items</p>
              <p className="text-neutral-500 text-xs mt-1">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-[#181818] border border-neutral-800">
              <ShoppingBag className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-400 text-sm font-semibold tracking-wider">No Products Found</p>
              <p className="text-neutral-600 text-xs mt-1">There are no active catalog items listed under this collection right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const isWishlisted = wishlistIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="group bg-[#181818] border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
                  >
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="relative w-full aspect-square bg-neutral-100 flex items-center justify-center overflow-hidden">
                        {product.badge && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase">
                              {product.badge}
                            </span>
                          </div>
                        )}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-sm py-2 px-4 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) => { e.preventDefault(); addToCart(product, 1); }}
                            className="text-neutral-300 hover:text-white p-1.5"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                            className={`p-1.5 ${isWishlisted ? 'text-amber-400' : 'text-neutral-300 hover:text-white'}`}
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                          <button
                            onClick={(e) => { e.preventDefault(); setSelectedProduct(product); }}
                            className="text-neutral-300 hover:text-white p-1.5"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Link>

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
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
      />

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
