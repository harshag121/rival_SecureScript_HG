import Link from 'next/link';
import clsx from 'clsx';

interface BrandProps {
  compact?: boolean;
  href?: string;
  className?: string;
}

export function Brand({ compact = false, href = '/', className }: BrandProps) {
  const logo = (
    <>
      <span className={clsx('brand-mark', compact ? 'h-8 w-8' : 'h-9 w-9')}>
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-white">
          <path d="M4 3h12v2H4V3zm0 4h12v2H4V7zm0 4h8v2H4v-2z" />
        </svg>
      </span>
      <span className="brand-wordmark">SecureBlog</span>
    </>
  );

  return (
    <Link href={href} className={clsx('inline-flex items-center gap-2.5', className)}>
      {logo}
    </Link>
  );
}
