import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Blog } from '@/lib/blog-api';

interface BlogCardProps {
  blog: Blog;
  showAuthor?: boolean;
}

function AuthorAvatar({ name, email }: { name?: string; email?: string }) {
  const letter = (name || email || 'A').charAt(0).toUpperCase();
  return (
    <span className="avatar w-7 h-7 text-xs flex-shrink-0">{letter}</span>
  );
}

export function BlogCard({ blog, showAuthor = true }: BlogCardProps) {
  const readTime = Math.max(1, Math.ceil((blog.content?.split(/\s+/).length ?? 0) / 200));

  return (
    <article className="article-card group">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">

          {/* Author row */}
          {showAuthor && blog.user && (
            <div className="flex items-center gap-2 mb-3">
              <AuthorAvatar name={blog.user.name} email={blog.user.email} />
              <span className="text-sm font-medium text-ink-secondary">
                {blog.user.name || blog.user.email}
              </span>
              <span className="text-ink-faint">·</span>
              <span className="text-xs text-ink-muted">
                {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
              </span>
            </div>
          )}

          {/* Title */}
          <Link href={`/blog/${blog.slug}`} className="block mb-2">
            <h2 className="text-xl font-bold text-ink leading-snug group-hover:text-neutral-600 transition-colors line-clamp-2">
              {blog.title}
            </h2>
          </Link>

          {/* Summary */}
          {blog.summary && (
            <p className="text-ink-secondary text-[0.9375rem] leading-relaxed line-clamp-2 mb-4">
              {blog.summary}
            </p>
          )}

          {/* Footer meta */}
          <div className="flex items-center gap-4 text-xs text-ink-muted mt-3">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readTime} min read
            </span>

            {blog._count && (
              <>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {blog._count.likes}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {blog._count.comments}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Arrow CTA */}
        <Link
          href={`/blog/${blog.slug}`}
          className="flex-shrink-0 w-9 h-9 rounded-full border border-border flex items-center justify-center text-ink-muted group-hover:border-ink group-hover:text-ink group-hover:bg-ink group-hover:text-white transition-all duration-200 mt-1"
          aria-label="Read article"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
