import React, { useState, useRef, useCallback } from 'react';
import { Camera, Loader2, Check, AlertCircle, Link as LinkIcon, Upload } from 'lucide-react';
import { upsertSiteSetting } from '../../lib/siteSettingsApi';
import { uploadProductImage } from '../../lib/productsApi'; // reuse same bucket
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface MediaItem {
  key: string;
  label: string;
  aspect: string; // tailwind aspect-ratio class
}

const SECTIONS: { title: string; items: MediaItem[] }[] = [
  {
    title: 'Hero Slides',
    items: [
      { key: 'hero_slide_1_image', label: 'Slide 1', aspect: 'aspect-video' },
      { key: 'hero_slide_2_image', label: 'Slide 2', aspect: 'aspect-video' },
    ],
  },
  {
    title: 'Feature Banners',
    items: [
      { key: 'banner_bracelets_image', label: 'Bracelets Banner', aspect: 'aspect-[3/4]' },
      { key: 'banner_rings_image', label: 'Rings Banner', aspect: 'aspect-[3/4]' },
      { key: 'banner_earrings_image', label: 'Earrings Banner', aspect: 'aspect-[3/4]' },
      { key: 'banner_pendants_image', label: 'Pendants Banner', aspect: 'aspect-[3/4]' },
    ],
  },
  {
    title: 'Blog Posts',
    items: [
      { key: 'blog_post_1_image', label: 'Blog Post 1', aspect: 'aspect-[4/3]' },
      { key: 'blog_post_2_image', label: 'Blog Post 2', aspect: 'aspect-[4/3]' },
      { key: 'blog_post_3_image', label: 'Blog Post 3', aspect: 'aspect-[4/3]' },
    ],
  },
  {
    title: 'Popular Categories',
    items: [
      { key: 'category_1_image', label: 'Category 1 (Bracelets)', aspect: 'aspect-square' },
      { key: 'category_2_image', label: 'Category 2 (Rings)', aspect: 'aspect-square' },
      { key: 'category_3_image', label: 'Category 3 (Earrings)', aspect: 'aspect-square' },
    ],
  },
];

// Per-image card with upload / URL editing
const MediaCard: React.FC<{ item: MediaItem }> = ({ item }) => {
  const { get, refetch } = useSiteSettings();
  const currentUrl = get(item.key);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'idle' | 'url'>('idle');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const save = useCallback(async (url: string) => {
    setSaving(true);
    setError(null);
    try {
      await upsertSiteSetting(item.key, url);
      refetch();
      setSaved(true);
      setMode('idle');
      setTimeout(() => setSaved(false), 2000);
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
    } finally {
      setSaving(false);
    }
  }, [item.key, refetch]);

  const handleFile = useCallback(async (file: File) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) { setError('PNG, JPEG or WebP only'); return; }
    if (file.size > 8 * 1024 * 1024) { setError('Max 8 MB'); return; }
    setSaving(true);
    setError(null);
    try {
      const publicUrl = await uploadProductImage(file);
      await save(publicUrl);
    } catch (err: unknown) {
      let msg = 'Upload failed';
      if (err && typeof err === 'object') {
        const e = err as Record<string, unknown>;
        msg = (e.message as string)
          || (e.error_description as string)
          || (e.details as string)
          || JSON.stringify(err);
      }
      setError(msg);
      setSaving(false);
    }
  }, [save]);

  return (
    <div className="bg-[#181818] border border-neutral-800 overflow-hidden group">
      {/* Image container */}
      <div className={`relative w-full ${item.aspect} overflow-hidden bg-neutral-900`}>
        <img
          src={currentUrl}
          alt={item.label}
          className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-50"
        />

        {/* Hover overlay — shows action buttons */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {saving ? (
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          ) : saved ? (
            <div className="flex flex-col items-center gap-1">
              <Check className="w-8 h-8 text-emerald-400" />
              <span className="text-emerald-400 text-[10px] tracking-wider uppercase">Saved!</span>
            </div>
          ) : (
            <>
              {/* Upload file button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-black text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-amber-300 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload File
              </button>
              {/* Paste URL button */}
              <button
                onClick={() => { setMode('url'); setUrlInput(currentUrl); }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-[10px] font-semibold tracking-[0.15em] uppercase hover:bg-white/20 transition-colors border border-white/20"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Paste URL
              </button>
            </>
          )}
        </div>

        {/* Camera badge */}
        <div className="absolute top-2 right-2 w-7 h-7 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-3.5 h-3.5 text-white" />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {/* Label + error */}
      <div className="px-3 py-2">
        <p className="text-[10px] tracking-[0.15em] text-neutral-400 uppercase font-semibold">{item.label}</p>
        {error && (
          <div className="flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-[10px]">{error}</p>
          </div>
        )}
      </div>

      {/* URL input (shown when mode === 'url') */}
      {mode === 'url' && (
        <div className="px-3 pb-3 space-y-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            autoFocus
            className="w-full bg-[#121212] border border-neutral-700 text-white text-xs px-2.5 py-2 outline-none focus:border-amber-400/60 placeholder:text-neutral-600"
          />
          <div className="flex gap-2">
            <button
              onClick={() => save(urlInput)}
              disabled={!urlInput.trim() || saving}
              className="flex-1 py-1.5 text-[10px] tracking-wider uppercase font-bold bg-amber-400 text-black hover:bg-amber-300 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => { setMode('idle'); setError(null); }}
              className="px-3 py-1.5 text-[10px] uppercase text-neutral-400 border border-neutral-700 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SiteMediaPanel() {
  return (
    <div className="space-y-10">
      <div className="flex items-start gap-3 pb-4 border-b border-neutral-800">
        <Camera className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-1">Site Media</h2>
          <p className="text-[11px] text-neutral-500">
            Hover over any image to replace it. Changes are saved instantly and go live on the storefront.
          </p>
        </div>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title}>
          <h3 className="text-[10px] tracking-[0.25em] text-amber-400 uppercase font-bold mb-4 border-b border-neutral-800 pb-2">
            {section.title}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {section.items.map((item) => (
              <MediaCard key={item.key} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
