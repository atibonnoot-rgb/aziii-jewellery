import React from 'react';
import { Link } from 'react-router-dom';
import { User, MessageSquare, Calendar, Loader2 } from 'lucide-react';
import { DiamondIcon } from './DiamondIcon';
import type { BlogPost } from '../lib/blogsApi';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface BlogSectionProps {
  blogs: BlogPost[];
  loading: boolean;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ blogs, loading }) => {
  const { get } = useSiteSettings();
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Dec 09 2017';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <section id="blog" className="w-full bg-[#121212] py-16 text-white font-['Jost',sans-serif]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] text-white uppercase font-['Montserrat',sans-serif] mb-2">
            LATEST NEWS FROM THE BLOG
          </h2>

          <div className="flex justify-center my-2">
            <DiamondIcon className="w-3.5 h-3.5 text-white/80" />
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-xl mx-auto mt-2">
            {get('blog_subtitle') || 'This unique jewelry is handcrafted on the beautiful island of Nantucket using fine silver and semi precious stones.'}
          </p>
        </div>

        {/* 3 Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#181818] border border-neutral-800 p-6 flex flex-col items-center text-center animate-pulse"
              >
                <div className="relative aspect-[4/3] w-full bg-neutral-800 mb-4" />
                <div className="h-4 w-40 bg-neutral-800 mb-2 rounded" />
                <div className="h-3 w-32 bg-neutral-800 rounded" />
              </div>
            ))
          ) : blogs.length === 0 ? (
            <div className="col-span-3 text-center py-12 bg-[#181818] border border-neutral-800/50">
              <p className="text-neutral-500 text-xs uppercase tracking-wider">No articles published yet.</p>
            </div>
          ) : (
            blogs.slice(0, 3).map((post) => (
              <article
                key={post.id}
                className="bg-[#181818] border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex flex-col group"
              >
                {/* Blog Image */}
                <Link to={`/blog/${post.id}`} className="block relative aspect-[4/3] overflow-hidden bg-neutral-900">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.9]"
                  />
                </Link>

                {/* Blog Content */}
                <div className="p-6 flex flex-col flex-grow justify-between text-center items-center">
                  <div>
                    <Link to={`/blog/${post.id}`} className="block">
                      <h3 className="text-sm font-bold tracking-widest text-white uppercase font-['Montserrat',sans-serif] mb-3 group-hover:text-amber-200 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                    </Link>

                    {/* Meta Details */}
                    <div className="flex items-center justify-center space-x-4 text-[10px] text-neutral-400 uppercase tracking-wider mb-4 border-b border-neutral-800 pb-3 w-full">
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-neutral-500" />
                        <span>{post.author}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1 font-semibold text-neutral-400">
                        <MessageSquare className="w-3 h-3 text-neutral-500" />
                        <span>0 Comments</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-neutral-500" />
                        <span>{formatDate(post.created_at)}</span>
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed font-light mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <Link
                    to={`/blog/${post.id}`}
                    className="px-6 py-2 text-[10px] font-bold tracking-[0.2em] text-white uppercase bg-neutral-900 border border-neutral-700 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                  >
                    READ MORE
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
