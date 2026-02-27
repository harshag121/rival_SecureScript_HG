'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { DashboardRowSkeleton, EmptyState } from '@/components/LoadingSpinner';
import { PageShell } from '@/components/layout/PageShell';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { blogApi, Blog } from '@/lib/blog-api';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBlogs = async () => {
    try {
      const data = await blogApi.getAll();
      setBlogs(data);
    } catch {
      toast.error('Failed to load stories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this story permanently?')) return;
    setDeletingId(id);
    try {
      await blogApi.delete(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success('Story deleted');
    } catch {
      toast.error('Failed to delete story');
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    setTogglingId(blog.id);
    try {
      const updated = await blogApi.update(blog.id, { isPublished: !blog.isPublished });
      setBlogs((prev) => prev.map((b) => (b.id === blog.id ? updated : b)));
      toast.success(updated.isPublished ? 'Story published!' : 'Moved to drafts');
    } catch {
      toast.error('Failed to update story');
    } finally {
      setTogglingId(null);
    }
  };

  const published = blogs.filter((b) => b.isPublished);
  const drafts = blogs.filter((b) => !b.isPublished);

  const stats = [
    { label: 'Total stories', value: blogs.length },
    { label: 'Published', value: published.length },
    { label: 'Drafts', value: drafts.length },
    { label: 'Total likes', value: blogs.reduce((acc, b) => acc + (b._count?.likes ?? 0), 0) },
  ];

  return (
    <PageShell className="bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-start justify-between">
          <SectionHeading title="Dashboard" subtitle={user?.name || user?.email || 'Manage your stories'} />
          <Link href="/dashboard/new" className="btn-primary gap-1.5">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Write a story
          </Link>
        </div>

        {!isLoading && blogs.length > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-white px-5 py-4 shadow-card">
                <p className="text-2xl font-bold tracking-tight text-ink">{s.value}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
          {isLoading ? (
            <div className="space-y-3 p-6">{[1, 2, 3].map((i) => <DashboardRowSkeleton key={i} />)}</div>
          ) : blogs.length === 0 ? (
            <EmptyState
              icon="✍️"
              title="No stories yet"
              description="Your words are waiting. Write your first story and share it with the world."
              action={<Link href="/dashboard/new" className="btn-primary">Write your first story</Link>}
            />
          ) : (
            <>
              {drafts.length > 0 && (
                <div>
                  <div className="border-b border-border bg-surface px-5 py-3">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Drafts · {drafts.length}</h2>
                  </div>
                  <div className="divide-y divide-border">
                    {drafts.map((blog) => (
                      <BlogRow
                        key={blog.id}
                        blog={blog}
                        onDelete={handleDelete}
                        onToggle={handleTogglePublish}
                        deletingId={deletingId}
                        togglingId={togglingId}
                      />
                    ))}
                  </div>
                </div>
              )}
              {published.length > 0 && (
                <div>
                  <div className="border-y border-border bg-surface px-5 py-3">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Published · {published.length}
                    </h2>
                  </div>
                  <div className="divide-y divide-border">
                    {published.map((blog) => (
                      <BlogRow
                        key={blog.id}
                        blog={blog}
                        onDelete={handleDelete}
                        onToggle={handleTogglePublish}
                        deletingId={deletingId}
                        togglingId={togglingId}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function BlogRow({
  blog,
  onDelete,
  onToggle,
  deletingId,
  togglingId,
}: {
  blog: Blog;
  onDelete: (id: string) => void;
  onToggle: (blog: Blog) => void;
  deletingId: string | null;
  togglingId: string | null;
}) {
  return (
    <div className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface">
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2.5">
          <p className="truncate text-sm font-medium text-ink">{blog.title}</p>
          <span className={blog.isPublished ? 'tag-published' : 'tag-draft'}>
            {blog.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
        <p className="flex items-center gap-2 text-xs text-ink-muted">
          <span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
          {blog._count && (
            <>
              <span className="text-ink-faint">·</span>
              <span>♥ {blog._count.likes}</span>
              <span className="text-ink-faint">·</span>
              <span>💬 {blog._count.comments}</span>
            </>
          )}
        </p>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        {blog.isPublished && (
          <Link href={`/blog/${blog.slug}`} target="_blank" className="btn-ghost rounded-lg px-3 py-1.5 text-xs">
            View
          </Link>
        )}
        <button
          onClick={() => onToggle(blog)}
          disabled={togglingId === blog.id}
          className="btn-secondary rounded-lg px-3 py-1.5 text-xs"
        >
          {togglingId === blog.id ? '...' : blog.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <Link href={`/dashboard/edit/${blog.id}`} className="btn-secondary rounded-lg px-3 py-1.5 text-xs">
          Edit
        </Link>
        <button
          onClick={() => onDelete(blog.id)}
          disabled={deletingId === blog.id}
          className="btn-ghost rounded-lg px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          {deletingId === blog.id ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
