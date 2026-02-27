'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { commentApi, Comment } from '@/lib/blog-api';
import { useAuth } from '@/contexts/auth-context';
import { CommentItem } from './CommentItem';
import { getErrorMessage } from '@/lib/error-message';

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

  const fetchComments = useCallback(async (pageNum: number, append = false) => {
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
  }, [blogId]);

  useEffect(() => { fetchComments(1); }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to comment');
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
      toast.success('Response posted!');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to post response'));
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
    <section>
      <h3 className="text-xl font-bold text-ink mb-6 tracking-tight">
        Responses
        {total > 0 && (
          <span className="ml-2 text-sm font-normal text-ink-muted">({total})</span>
        )}
      </h3>

      {/* Comment form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are your thoughts on this story?"
              disabled={isSubmitting}
              rows={4}
              maxLength={1000}
              className="input-field resize-none pr-4"
            />
          </div>
          <div className="flex justify-between items-center mt-2.5">
            <span className="text-xs text-ink-muted">{content.length}/1000</span>
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="btn-primary text-sm px-5 py-2"
            >
              {isSubmitting ? 'Posting…' : 'Post response'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-xl border border-border bg-surface p-5 text-center">
          <p className="text-sm text-ink-secondary mb-3">Sign in to leave a response</p>
          <Link href="/login" className="btn-primary text-sm px-5 py-2">
            Sign in
          </Link>
        </div>
      )}

      {/* Comments list */}
      {isLoading ? (
        <div className="space-y-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3.5 py-5 border-b border-border last:border-0">
              <div className="skeleton w-9 h-9 rounded-full" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="skeleton h-3 w-1/4 rounded-full" />
                <div className="skeleton h-3 w-5/6 rounded-full" />
                <div className="skeleton h-3 w-2/3 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-ink-muted text-sm text-center py-12">
          No responses yet. Share your thoughts!
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
