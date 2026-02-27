import Link from 'next/link';
import { Brand } from '@/components/ui/Brand';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-white/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-8 sm:flex-row sm:px-6">
        <Brand compact />

        <nav className="flex items-center gap-6">
          <Link href="/feed" className="footer-link">
            Feed
          </Link>
          <Link href="/login" className="footer-link">
            Sign in
          </Link>
          <Link href="/register" className="footer-link">
            Register
          </Link>
        </nav>

        <p className="text-xs text-ink-muted">
          © {new Date().getFullYear()} SecureBlog
        </p>
      </div>
    </footer>
  );
}
