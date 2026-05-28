'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  MapPin, 
  Search, 
  Coins, 
  CheckCircle2, 
  Loader2, 
  Clock, 
  AlertTriangle,
  Star,
  Globe,
  Phone,
  RefreshCw
} from 'lucide-react';

interface ScrapeJob {
  id: string;
  status: string;
  scraper_id: string;
  scraper_name: string | null;
  result_count: number;
  charged_credits: number;
  estimated_credits: number;
  export_csv_url: string | null;
  error_message: string | null;
  normalized_input_json: Record<string, unknown> | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

interface ScrapeResult {
  id: string;
  company_name: string | null;
  phone: string | null;
  website: string | null;
  domain: string | null;
  category: string | null;
  rating: string | null;
  review_count: number | null;
}

interface JobDetailClientProps {
  jobId: string;
  initialJob: ScrapeJob;
  initialResults: ScrapeResult[];
}

const ACTIVE_STATUSES = ['queued', 'running', 'fetching_results', 'processing_results'];

export function JobDetailClient({ jobId, initialJob, initialResults }: JobDetailClientProps) {
  const router = useRouter();
  const [job, setJob] = useState<ScrapeJob>(initialJob);
  const [results, setResults] = useState<ScrapeResult[]>(initialResults);
  const [pollCount, setPollCount] = useState(0);

  const isActive = ACTIVE_STATUSES.includes(job.status);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) return;
        const data = await res.json();
        
        setJob(data.job);
        if (data.results) setResults(data.results);
        setPollCount(c => c + 1);

        // If job is done, stop polling and refresh the page for full server-side data
        if (!ACTIVE_STATUSES.includes(data.job.status)) {
          clearInterval(interval);
          router.refresh();
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [jobId, isActive, router]);

  const input = (job.normalized_input_json || {}) as Record<string, unknown>;
  const searchTerm = (input.searchTerm as string) || 'Okänt';
  const region = (input.region as string) || 'Okänt';
  const country = (input.country as string) || '';
  const maxResults = (input.maxResults as number) || job.estimated_credits;

