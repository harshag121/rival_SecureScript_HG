'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogCard } from '@/components/BlogCard';
import { ArticleSkeleton, EmptyState } from '@/components/LoadingSpinner';
import { publicApi, Blog, FeedMeta } from '@/lib/blog-api';

const TOPICS = ['Technology', 'Design', 'AI', 'Programming', 'Science', 'Productivity', 'Startups', 'Writing'];

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
      setError('Failed to load stories. Please check your connection and try again.');
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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Page header */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold text-ink tracking-tight mb-1">Feed</h1>
          <p className="text-ink-secondary text-[0.9375rem]">
            Stories from the community, sorted by newest
          </p>
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex gap-14">

          {/* Main feed */}
          <main className="flex-1 min-w-0">
            {isLoading ? (
              <div>{[1, 2, 3, 4].map((i) => <ArticleSkeleton key={i} />)}</div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-ink-secondary mb-5 text-sm">{error}</p>
                <button onClick={() => { setError(null); setIsLoading(true); fetchFeed(1); }} className="btn-primary">
                  Try again
                </button>
              </div>
            ) : blogs.length === 0 ? (
              <EmptyState
                icon="📭"
                title="No stories yet"
                description="Be the first to publish a story and it will appear here."
              />
            ) : (
              <>
                <div>
                  {blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
                </div>

                {meta?.hasNextPage && (
                  <div className="flex justify-center pt-12">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="btn-secondary min-w-[160px]"
                    >
                      {isLoadingMore ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-neutral-300 border-t-ink animate-spin" />
                          Loading…
                        </span>
                      ) : (
                        'Load more stories'
                      )}
                    </button>
                  </div>
                )}

                {meta && (
                  <p className="text-center text-xs text-ink-muted pt-6">
                    Showing {blogs.length} of {meta.total} {meta.total === 1 ? 'story' : 'stories'}
                  </p>
                )}
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 space-y-8">
              <div>
                <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">
                  Discover topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((t) => (
                    <span key={t} className="tag cursor-pointer text-xs">{t}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-8">
                <h3 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
                  About
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  SecureBlog is a production-grade platform for curious minds to publish, discover, and engage with ideas that matter.
                </p>
              </div>

              <div className="text-xs text-ink-muted leading-relaxed">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {['Help', 'Privacy', 'Terms'].map((l) => (
                    <span key={l} className="hover:text-ink cursor-pointer transition-colors">{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}

