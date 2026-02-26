import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export function LoadingSpinner({ size = 'md', className, color }: LoadingSpinnerProps) {
  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-2',
        color || 'border-neutral-200 border-t-neutral-900',
        { 'w-4 h-4': size === 'sm', 'w-7 h-7': size === 'md', 'w-12 h-12': size === 'lg' },
        className,
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-neutral-400 text-sm">Loading…</p>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="article-card animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-neutral-100" />
        <div className="w-28 h-4 bg-neutral-100 rounded-full my-auto" />
      </div>
      <div className="h-6 bg-neutral-100 rounded-full w-3/4 mb-2" />
      <div className="h-4 bg-neutral-100 rounded-full w-full mb-1" />
      <div className="h-4 bg-neutral-100 rounded-full w-2/3" />
    </div>
  );
}
