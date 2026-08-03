import { supabase } from './supabase';

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  image_url: string;
  created_at?: string;
}

export async function getBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getBlogById(id: string): Promise<BlogPost> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createBlog(blog: Omit<BlogPost, 'id' | 'created_at'>): Promise<BlogPost> {
  const { data, error } = await supabase
    .from('blogs')
    .insert([blog])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlog(id: string, blog: Partial<Omit<BlogPost, 'id' | 'created_at'>>): Promise<BlogPost> {
  const { data, error } = await supabase
    .from('blogs')
    .update(blog)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlog(id: string): Promise<void> {
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw error;
}
