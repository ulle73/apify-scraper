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
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mina sökjobb</h1>
          <p className="text-slate-500 text-sm mt-1">
            Här visas historiken över dina påbörjade och klara leadinsamlingar.
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          Skapa ny sökning
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-[#F1F5F9] bg-white max-w-xl mx-auto shadow-sm">
          <div className="p-4 rounded-full bg-slate-50 text-slate-400 inline-block mb-4 border border-[#E2E8F0]">
            <History className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Inga sökjobb hittades</h3>
          <p className="text-sm text-slate-450 max-w-sm mx-auto mb-6 text-slate-500 leading-relaxed font-semibold">
            Du har inte startat några leadinsamlingar ännu. Ställ in din första sökning på bara några klick!
          </p>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all"
          >
            Skapa din första sökning
          </Link>
        </div>
      ) : (
        <div className="border border-[#F1F5F9] bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-[#F1F5F9] text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  <th className="px-6 py-4">Datum</th>
                  <th className="px-6 py-4">Källa</th>
                  <th className="px-6 py-4">Sökord</th>
                  <th className="px-6 py-4">Stad / Region</th>
                  <th className="px-6 py-4">Leads</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Åtgärder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-slate-600 font-semibold text-xs">
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
                    <tr key={job.id} className="hover:bg-slate-50/25 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-400 whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-extrabold">
                        {job.scraper_name || 'Google Maps'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-bold">
                        {searchTerm}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-800">
                        {region} <span className="text-slate-400 text-xs font-semibold">({country})</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                        {job.status === 'completed' ? `${job.result_count} st` : `upp till ${maxResults} st`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {job.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAFDF5] text-[#10B981] border border-[#A7F3D0]">
                            Klar
                          </span>
                        )}
                        {job.status === 'running' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                            Körs
                          </span>
                        )}
                        {job.status === 'queued' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Köad
                          </span>
                        )}
                        {job.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                            Fel
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                        <Link
                          href={`/dashboard/jobs/${job.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-500" /> Visa
                        </Link>
                        {job.status === 'completed' && (
                          <a
                            href={job.export_csv_url || ''}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 transition-all animate-fade-in"
                          >
                            <Download className="h-3.5 w-3.5" /> CSV
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
