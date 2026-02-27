'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { BlogEditor } from '@/components/BlogEditor';
import { blogApi, Blog } from '@/lib/blog-api';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-ink-muted mb-8">
            <Link href="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-ink font-medium truncate max-w-[240px]">
              {blog?.title || 'Edit Story'}
            </span>
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
            <div className="text-center py-16">
              <p className="text-ink-secondary mb-4">Story not found.</p>
              <Link href="/dashboard" className="btn-secondary">Back to Dashboard</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


