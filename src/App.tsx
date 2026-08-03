import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { useAuth } from './hooks/useAuth';
import StoreFront from './pages/StoreFront';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import BlogPage from './pages/BlogPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminPanel from './pages/admin/AdminPanel';

// Guards the /admin route — redirects to /admin/login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <svg className="animate-spin w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* CartProvider wraps all routes so cart persists across navigation */}
      <CartProvider>
        <SiteSettingsProvider>
          <Routes>
            {/* Public storefront */}
            <Route path="/" element={<StoreFront />} />

            {/* Product detail page */}
            <Route path="/product/:id" element={<ProductPage />} />

            {/* Category page */}
            <Route path="/collection/:filterType/:filterValue" element={<CategoryPage />} />

            {/* Blog detail page */}
            <Route path="/blog/:id" element={<BlogPage />} />

            {/* Admin login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin panel */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SiteSettingsProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
