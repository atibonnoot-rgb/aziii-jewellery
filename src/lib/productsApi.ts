import { supabase } from './supabase';
import type { Product } from '../types';

const BUCKET = 'product-images';

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * Requires a public bucket named 'product-images' in your Supabase project.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { cacheControl: '3600', upsert: false });

  if (error) throw error;

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return urlData.publicUrl;
}


// Maps Supabase row → Product interface
function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.title as string,
    description: row.description as string | undefined,
    category: (row.category as Product['category']) || 'UNISEX',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    badge: row.badge as Product['badge'] | undefined,
    rating: Number(row.rating) || 5,
    image: row.image_url as string,
    type: (row.type as Product['type']) || 'ring',
    section: (row.section as Product['section']) || 'new_arrival',
    isBestSeller:
      row.section === 'best_seller' || row.section === 'both',
    isNewArrival:
      row.section === 'new_arrival' || row.section === 'both',
    created_at: row.created_at as string | undefined,
  };
}

// Maps Product → Supabase row payload
function productToRow(p: Partial<Product> & { name: string; price: number; image: string }) {
  return {
    title: p.name,
    description: p.description ?? null,
    price: p.price,
    original_price: p.originalPrice ?? null,
    image_url: p.image,
    category: p.category ?? 'UNISEX',
    type: p.type ?? 'ring',
    badge: p.badge ?? null,
    section: p.section ?? 'new_arrival',
    rating: p.rating ?? 5,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return rowToProduct(data);
}


export async function createProduct(
  product: Omit<Product, 'id' | 'created_at' | 'isBestSeller' | 'isNewArrival'>
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert([productToRow(product as Product & { name: string; price: number; image: string })])
    .select()
    .single();

  if (error) throw error;
  return rowToProduct(data);
}

export async function updateProduct(
  id: string,
  product: Partial<Omit<Product, 'id' | 'created_at' | 'isBestSeller' | 'isNewArrival'>>
): Promise<Product> {
  const payload: Record<string, unknown> = {};
  if (product.name !== undefined) payload.title = product.name;
  if (product.description !== undefined) payload.description = product.description;
  if (product.price !== undefined) payload.price = product.price;
  if (product.originalPrice !== undefined) payload.original_price = product.originalPrice;
  if (product.image !== undefined) payload.image_url = product.image;
  if (product.category !== undefined) payload.category = product.category;
  if (product.type !== undefined) payload.type = product.type;
  if (product.badge !== undefined) payload.badge = product.badge;
  if (product.section !== undefined) payload.section = product.section;
  if (product.rating !== undefined) payload.rating = product.rating;

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return rowToProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
