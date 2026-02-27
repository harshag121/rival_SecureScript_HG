'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/auth-context';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AuthShell } from '@/components/ui/AuthShell';
import { getErrorMessage } from '@/lib/error-message';

function PasswordStrength({ password }: { password: string }) {
  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const labels = ['', 'Weak', 'Fair', 'Strong'];
  const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-500'];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="mb-1 flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= strength ? colors[strength] : 'bg-neutral-200'
            }`}
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
      toast.success('Account created! Welcome aboard.');
      router.push('/dashboard');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Registration failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start publishing in seconds with a clean and secure workflow."
      altHref="/login"
      altLabel="Already have an account?"
      altCta="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="form-label">
            Name <span className="font-normal text-ink-muted">(optional)</span>
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
          <label htmlFor="email" className="form-label">
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
          <label htmlFor="password" className="form-label">
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

        <button type="submit" disabled={isLoading} className="btn-primary w-full rounded-xl py-3 text-[0.9375rem] mt-2">
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>
    </AuthShell>
  );
}
