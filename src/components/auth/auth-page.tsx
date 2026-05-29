'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Layers, 
  AlertCircle, 
  Loader2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  HelpCircle,
  ShieldCheck,
  Star,
  User,
  Building2
} from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

function AuthForm({ mode }: AuthPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signupSuccess = searchParams.get('signup_success') === 'true';

  // Shared state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Login specific state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup specific state
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCompanyName, setSignupCompanyName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupSuccessState, setSignupSuccessState] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Vänligen fyll i alla fält.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email: loginEmail.toLowerCase().trim(),
        password: loginPassword,
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

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !signupFullName) {
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
          email: signupEmail.toLowerCase().trim(),
          password: signupPassword,
          fullName: signupFullName,
          companyName: signupCompanyName || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Något gick fel vid registreringen.');
        setLoading(false);
      } else {
        setSignupSuccessState(true);
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
    <div className="relative h-screen flex flex-col bg-white overflow-hidden font-sans">
      
      {/* Full-bleed diagonal background split (Desktop) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex">
        {/* Left side is white */}
        <div className="w-full lg:w-[42vw] bg-white h-full" />
        {/* Right side is the slanted container filled 100% with hero-login.png */}
        <div 
          className="hidden lg:block relative flex-grow h-full overflow-hidden"
          style={{ 
            clipPath: 'polygon(10vw 0, 100% 0, 100% 100%, 0 100%)'
          }}
        >
          <Image
            src="/hero-login.png"
            alt="Leadify background"
            fill
            priority
            className="object-cover pointer-events-none select-none z-0"
            style={{ 
              objectPosition: '80% center' // Shifts motif leftwards without increasing scale!
            }}
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-white z-0 pointer-events-none lg:hidden block" />

      {/* Navigation Header */}
      <header className="relative z-10 w-full bg-white px-6 sm:px-12 lg:px-16 py-5 flex items-center justify-between">
        {/* Brand/Logo - Leadify style */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative text-blue-600 group-hover:scale-105 transition-transform duration-200">
            <svg className="h-6.5 w-6.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgba(91, 139, 245, 0.15)" />
              <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">
            Leadify
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link href="/#popular-scrapers" className="text-slate-600 hover:text-slate-900 transition-colors">
            Scrapers
          </Link>
          <Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors">
            Priser
          </Link>
          <Link href="/#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">
            Så fungerar det
          </Link>
        </nav>

        {/* Support & CTA */}
        <div className="flex items-center gap-5">
          <Link 
            href="mailto:support@leadify.se" 
            className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-semibold flex items-center gap-1.5"
          >
            <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
            <span>Support</span>
          </Link>
          {mode === 'login' ? (
            <Link 
              href="/signup" 
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50 text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Skapa konto</span>
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50 text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Logga in</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 px-6 sm:px-12 lg:px-16 py-8 items-center gap-12 lg:gap-8">
        
        {/* Left Side: Dynamic Form Area */}
        <div className="lg:col-span-5 flex flex-col justify-center w-full max-w-md ml-40">
          
          {/* Form Content Switch */}
          {mode === 'login' ? (
            /* ==================== LOGIN FORM ==================== */
            <>
              {/* Heading */}
              <h1 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-3">
                Välkommen tillbaka
              </h1>
              <p className="text-center text-slate-500 text-sm mb-8">
                Har du inget konto?{' '}
                <Link href="/signup" className="font-bold text-blue-600 hover:underline transition-colors">
                  Skapa ett konto gratis
                </Link>
              </p>

              {/* Success message from signup */}
              {signupSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex gap-3 items-start mb-6">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Registreringen klar!</span>
                    Kontot har skapats. Vänligen logga in med dina uppgifter nedan.
                  </div>
                </div>
              )}

              {/* Form */}
              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm flex gap-2 items-center">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    E-postadress <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="namn@foretag.se"
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                      Lösenord <span className="text-rose-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full pl-11 pr-11 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loggar in...
                      </>
                    ) : (
                      <>
                        <span>Logga in</span>
                        <ArrowRight className="h-4.5 w-4.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-5 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <span className="relative bg-white px-3 text-xs font-semibold text-slate-400 tracking-wider">
                    eller fortsätt med
                  </span>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => {
                    alert('Inloggning med Google är för närvarande under underhåll. Vänligen logga in med din e-postadress och lösenord.');
                  }}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Fortsätt med Google</span>
                </button>
              </form>

              {/* Legal Notice */}
              <p className="text-center text-[11px] text-slate-400 mt-6 leading-relaxed">
                Genom att logga in godkänner du våra{' '}
                <Link href="/terms" className="text-blue-600 underline font-semibold">Användarvillkor</Link> och{' '}
                <Link href="/privacy" className="text-blue-600 underline font-semibold">Integritetspolicy</Link>.
              </p>
            </>
          ) : (
            /* ==================== SIGNUP FORM ==================== */
            <>
              {/* Heading */}
              <h1 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-3">
                Skapa ett konto gratis
              </h1>
              <p className="text-center text-slate-500 text-sm mb-8">
                Redan medlem?{' '}
                <Link href="/login" className="font-bold text-blue-600 hover:underline transition-colors">
                  Logga in här
                </Link>
              </p>

              {/* Success Card */}
              {signupSuccessState ? (
                <div className="py-8 text-center space-y-4 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <div className="inline-flex p-3.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200 mb-2">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Kontot skapat!</h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Registreringen lyckades. Vi omdirigerar dig till inloggningssidan...
                  </p>
                  <div className="flex justify-center pt-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  </div>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSignupSubmit}>
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm flex gap-2 items-center">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Full Name Field */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Fullständigt namn <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={signupFullName}
                        onChange={(e) => setSignupFullName(e.target.value)}
                        placeholder="t.ex. Johan Andersson"
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      E-postadress <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="namn@foretag.se"
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Company Name Field */}
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Företagsnamn (valfritt)
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={signupCompanyName}
                        onChange={(e) => setSignupCompanyName(e.target.value)}
                        placeholder="t.ex. Företaget AB"
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Lösenord <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="w-full pl-11 pr-11 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Skapar konto...
                        </>
                      ) : (
                        <>
                          <span>Registrera konto</span>
                          <ArrowRight className="h-4.5 w-4.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative my-5 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100" />
                    </div>
                    <span className="relative bg-white px-3 text-xs font-semibold text-slate-400 tracking-wider">
                      eller fortsätt med
                    </span>
                  </div>

                  {/* Google Button */}
                  <button
                    type="button"
                    onClick={() => {
                      alert('Registrering med Google är för närvarande under underhåll. Vänligen fyll i formuläret för att skapa ett konto.');
                    }}
                    className="w-full flex items-center justify-center gap-3 px-5 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Fortsätt med Google</span>
                  </button>
                </form>
              )}

              {/* Legal Notice */}
              <p className="text-center text-[11px] text-slate-400 mt-6 leading-relaxed">
                Genom att registrera dig godkänner du våra{' '}
                <Link href="/terms" className="text-blue-600 underline font-semibold">Användarvillkor</Link> och{' '}
                <Link href="/privacy" className="text-blue-600 underline font-semibold">Integritetspolicy</Link>.
              </p>
            </>
          )}
        </div>

        {/* Right Side: Marketing Column */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-start pt-10 pl-8 xl:pl-20 w-full max-w-2xl ml-auto h-full self-start">
          <div className="w-full">
            {/* <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-5">
              Hitta leads. Spara tid.<br />
              Väx smartare.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed mb-10 max-w-lg">
              Leadify hjälper dig automatisera datainsamling och fokusera på det som faktiskt driver resultat.
            </p> */}
          </div>
        </div>
      </main>

      {/* Specialized Clean Footer */}
      <footer className="relative z-10 w-full bg-white px-6 sm:px-12 lg:px-16 py-6 border-t border-slate-100 mt-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Security Check Badge */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-900">Säker och GDPR-kompatibel</p>
            <p className="text-[10px] text-slate-500 leading-tight">Dina uppgifter är alltid skyddade.</p>
          </div>
        </div>

        {/* Center: Star Rating */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-0.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
            ))}
          </div>
          <p className="text-xs font-bold text-slate-900 leading-none mb-0.5">4.8 av 5 i betyg</p>
          <p className="text-[10px] text-slate-500">Baserat på 500+ omdömen</p>
        </div>

        {/* Right: Legal & Copyright Links */}
        <div className="flex flex-col items-center md:items-end gap-1.5">
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Integritetspolicy</Link>
            <span className="text-slate-200">|</span>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Användarvillkor</Link>
            <span className="text-slate-200">|</span>
            <Link href="mailto:kontakt@leadify.se" className="hover:text-slate-900 transition-colors">Kontakt</Link>
          </div>
          <p className="text-[10px] text-slate-400">© 2024 Leadify AB</p>
        </div>
      </footer>
    </div>
  );
}

export default function AuthPage({ mode }: AuthPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <AuthForm mode={mode} />
    </Suspense>
  );
}
