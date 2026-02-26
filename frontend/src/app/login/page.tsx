'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/auth-context';
import { LoadingSpinner } from '@/components/LoadingSpinner';

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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-amber-50 flex-col justify-center px-16">
        <Link href="/" className="text-2xl font-bold text-neutral-900 mb-10" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
          SecureBlog
        </Link>
        <h2 className="text-4xl font-bold text-neutral-900 mb-4 leading-tight" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
          Every idea deserves
          <br />an audience.
        </h2>
        <p className="text-neutral-500 text-lg">Start writing. Start reading.</p>
      </div>

      {/* Right auth form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-sm w-full mx-auto">
          <Link href="/" className="lg:hidden text-xl font-bold text-neutral-900 mb-8 block" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
            SecureBlog
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Welcome back.</h1>
          <p className="text-sm text-neutral-400 mb-8">Sign in to continue reading and writing.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
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
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
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
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? <><LoadingSpinner size="sm" />Signing in…</> : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-neutral-500 text-center">
            New here?{' '}
            <Link href="/register" className="text-amber-600 hover:text-amber-700 font-medium">
              Create an account
            </Link>
          </p>
          <p className="mt-3 text-xs text-neutral-400 text-center">
            Demo: <span className="font-mono">demo@secureblog.dev</span> / <span className="font-mono">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