  return (
    <div className="space-y-8">
      {/* Back link & Title */}
      <div className="space-y-4">
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-1.5 text-navy-400 hover:text-white text-xs font-semibold tracking-wide"
        >
          <ArrowLeft className="h-4 w-4" />
          Tillbaka till sökningar
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Sökning: {searchTerm}</h1>
            <p className="text-navy-450 text-xs text-navy-400 mt-1">
              Jobb-ID: <code className="text-navy-300 font-mono">{jobId}</code>
            </p>
          </div>
          
          {job.status === 'completed' && (
            <a
              href={job.export_csv_url || ''}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-brand-500 hover:bg-brand-400 text-navy-950 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-[0.98] transition-all"
            >
              <Download className="h-4.5 w-4.5" />
              Ladda ner CSV-fil
            </a>
          )}
        </div>
      </div>

      {/* 3-Step Status Timeline */}
      <div className="p-6 rounded-2xl border border-navy-850 bg-navy-900/20 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Step 1 */}
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">1. Sökning köad</h3>
            <p className="text-xs text-navy-400">Credits har dragits</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-4">
          {job.status === 'completed' ? (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          ) : isActive ? (
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 animate-pulse">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : job.status === 'failed' ? (
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-navy-950 text-navy-600 border border-navy-850">
              <Clock className="h-5 w-5" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-white">2. Hämtar från Google</h3>
            <p className="text-xs text-navy-400">
              {job.status === 'completed'
                ? 'Insamling slutförd'
                : isActive
                ? 'Söker på kartan just nu...'
                : job.status === 'failed'
                ? 'Körningen avbröts'
                : 'Väntar i kön'}
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-center gap-4">
          {job.status === 'completed' ? (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-navy-950 text-navy-600 border border-navy-850">
              <Clock className="h-5 w-5" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-white">3. Klar för export</h3>
            <p className="text-xs text-navy-400">
              {job.status === 'completed' ? `${job.result_count} unika leads tvättade` : 'Exporteras till CSV'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Info panel + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Search info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-navy-850 bg-navy-900/40 backdrop-blur-sm space-y-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-navy-850 pb-3">Sökparametrar</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-navy-400" />
                <div>
                  <div className="text-xs text-navy-400">Sökord</div>
                  <div className="text-sm font-bold text-white">{searchTerm}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-navy-400" />
                <div>
                  <div className="text-xs text-navy-400">Plats</div>
                  <div className="text-sm font-bold text-white">{region} <span className="text-xs text-navy-400">({country})</span></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Coins className="h-5 w-5 text-navy-400" />
                <div>
                  <div className="text-xs text-navy-400">Kostnad</div>
                  <div className="text-sm font-bold text-white">{job.charged_credits} credits</div>
                </div>
              </div>
            </div>
          </div>

          {/* Running view card */}
          {isActive && (
            <div className="p-6 rounded-2xl border border-brand-500/20 bg-brand-500/5 text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-brand-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Insamling pågår...</h3>
              <p className="text-xs text-navy-400 leading-relaxed">
                Våra bakgrundsjobb hämtar just nu företagsdata från Google Maps. Det tar normalt under 2 minuter.
              </p>
              {pollCount > 0 && (
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-navy-500">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Uppdaterar automatiskt...
                </div>
              )}
            </div>
          )}

          {/* Error Board */}
          {job.status === 'failed' && (
            <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-3">
              <div className="flex gap-2 items-center text-rose-400 font-bold text-sm">
                <AlertTriangle className="h-5 w-5" />
                Ett fel uppstod
              </div>
              <p className="text-xs text-rose-300/80 leading-relaxed">
                {job.error_message || 'Körningen avbröts av okänd anledning. Dina credits har betalats tillbaka automatiskt.'}
              </p>
            </div>
          )}
        </div>

        {/* Right column: Results Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">
              Resultatförhandsvisning {job.status === 'completed' && <span className="text-sm font-normal text-navy-400">({results.length} av {job.result_count} st visas)</span>}
            </h2>
          </div>

          {isActive ? (
            <div className="p-16 text-center border border-navy-850 bg-navy-900/20 rounded-2xl">
              <Loader2 className="h-8 w-8 animate-spin text-navy-500 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Hämtar data...</h3>
              <p className="text-xs text-navy-500">
                Leadlistan genereras i bakgrunden. Förhandsgranskningen uppdateras automatiskt när jobbet är klart.
              </p>
            </div>
          ) : job.status === 'failed' ? (
            <div className="p-16 text-center border border-navy-850 bg-navy-900/20 rounded-2xl">
              <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-1">Inga resultat tillgängliga</h3>
              <p className="text-xs text-navy-500">
                Sökjobbet misslyckades. Inga leads samlades in.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-16 text-center border border-navy-850 bg-navy-900/20 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-1">Hittade inga resultat</h3>
              <p className="text-xs text-navy-400">
                Sökningen slutfördes men vi kunde inte hitta några matchande företag i det angivna området. Reserverade credits har återbetalats.
              </p>
            </div>
          ) : (
            <div className="border border-navy-850 bg-navy-900/20 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-navy-900/60 border-b border-navy-850 text-navy-400 text-xs">
                      <th className="px-5 py-3 text-left font-bold uppercase tracking-wider">Företagsnamn</th>
                      <th className="px-5 py-3 text-left font-bold uppercase tracking-wider">Telefon</th>
                      <th className="px-5 py-3 text-left font-bold uppercase tracking-wider">Hemsida</th>
                      <th className="px-5 py-3 text-left font-bold uppercase tracking-wider">Kategori</th>
                      <th className="px-5 py-3 text-left font-bold uppercase tracking-wider">Betyg</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-850/60 text-navy-300">
                    {results.map((row) => (
                      <tr key={row.id} className="hover:bg-navy-900/30 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-white max-w-[200px] truncate">
                          {row.company_name || '-'}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-navy-400">
                          {row.phone ? (
                            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 shrink-0" />{row.phone}</span>
                          ) : '-'}
                        </td>
                        <td className="px-5 py-3.5 truncate max-w-[150px]">
                          {row.website ? (
                            <a
                              href={row.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-400 hover:underline flex items-center gap-1"
                            >
                              <Globe className="h-3 w-3 shrink-0" />
                              {row.domain || 'hemsida'}
                            </a>
                          ) : '-'}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap truncate max-w-[120px]">
                          {row.category || '-'}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-white font-medium">
                          {row.rating ? (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current text-yellow-400" />
                              {row.rating}
                              <span className="text-[10px] text-navy-500">({row.review_count})</span>
                            </span>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
