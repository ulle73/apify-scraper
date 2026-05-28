'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vänligen fyll i alla fält.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Fel e-postadress eller lösenord.');
        setLoading(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Ett oväntat fel uppstod. Försök igen.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand-500/10 blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex justify-center items-center gap-2 group mb-6">
          <div className="p-2 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg text-navy-950 shadow-md">
            <Zap className="h-6 w-6 fill-current" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Super<span className="text-brand-400">Scraper</span>
          </span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
          Logga in på ditt konto
        </h2>
        <p className="mt-2 text-center text-sm text-navy-400">
          Eller{' '}
          <Link href="/signup" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
            skapa ett konto gratis
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-navy-900/60 backdrop-blur-md py-8 px-4 border border-navy-800 shadow-xl rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-2 items-center">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-navy-200 mb-1.5">
                E-postadress
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namn@foretag.se"
                className="w-full px-4 py-3 bg-navy-950 border border-navy-850 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-navy-200 mb-1.5">
                Lösenord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-navy-950 border border-navy-850 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:from-brand-400 hover:to-brand-600 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loggar in...
                  </>
                ) : (
                  'Logga in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
