'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LikeButton } from '@/components/LikeButton';
import { CommentSection } from '@/components/CommentSection';
import { PageLoader } from '@/components/LoadingSpinner';
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

  if (isLoading) return <><Navbar /><PageLoader /></>;

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-ink mb-3">Story Not Found</h1>
          <p className="text-ink-secondary text-sm mb-8 max-w-sm">{error}</p>
          <Link href="/feed" className="btn-primary">Back to Feed</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const initials = (blog.user?.name || blog.user?.email || 'A').charAt(0).toUpperCase();
  const wordCount = blog.content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6 pt-12 pb-20">
          <article>
            {/* Title */}
            <h1
              className="text-4xl sm:text-[2.75rem] font-bold text-ink mb-6 leading-[1.15] tracking-tight"
              style={{ fontFamily: 'Merriweather, Georgia, serif' }}
            >
              {blog.title}
            </h1>

            {/* Author + meta row */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className="avatar w-10 h-10 text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {blog.user?.name || blog.user?.email}
                  </p>
                  <p className="text-xs text-ink-muted flex items-center gap-1.5 mt-0.5">
                    <span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
                    <span className="text-ink-faint">·</span>
                    <span>{readTime} min read</span>
                    <span className="text-ink-faint">·</span>
                    <span>{wordCount} words</span>
                  </p>
                </div>
              </div>
              <LikeButton
                blogId={blog.id}
                initialLiked={likeStatus.liked}
                initialCount={likeStatus.likeCount}
              />
            </div>

            {/* AI Summary callout */}
            {blog.summary && (
              <div className="flex gap-4 bg-accent-light border border-accent-muted rounded-2xl p-5 mb-8">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">AI Summary</p>
                  <p className="text-ink-secondary text-sm leading-relaxed italic">{blog.summary}</p>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose-content">
              {blog.content.split('\n').map((paragraph, i) =>
                paragraph.trim() ? (
                  <p key={i}>{paragraph}</p>
                ) : (
                  <br key={i} />
                ),
              )}
            </div>
          </article>

          {/* Sticky-ish bottom like bar */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
            <LikeButton
              blogId={blog.id}
              initialLiked={likeStatus.liked}
              initialCount={likeStatus.likeCount}
            />
            <Link href="/feed" className="btn-ghost text-sm">
              ← Back to feed
            </Link>
          </div>

          {/* Comments */}
          <div className="mt-10">
            <CommentSection blogId={blog.id} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

