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
    <div
      className="avatar w-8 h-8 text-xs flex-shrink-0"
      style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}
    >
      {letter}
    </div>
  );
}

export function BlogCard({ blog, showAuthor = true }: BlogCardProps) {
  return (
    <article className="article-card">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          {/* Author row */}
          {showAuthor && blog.user && (
            <div className="flex items-center gap-2 mb-3">
              <AuthorAvatar name={blog.user.name} email={blog.user.email} />
              <span className="text-sm font-medium text-neutral-700">
                {blog.user.name || blog.user.email}
              </span>
            </div>
          )}

          {/* Title */}
          <Link href={`/blog/${blog.slug}`}>
            <h2 className="text-xl font-bold text-neutral-900 leading-snug group-hover:text-neutral-600 transition-colors line-clamp-2 mb-2">
              {blog.title}
            </h2>
          </Link>

          {/* Summary */}
          {blog.summary && (
            <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2 mb-4">
              {blog.summary}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span>
              {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
            </span>
            {blog._count && (
              <>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {blog._count.likes}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {blog._count.comments}
                </span>
                <span className="text-neutral-300">
                  {Math.ceil(blog.content?.split(/\s+/).length / 200) || 1} min read
                </span>
              </>
            )}
          </div>
        </div>

        {/* Read link */}
        <Link
          href={`/blog/${blog.slug}`}
          className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-full border border-neutral-200 items-center justify-center text-neutral-400 hover:border-neutral-900 hover:text-neutral-900 transition-all mt-1"
          aria-label="Read article"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
