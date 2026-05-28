'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layers, AlertCircle, Loader2 } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
      {/* Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <Link href="/" className="flex justify-center items-center gap-2.5 group mb-8">
          <div className="p-2 bg-[#4F46E5] rounded-xl text-white shadow-md shadow-[#4F46E5]/20">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Leadify
          </span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Logga in på ditt konto
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Eller{' '}
          <Link href="/signup" className="font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors">
            skapa ett konto gratis
          </Link>
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-[#F1F5F9] shadow-sm rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm flex gap-2 items-center">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
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
                className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-sm transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
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
                className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-sm transition"
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-md shadow-[#4F46E5]/15 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
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
