'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  Search, 
  Coins, 
  Sparkles,
  HelpCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

interface CreateClientProps {
  initialBalance: number;
}

export default function CreateClient({ initialBalance }: CreateClientProps) {
  const router = useRouter();
  
  // Stage state: 'config' or 'review'
  const [stage, setStage] = useState<'config' | 'review'>('config');

  // Form fields
  const [country, setCountry] = useState('Sverige');
  const [region, setRegion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [maxResults, setMaxResults] = useState(100);
  const [language, setLanguage] = useState('English');

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cost estimates: 1 credit per lead
  const estimatedCredits = maxResults;
  
  // Dynamic time estimate
  const getEstimatedTime = () => {
    if (maxResults <= 100) return '1-2 min';
    if (maxResults <= 500) return '2-4 min';
    return '3-5 min';
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!region || !searchTerm) {
      setError('Vänligen fyll i både region/stad och sökord.');
      return;
    }

    if (maxResults < 10 || maxResults > 1000) {
      setError('Max antal leads måste vara mellan 10 och 1000.');
      return;
    }

    setError(null);
    setStage('review');
  };

  const handlePayWithCredits = async () => {
    if (initialBalance < estimatedCredits) {
      setError(`Otillräckliga credits. Du behöver ${estimatedCredits} credits, men ditt saldo är ${initialBalance}.`);
      setStage('config');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scraperId: 'google-maps',
          input: {
            country,
            region: region.trim(),
            searchTerm: searchTerm.trim(),
            maxResults: Number(maxResults),
            language,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Det gick inte att starta jobbet. Kontrollera dina credits.');
        setLoading(false);
        setStage('config');
      } else {
        router.push(`/dashboard/jobs/${data.jobId}`);
      }
    } catch (err) {
      setError('Kunde inte kommunicera med servern. Kontrollera din anslutning.');
      setLoading(false);
      setStage('config');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4">
      {/* Configuration Stage */}
      {stage === 'config' && (
        <div className="space-y-6">
          {/* Header with Google Maps G icon */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Google Maps Leads
              </h1>
              <p className="text-slate-500 text-sm">
                Extract businesses from Google Maps with contact details.
              </p>
            </div>
            {/* Google Maps Styled Icon Pin Box */}
            <div className="h-16 w-16 bg-white border border-[#E2E8F0] rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <svg viewBox="0 0 24 24" className="h-9 w-9">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#4285F4"/>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 1.9 1.05 4.3 2.72 7.02l4.28 5.48 4.28-5.48C17.95 13.3 19 10.9 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#34A853" opacity="0.3"/>
              </svg>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex gap-2.5 items-center">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleContinueToPayment} className="space-y-5">
            {/* Search term */}
            <div className="space-y-1.5">
              <label htmlFor="searchTerm" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Search term
              </label>
              <div className="relative">
                <input
                  id="searchTerm"
                  type="text"
                  required
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Coffee shops, restaurants, dentists"
                  className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] transition-all shadow-sm"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label htmlFor="region" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Location
              </label>
              <div className="relative">
                <input
                  id="region"
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Stockholm, Sweden"
                  className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] transition-all shadow-sm"
                />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            {/* Max results & Language split */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="maxResults" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Max results
                </label>
                <select
                  id="maxResults"
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#4F46E5] transition-all shadow-sm"
                >
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="250">250</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="language" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#4F46E5] transition-all shadow-sm"
                >
                  <option value="English">English</option>
                  <option value="Swedish">Swedish</option>
                  <option value="German">German</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>
            </div>

            {/* Mini stats boxes */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-[#F1F5F9] bg-[#F8F9FA] space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated credits</div>
                <div className="text-sm font-extrabold text-slate-900">{estimatedCredits} credits</div>
              </div>
              
              <div className="p-4 rounded-xl border border-[#F1F5F9] bg-[#F8F9FA] space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated time</div>
                <div className="text-sm font-extrabold text-slate-900">{getEstimatedTime()}</div>
              </div>
            </div>

            {/* Continue button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-md shadow-[#4F46E5]/15 active:scale-[0.99] transition-all"
              >
                Continue to payment
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review & Pay Stage */}
      {stage === 'review' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setStage('config')}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Review & pay
            </h1>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex gap-2.5 items-center">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Details Card */}
          <div className="p-6 rounded-2xl border border-[#F1F5F9] bg-white shadow-sm space-y-5">
            {/* Header info */}
            <div className="flex items-center gap-3 pb-5 border-b border-[#F1F5F9]">
              {/* Logo icon */}
              <div className="h-12 w-12 bg-slate-50 border border-[#E2E8F0] rounded-xl flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#4285F4"/>
                </svg>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900">Google Maps Leads</h3>
                <p className="text-xs text-slate-400 font-semibold">{searchTerm} in {region}</p>
              </div>
              <div className="ml-auto text-sm font-extrabold text-slate-900">
                {estimatedCredits} credits
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-3.5 pb-5 border-b border-[#F1F5F9] text-xs font-bold text-slate-500">
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-slate-900 font-extrabold">{estimatedCredits} credits</span>
              </div>
              <div className="flex justify-between">
                <span>Your balance</span>
                <span className={initialBalance >= estimatedCredits ? 'text-emerald-500 font-extrabold' : 'text-rose-500 font-extrabold'}>
                  {initialBalance} credits
                </span>
              </div>
            </div>

            {/* Payment buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handlePayWithCredits}
                disabled={loading || initialBalance < estimatedCredits}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-md shadow-[#4F46E5]/15 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay with credits
                  </>
                )}
              </button>

              <div className="flex items-center justify-center my-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white px-3 relative z-10">or</span>
                <div className="w-full h-px bg-[#F1F5F9] absolute"></div>
              </div>

              <Link
                href="/dashboard/billing"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 active:scale-[0.99] transition-all"
              >
                <CreditCard className="h-4 w-4 text-slate-500" />
                Pay with card
              </Link>
            </div>

            {/* Security stamp */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">
              <ShieldCheck className="h-4.5 w-4.5 text-slate-400" />
              Secure payment
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
