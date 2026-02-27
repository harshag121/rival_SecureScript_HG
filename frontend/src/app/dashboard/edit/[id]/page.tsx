'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { BlogEditor } from '@/components/BlogEditor';
import { PageShell } from '@/components/layout/PageShell';
import { blogApi, Blog } from '@/lib/blog-api';

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    blogApi
      .getOne(id)
      .then(setBlog)
      .catch(() => toast.error('Story not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <PageShell className="bg-surface" showFooter={false}>
      <div className="mx-auto max-w-[760px] px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center gap-2 text-sm text-ink-muted">
          <Link href="/dashboard" className="transition-colors hover:text-ink">
            Dashboard
          </Link>
          <span>›</span>
          <span className="max-w-[240px] truncate font-medium text-ink">{blog?.title || 'Edit Story'}</span>
        </div>

        {isLoading ? (
          <div className="space-y-5">
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-24 w-full rounded-xl" />
            <div className="skeleton h-80 w-full rounded-xl" />
          </div>
        ) : blog ? (
          <BlogEditor mode="edit" initialData={blog} />
        ) : (
          <div className="py-16 text-center">
            <p className="mb-4 text-ink-secondary">Story not found.</p>
            <Link href="/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </PageShell>
  );
}
