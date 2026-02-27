import clsx from 'clsx';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={clsx('space-y-1', className)}>
      <h1 className="text-3xl font-bold text-ink tracking-tight">{title}</h1>
      {subtitle ? <p className="text-sm text-ink-secondary">{subtitle}</p> : null}
    </div>
  );
}
