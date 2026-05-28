import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { scrapeJobs } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { 
  History, 
  PlusCircle, 
  CheckCircle, 
  Loader2, 
  Clock, 
  AlertCircle, 
  Download,
  Eye
} from 'lucide-react';

export default async function JobsPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/login');
  }

  const userId = session.user.id;

  // Fetch all jobs for the current user
  const jobs = await db
    .select()
    .from(scrapeJobs)
    .where(eq(scrapeJobs.user_id, userId as string))
    .orderBy(desc(scrapeJobs.created_at));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Mina sökjobb</h1>
          <p className="text-navy-400 text-sm mt-1">
            Här visas historiken över dina påbörjade och klara leadinsamlingar.
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:from-brand-400 hover:to-brand-600 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20"
        >
          <PlusCircle className="h-4 w-4" />
          Skapa ny sökning
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-navy-850 bg-navy-900/20 max-w-xl mx-auto">
          <div className="p-4 rounded-full bg-navy-900 text-navy-500 inline-block mb-4 border border-navy-800">
            <History className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Inga sökjobb hittades</h3>
          <p className="text-sm text-navy-450 max-w-sm mx-auto mb-6 text-navy-400 leading-relaxed">
            Du har inte startat några leadinsamlingar ännu. Ställ in din första sökning på bara några klick!
          </p>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 transition-all duration-200"
          >
            Skapa din första leadlista
          </Link>
        </div>
      ) : (
        <div className="border border-navy-850 bg-navy-900/20 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-900/60 border-b border-navy-850 text-navy-400 text-xs">
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Datum</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Källa</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Sökord</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Stad / Region</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Leads</th>
                  <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right font-bold uppercase tracking-wider">Åtgärder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-850/60 text-navy-300">
                {jobs.map((job) => {
                  const dateStr = new Date(job.created_at).toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const input = job.normalized_input_json as any;
                  const searchTerm = input?.searchTerm || '-';
                  const region = input?.region || '-';
                  const country = input?.country || '';
                  const maxResults = input?.maxResults || job.estimated_credits;

                  return (
                    <tr key={job.id} className="hover:bg-navy-900/30 transition-colors">
                      <td className="px-6 py-4.5 font-medium whitespace-nowrap text-navy-450 text-navy-400 text-xs">
                        {dateStr}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap font-bold text-white text-xs">
                        {job.scraper_name || 'Google Maps'}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap font-semibold text-white">
                        {searchTerm}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        {region} <span className="text-navy-500 text-xs">({country})</span>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap font-medium text-white text-xs">
                        {job.status === 'completed' ? `${job.result_count} st` : `upp till ${maxResults} st`}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        {job.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle className="h-3 w-3" /> Klar
                          </span>
                        )}
                        {job.status === 'running' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                            <Loader2 className="h-3 w-3 animate-spin" /> Körs
                          </span>
                        )}
                        {job.status === 'queued' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="h-3 w-3" /> Köad
                          </span>
                        )}
                        {job.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <AlertCircle className="h-3 w-3" /> Misslyckad
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4.5 text-right whitespace-nowrap space-x-2">
                        <Link
                          href={`/dashboard/jobs/${job.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-navy-800 hover:bg-navy-750 text-white border border-navy-700 transition"
                        >
                          <Eye className="h-3 w-3" /> Visa
                        </Link>
                        {job.status === 'completed' && (
                          <a
                            href={job.export_csv_url || ''}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-500 hover:bg-brand-400 text-navy-950 transition"
                          >
                            <Download className="h-3 w-3" /> CSV
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
