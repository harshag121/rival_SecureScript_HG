'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { LikeButton } from '@/components/LikeButton';
import { CommentSection } from '@/components/CommentSection';
import { PageLoader } from '@/components/LoadingSpinner';
import { PageShell } from '@/components/layout/PageShell';
import { publicApi, likeApi, Blog } from '@/lib/blog-api';
import { useAuth } from '@/contexts/auth-context';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPage({ params }: BlogPageProps) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [likeStatus, setLikeStatus] = useState({ liked: false, likeCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await publicApi.getBlogBySlug(slug);
        setBlog(data);
        setLikeStatus({ liked: false, likeCount: data._count?.likes || 0 });
      } catch {
        setError('Blog not found or has been unpublished');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const blogId = blog?.id;
    if (!blogId || !isAuthenticated) return;
    likeApi.getStatus(blogId).then(setLikeStatus).catch(() => {});
  }, [blog?.id, isAuthenticated]);

  if (isLoading) {
    return (
      <>
        <PageShell showFooter={false}>
          <PageLoader />
        </PageShell>
      </>
    );
  }

  if (error || !blog) {
    return (
      <PageShell className="bg-surface">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
            <svg className="h-8 w-8 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mb-3 text-2xl font-bold text-ink">Story Not Found</h1>
          <p className="mb-8 max-w-sm text-sm text-ink-secondary">{error}</p>
          <Link href="/feed" className="btn-primary">
            Back to Feed
          </Link>
        </div>
      </PageShell>
    );
  }

  const initials = (blog.user?.name || blog.user?.email || 'A').charAt(0).toUpperCase();
  const wordCount = blog.content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <PageShell className="bg-white">
      <div className="mx-auto max-w-[700px] px-4 pb-20 pt-12 sm:px-6">
        <article>
          <h1 className="mb-6 text-4xl font-bold leading-[1.15] tracking-tight text-ink sm:text-[2.75rem]" style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}>
            {blog.title}
          </h1>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
            <div className="flex items-center gap-3">
              <div className="avatar h-10 w-10 text-sm font-bold">{initials}</div>
              <div>
                <p className="text-sm font-semibold text-ink">{blog.user?.name || blog.user?.email}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
                  <span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
                  <span className="text-ink-faint">·</span>
                  <span>{readTime} min read</span>
                  <span className="text-ink-faint">·</span>
                  <span>{wordCount} words</span>
                </p>
              </div>
            </div>
            <LikeButton blogId={blog.id} initialLiked={likeStatus.liked} initialCount={likeStatus.likeCount} />
          </div>

          {blog.summary && (
            <div className="mb-8 flex gap-4 rounded-2xl border border-accent-muted bg-accent-light p-5">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white">★</div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">AI Summary</p>
                <p className="text-sm italic leading-relaxed text-ink-secondary">{blog.summary}</p>
              </div>
            </div>
          )}

          <div className="prose-content">
            {blog.content.split('\n').map((paragraph, i) =>
              paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />,
            )}
          </div>
        </article>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-8">
          <LikeButton blogId={blog.id} initialLiked={likeStatus.liked} initialCount={likeStatus.likeCount} />
          <Link href="/feed" className="btn-ghost text-sm">
            Back to feed
          </Link>
        </div>

        <div className="mt-10">
          <CommentSection blogId={blog.id} />
        </div>
      </div>
    </PageShell>
  );
}
