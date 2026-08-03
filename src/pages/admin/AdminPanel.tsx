import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  RefreshCw,
  Package,
  AlertCircle,
  X,
  ImageIcon,
  Image,
} from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { formatPrice } from '../../lib/currency';
import { useAuth } from '../../hooks/useAuth';
import { createProduct, updateProduct, deleteProduct } from '../../lib/productsApi';
import ProductFormModal, { type ProductFormData } from './ProductFormModal';
import SiteMediaPanel from './SiteMediaPanel';
import HeroSlidesPanel from './HeroSlidesPanel';
import PopularCategoriesPanel from './PopularCategoriesPanel';
import BlogsPanel from './BlogsPanel';
import SiteTextPanel from './SiteTextPanel';
import { DiamondIcon } from '../../components/DiamondIcon';
import type { Product } from '../../types';

// --- Delete Confirmation Dialog ---
function DeleteDialog({
  product,
  onConfirm,
  onCancel,
}: {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
    >
      <div className="bg-[#181818] border border-neutral-700 w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-start gap-3 mb-5">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-1">
              Delete Product
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="text-white font-semibold">"{product.name}"</span>?
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-neutral-400 border border-neutral-700 hover:border-neutral-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            onClick={onConfirm}
            className="px-5 py-2 text-[10px] tracking-[0.2em] uppercase font-bold bg-red-600 text-white hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Section Badge ---
function SectionBadge({ section }: { section?: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    best_seller: { label: 'Best Seller', cls: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
    new_arrival: { label: 'New Arrival', cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
    both: { label: 'Both', cls: 'text-sky-400 bg-sky-400/10 border-sky-400/30' },
  };
  const s = map[section ?? ''] ?? { label: section ?? '—', cls: 'text-neutral-400 bg-neutral-800 border-neutral-700' };
  return (
    <span className={`text-[9px] tracking-[0.15em] uppercase font-semibold px-2 py-0.5 border ${s.cls}`}>
      {s.label}
    </span>
  );
}

// --- Skeleton Row ---
function SkeletonRow() {
  return (
    <tr className="border-b border-neutral-800 animate-pulse">
      <td className="px-4 py-3"><div className="w-10 h-10 bg-neutral-800 rounded" /></td>
      <td className="px-4 py-3"><div className="h-3 w-40 bg-neutral-800 rounded" /></td>
      <td className="px-4 py-3"><div className="h-3 w-12 bg-neutral-800 rounded" /></td>
      <td className="px-4 py-3"><div className="h-4 w-20 bg-neutral-800 rounded" /></td>
      <td className="px-4 py-3"><div className="h-3 w-16 bg-neutral-800 rounded" /></td>
      <td className="px-4 py-3"><div className="flex gap-2"><div className="h-7 w-7 bg-neutral-800 rounded"/><div className="h-7 w-7 bg-neutral-800 rounded"/></div></td>
    </tr>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const { products, loading, error, refetch } = useProducts();

  const [activeTab, setActiveTab] = useState<'products' | 'media' | 'slides' | 'categories' | 'blogs' | 'texts'>('products');
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const openAddForm = () => {
    setEditProduct(null);
    setFormOpen(true);
  };

  const openEditForm = (p: Product) => {
    setEditProduct(p);
    setFormOpen(true);
  };

  const handleSave = async (data: ProductFormData, id?: string) => {
    setActionError(null);
    const payload: Omit<Product, 'id' | 'created_at' | 'isBestSeller' | 'isNewArrival'> = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      price: parseFloat(data.price),
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
      image: data.image.trim(),
      category: data.category,
      type: data.type,
      badge: (data.badge || undefined) as Product['badge'],
      section: data.section,
      rating: 5,
    };
    if (id) {
      await updateProduct(id, payload);
    } else {
      await createProduct(payload);
    }
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Delete failed.');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-['Jost',sans-serif] text-white">
      {/* Top Bar */}
      <header className="bg-[#181818] border-b border-neutral-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DiamondIcon className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-white">
                Azii Jewels
              </span>
              <span className="text-neutral-600 mx-2 text-xs">·</span>
              <span className="text-[10px] tracking-[0.15em] text-neutral-500 uppercase">
                Admin Panel
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 hover:text-white transition-colors"
            >
              ← Storefront
            </a>
            <div className="w-px h-4 bg-neutral-700" />
            <span className="text-[10px] text-neutral-600 hidden sm:block truncate max-w-[180px]">
              {session?.user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-neutral-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="bg-[#121212] border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 text-[10px] tracking-[0.25em] uppercase font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('slides')}
            className={`py-3 text-[10px] tracking-[0.25em] uppercase font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'slides'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Hero Slides
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 text-[10px] tracking-[0.25em] uppercase font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Categories Panel
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`py-3 text-[10px] tracking-[0.25em] uppercase font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'blogs'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Blogs
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 text-[10px] tracking-[0.25em] uppercase font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'media'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Site Media
          </button>
          <button
            onClick={() => setActiveTab('texts')}
            className={`py-3 text-[10px] tracking-[0.25em] uppercase font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'texts'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Site Texts
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'products' && (
          <>
            {/* Page Title + actions */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold tracking-[0.15em] uppercase font-['Montserrat',sans-serif]">
                  Products
                </h1>
                <p className="text-neutral-500 text-xs mt-1">
                  {loading ? '…' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={refetch}
                  className="p-2 text-neutral-500 hover:text-white transition-colors border border-neutral-800 hover:border-neutral-600"
                  title="Refresh"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  id="add-product-btn"
                  onClick={openAddForm}
                  className="flex items-center gap-2 bg-amber-400 text-black text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2.5 hover:bg-amber-300 active:bg-amber-500 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Product
                </button>
              </div>
            </div>

            {/* Action error banner */}
            {actionError && (
              <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 px-4 py-3 mb-5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-red-400 text-xs">{actionError}</p>
                </div>
                <button onClick={() => setActionError(null)}>
                  <X className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            )}

            {/* Fetch error */}
            {error && !loading && (
              <div className="bg-red-500/10 border border-red-500/30 px-5 py-6 text-center">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-400 text-sm mb-1 font-semibold">Failed to load products</p>
                <p className="text-neutral-500 text-xs mb-4">{error}</p>
                <button
                  onClick={refetch}
                  className="px-4 py-2 text-[10px] tracking-[0.2em] uppercase border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && products.length === 0 && (
              <div className="bg-[#181818] border border-neutral-800 px-6 py-16 text-center">
                <Package className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-400 text-sm font-semibold tracking-wider mb-1">
                  No Products Yet
                </p>
                <p className="text-neutral-600 text-xs mb-5">
                  Add your first product to start populating the storefront.
                </p>
                <button
                  onClick={openAddForm}
                  className="inline-flex items-center gap-2 bg-amber-400 text-black text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-amber-300 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add First Product
                </button>
              </div>
            )}

            {/* Products Table */}
            {(loading || products.length > 0) && !error && (
              <div className="bg-[#181818] border border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800">
                        <th className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-neutral-500 font-semibold w-16">
                          Image
                        </th>
                        <th className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-neutral-500 font-semibold">
                          Title
                        </th>
                        <th className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-neutral-500 font-semibold hidden md:table-cell">
                          Category
                        </th>
                        <th className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-neutral-500 font-semibold">
                          Section
                        </th>
                        <th className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-neutral-500 font-semibold">
                          Price
                        </th>
                        <th className="text-right px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-neutral-500 font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading
                        ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                        : products.map((product) => (
                            <tr
                              key={product.id}
                              className="border-b border-neutral-800/60 hover:bg-white/[0.02] transition-colors group"
                            >
                              {/* Image */}
                              <td className="px-4 py-3">
                                <div className="w-10 h-10 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {product.image ? (
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <ImageIcon className="w-4 h-4 text-neutral-400" />
                                  )}
                                </div>
                              </td>

                              {/* Title */}
                              <td className="px-4 py-3">
                                <p className="font-semibold text-neutral-200 tracking-wide uppercase text-[11px] line-clamp-1">
                                  {product.name}
                                </p>
                                {product.description && (
                                  <p className="text-neutral-600 text-[10px] mt-0.5 line-clamp-1">
                                    {product.description}
                                  </p>
                                )}
                              </td>

                              {/* Category */}
                              <td className="px-4 py-3 hidden md:table-cell">
                                <span className="text-[9px] tracking-wider text-neutral-500 uppercase">
                                  {product.category}
                                </span>
                              </td>

                              {/* Section */}
                              <td className="px-4 py-3">
                                <SectionBadge section={product.section} />
                              </td>

                              {/* Price */}
                              <td className="px-4 py-3">
                                <span className="text-white font-semibold">
                                  {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-neutral-600 line-through ml-1.5 text-[10px]">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => openEditForm(product)}
                                    className="p-1.5 text-neutral-500 hover:text-amber-400 transition-colors"
                                    title="Edit"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget(product)}
                                    className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'slides' && <HeroSlidesPanel />}
        {activeTab === 'categories' && <PopularCategoriesPanel />}
        {activeTab === 'blogs' && <BlogsPanel />}
        {activeTab === 'media' && <SiteMediaPanel />}
        {activeTab === 'texts' && <SiteTextPanel />}
      </main>

      {/* Modals */}
      <ProductFormModal
        isOpen={formOpen}
        editProduct={editProduct}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      {deleteTarget && (
        <DeleteDialog
          product={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
