import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-2 border-neutral-200 border-t-ink flex-shrink-0',
        { 'w-4 h-4 border-[1.5px]': size === 'sm', 'w-6 h-6': size === 'md', 'w-10 h-10 border-[3px]': size === 'lg' },
        className,
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-ink-muted text-sm animate-pulse">Loading…</p>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="py-8 border-b border-border/60">
      {/* Author row */}
      <div className="flex items-center gap-2 mb-4">
        <div className="skeleton w-7 h-7 rounded-full" />
        <div className="skeleton h-3.5 w-28 rounded-full" />
        <div className="skeleton h-3.5 w-16 rounded-full" />
      </div>
      {/* Title */}
      <div className="skeleton h-6 w-3/4 rounded-full mb-2" />
      <div className="skeleton h-6 w-1/2 rounded-full mb-4" />
      {/* Summary */}
      <div className="skeleton h-4 w-full rounded-full mb-2" />
      <div className="skeleton h-4 w-5/6 rounded-full mb-5" />
      {/* Meta */}
      <div className="flex gap-4">
        <div className="skeleton h-3 w-16 rounded-full" />
        <div className="skeleton h-3 w-10 rounded-full" />
        <div className="skeleton h-3 w-10 rounded-full" />
      </div>
    </div>
  );
}

export function DashboardRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-4 rounded-xl border border-border/50 animate-skeleton">
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-2/3 rounded-full" />
        <div className="skeleton h-3 w-1/3 rounded-full" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-8 w-16 rounded-full" />
        <div className="skeleton h-8 w-14 rounded-full" />
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="text-5xl mb-5 select-none" role="img" aria-hidden>{icon}</div>
      <h3 className="text-xl font-bold text-ink mb-2">{title}</h3>
      <p className="text-ink-secondary text-sm max-w-sm leading-relaxed mb-6">{description}</p>
      {action}
    </div>
  );
}

