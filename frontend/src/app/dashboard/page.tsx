'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DashboardRowSkeleton, EmptyState } from '@/components/LoadingSpinner';
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

  useEffect(() => { fetchBlogs(); }, []);

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
    {
      label: 'Total likes',
      value: blogs.reduce((acc, b) => acc + (b._count?.likes ?? 0), 0),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-ink tracking-tight">Dashboard</h1>
              <p className="text-ink-secondary text-sm mt-1">
                {user?.name || user?.email}
              </p>
            </div>
            <Link href="/dashboard/new" className="btn-primary gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Write a story
            </Link>
          </div>

          {/* Stats row */}
          {!isLoading && blogs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-border shadow-card px-5 py-4">
                  <p className="text-2xl font-bold text-ink tracking-tight">{s.value}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Stories list */}
          <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => <DashboardRowSkeleton key={i} />)}
              </div>
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
                    <div className="px-5 py-3 bg-surface border-b border-border">
                      <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                        Drafts · {drafts.length}
                      </h2>
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
                    <div className="px-5 py-3 bg-surface border-b border-border border-t border-border">
                      <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
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
      </div>

      <Footer />
    </div>
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
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-surface transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-0.5">
          <p className="font-medium text-ink text-sm truncate">{blog.title}</p>
          <span className={blog.isPublished ? 'tag-published' : 'tag-draft'}>
            {blog.isPublished ? (
              <>
                <svg className="w-3 h-3" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="3" /></svg>
                Published
              </>
            ) : 'Draft'}
          </span>
        </div>
        <p className="text-xs text-ink-muted flex items-center gap-2">
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

      {/* Actions – visible on hover */}
      <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {blog.isPublished && (
          <Link
            href={`/blog/${blog.slug}`}
            target="_blank"
            className="btn-ghost text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
          >
            View
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        )}
        <button
          onClick={() => onToggle(blog)}
          disabled={togglingId === blog.id}
          className="btn-secondary text-xs px-3 py-1.5 rounded-lg"
        >
          {togglingId === blog.id ? '…' : blog.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <Link href={`/dashboard/edit/${blog.id}`} className="btn-secondary text-xs px-3 py-1.5 rounded-lg">
          Edit
        </Link>
        <button
          onClick={() => onDelete(blog.id)}
          disabled={deletingId === blog.id}
          className="btn-ghost text-xs px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          {deletingId === blog.id ? '…' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

