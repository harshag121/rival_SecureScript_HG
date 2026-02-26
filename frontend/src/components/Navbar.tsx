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

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={clsx(
        'text-sm font-medium transition-colors duration-150',
        pathname === href
          ? 'text-neutral-900'
          : 'text-neutral-500 hover:text-neutral-900',
      )}
    >
      {label}
    </Link>
  );

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-neutral-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-neutral-900 hover:text-neutral-600 transition-colors"
        >
          SecureBlog
        </Link>

        {/* Center nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {navLink('/feed', 'Explore')}
          {isAuthenticated && navLink('/dashboard', 'Dashboard')}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-neutral-100 animate-pulse" />
          ) : isAuthenticated ? (
            <>
              <Link href="/dashboard/new" className="btn-primary text-xs px-4 py-2">
                Write
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none">
                  <div
                    className="avatar w-9 h-9 text-sm"
                    style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}
                  >
                    {initials}
                  </div>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    Dashboard
                  </Link>
                  <Link href="/dashboard/new" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    New Story
                  </Link>
                  <Link href="/admin/logs" className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Live Logs
                  </Link>
                  <div className="border-t border-neutral-100 mt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">
                Sign in
              </Link>
              <Link href="/register" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
