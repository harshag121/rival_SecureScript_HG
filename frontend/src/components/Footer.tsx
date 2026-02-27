import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-ink flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2h12v2H2V2zm0 4h8v2H2V6zm0 4h10v2H2v-2z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-ink">SecureBlog</span>
        </div>

        <nav className="flex items-center gap-6">
          {[
            { href: '/feed', label: 'Feed' },
            { href: '/login', label: 'Sign in' },
            { href: '/register', label: 'Register' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-ink-muted hover:text-ink transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-ink-muted">
          © {new Date().getFullYear()} SecureBlog. Built with Next.js & NestJS.
        </p>
      </div>
    </footer>
  );
}
