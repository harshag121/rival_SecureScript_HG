'use client';

import { useState, useEffect } from 'react';
import { BlogCard } from '@/components/BlogCard';
import { ArticleSkeleton, EmptyState } from '@/components/LoadingSpinner';
import { PageShell } from '@/components/layout/PageShell';
import { SectionHeading } from '@/components/ui/SectionHeading';
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

  useEffect(() => {
    fetchFeed(1);
  }, []);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    setIsLoadingMore(true);
    fetchFeed(next, true);
  };

  return (
    <PageShell className="bg-surface">
      <div className="border-b border-border bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <SectionHeading title="Public Feed" subtitle="Stories from the community, sorted by newest." />
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-14 px-4 py-10 sm:px-6">
        <section className="min-w-0 flex-1 rounded-2xl border border-border/80 bg-white px-6 py-4 shadow-card">
          {isLoading ? (
            <div>{[1, 2, 3, 4].map((i) => <ArticleSkeleton key={i} />)}</div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="mb-5 text-sm text-ink-secondary">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  fetchFeed(1);
                }}
                className="btn-primary"
              >
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
              <div>{blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}</div>

              {meta?.hasNextPage && (
                <div className="flex justify-center pt-12">
                  <button onClick={handleLoadMore} disabled={isLoadingMore} className="btn-secondary min-w-[160px]">
                    {isLoadingMore ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-300 border-t-ink" />
                        Loading...
                      </span>
                    ) : (
                      'Load more stories'
                    )}
                  </button>
                </div>
              )}

              {meta && (
                <p className="pt-6 text-center text-xs text-ink-muted">
                  Showing {blogs.length} of {meta.total} {meta.total === 1 ? 'story' : 'stories'}
                </p>
              )}
            </>
          )}
        </section>

        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <div className="sticky top-20 space-y-6 rounded-2xl border border-border/80 bg-white p-5 shadow-card">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">Discover topics</h3>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <span key={t} className="tag cursor-pointer text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">About</h3>
              <p className="text-xs leading-relaxed text-ink-secondary">
                SecureBlog is a production-grade platform for publishing, discovering, and discussing ideas that matter.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
