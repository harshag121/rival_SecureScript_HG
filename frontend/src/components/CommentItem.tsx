import { formatDistanceToNow } from 'date-fns';
import { Comment } from '@/lib/blog-api';

interface CommentItemProps { comment: Comment; }

export function CommentItem({ comment }: CommentItemProps) {
  const letter = (comment.user.name || comment.user.email).charAt(0).toUpperCase();
  return (
    <div className="flex gap-4 py-5 border-b border-neutral-100 last:border-0">
      <div
        className="avatar w-9 h-9 text-sm flex-shrink-0 mt-0.5"
        style={{ background: 'linear-gradient(135deg,#43e97b,#38f9d7)' }}
      >
        {letter}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-neutral-900">
            {comment.user.name || comment.user.email}
          </span>
          <span className="text-xs text-neutral-400">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-neutral-700 text-sm leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}
