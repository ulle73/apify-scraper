'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError('Vänligen fyll i alla obligatoriska fält (Namn, E-post, Lösenord).');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          fullName,
          companyName: companyName || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Något gick fel vid registreringen.');
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        // Automatically redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/login?signup_success=true');
        }, 2000);
      }
    } catch (err) {
      setError('Kunde inte kontakta servern. Försök igen.');
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
          Skapa ett konto gratis
        </h2>
        <p className="mt-2 text-center text-sm text-navy-400">
          Redan medlem?{' '}
          <Link href="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
            Logga in här
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-navy-900/60 backdrop-blur-md py-8 px-4 border border-navy-800 shadow-xl rounded-2xl sm:px-10">
          
          {success ? (
            <div className="py-6 text-center space-y-4">
              <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-2">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Kontot skapat!</h3>
              <p className="text-sm text-navy-300">
                Registreringen lyckades. Vi omdirigerar dig till inloggningssidan...
              </p>
              <div className="flex justify-center pt-2">
                <Loader2 className="h-5 w-5 animate-spin text-brand-405 text-brand-400" />
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-2 items-center">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-navy-200 mb-1">
                  Fullständigt namn *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="t.ex. Johan Andersson"
                  className="w-full px-4 py-2.5 bg-navy-950 border border-navy-850 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-navy-200 mb-1">
                  E-postadress *
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
                  className="w-full px-4 py-2.5 bg-navy-950 border border-navy-850 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition"
                />
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-navy-200 mb-1">
                  Företagsnamn (valfritt)
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="t.ex. Företaget AB"
                  className="w-full px-4 py-2.5 bg-navy-950 border border-navy-850 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-navy-200 mb-1">
                  Lösenord *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minst 6 tecken"
                  className="w-full px-4 py-2.5 bg-navy-950 border border-navy-850 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:from-brand-400 hover:to-brand-600 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Skapar konto...
                    </>
                  ) : (
                    'Registrera konto'
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-navy-500 mt-4 leading-relaxed">
                Genom att registrera dig godkänner du våra{' '}
                <Link href="/terms" className="underline hover:text-navy-300">Användarvillkor</Link> och{' '}
                <Link href="/privacy" className="underline hover:text-navy-300">Integritetspolicy</Link>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
