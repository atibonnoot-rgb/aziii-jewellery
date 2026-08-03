import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useDynamicContent } from '../hooks/useDynamicContent';
import { useBlogs } from '../hooks/useBlogs';
import { useCart } from '../context/CartContext';
import { Header } from '../components/Header';
import { HeroBanner } from '../components/HeroBanner';
import { FeatureBanners } from '../components/FeatureBanners';
import { BestSellers } from '../components/BestSellers';
import { NewArrivals } from '../components/NewArrivals';
import { MiddleBanner } from '../components/MiddleBanner';
import { BlogSection } from '../components/BlogSection';
import { PopularCategories } from '../components/PopularCategories';
import { Footer } from '../components/Footer';
import { ProductModal } from '../components/ProductModal';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import type { Product } from '../types';

export default function StoreFront() {
  const { products, loading } = useProducts();
  const { slides, categories, loading: dynamicLoading } = useDynamicContent();
  const { blogs, loading: blogsLoading } = useBlogs();

  const {
    cart, wishlist,
    addToCart, updateCartQuantity, removeFromCart,
    toggleWishlist, removeFromWishlist,
    isCartOpen, isWishlistOpen,
    openCart, closeCart, openWishlist, closeWishlist,
  } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const bestSellers = products.filter(
    (p) => p.section === 'best_seller' || p.section === 'both'
  );
  const newArrivals = products.filter(
    (p) => p.section === 'new_arrival' || p.section === 'both'
  );

  const handleSearch = (query: string) => {
    if (!query) return;
    const found = products.find((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    if (found) {
      setSelectedProduct(found);
    } else {
      alert(`No products found matching "${query}"`);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col font-['Jost',sans-serif] selection:bg-amber-400 selection:text-black overflow-x-hidden w-full max-w-full">
      <Header
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={openCart}
        onOpenWishlist={openWishlist}
        onSearch={handleSearch}
      />

      <main className="flex-grow">
        <HeroBanner slides={slides} loading={dynamicLoading} />
        <FeatureBanners />

        <BestSellers
          products={bestSellers}
          loading={loading}
          onAddToCart={(p) => addToCart(p, 1)}
          onToggleWishlist={toggleWishlist}
          onQuickView={setSelectedProduct}
          wishlistIds={wishlist.map((w) => w.id)}
        />

        <NewArrivals
          products={newArrivals}
          loading={loading}
          onAddToCart={(p) => addToCart(p, 1)}
          onToggleWishlist={toggleWishlist}
          onQuickView={setSelectedProduct}
          wishlistIds={wishlist.map((w) => w.id)}
        />

        <MiddleBanner />
        <BlogSection blogs={blogs} loading={blogsLoading} />
        <PopularCategories categories={categories} loading={dynamicLoading} />
      </main>

      <Footer />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        isWishlisted={
          selectedProduct ? wishlist.some((w) => w.id === selectedProduct.id) : false
        }
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
