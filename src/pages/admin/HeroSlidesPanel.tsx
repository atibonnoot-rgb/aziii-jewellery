import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Camera, Upload, Link as LinkIcon, Loader2, Check, AlertCircle, X } from 'lucide-react';
import { getHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide, type HeroSlide } from '../../lib/dynamicContentApi';
import { uploadProductImage } from '../../lib/productsApi';

export default function HeroSlidesPanel() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HeroSlide | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('#bestsellers');

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const data = await getHeroSlides();
      setSlides(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openAdd = () => {
    setEditTarget(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setLink('#bestsellers');
    setError(null);
    setUploadError(null);
    setModalOpen(true);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditTarget(slide);
    setTitle(slide.title);
    setDescription(slide.description);
    setImageUrl(slide.image_url);
    setLink(slide.link);
    setError(null);
    setUploadError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      await deleteHeroSlide(id);
      fetchSlides();
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

    try {
      const payload = { title, description, image_url: imageUrl, link };
      if (editTarget) {
        await updateHeroSlide(editTarget.id, payload);
      } else {
        await createHeroSlide(payload);
      }
      setModalOpen(false);
      fetchSlides();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const inputCls = 'w-full bg-[#121212] border border-neutral-700 text-white text-sm px-3.5 py-2.5 outline-none focus:border-amber-400/60 transition-colors placeholder:text-neutral-600 rounded-none';
  const labelCls = 'block text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-1.5';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-1">Hero Slides</h2>
          <p className="text-[11px] text-neutral-500">
            Create or customize slides displayed in the main banner showcase.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-amber-400 text-black text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2.5 hover:bg-amber-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Slide
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-[#181818] border border-neutral-800 p-12 text-center text-neutral-500 text-xs">
          No hero slides. Add one to show a banner on the storefront.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-[#181818] border border-neutral-800 flex flex-col justify-between group">
              <div>
                <div className="relative aspect-video overflow-hidden bg-neutral-900">
                  <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white line-clamp-1">{slide.title}</h4>
                  <p className="text-[10px] text-neutral-500 line-clamp-2 mt-1 leading-relaxed">{slide.description || 'No description provided'}</p>
                </div>
              </div>
              <div className="p-4 pt-0 flex gap-2 justify-end border-t border-neutral-800/50 mt-2">
                <button
                  onClick={() => openEdit(slide)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-700 hover:border-amber-400 hover:text-amber-400 text-[10px] uppercase tracking-wider transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
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
              {editTarget ? 'Edit Hero Slide' : 'Add Hero Slide'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className={labelCls}>Title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
              </div>

              <div>
                <label className={labelCls}>Slide Link</label>
                <input type="text" value={link} onChange={(e) => setLink(e.target.value)} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Slide Background Image *</label>
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
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Or paste background image URL here…" required className={inputCls} />
                {imageUrl && (
                  <div className="mt-3 aspect-video bg-neutral-900 overflow-hidden border border-neutral-800">
                    <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
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
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
