'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { likeApi } from '@/lib/blog-api';
import { useAuth } from '@/contexts/auth-context';
import clsx from 'clsx';

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
      toast.error('Please login to like posts');
      router.push('/login');
      return;
    }
    const newLiked = !liked;
    setLiked(newLiked);
    setCount(newLiked ? count + 1 : count - 1);
    setIsPending(true);
    try {
      const res = newLiked ? await likeApi.like(blogId) : await likeApi.unlike(blogId);
      setLiked(res.liked);
      setCount(res.likeCount);
    } catch (error: any) {
      setLiked(liked);
      setCount(count);
      toast.error(error.response?.data?.message || 'Failed to update like');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={clsx(
        'flex items-center gap-2 px-5 py-2.5 rounded-full border-2 font-medium text-sm transition-all duration-150',
        liked
          ? 'bg-red-50 border-red-400 text-red-600'
          : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900',
        'disabled:opacity-40 disabled:cursor-not-allowed active:scale-95',
      )}
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      <svg
        className="w-4 h-4"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
}
