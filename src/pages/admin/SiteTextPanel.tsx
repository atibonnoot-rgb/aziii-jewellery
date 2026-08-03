import React, { useState, useEffect } from 'react';
import { Type, Save, Check, Loader2, AlertCircle } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { upsertSiteSetting } from '../../lib/siteSettingsApi';

interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder?: string;
}

interface SectionDef {
  title: string;
  fields: FieldDef[];
}

const SECTIONS: SectionDef[] = [
  {
    title: 'News Ticker & Call Info (Top Bar)',
    fields: [
      { key: 'news_badge', label: 'News Badge Text (e.g. NEWS)', type: 'text' },
      { key: 'news_text', label: 'News Headline Text', type: 'text' },
      { key: 'header_phone', label: 'Call Phone Number', type: 'text' },
    ],
  },
  {
    title: 'Brand / Logo Labels',
    fields: [
      { key: 'logo_text_top', label: 'Brand Logo Title Top (e.g. Azii)', type: 'text' },
      { key: 'logo_text_bottom', label: 'Brand Logo Title Bottom (e.g. Jewels)', type: 'text' },
      { key: 'logo_monogram', label: 'Logo Circle Monogram (e.g. azii)', type: 'text' },
    ],
  },
  {
    title: 'Catalog Section Subtitles',
    fields: [
      { key: 'bestsellers_subtitle', label: 'Best Sellers Subtitle', type: 'textarea' },
      { key: 'newarrivals_subtitle', label: 'New Arrivals Subtitle', type: 'textarea' },
      { key: 'blog_subtitle', label: 'Blog News Subtitle', type: 'textarea' },
    ],
  },
];

export default function SiteTextPanel() {
  const { settings, refetch } = useSiteSettings();
  const [form, setForm] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize form state once settings are loaded
  useEffect(() => {
    if (settings) {
      setForm(settings);
    }
  }, [settings]);

  const handleChange = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSaveField = async (key: string) => {
    const value = form[key] || '';
    setSavingKey(key);
    setError(null);
    try {
      await upsertSiteSetting(key, value);
      refetch();
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save setting');
    } finally {
      setSavingKey(null);
    }
  };

  const inputCls = 'w-full bg-[#121212] border border-neutral-700 text-white text-sm px-3.5 py-2.5 outline-none focus:border-amber-400/60 transition-colors placeholder:text-neutral-600 rounded-none';
  const labelCls = 'block text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-1.5 font-bold';

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-start gap-3 pb-4 border-b border-neutral-800">
        <Type className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-1">Site Texts & Copy</h2>
          <p className="text-[11px] text-neutral-500">
            Edit text headers, slogans, ticker items, and call descriptors dynamically.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.title} className="bg-[#181818] border border-neutral-800 p-6 space-y-6">
            <h3 className="text-[10px] tracking-[0.25em] text-amber-400 uppercase font-bold border-b border-neutral-800 pb-2">
              {section.title}
            </h3>

            <div className="space-y-4">
              {section.fields.map((field) => {
                const isSaving = savingKey === field.key;
                const isSaved = savedKey === field.key;
                const currentValue = form[field.key] || '';

                return (
                  <div key={field.key} className="space-y-1.5">
                    <label className={labelCls}>{field.label}</label>
                    <div className="flex gap-2 items-start">
                      {field.type === 'textarea' ? (
                        <textarea
                          value={currentValue}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          rows={3}
                          className={`${inputCls} resize-y`}
                        />
                      ) : (
                        <input
                          type="text"
                          value={currentValue}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className={inputCls}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleSaveField(field.key)}
                        disabled={isSaving}
                        className={`px-4 py-3 text-[10px] tracking-wider uppercase font-bold flex items-center gap-1.5 transition-colors border ${
                          isSaved
                            ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400'
                            : 'bg-amber-400 text-black border-amber-400 hover:bg-amber-300'
                        }`}
                        title="Save setting"
                      >
                        {isSaving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isSaved ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>{isSaving ? 'Saving' : isSaved ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
