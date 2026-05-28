'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Search, 
  Mail, 
  Camera, 
  FileText, 
  Coins, 
  Sparkles,
  HelpCircle,
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';

const AVAILABLE_SCRAPERS = [
  {
    id: 'google-maps',
    name: 'Google Maps Leadlista',
    description: 'Hitta lokala företag baserat på plats och bransch sökord.',
    category: 'leads',
    enabled: true,
    icon: MapPin,
    creditFormula: '1 lead = 1 credit',
  },
  {
    id: 'google-search',
    name: 'Google Sökresultat',
    description: 'Hämta organiska sökresultat från Google.',
    category: 'search',
    enabled: false,
    icon: Search,
  },
  {
    id: 'contact-details',
    name: 'Kontaktuppgifter från Hemsida',
    description: 'Extrahera e-post och telefonnummer från hemsidor.',
    category: 'leads',
    enabled: false,
    icon: Mail,
  },
  {
    id: 'instagram-profile',
    name: 'Instagram Profiler',
    description: 'Hämta profil- och kontaktinfo från Instagram.',
    category: 'social',
    enabled: false,
    icon: Camera,
  },
  {
    id: 'linkedin-company',
    name: 'LinkedIn Företag',
    description: 'Samla företagsstorlek och detaljer från LinkedIn.',
    category: 'leads',
    enabled: false,
    icon: FileText,
  }
];

