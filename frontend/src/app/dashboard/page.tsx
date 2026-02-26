'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { Navbar } from '@/components/Navbar';
import { blogApi, Blog } from '@/lib/blog-api';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      const data = await blogApi.getAll();
      setBlogs(data);
    } catch {
      toast.error('Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    setDeletingId(id);
    try {
      await blogApi.delete(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success('Blog deleted');
    } catch {
      toast.error('Failed to delete blog');
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    setTogglingId(blog.id);
    try {
      const updated = await blogApi.update(blog.id, {
        isPublished: !blog.isPublished,
      });
      setBlogs((prev) => prev.map((b) => (b.id === blog.id ? updated : b)));
      toast.success(
        updated.isPublished ? 'Blog published!' : 'Blog unpublished',
      );
    } catch {
      toast.error('Failed to update blog');
    } finally {
      setTogglingId(null);
    }
  };

  const published = blogs.filter((b) => b.isPublished);
  const drafts = blogs.filter((b) => !b.isPublished);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
              Your stories
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              {user?.name || user?.email} · {blogs.length} {blogs.length === 1 ? 'story' : 'stories'}
            </p>
          </div>
          <Link href="/dashboard/new" className="btn-primary">Write a story</Link>
        </div>

        {isLoading ? (
          <div>{[1,2,3].map(i => <div key={i} className="animate-pulse h-20 bg-neutral-100 rounded-2xl mb-3" />)}</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">✍️</div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No stories yet</h3>
            <p className="text-neutral-400 mb-6">Your words are waiting.</p>
            <Link href="/dashboard/new" className="btn-primary">Write your first story</Link>
          </div>
        ) : (
          <>
            {drafts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Drafts ({drafts.length})</h2>
                <div className="space-y-2">
                  {drafts.map((blog) => <BlogRow key={blog.id} blog={blog} onDelete={handleDelete} onToggle={handleTogglePublish} deletingId={deletingId} togglingId={togglingId} />)}
                </div>
              </div>
            )}
            {published.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Published ({published.length})</h2>
                <div className="space-y-2">
                  {published.map((blog) => <BlogRow key={blog.id} blog={blog} onDelete={handleDelete} onToggle={handleTogglePublish} deletingId={deletingId} togglingId={togglingId} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function BlogRow({ blog, onDelete, onToggle, deletingId, togglingId }: {
  blog: Blog;
  onDelete: (id: string) => void;
  onToggle: (blog: Blog) => void;
  deletingId: string | null;
  togglingId: string | null;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-neutral-100 hover:border-neutral-200 bg-white transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-medium text-neutral-900 truncate">{blog.title}</p>
          <span className={blog.isPublished ? 'tag-published' : 'tag-draft'}>
            {blog.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
        <p className="text-xs text-neutral-400">
          {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
          {blog._count ? ` · ♥ ${blog._count.likes} · 💬 ${blog._count.comments}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {blog.isPublished && (
          <Link href={`/blog/${blog.slug}`} target="_blank" className="btn-ghost text-sm">View ↗</Link>
        )}
        <button onClick={() => onToggle(blog)} disabled={togglingId === blog.id} className="btn-secondary text-sm">
          {togglingId === blog.id ? '…' : blog.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <Link href={`/dashboard/edit/${blog.id}`} className="btn-secondary text-sm">Edit</Link>
        <button onClick={() => onDelete(blog.id)} disabled={deletingId === blog.id} className="btn-danger text-sm">
          {deletingId === blog.id ? '…' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
