'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/auth-context';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getErrorMessage } from '@/lib/error-message';

function PasswordStrength({ password }: { password: string }) {
  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3;

  const labels = ['', 'Weak', 'Fair', 'Strong'];
  const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-500'];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= strength ? colors[strength] : 'bg-neutral-100'}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${strength === 1 ? 'text-red-500' : strength === 2 ? 'text-amber-600' : 'text-emerald-600'}`}>
        {labels[strength]} password
      </p>
    </div>
  );
}

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
      toast.success('Account created! Welcome aboard 🎉');
      router.push('/dashboard');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Registration failed. Please try again.'));
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
          <h1 className="text-2xl font-bold text-ink tracking-tight mb-1">Create your account</h1>
          <p className="text-sm text-ink-secondary">Free forever. Start writing in seconds.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">
              Name{' '}
              <span className="text-ink-muted font-normal">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Jane Doe"
            />
          </div>

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
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Min. 8 characters"
            />
            <PasswordStrength password={password} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 rounded-xl text-[0.9375rem] mt-2"
          >
            {isLoading ? (
              <><LoadingSpinner size="sm" />Creating account…</>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-secondary text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-medium hover:text-indigo-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
