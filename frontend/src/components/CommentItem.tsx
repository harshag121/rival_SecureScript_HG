import { formatDistanceToNow } from 'date-fns';
import { Comment } from '@/lib/blog-api';

interface CommentItemProps { comment: Comment; }

const AVATAR_COLORS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #f77062, #fe5196)',
];

function hashColor(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export function CommentItem({ comment }: CommentItemProps) {
  const displayName = comment.user.name || comment.user.email;
  const letter = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex gap-3.5 py-5 border-b border-border last:border-0">
      <div
        className="avatar w-9 h-9 text-sm flex-shrink-0 mt-0.5"
        style={{ background: hashColor(displayName) }}
      >
        {letter}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-sm font-semibold text-ink">{displayName}</span>
          <span className="text-xs text-ink-muted">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-[0.9375rem] text-neutral-700 leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}
