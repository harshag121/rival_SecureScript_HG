'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Navbar } from '@/components/Navbar';
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
    if (!blog || !isAuthenticated) return;
    likeApi.getStatus(blog.id).then(setLikeStatus).catch(() => {});
  }, [blog?.id, isAuthenticated]);

  if (isLoading) return <><Navbar /><PageLoader /></>;

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
            Story Not Found
          </h1>
          <p className="text-neutral-500 mb-8">{error}</p>
          <Link href="/feed" className="btn-primary">Back to Feed</Link>
        </div>
      </>
    );
  }

  const initials = (blog.user?.name || blog.user?.email || 'A').charAt(0).toUpperCase();
  const wordCount = blog.content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <article>
          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-6 leading-tight"
            style={{ fontFamily: 'Merriweather, Georgia, serif' }}
          >
            {blog.title}
          </h1>

          {/* Author row */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="avatar">{initials}</div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  {blog.user?.name || blog.user?.email}
                </p>
                <p className="text-xs text-neutral-400">
                  {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                  {' · '}
                  {readTime} min read
                </p>
              </div>
            </div>
            <LikeButton
              blogId={blog.id}
              initialLiked={likeStatus.liked}
              initialCount={likeStatus.likeCount}
            />
          </div>

          {/* Summary callout */}
          {blog.summary && (
            <blockquote className="border-l-4 border-amber-400 bg-amber-50 pl-5 pr-4 py-3 mb-8 rounded-r-xl">
              <p className="text-neutral-600 italic text-sm leading-relaxed">{blog.summary}</p>
            </blockquote>
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

        <div className="divider my-12" />

        <CommentSection blogId={blog.id} />
      </main>
    </>
  );
}
