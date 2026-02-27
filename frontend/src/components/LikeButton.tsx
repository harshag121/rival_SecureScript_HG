'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { likeApi } from '@/lib/blog-api';
import { useAuth } from '@/contexts/auth-context';
import { getErrorMessage } from '@/lib/error-message';

interface LikeButtonProps {
  blogId: string;
  initialLiked: boolean;
  initialCount: number;
}

export function LikeButton({ blogId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Sign in to like this story');
      router.push('/login');
      return;
    }

    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount(nextLiked ? count + 1 : count - 1);
    setIsPending(true);

    try {
      const res = nextLiked ? await likeApi.like(blogId) : await likeApi.unlike(blogId);
      setLiked(res.liked);
      setCount(res.likeCount);
    } catch (error: unknown) {
      setLiked(liked);
      setCount(count);
      toast.error(getErrorMessage(error, 'Failed to update like'));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={clsx(
        'inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95 focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        liked
          ? 'border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100'
          : 'border-border bg-white text-ink-secondary hover:border-neutral-400 hover:text-ink',
      )}
      aria-label={liked ? `Unlike (${count})` : `Like (${count})`}
    >
      <svg className={clsx('h-4 w-4 transition-transform duration-150', liked && 'scale-110')} fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
}
