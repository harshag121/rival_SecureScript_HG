'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { commentApi, Comment } from '@/lib/blog-api';
import { useAuth } from '@/contexts/auth-context';
import { CommentItem } from './CommentItem';
import Link from 'next/link';

interface CommentSectionProps {
  blogId: string;
}

export function CommentSection({ blogId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const fetchComments = async (pageNum: number, append = false) => {
    try {
      const res = await commentApi.getAll(blogId, pageNum);
      setComments((prev) => (append ? [...prev, ...res.data] : res.data));
      setTotal(res.meta.total);
      setHasMore(res.meta.hasNextPage);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to comment');
      router.push('/login');
      return;
    }

    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment = await commentApi.create(blogId, content.trim());
      setComments((prev) => [newComment, ...prev]);
      setTotal((prev) => prev + 1);
      setContent('');
      toast.success('Comment posted!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage, true);
  };

  return (
    <section className="mt-12">
      <h3 className="text-lg font-bold text-neutral-900 mb-6"
        style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
        Responses ({total})
      </h3>

      {/* Comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What are your thoughts?"
            disabled={isSubmitting}
            rows={4}
            maxLength={1000}
            className="input-field resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-neutral-400">{content.length}/1000</span>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="btn-primary text-sm"
            >
              {isSubmitting ? 'Posting…' : 'Respond'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-5 rounded-2xl border border-neutral-200 bg-neutral-50 text-center">
          <p className="text-sm text-neutral-500 mb-3">Sign in to leave a response</p>
          <a href="/login" className="btn-primary text-sm">Sign in</a>
        </div>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3 py-4">
              <div className="w-9 h-9 bg-neutral-200 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-2.5 bg-neutral-200 rounded w-1/4" />
                <div className="h-2.5 bg-neutral-200 rounded w-5/6" />
                <div className="h-2.5 bg-neutral-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-neutral-400 text-sm text-center py-10">
          No responses yet. Be the first.
        </p>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}

          {hasMore && (
            <button onClick={loadMore} className="mt-6 w-full btn-secondary text-sm">
              Load more responses
            </button>
          )}
        </div>
      )}
    </section>
  );
}
