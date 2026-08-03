import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Camera, Upload, Link as LinkIcon, Loader2, Check, AlertCircle, X, FileText } from 'lucide-react';
import { getBlogs, createBlog, updateBlog, deleteBlog, type BlogPost } from '../../lib/blogsApi';
import { uploadProductImage } from '../../lib/productsApi';

export default function BlogsPanel() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // File Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAdd = () => {
    setEditTarget(null);
    setTitle('');
    setAuthor('Admin');
    setExcerpt('');
    setContent('');
    setImageUrl('');
    setError(null);
    setUploadError(null);
    setModalOpen(true);
  };

  const openEdit = (blog: BlogPost) => {
    setEditTarget(blog);
    setTitle(blog.title);
    setAuthor(blog.author);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setImageUrl(blog.image_url);
    setError(null);
    setUploadError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await deleteBlog(id);
      fetchBlogs();
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
    if (!title.trim() || !content.trim() || !imageUrl.trim()) {
      setError('Title, content body, and feature image are required');
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        author: author.trim() || 'Admin',
        excerpt: excerpt.trim(),
        content: content.trim(),
        image_url: imageUrl.trim(),
      };

      if (editTarget) {
        await updateBlog(editTarget.id, payload);
      } else {
        await createBlog(payload);
      }
      setModalOpen(false);
      fetchBlogs();
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
          <h2 className="text-xs font-bold tracking-[0.2em] text-white uppercase mb-1">Blog Articles</h2>
          <p className="text-[11px] text-neutral-500">
            Publish and manage dynamic blog posts for the storefront catalog.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-amber-400 text-black text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2.5 hover:bg-amber-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Article
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-[#181818] border border-neutral-800 p-12 text-center text-neutral-500 text-xs">
          No blog articles. Publish your first article to display it.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((post) => (
            <div key={post.id} className="bg-[#181818] border border-neutral-800 flex flex-col justify-between group">
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white line-clamp-1">{post.title}</h4>
                  <p className="text-[9px] uppercase tracking-wider text-neutral-500 mt-1">By {post.author}</p>
                  <p className="text-[10px] text-neutral-400 line-clamp-3 mt-2 leading-relaxed">{post.excerpt}</p>
                </div>
              </div>
              <div className="p-4 pt-0 flex gap-2 justify-end border-t border-neutral-800/50 mt-2">
                <button
                  onClick={() => openEdit(post)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-700 hover:border-amber-400 hover:text-amber-400 text-[10px] uppercase tracking-wider transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
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
          <div className="bg-[#181818] border border-neutral-700 w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">
              {editTarget ? 'Edit Blog Article' : 'Add Blog Article'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className={labelCls}>Article Title *</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. SLIDE IMAGE POST FORMAT" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Author</label>
                  <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Excerpt (Short Summary) *</label>
                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Write a short teaser summary of the post…" className={`${inputCls} resize-none`} />
              </div>

              <div>
                <label className={labelCls}>Full Content (Body Text) *</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Write the main blog article text here…" className={`${inputCls} resize-y`} />
              </div>

              <div>
                <label className={labelCls}>Feature Image *</label>
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
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Or paste image URL here…" required className={inputCls} />
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
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
