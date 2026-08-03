import { supabase } from './supabase';

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
}

export interface PopularCategory {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  filter_type?: 'ring' | 'bracelet' | 'earrings' | 'pendant';
  filter_cat?: 'WOMEN' | 'MEN' | 'UNISEX';
}

// ── HERO SLIDES API ──
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createHeroSlide(slide: Omit<HeroSlide, 'id'>): Promise<HeroSlide> {
  const { data, error } = await supabase
    .from('hero_slides')
    .insert([slide])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHeroSlide(id: string, slide: Partial<Omit<HeroSlide, 'id'>>): Promise<HeroSlide> {
  const { data, error } = await supabase
    .from('hero_slides')
    .update(slide)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const { error } = await supabase.from('hero_slides').delete().eq('id', id);
  if (error) throw error;
}

// ── POPULAR CATEGORIES API ──
export async function getPopularCategories(): Promise<PopularCategory[]> {
  const { data, error } = await supabase
    .from('popular_categories')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createPopularCategory(cat: Omit<PopularCategory, 'id'>): Promise<PopularCategory> {
  const { data, error } = await supabase
    .from('popular_categories')
    .insert([cat])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePopularCategory(id: string, cat: Partial<Omit<PopularCategory, 'id'>>): Promise<PopularCategory> {
  const { data, error } = await supabase
    .from('popular_categories')
    .update(cat)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePopularCategory(id: string): Promise<void> {
  const { error } = await supabase.from('popular_categories').delete().eq('id', id);
  if (error) throw error;
}
