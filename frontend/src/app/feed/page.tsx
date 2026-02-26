'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { BlogCard } from '@/components/BlogCard';
import { ArticleSkeleton } from '@/components/LoadingSpinner';
import { publicApi, Blog, FeedMeta } from '@/lib/blog-api';

export default function FeedPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [meta, setMeta] = useState<FeedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async (pageNum: number, append = false) => {
    try {
      const res = await publicApi.getFeed(pageNum, 10);
      setBlogs((prev) => (append ? [...prev, ...res.data] : res.data));
      setMeta(res.meta);
    } catch {
      setError('Failed to load feed. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => { fetchFeed(1); }, []);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    setIsLoadingMore(true);
    fetchFeed(next, true);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex gap-12">
        {/* Main feed */}
        <main className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">Explore</h1>
          <p className="text-neutral-400 text-sm mb-8">Latest stories from the community</p>

          {isLoading ? (
            <div>{[1,2,3,4].map(i => <ArticleSkeleton key={i} />)}</div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-neutral-500 mb-4">{error}</p>
              <button onClick={() => fetchFeed(1)} className="btn-primary">Try Again</button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No stories yet</h3>
              <p className="text-neutral-500">Be the first to publish a story.</p>
            </div>
          ) : (
            <>
              {blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}

              {meta?.hasNextPage && (
                <div className="flex justify-center pt-10">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="btn-secondary"
                  >
                    {isLoadingMore ? 'Loading…' : 'Load more stories'}
                  </button>
                </div>
              )}
              {meta && (
                <p className="text-center text-xs text-neutral-300 pt-6">
                  {blogs.length} of {meta.total} stories
                </p>
              )}
            </>
          )}
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">
              Discover topics
            </h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Technology', 'Design', 'AI', 'Programming', 'Science', 'Productivity', 'Startups', 'Writing'].map((t) => (
                <span key={t} className="tag cursor-pointer">{t}</span>
              ))}
            </div>
            <div className="divider" />
            <p className="text-xs text-neutral-400 leading-relaxed">
              SecureBlog is a place for curious minds to read, write, and connect with ideas that matter.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
