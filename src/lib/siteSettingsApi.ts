import { supabase } from './supabase';

export interface SiteSetting {
  key: string;
  value: string;
  label?: string;
  section?: string;
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error) throw error;
  return Object.fromEntries((data || []).map((r) => [r.key, r.value]));
}

export async function upsertSiteSetting(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) throw error;
}

/** Defaults shown before the DB loads or if the table is empty */
export const DEFAULT_SITE_SETTINGS: Record<string, string> = {
  hero_slide_1_image:
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920&q=80',
  hero_slide_2_image:
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1920&q=80',
  banner_bracelets_image:
    'https://images.unsplash.com/photo-1611591475281-912f7166184a?auto=format&fit=crop&w=800&q=80',
  banner_rings_image:
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
  banner_earrings_image:
    'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=80',
  banner_pendants_image:
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  blog_post_1_image:
    'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=800&q=80',
  blog_post_2_image:
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
  blog_post_3_image:
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  category_1_image:
    'https://images.unsplash.com/photo-1611591475281-912f7166184a?auto=format&fit=crop&w=400&q=80',
  category_2_image:
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80',
  category_3_image:
    'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=400&q=80',
  news_badge: 'NEWS',
  news_text: 'Lorem ipsum dolor consectetu',
  header_phone: '01678 311 160',
  logo_text_top: 'Azii',
  logo_text_bottom: 'Jewels',
  logo_monogram: 'azii',
  bestsellers_subtitle: 'This unique jewelry is handcrafted on the beautiful island of Nantucket using fine silver and semi precious stones. View glasse fashion collection 2018 by Fanbong',
  newarrivals_subtitle: 'This unique jewelry is handcrafted on the beautiful island of Nantucket using fine silver and semi precious stones. View glasse fashion collection 2018 by Fanbong',
  blog_subtitle: 'This unique jewelry is handcrafted on the beautiful island of Nantucket using fine silver and semi precious stones. View glasse fashion collection 2018 by Fanbong',
};
