'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Coins, 
  Sparkles,
  HelpCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Search,
  Filter
} from 'lucide-react';
import { getEnabledAdapters } from '@/lib/scrapers/registry';
import { ScraperAdapter } from '@/lib/scrapers/types';

interface CreateClientProps {
  initialBalance: number;
}

export default function CreateClient({ initialBalance }: CreateClientProps) {
  const router = useRouter();
  const enabledScrapers = getEnabledAdapters();

  // Stage state: 'catalog' | 'config' | 'review'
  const [stage, setStage] = useState<'catalog' | 'config' | 'review'>('catalog');
  const [selectedScraper, setSelectedScraper] = useState<ScraperAdapter | null>(null);
  
  // Dynamic form state
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  
  // Catalog search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectScraper = (scraper: ScraperAdapter) => {
    setSelectedScraper(scraper);
    const initialValues: Record<string, any> = {};
    scraper.fields.forEach(field => {
      initialValues[field.name] = field.defaultValue !== undefined ? field.defaultValue : '';
    });
    setFormValues(initialValues);
    setError(null);
    setStage('config');
  };

  // Cost estimates
  const getEstimatedCredits = () => {
    if (!selectedScraper) return 0;
    return selectedScraper.creditEstimate(formValues);
  };

  const getEstimatedTime = () => {
    if (!selectedScraper) return '1-2 min';
    // Find limit/results count
    const limitField = selectedScraper.fields.find(f => f.name === 'maxResults' || f.name === 'resultsLimit' || f.name === 'limit');
    const limitVal = limitField ? Number(formValues[limitField.name]) || 50 : 50;
    
    if (limitVal <= 50) return '1-2 min';
    if (limitVal <= 200) return '2-3 min';
    return '3-5 min';
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleContinueToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScraper) return;

    // Validate inputs using adapter
    const validation = selectedScraper.validateInput(formValues);
    if (!validation.success) {
      setError(validation.error || 'Kontrollera dina ifyllda uppgifter.');
      return;
    }

    setError(null);
    setStage('review');
  };

  const handlePayWithCredits = async () => {
    if (!selectedScraper) return;
    const cost = getEstimatedCredits();

    if (initialBalance < cost) {
      setError(`Otillräckliga credits. Du behöver ${cost} credits, men ditt saldo är ${initialBalance}.`);
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
          scraperId: selectedScraper.id,
          input: formValues,
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

  // Filtered scrapers list
  const filteredScrapers = enabledScrapers.filter(scraper => {
    const matchesSearch = scraper.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          scraper.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || scraper.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'Alla' },
    { id: 'leads', label: 'Leads' },
    { id: 'social', label: 'Sociala Medier' },
    { id: 'search', label: 'Sök' },
    { id: 'content', label: 'Innehåll' },
    { id: 'ecommerce', label: 'E-handel' },
  ];

  return (
    <div className="w-full py-4 font-sans">
      
      {/* 1. CATALOG STAGE */}
      {stage === 'catalog' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Skapa ny sökning
            </h1>
            <p className="text-slate-500 text-sm">
              Välj en scraper nedan för att påbörja din datainsamling.
            </p>
          </div>

          {/* Search & Filter Header */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sök bland tillgängliga scrapers..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            </div>

            {/* Category selection */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white border-[#E2E8F0] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid list of scrapers */}
          {filteredScrapers.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="h-12 w-12 bg-slate-50 text-slate-400 flex items-center justify-center rounded-full mx-auto mb-3">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Hittade inga scrapers</h3>
              <p className="text-xs text-slate-400">Försök söka med en annan term eller byt kategori.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
              {filteredScrapers.map(scraper => (
                <button
                  key={scraper.id}
                  onClick={() => handleSelectScraper(scraper)}
                  className="w-full text-left bg-white rounded-2xl border border-[#F1F5F9] p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl border border-[#E2E8F0] shadow-sm bg-slate-50 shrink-0 flex items-center justify-center p-1.5">
                      <Image
                        src={scraper.icon || '/icons/default.svg'}
                        alt={scraper.name}
                        width={40}
                        height={40}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {scraper.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        {scraper.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50 w-full text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="bg-slate-50 px-2 py-1 rounded border border-slate-100/50">
                      {scraper.category}
                    </span>
                    <div className="flex items-center gap-1 text-slate-500 font-extrabold group-hover:text-blue-600 transition-colors">
                      Välj
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. CONFIGURATION STAGE */}
      {stage === 'config' && selectedScraper && (
        <div className="max-w-xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStage('catalog')}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="space-y-0.5">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {selectedScraper.name}
                </h1>
                <p className="text-slate-500 text-xs font-semibold">
                  {selectedScraper.description}
                </p>
              </div>
            </div>
             {/* Scraper Icon Box */}
            <div className="h-14 w-14 rounded-2xl border border-[#E2E8F0] shadow-sm bg-slate-50 shrink-0 flex items-center justify-center p-2">
              <Image
                src={selectedScraper.icon || '/icons/default.svg'}
                alt={selectedScraper.name}
                width={44}
                height={44}
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex gap-2.5 items-center">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleContinueToReview} className="space-y-5">
            
            {/* Dynamic Inputs Builder */}
            {selectedScraper.fields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label htmlFor={field.name} className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                </label>
                {field.description && (
                  <p className="text-slate-400 text-[11px] font-semibold mt-0.5 leading-relaxed">{field.description}</p>
                )}
                
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    required={field.required}
                    value={formValues[field.name] === undefined ? '' : formValues[field.name]}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={field.name}
                    required={field.required}
                    value={formValues[field.name] === undefined ? '' : formValues[field.name]}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center gap-2.5 py-1">
                    <input
                      id={field.name}
                      type="checkbox"
                      checked={!!formValues[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">{field.placeholder || field.label}</span>
                  </div>
                ) : (
                  <input
                    id={field.name}
                    type={field.type}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    value={formValues[field.name] === undefined ? '' : formValues[field.name]}
                    onChange={(e) => handleInputChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                  />
                )}
              </div>
            ))}

            {/* Dynamic Cost Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-[#F1F5F9] bg-[#F8F9FA] space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Beräknad kostnad</div>
                <div className="text-sm font-extrabold text-slate-900">{getEstimatedCredits()} credits</div>
              </div>
              
              <div className="p-4 rounded-xl border border-[#F1F5F9] bg-[#F8F9FA] space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uppskattad tid</div>
                <div className="text-sm font-extrabold text-slate-900">{getEstimatedTime()}</div>
              </div>
            </div>

            {/* Continue button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 active:scale-[0.99] transition-all"
              >
                Gå vidare till granskning
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. REVIEW & PAY STAGE */}
      {stage === 'review' && selectedScraper && (
        <div className="max-w-xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setStage('config')}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Granska & Bekräfta
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
              <div className="h-12 w-12 rounded-xl border border-[#E2E8F0] shadow-sm bg-slate-50 shrink-0 flex items-center justify-center p-1.5">
                <Image
                  src={selectedScraper.icon || '/icons/default.svg'}
                  alt={selectedScraper.name}
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900">{selectedScraper.name}</h3>
                <p className="text-xs text-slate-400 font-semibold truncate max-w-[240px]">
                  {Object.entries(formValues)
                    .filter(([key]) => key !== 'queries' && key !== 'urls' && key !== 'companies' && key !== 'searchQueries')
                    .map(([key, val]) => `${key}: ${val}`)
                    .join(', ') || selectedScraper.description}
                </p>
              </div>
              <div className="ml-auto text-sm font-extrabold text-slate-900">
                {getEstimatedCredits()} credits
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-3.5 pb-5 border-b border-[#F1F5F9] text-xs font-bold text-slate-500">
              <div className="flex justify-between">
                <span>Total kostnad</span>
                <span className="text-slate-900 font-extrabold">{getEstimatedCredits()} credits</span>
              </div>
              <div className="flex justify-between">
                <span>Ditt credit-saldo</span>
                <span className={initialBalance >= getEstimatedCredits() ? 'text-emerald-500 font-extrabold' : 'text-rose-500 font-extrabold'}>
                  {initialBalance} credits
                </span>
              </div>
            </div>

            {/* Payment buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handlePayWithCredits}
                disabled={loading || initialBalance < getEstimatedCredits()}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Startar insamling...
                  </>
                ) : (
                  <>
                    Betala med credits & starta
                  </>
                )}
              </button>

              <div className="flex items-center justify-center my-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white px-3 relative z-10">eller</span>
                <div className="w-full h-px bg-[#F1F5F9] absolute"></div>
              </div>

              <Link
                href="/dashboard/billing"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 active:scale-[0.99] transition-all"
              >
                <CreditCard className="h-4 w-4 text-slate-500" />
                Köp fler credits
              </Link>
            </div>

            {/* Security stamp */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">
              <ShieldCheck className="h-4.5 w-4.5 text-slate-400" />
              Säker transaktion
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
