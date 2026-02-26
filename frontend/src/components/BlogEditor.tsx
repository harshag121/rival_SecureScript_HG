'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { blogApi, Blog, CreateBlogData, UpdateBlogData } from '@/lib/blog-api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface BlogEditorProps {
  initialData?: Blog;
  mode: 'create' | 'edit';
}

export function BlogEditor({ initialData, mode }: BlogEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished || false,
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (content.trim().length < 10) {
      toast.error('Content must be at least 10 characters');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'create') {
        const data: CreateBlogData = {
          title: title.trim(),
          content: content.trim(),
          isPublished,
          summary: summary.trim() || undefined,
        };
        await blogApi.create(data);
        toast.success('Blog created!');
      } else {
        const data: UpdateBlogData = {
          title: title.trim(),
          content: content.trim(),
          isPublished,
          summary: summary.trim() || undefined,
        };
        await blogApi.update(initialData!.id, data);
        toast.success('Blog updated!');
      }
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || `Failed to ${mode === 'create' ? 'create' : 'update'} blog`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <input
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-title"
          placeholder="Title"
        />
        <p className="mt-1 text-xs text-neutral-400">{title.length}/200</p>
      </div>

      {/* Summary */}
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-neutral-700 mb-1">
          Summary{' '}
          <span className="text-neutral-400 font-normal">(optional — auto-generated if blank)</span>
        </label>
        <textarea
          id="summary"
          maxLength={500}
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="input-field resize-none"
          placeholder="A short hook for your story…"
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-1">
          Content *
        </label>
        <textarea
          id="content"
          required
          rows={18}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input-field resize-y font-serif text-base leading-relaxed"
          placeholder="Tell your story…"
        />
        <p className="mt-1 text-xs text-neutral-400">
          {content.split(/\s+/).filter(Boolean).length} words
          {' · '}
          ~{Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 200))} min read
        </p>
      </div>

      {/* Publish toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
        <div className="relative">
          <input
            id="published"
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-10 h-6 rounded-full transition-colors ${isPublished ? 'bg-green-500' : 'bg-neutral-200'}`} />
          <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isPublished ? 'translate-x-4' : ''}`} />
        </div>
        <span className="text-sm font-medium text-neutral-700">
          {isPublished ? 'Publish immediately' : 'Save as draft'}
        </span>
      </label>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isLoading} className="btn-primary flex items-center gap-2">
          {isLoading ? (
            <><LoadingSpinner size="sm" />{mode === 'create' ? 'Creating…' : 'Saving…'}</>
          ) : mode === 'create' ? 'Publish Story' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.push('/dashboard')} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
