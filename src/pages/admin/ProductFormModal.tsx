import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ImageIcon, AlertCircle, Upload, Link, Loader2 } from 'lucide-react';
import type { Product } from '../../types';
import { uploadProductImage } from '../../lib/productsApi';

interface ProductFormModalProps {
  isOpen: boolean;
  editProduct: Product | null;
  onClose: () => void;
  onSave: (data: ProductFormData, id?: string) => Promise<void>;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  image: string;
  category: Product['category'];
  type: Product['type'];
  badge: Product['badge'] | '';
  section: NonNullable<Product['section']>;
}

const EMPTY_FORM: ProductFormData = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  image: '',
  category: 'UNISEX',
  type: 'ring',
  badge: '',
  section: 'new_arrival',
};

type ImageMode = 'upload' | 'url';

export default function ProductFormModal({
  isOpen,
  editProduct,
  onClose,
  onSave,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<ImageMode>('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // handleFile must be declared BEFORE any early return to respect Rules of Hooks
  const handleFile = useCallback(
    async (file: File) => {
      const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowed.includes(file.type)) {
        setUploadError('Only PNG, JPEG, and WebP files are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File must be under 5 MB.');
        return;
      }

      setUploadError(null);
      setUploading(true);

      // Show local preview immediately
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);

      try {
        const publicUrl = await uploadProductImage(file);
        setForm((f) => ({ ...f, image: publicUrl }));
        setPreviewUrl(publicUrl);
      } catch (err) {
        setUploadError(
          err instanceof Error
            ? err.message
            : 'Upload failed. Make sure the "product-images" storage bucket exists in Supabase.'
        );
        setPreviewUrl(null);
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        description: editProduct.description ?? '',
        price: String(editProduct.price),
        originalPrice: editProduct.originalPrice ? String(editProduct.originalPrice) : '',
        image: editProduct.image,
        category: editProduct.category,
        type: editProduct.type,
        badge: editProduct.badge ?? '',
        section: editProduct.section ?? 'new_arrival',
      });
      setPreviewUrl(editProduct.image || null);
      // Always open in upload mode so the existing image shows as a preview
      // and the user can clearly click/drag to replace it
      setImageMode('upload');
    } else {
      setForm(EMPTY_FORM);
      setPreviewUrl(null);
      setImageMode('upload');
    }
    setError(null);
    setUploadError(null);
  }, [editProduct, isOpen]);

  if (!isOpen) return null;


  const set = (key: keyof ProductFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (key === 'image') setPreviewUrl(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.image.trim()) {
      setError('Title, Price, and Image are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(form, editProduct?.id);
      onClose();
    } catch (err: unknown) {
      // Extract the most useful error message from Supabase errors
      let msg = 'Save failed.';
      if (err && typeof err === 'object') {
        const e = err as Record<string, unknown>;
        msg = (e.message as string)
          || (e.error_description as string)
          || (e.details as string)
          || JSON.stringify(err);
      }
      setError(msg);
    } finally {
      setSaving(false);
    }
  };


  const inputCls =
    'w-full bg-[#121212] border border-neutral-700 text-white text-sm px-3.5 py-2.5 outline-none focus:border-amber-400/60 transition-colors placeholder:text-neutral-600 rounded-none';
  const labelCls = 'block text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-1.5';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
    >
      <div className="bg-[#181818] border border-neutral-700 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="text-xs font-bold tracking-[0.25em] text-white uppercase">
            {editProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className={labelCls}>Title *</label>
            <input
              id="pf-title"
              type="text"
              value={form.name}
              onChange={set('name')}
              required
              placeholder="e.g. Gold Diamond Bracelet"
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              id="pf-description"
              value={form.description}
              onChange={set('description')}
              rows={2}
              placeholder="Short product description…"
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Price (INR ₹) *</label>
              <input
                id="pf-price"
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={set('price')}
                required
                placeholder="999"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Original Price (INR ₹)</label>
              <input
                id="pf-original-price"
                type="number"
                min="0"
                step="1"
                value={form.originalPrice}
                onChange={set('originalPrice')}
                placeholder="1499"
                className={inputCls}
              />
            </div>
          </div>

          {/* Image Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${labelCls} mb-0`}>Image *</label>
              {/* Toggle between upload and URL */}
              <div className="flex items-center bg-[#121212] border border-neutral-700 rounded-none overflow-hidden">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase font-semibold transition-colors ${
                    imageMode === 'upload'
                      ? 'bg-amber-400 text-black'
                      : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase font-semibold transition-colors ${
                    imageMode === 'url'
                      ? 'bg-amber-400 text-black'
                      : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  <Link className="w-3 h-3" />
                  URL
                </button>
              </div>
            </div>

            {/* Upload mode */}
            {imageMode === 'upload' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleFileInput}
                  id="pf-file-input"
                />
                <div
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center py-8 px-4 text-center ${
                    isDragging
                      ? 'border-amber-400 bg-amber-400/5'
                      : 'border-neutral-700 hover:border-neutral-500 bg-[#121212]'
                  } ${uploading ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                      <p className="text-neutral-400 text-xs">Uploading to Supabase Storage…</p>
                    </div>
                  ) : previewUrl && form.image ? (
                    <div className="flex flex-col items-center gap-3">
                      {/* Large preview of current image */}
                      <div className="relative w-32 h-32 overflow-hidden border border-neutral-700">
                        <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                        {/* Remove / clear button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewUrl(null);
                            setForm((f) => ({ ...f, image: '' }));
                            setUploadError(null);
                          }}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white w-5 h-5 flex items-center justify-center text-[10px] font-bold transition-colors"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-neutral-400 text-[10px]">
                        {editProduct ? 'Click or drag to replace current image' : 'Click or drag to replace'}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-neutral-800 flex items-center justify-center mb-1">
                        <ImageIcon className="w-5 h-5 text-neutral-500" />
                      </div>
                      <p className="text-neutral-300 text-xs font-semibold">
                        Drop image here or click to browse
                      </p>
                      <p className="text-neutral-600 text-[10px]">PNG, JPEG, WebP — max 5 MB</p>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 px-3 py-2 mt-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-400 text-[10px]">{uploadError}</p>
                  </div>
                )}
              </div>
            )}

            {/* URL mode */}
            {imageMode === 'url' && (
              <div>
                <input
                  id="pf-image-url"
                  type="url"
                  value={form.image}
                  onChange={(e) => {
                    set('image')(e);
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/…"
                  className={inputCls}
                />
                {previewUrl && (
                  <div className="mt-2 w-16 h-16 bg-white flex items-center justify-center overflow-hidden border border-neutral-700">
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category / Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category</label>
              <select id="pf-category" value={form.category} onChange={set('category')} className={`${inputCls} cursor-pointer`}>
                <option value="WOMEN">Women</option>
                <option value="MEN">Men</option>
                <option value="UNISEX">Unisex</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select id="pf-type" value={form.type} onChange={set('type')} className={`${inputCls} cursor-pointer`}>
                <option value="ring">Ring</option>
                <option value="bracelet">Bracelet</option>
                <option value="earrings">Earrings</option>
                <option value="pendant">Pendant</option>
              </select>
            </div>
          </div>

          {/* Badge / Section */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Badge</label>
              <select id="pf-badge" value={form.badge} onChange={set('badge')} className={`${inputCls} cursor-pointer`}>
                <option value="">None</option>
                <option value="NEW">NEW</option>
                <option value="HOT">HOT</option>
                <option value="-20%">-20%</option>
                <option value="-30%">-30%</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Section</label>
              <select id="pf-section" value={form.section} onChange={set('section')} className={`${inputCls} cursor-pointer`}>
                <option value="best_seller">Best Seller</option>
                <option value="new_arrival">New Arrival</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase text-neutral-400 border border-neutral-700 hover:border-neutral-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              id="pf-save-btn"
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase font-bold bg-amber-400 text-black hover:bg-amber-300 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving…
                </>
              ) : editProduct ? (
                'Update Product'
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
