import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from '../lib/siteSettingsApi';

interface SiteSettingsContextValue {
  settings: Record<string, string>;
  loading: boolean;
  /** Get a setting value, falling back to the hardcoded default */
  get: (key: string) => string;
  /** Re-fetch all settings from Supabase (call after admin saves) */
  refetch: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: DEFAULT_SITE_SETTINGS,
  loading: false,
  get: (key) => DEFAULT_SITE_SETTINGS[key] ?? '',
  refetch: () => {},
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSiteSettings();
      // Merge: DB values override defaults, but defaults fill any gaps
      setSettings({ ...DEFAULT_SITE_SETTINGS, ...data });
    } catch {
      // On error just keep the defaults — storefront still shows something
      setSettings(DEFAULT_SITE_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const get = (key: string) => settings[key] ?? DEFAULT_SITE_SETTINGS[key] ?? '';

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, get, refetch: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
