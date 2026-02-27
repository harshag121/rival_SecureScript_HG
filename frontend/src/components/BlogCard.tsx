import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Blog } from '@/lib/blog-api';

interface BlogCardProps {
  blog: Blog;
  showAuthor?: boolean;
}

function MetaItem({ icon, value }: { icon: React.ReactNode; value: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1">
      {icon}
      {value}
    </span>
  );
}

function AuthorAvatar({ name, email }: { name?: string; email?: string }) {
  const letter = (name || email || 'A').charAt(0).toUpperCase();
  return <span className="avatar h-7 w-7 flex-shrink-0 text-xs">{letter}</span>;
}

export function BlogCard({ blog, showAuthor = true }: BlogCardProps) {
  const readTime = Math.max(1, Math.ceil((blog.content?.split(/\s+/).length ?? 0) / 200));

  return (
    <article className="article-card group">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          {showAuthor && blog.user && (
            <div className="mb-3 flex items-center gap-2">
              <AuthorAvatar name={blog.user.name} email={blog.user.email} />
              <span className="text-sm font-medium text-ink-secondary">{blog.user.name || blog.user.email}</span>
              <span className="text-ink-faint">·</span>
              <span className="text-xs text-ink-muted">{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
            </div>
          )}

          <Link href={`/blog/${blog.slug}`} className="mb-2 block">
            <h2 className="line-clamp-2 text-2xl font-bold leading-snug text-ink transition-colors group-hover:text-accent" style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}>
              {blog.title}
            </h2>
          </Link>

          {blog.summary && <p className="mb-4 line-clamp-2 text-[0.95rem] leading-relaxed text-ink-secondary">{blog.summary}</p>}

          <div className="mt-3 flex items-center gap-4 text-xs text-ink-muted">
            <MetaItem
              value={`${readTime} min read`}
              icon={
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            {blog._count && (
              <>
                <MetaItem
                  value={blog._count.likes}
                  icon={
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  }
                />
                <MetaItem
                  value={blog._count.comments}
                  icon={
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  }
                />
              </>
            )}
          </div>
        </div>

        <Link
          href={`/blog/${blog.slug}`}
          className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border text-ink-muted transition-all duration-200 group-hover:border-ink group-hover:bg-ink group-hover:text-white"
          aria-label="Read article"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
