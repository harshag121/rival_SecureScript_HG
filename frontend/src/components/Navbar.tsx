'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import clsx from 'clsx';

export function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-ink flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2h12v2H2V2zm0 4h8v2H2V6zm0 4h10v2H2v-2z" />
            </svg>
          </div>
          <span className="text-[0.9375rem] font-semibold text-ink tracking-tight">SecureBlog</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/feed"
            className={clsx(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              isActive('/feed') ? 'bg-neutral-100 text-ink' : 'text-ink-secondary hover:text-ink hover:bg-neutral-50',
            )}
          >
            Feed
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                isActive('/dashboard') ? 'bg-neutral-100 text-ink' : 'text-ink-secondary hover:text-ink hover:bg-neutral-50',
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full skeleton" />
          ) : isAuthenticated ? (
            <>
              <Link
                href="/dashboard/new"
                className="hidden sm:inline-flex btn-primary text-xs px-4 py-2 rounded-full gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Write
              </Link>

              {/* Avatar dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  aria-label="Open user menu"
                >
                  <div className="avatar w-8 h-8 text-xs font-semibold">{initials}</div>
                </button>

                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-modal border border-border py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-border mb-1">
                    <p className="text-sm font-semibold text-ink truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-ink-muted truncate mt-0.5">{user?.email}</p>
                  </div>

                  {[
                    { href: '/dashboard', icon: 'M4 6h16M4 12h8m-8 6h16', label: 'Dashboard' },
                    { href: '/dashboard/new', icon: 'M12 4v16m8-8H4', label: 'New Story' },
                    { href: '/admin/logs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Live Logs' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-secondary hover:text-ink hover:bg-neutral-50 transition-colors"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={item.icon} />
                      </svg>
                      {item.label}
                    </Link>
                  ))}

                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-2xl"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm rounded-full px-4 py-2">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary text-sm rounded-full px-4 py-2">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

