'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/auth-context';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getErrorMessage } from '@/lib/error-message';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Invalid email or password'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 2h12v2H2V2zm0 4h8v2H2V6zm0 4h10v2H2v-2z" />
          </svg>
        </div>
        <span className="text-lg font-semibold text-ink">SecureBlog</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-[400px] bg-white rounded-2xl border border-border shadow-modal p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-ink tracking-tight mb-1">Welcome back</h1>
          <p className="text-sm text-ink-secondary">Sign in to continue reading and writing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 rounded-xl text-[0.9375rem] mt-2"
          >
            {isLoading ? (
              <><LoadingSpinner size="sm" />Signing in…</>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-secondary text-center">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-accent font-medium hover:text-indigo-700 transition-colors">
            Create one
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-ink-muted text-center">
            Demo account:{' '}
            <span className="font-mono text-ink-secondary">demo@secureblog.dev</span>
            {' / '}
            <span className="font-mono text-ink-secondary">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
