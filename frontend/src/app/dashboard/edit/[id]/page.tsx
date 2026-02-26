'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { Navbar } from '@/components/Navbar';
import { BlogEditor } from '@/components/BlogEditor';
import { PageLoader } from '@/components/LoadingSpinner';
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
      .catch(() => toast.error('Blog not found'))
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
            Edit Story
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Make your story better.</p>
        </div>
        {isLoading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="animate-pulse h-12 bg-neutral-100 rounded-xl" />)}</div>
        ) : blog ? (
          <BlogEditor mode="edit" initialData={blog} />
        ) : (
          <p className="text-red-500 text-center py-8">Story not found</p>
        )}
      </main>
    </>
  );
}
