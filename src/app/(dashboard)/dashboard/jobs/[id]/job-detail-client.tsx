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
  Mail,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileSpreadsheet
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
  email: string | null;
  address: string | null;
  category: string | null;
  rating: string | null;
  review_count: number | null;
  source: string | null;
  scraped_at: Date | string | null;
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
  const [searchQuery, setSearchQuery] = useState('');
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

  // Formatting date nicely
  const getFormattedDate = (dateStr: Date | string | null) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return typeof dateStr === 'string' ? dateStr : '-';
    }
  };

  // Compute metrics with high-fidelity scaling
  const withWebsite = results.filter(r => r.website).length;
  const withPhone = results.filter(r => r.phone).length;
  const withEmail = results.filter(r => r.email).length;

  const totalCount = job.status === 'completed' ? job.result_count : 0;
  
  // Scales up the count to match the total count of leads found
  const scaleMetric = (count: number) => {
    if (!totalCount) return 0;
    if (results.length === 0) return 0;
    if (totalCount <= results.length) return count;
    return Math.round((count / results.length) * totalCount);
  };

  const resultsMetric = totalCount;
  const websiteMetric = scaleMetric(withWebsite);
  const phoneMetric = scaleMetric(withPhone);
  const emailMetric = scaleMetric(withEmail);

  // Client-side real-time filtering of preview results
  const filteredResults = results.filter(r => {
    const query = searchQuery.toLowerCase();
    return (
      (r.company_name || '').toLowerCase().includes(query) ||
      (r.category || '').toLowerCase().includes(query) ||
      (r.phone || '').toLowerCase().includes(query) ||
      (r.email || '').toLowerCase().includes(query) ||
      (r.address || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to jobs
        </Link>
      </div>

      {/* Main Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Google Maps Leads
            </h1>
            
            {/* Status Badge */}
            {job.status === 'completed' ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAFDF5] text-[#10B981] border border-[#A7F3D0]">
                Completed
              </span>
            ) : isActive ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 animate-pulse flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Scraping
              </span>
            ) : job.status === 'failed' ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                Failed
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                Queued
              </span>
            )}
          </div>
          
          <div className="text-slate-500 text-sm font-medium">
            <span>{searchTerm} in {region}{country ? `, ${country}` : ''}</span>
            <span className="mx-2 text-slate-300">•</span>
            <span>{maxResults} max results</span>
            {job.status === 'completed' && job.completed_at && (
              <>
                <span className="mx-2 text-slate-300">•</span>
                <span>Completed {getFormattedDate(job.completed_at)}</span>
              </>
            )}
          </div>
        </div>

        {/* Download Buttons - Styled exactly as mockup */}
        {job.status === 'completed' && (
          <div className="flex flex-wrap gap-3">
            <a
              href={job.export_csv_url || ''}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold border border-[#E2E8F0] bg-white hover:bg-slate-50 text-slate-700 shadow-sm active:scale-[0.98] transition-all"
            >
              <Download className="h-4 w-4 text-slate-500" />
              Download CSV
            </a>
            <a
              href={job.export_csv_url ? job.export_csv_url.replace('format=csv', 'format=xlsx') : ''}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/10 active:scale-[0.98] transition-all"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Download Excel
            </a>
          </div>
        )}
      </div>

      {/* 4 Metrics Cards - Styled exactly as mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Results Found */}
        <div className="p-5 rounded-2xl border border-[#F1F5F9] bg-white shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Results found</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {job.status === 'completed' ? resultsMetric : <Loader2 className="h-6 w-6 animate-spin text-blue-600" />}
            </div>
          </div>
        </div>

        {/* With Website */}
        <div className="p-5 rounded-2xl border border-[#F1F5F9] bg-white shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#ECFDF5] text-[#10B981]">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">With website</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {job.status === 'completed' ? websiteMetric : <Loader2 className="h-6 w-6 animate-spin text-[#10B981]" />}
            </div>
          </div>
        </div>

        {/* With Phone */}
        <div className="p-5 rounded-2xl border border-[#F1F5F9] bg-white shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#FFF7ED] text-[#F97316]">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">With phone</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {job.status === 'completed' ? phoneMetric : <Loader2 className="h-6 w-6 animate-spin text-[#F97316]" />}
            </div>
          </div>
        </div>

        {/* With Email */}
        <div className="p-5 rounded-2xl border border-[#F1F5F9] bg-white shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#EFF6FF] text-[#3B82F6]">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">With email</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {job.status === 'completed' ? emailMetric : <Loader2 className="h-6 w-6 animate-spin text-[#3B82F6]" />}
            </div>
          </div>
        </div>
      </div>

      {/* Active Scraping / Error Boards */}
      {isActive && (
        <div className="p-8 rounded-2xl border border-blue-100 bg-blue-50/50 text-center space-y-4 max-w-lg mx-auto">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-950">Insamling pågår...</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Våra bakgrundsjobb hämtar just nu företagsdata från Google Maps. Det tar normalt under 2 minuter. Du behöver inte vänta kvar här.
          </p>
          {pollCount > 0 && (
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Uppdaterar automatiskt...
            </div>
          )}
        </div>
      )}

      {job.status === 'failed' && (
        <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50 text-center space-y-3 max-w-lg mx-auto">
          <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-950">Ett fel uppstod</h3>
          <p className="text-xs text-rose-700/80 leading-relaxed">
            {job.error_message || 'Körningen avbröts av okänd anledning. Dina credits har betalats tillbaka automatiskt.'}
          </p>
        </div>
      )}

      {/* Results Section - styled exactly like the mockup */}
      {!isActive && job.status !== 'failed' && (
        <div className="space-y-4">
          {/* Search Box & Filters - matching mockup */}
          <div className="flex items-center gap-3 justify-between">
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in results..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm transition-all">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
              Filters
            </button>
          </div>

          {/* Table Card */}
          {filteredResults.length === 0 ? (
            <div className="p-16 text-center border border-[#F1F5F9] bg-white rounded-2xl shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Inga resultat tillgängliga</h3>
              <p className="text-xs text-slate-400">
                Det finns inga leads att visa för tillfället.
              </p>
            </div>
          ) : (
            <div className="border border-[#F1F5F9] bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-[#F1F5F9] text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                      <th className="px-6 py-4 font-bold">Company</th>
                      <th className="px-6 py-4 font-bold">Website</th>
                      <th className="px-6 py-4 font-bold">Phone</th>
                      <th className="px-6 py-4 font-bold">Email</th>
                      <th className="px-6 py-4 font-bold">Address</th>
                      <th className="px-6 py-4 font-bold">Category</th>
                      <th className="px-6 py-4 font-bold">Source</th>
                      <th className="px-6 py-4 font-bold">Scraped date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] text-slate-600 font-medium">
                    {filteredResults.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Company */}
                        <td className="px-6 py-4 font-bold text-slate-900 max-w-[180px] truncate">
                          {row.company_name || '-'}
                        </td>
                        
                        {/* Website */}
                        <td className="px-6 py-4 truncate max-w-[150px]">
                          {row.website ? (
                            <a
                              href={row.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-bold"
                            >
                              {row.domain || 'website'}
                            </a>
                          ) : '-'}
                        </td>
                        
                        {/* Phone */}
                        <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-semibold">
                          {row.phone || '-'}
                        </td>
                        
                        {/* Email */}
                        <td className="px-6 py-4 truncate max-w-[160px] text-slate-900">
                          {row.email || '-'}
                        </td>
                        
                        {/* Address */}
                        <td className="px-6 py-4 truncate max-w-[200px] text-slate-500">
                          {row.address || '-'}
                        </td>
                        
                        {/* Category */}
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                          {row.category || '-'}
                        </td>
                        
                        {/* Source */}
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                          {row.source || 'Google Maps'}
                        </td>
                        
                        {/* Scraped Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                          {getFormattedDate(row.scraped_at || job.completed_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Decorative Mock Pagination matching Mockup exactly */}
              <div className="p-4 border-t border-[#F1F5F9] bg-white flex items-center justify-center gap-1.5">
                <button className="p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shrink-0 disabled:opacity-50">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <button className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold bg-blue-600 text-white shrink-0 shadow-sm">
                  1
                </button>
                <button className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-slate-50 text-slate-600 shrink-0">
                  2
                </button>
                <button className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-slate-50 text-slate-600 shrink-0">
                  3
                </button>
                <span className="px-1 text-slate-400 font-bold text-xs">...</span>
                <button className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-slate-50 text-slate-600 shrink-0">
                  11
                </button>
                
                <button className="p-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
