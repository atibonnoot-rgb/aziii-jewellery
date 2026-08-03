import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Camera, Upload, Link as LinkIcon, Loader2, Check, AlertCircle, X, Folder } from 'lucide-react';
import { getPopularCategories, createPopularCategory, updatePopularCategory, deletePopularCategory, type PopularCategory } from '../../lib/dynamicContentApi';
import { uploadProductImage } from '../../lib/productsApi';

export default function PopularCategoriesPanel() {
  const [categories, setCategories] = useState<PopularCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PopularCategory | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [filterType, setFilterType] = useState<PopularCategory['filter_type'] | ''>('');
  const [filterCat, setFilterCat] = useState<PopularCategory['filter_cat'] | ''>('');

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getPopularCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditTarget(null);
    setTitle('');
    setSubtitle('');
    setImageUrl('');
    setFilterType('');
    setFilterCat('');
    setError(null);
    setUploadError(null);
    setModalOpen(true);
  };

  const openEdit = (cat: PopularCategory) => {
    setEditTarget(cat);
    setTitle(cat.title);
    setSubtitle(cat.subtitle || '');
    setImageUrl(cat.image_url);
    setFilterType(cat.filter_type || '');
    setFilterCat(cat.filter_cat || '');
    setError(null);
    setUploadError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category widget?')) return;
    try {
      await deletePopularCategory(id);
      fetchCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleFileUpload = async (file: File) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) { setUploadError('PNG, JPEG or WebP only'); return; }
    if (file.size > 8 * 1024 * 1024) { setUploadError('Max 8 MB'); return; }

    setUploading(true);
    setUploadError(null);
    try {
      const publicUrl = await uploadProductImage(file);
      setImageUrl(publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      setError('Title and image are required');
      return;
    }
    if (!filterType && !filterCat) {
      setError('You must select at least one filter type (e.g. Ring) or filter category (e.g. Women) to link to');
      return;
    }

    try {
      const payload = {
        title,
        subtitle,
        image_url: imageUrl,
        filter_type: filterType ? (filterType as PopularCategory['filter_type']) : undefined,
        filter_cat: filterCat ? (filterCat as PopularCategory['filter_cat']) : undefined,
      };

      if (editTarget) {
        await updatePopularCategory(editTarget.id, payload);
      } else {
        await createPopularCategory(payload);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: unknown) {
      let msg = 'Save failed';
      if (err && typeof err === 'object') {
        const e = err as Record<string, unknown>;
        msg = (e.message as string)
          || (e.error_description as string)
          || (e.details as string)
          || JSON.stringify(err);
      }
      setError(msg);
    }
  };

  const inputCls = 'w-full bg-[#121212] border border-neutral-700 text-white text-sm px-3.5 py-2.5 outline-none focus:border-amber-400/60 transition-colors placeholder:text-neutral-600 rounded-none';
  const labelCls = 'block text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-1.5';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-1">Popular Categories</h2>
          <p className="text-[11px] text-neutral-500">
            Customize the dynamic category cards showing on your home catalog.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-amber-400 text-black text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2.5 hover:bg-amber-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Category Widget
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-[#181818] border border-neutral-800 p-12 text-center text-neutral-500 text-xs">
          No category widgets. Add one to start populating your catalog categories index.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-[#181818] border border-neutral-800 flex flex-col justify-between group">
              <div>
                <div className="relative aspect-square overflow-hidden bg-neutral-900 flex items-center justify-center">
                  <img src={cat.image_url} alt={cat.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 border-t border-neutral-800/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white line-clamp-1">{cat.title}</h4>
                  {cat.subtitle && <p className="text-[10px] text-neutral-500 mt-1">{cat.subtitle}</p>}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {cat.filter_type && <span className="bg-neutral-800 text-[9px] uppercase px-1.5 py-0.5 text-neutral-400">Type: {cat.filter_type}</span>}
                    {cat.filter_cat && <span className="bg-neutral-800 text-[9px] uppercase px-1.5 py-0.5 text-neutral-400">Category: {cat.filter_cat}</span>}
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0 flex gap-2 justify-end border-t border-neutral-800/50 mt-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-700 hover:border-amber-400 hover:text-amber-400 text-[10px] uppercase tracking-wider transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-700 hover:border-red-500 hover:text-red-500 text-[10px] uppercase tracking-wider transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="bg-[#181818] border border-neutral-700 w-full max-w-md p-6 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">
              {editTarget ? 'Edit Category Widget' : 'Add Category Widget'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className={labelCls}>Category Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. BRACELETS FOR MEN" className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Subtitle</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. 2 Row Ring with Diamonds" className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Link Filter: Type</label>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className={inputCls}>
                    <option value="">None</option>
                    <option value="ring">Ring</option>
                    <option value="bracelet">Bracelet</option>
                    <option value="earrings">Earrings</option>
                    <option value="pendant">Pendant</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Link Filter: Category</label>
                  <select value={filterCat} onChange={(e) => setFilterCat(e.target.value as any)} className={inputCls}>
                    <option value="">None</option>
                    <option value="WOMEN">Women</option>
                    <option value="MEN">Men</option>
                    <option value="UNISEX">Unisex</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Thumbnail Image *</label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 border border-neutral-700 py-3 bg-[#121212] text-[10px] tracking-wider uppercase font-semibold text-neutral-300 hover:text-white hover:border-neutral-500"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {uploading ? 'Uploading…' : 'Upload File'}
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Or paste thumbnail image URL here…" required className={inputCls} />
                {imageUrl && (
                  <div className="mt-3 w-24 h-24 bg-white mx-auto flex items-center justify-center overflow-hidden border border-neutral-800 p-2">
                    <img src={imageUrl} alt="preview" className="w-full h-full object-contain" />
                  </div>
                )}
                {uploadError && <p className="text-red-400 text-[10px] mt-1">{uploadError}</p>}
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-[10px] tracking-wider uppercase text-neutral-400 border border-neutral-700 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 text-[10px] tracking-wider uppercase font-bold bg-amber-400 text-black hover:bg-amber-300 transition-colors disabled:opacity-50"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