export default function CreateJobPage() {
  const router = useRouter();
  const [selectedScraper, setSelectedScraper] = useState('google-maps');
  
  // Form fields
  const [country, setCountry] = useState('Sverige');
  const [region, setRegion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [maxResults, setMaxResults] = useState(100);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [estimatedCredits, setEstimatedCredits] = useState(100);

  // Update credits estimate when maxResults changes (1 credit per lead)
  useEffect(() => {
    setEstimatedCredits(maxResults);
  }, [maxResults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedScraper !== 'google-maps') return;

    if (!region || !searchTerm) {
      setError('Vänligen fyll i både region/stad och sökord.');
      return;
    }

    if (maxResults < 10 || maxResults > 1000) {
      setError('Max antal leads måste vara mellan 10 och 1000.');
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
          scraperId: selectedScraper,
          input: {
            country,
            region: region.trim(),
            searchTerm: searchTerm.trim(),
            maxResults: Number(maxResults),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Det gick inte att starta jobbet. Har du tillräckligt med credits?');
        setLoading(false);
      } else {
        // Redirect to the newly created job status page
        router.push(`/dashboard/jobs/${data.jobId}`);
      }
    } catch (err) {
      setError('Kunde inte kommunicera med servern. Kontrollera din anslutning.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Skapa leadlista</h1>
        <p className="text-navy-400 text-sm mt-1">
          Välj en datakälla och konfigurera sökningen för att starta din leadsgenerering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Scraper Select & Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Scraper Registry Select */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-navy-200">Välj datakälla</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AVAILABLE_SCRAPERS.map((scraper) => {
                const IconComponent = scraper.icon;
                const isSelected = selectedScraper === scraper.id;
                
                return (
                  <button
                    key={scraper.id}
                    type="button"
                    disabled={!scraper.enabled}
                    onClick={() => setSelectedScraper(scraper.id)}
                    className={`relative p-5 text-left rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500 shadow-md'
                        : scraper.enabled
                        ? 'border-navy-800 bg-navy-900/40 hover:border-navy-700 hover:bg-navy-900/60 cursor-pointer'
                        : 'border-navy-900/40 bg-navy-950/20 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {!scraper.enabled && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold text-navy-500 uppercase tracking-wider">
                        Kommer snart
                      </span>
                    )}
                    {isSelected && (
                      <span className="absolute top-3 right-3 p-0.5 rounded-full bg-brand-500 text-navy-950">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <IconComponent className={`h-6 w-6 mb-3 ${isSelected ? 'text-brand-400' : 'text-navy-400'}`} />
                    <h3 className="text-sm font-bold text-white mb-1">{scraper.name}</h3>
                    <p className="text-xs text-navy-450 leading-relaxed text-navy-400">
                      {scraper.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Scraper Settings Form */}
          {selectedScraper === 'google-maps' && (
            <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-navy-850 bg-navy-900/20 space-y-5">
              <h2 className="text-base font-bold text-white border-b border-navy-850 pb-3 mb-2 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-brand-400" />
                Sökkonfiguration (Google Maps)
              </h2>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-2 items-center">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Land */}
                <div>
                  <label htmlFor="country" className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-1.5">
                    Land *
                  </label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-950 border border-navy-850 rounded-xl text-white focus:outline-none focus:border-brand-500 text-sm font-medium transition"
                  >
                    <option value="Sverige">Sverige</option>
                    <option value="Norge">Norge</option>
                    <option value="Danmark">Danmark</option>
                    <option value="Finland">Finland</option>
                    <option value="Tyskland">Tyskland</option>
                    <option value="Storbritannien">Storbritannien</option>
                  </select>
                </div>

                {/* Region / Stad */}
                <div>
                  <label htmlFor="region" className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-1.5">
                    Region / Stad *
                  </label>
                  <input
                    id="region"
                    type="text"
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="t.ex. Göteborg, Uppsala, Skåne"
                    className="w-full px-4 py-2.5 bg-navy-950 border border-navy-850 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-brand-500 text-sm font-medium transition"
                  />
                </div>
              </div>

              {/* Sökord / Bransch */}
              <div>
                <label htmlFor="searchTerm" className="block text-xs font-bold text-navy-300 uppercase tracking-wider mb-1.5">
                  Sökord / Bransch *
                </label>
                <input
                  id="searchTerm"
                  type="text"
                  required
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="t.ex. bilverkstad, hotell, restaurang, tandläkare"
                  className="w-full px-4 py-2.5 bg-navy-950 border border-navy-850 rounded-xl text-white placeholder-navy-500 focus:outline-none focus:border-brand-500 text-sm font-medium transition"
                />
                <p className="text-[10px] text-navy-500 mt-1.5 leading-relaxed">
                  Tips: Använd specifika nischer för bättre relevans. Sökordet matchas mot Google Maps kategorier och taggar.
                </p>
              </div>

              {/* Max Leads */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="maxResults" className="block text-xs font-bold text-navy-300 uppercase tracking-wider">
                    Max antal leads *
                  </label>
                  <span className="text-xs text-brand-400 font-mono font-bold">{maxResults} st</span>
                </div>
                <input
                  id="maxResults"
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                  className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-brand-500 focus:outline-none focus:ring-0"
                />
                <div className="flex justify-between text-[10px] text-navy-500 font-mono mt-1">
                  <span>10 st</span>
                  <span>500 st</span>
                  <span>1 000 st</span>
                </div>
              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t border-navy-850 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Startar hämtning...
                    </>
                  ) : (
                    <>
                      Starta leadinsamling
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Side: Estimate Summary Box */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl border border-navy-850 bg-navy-900/40 backdrop-blur-sm sticky top-6 space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2.5">
              <Coins className="h-5 w-5 text-brand-400" />
              Kostnadssummering
            </h2>

            {/* Calculations */}
            <div className="space-y-4 text-sm border-b border-navy-850 pb-4">
              <div className="flex justify-between text-navy-450">
                <span className="text-navy-400">Vald datakälla:</span>
                <span className="font-bold text-white">Google Maps</span>
              </div>
              <div className="flex justify-between text-navy-455">
                <span className="text-navy-400">Beräknade leads:</span>
                <span className="font-bold text-white">{maxResults} st</span>
              </div>
              <div className="flex justify-between text-navy-455">
                <span className="text-navy-400">Kostnadsformel:</span>
                <span className="text-xs text-brand-450 font-bold text-brand-400">1 lead = 1 credit</span>
              </div>
            </div>

            {/* Estimate Total */}
            <div className="space-y-1">
              <div className="text-xs text-navy-400 font-semibold uppercase tracking-wider">Krävs för körning</div>
              <div className="text-3xl font-black text-brand-400">{estimatedCredits} credits</div>
              <p className="text-[10px] text-navy-500 leading-relaxed pt-1">
                Credits reserveras direkt på ditt konto. Om vi hittar färre leads än beställt, återbetalas skillnaden automatiskt efter körningen är klar.
              </p>
            </div>

            {/* Notice card */}
            <div className="p-4 rounded-xl border border-navy-850 bg-navy-950/40 space-y-2">
              <div className="flex gap-2 text-xs text-brand-300 font-semibold items-center">
                <HelpCircle className="h-4 w-4 shrink-0 text-brand-400" />
                Hur lång tid tar det?
              </div>
              <p className="text-[10px] text-navy-400 leading-relaxed">
                En sökning på 100 leads tar vanligtvis 1-2 minuter. Större sökningar upp till 1 000 leads kan ta upp till 5 minuter. Du kan stänga fönstret under tiden, sökningen körs färdigt i bakgrunden.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
