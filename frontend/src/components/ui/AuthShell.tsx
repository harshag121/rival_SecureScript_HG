import Link from 'next/link';
import { Brand } from './Brand';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  altHref: string;
  altLabel: string;
  altCta: string;
}

export function AuthShell({
  title,
  subtitle,
  children,
  altHref,
  altLabel,
  altCta,
}: AuthShellProps) {
  return (
    <div className="auth-shell">
      <div className="auth-glow" />
      <div className="auth-grid" />

      <div className="relative z-10 w-full max-w-[420px]">
        <Brand compact className="mb-8" />

        <div className="auth-card">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-ink tracking-tight mb-1">{title}</h1>
            <p className="text-sm text-ink-secondary">{subtitle}</p>
          </div>

          {children}

          <p className="mt-6 text-sm text-ink-secondary text-center">
            {altLabel}{' '}
            <Link href={altHref} className="text-accent font-semibold hover:opacity-80 transition-opacity">
              {altCta}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
