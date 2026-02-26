'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/auth-context';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name || undefined);
      toast.success('Account created! Welcome!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Registration failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-amber-50 flex-col justify-center px-16">
        <Link href="/" className="text-2xl font-bold text-neutral-900 mb-12" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
          SecureBlog
        </Link>
        <h2 className="text-4xl font-bold text-neutral-900 mb-4 leading-tight" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
          Join a community<br />of storytellers.
        </h2>
        <p className="text-neutral-500 text-lg">It&apos;s free. Always.</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-sm w-full mx-auto">
          <Link href="/" className="lg:hidden text-xl font-bold text-neutral-900 mb-8 block" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
            SecureBlog
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Create your account.</h1>
          <p className="text-sm text-neutral-400 mb-8">Start writing and sharing your ideas.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                Name <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input id="name" type="text" autoComplete="name" value={name}
                onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Jane Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input id="email" type="email" required autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Password <span className="text-neutral-400 font-normal">(min 8 chars)</span>
              </label>
              <input id="password" type="password" required minLength={8} autoComplete="new-password" value={password}
                onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {isLoading ? <><LoadingSpinner size="sm" />Creating…</> : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-neutral-500 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
