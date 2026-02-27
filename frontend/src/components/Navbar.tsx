'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/contexts/auth-context';
import { Brand } from '@/components/ui/Brand';

export function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Brand compact />

        <nav className="hidden items-center gap-1 sm:flex">
          <Link href="/feed" className={clsx('nav-pill', isActive('/feed') && 'nav-pill-active')}>
            Feed
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className={clsx('nav-pill', isActive('/dashboard') && 'nav-pill-active')}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full skeleton" />
          ) : isAuthenticated ? (
            <>
              <Link href="/dashboard/new" className="hidden sm:inline-flex btn-primary text-xs px-4 py-2 rounded-full">
                Write
              </Link>

              <div className="relative group">
                <button
                  className="flex items-center rounded-full p-1 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Open user menu"
                >
                  <div className="avatar h-8 w-8 text-xs font-semibold">{initials}</div>
                </button>

                <div className="invisible absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-border bg-white py-1.5 opacity-0 shadow-modal transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  <div className="mb-1 border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-semibold text-ink">{user?.name || 'User'}</p>
                    <p className="mt-0.5 truncate text-xs text-ink-muted">{user?.email}</p>
                  </div>

                  <Link href="/dashboard" className="menu-link">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/new" className="menu-link">
                    New Story
                  </Link>
                  <Link href="/admin/logs" className="menu-link">
                    Live Logs
                  </Link>

                  <div className="mt-1 border-t border-border pt-1">
                    <button onClick={handleLogout} className="menu-link w-full text-left text-red-600 hover:bg-red-50">
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost rounded-full px-4 py-2 text-sm">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary rounded-full px-4 py-2 text-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
