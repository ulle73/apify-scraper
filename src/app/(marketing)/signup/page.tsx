'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layers, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

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
          Skapa ett konto gratis
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Redan medlem?{' '}
          <Link href="/login" className="font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors">
            Logga in här
          </Link>
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-[#F1F5F9] shadow-sm rounded-2xl sm:px-10">
          
          {success ? (
            <div className="py-6 text-center space-y-4">
              <div className="inline-flex p-3 bg-[#ECFDF5] text-[#10B981] rounded-full border border-[#A7F3D0] mb-2">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Kontot skapat!</h3>
              <p className="text-sm text-slate-500">
                Registreringen lyckades. Vi omdirigerar dig till inloggningssidan...
              </p>
              <div className="flex justify-center pt-2">
                <Loader2 className="h-5 w-5 animate-spin text-[#4F46E5]" />
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm flex gap-2 items-center">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-1.5">
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
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-sm transition"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
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
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-sm transition"
                />
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Företagsnamn (valfritt)
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="t.ex. Företaget AB"
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-sm transition"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
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
                  className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-sm transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-md shadow-[#4F46E5]/15 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
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

              <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
                Genom att registrera dig godkänner du våra{' '}
                <Link href="/terms" className="underline hover:text-slate-600 text-slate-500">Användarvillkor</Link> och{' '}
                <Link href="/privacy" className="underline hover:text-slate-600 text-slate-500">Integritetspolicy</Link>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
