import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { scrapeJobs, creditBalances, exports } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { 
  Coins, 
  History, 
  CheckCircle, 
  Calendar, 
  PlusCircle, 
  Download,
  ArrowRight,
  Loader2,
  Clock,
  AlertCircle,
  MapPin,
  Globe,
  Phone
} from 'lucide-react';

export default async function DashboardOverview() {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/login');
  }

  const userId = session.user.id;

  // 1. Fetch user credit balance
  const balances = await db
    .select({ credits: creditBalances.credits })
    .from(creditBalances)
    .where(eq(creditBalances.user_id, userId as string))
    .limit(1);
  const credits = balances[0]?.credits ?? 0;

  // 2. Fetch all user jobs to calculate stats
  const allUserJobs = await db
    .select()
    .from(scrapeJobs)
    .where(eq(scrapeJobs.user_id, userId as string));

  const totalJobs = allUserJobs.length;
  const completedJobs = allUserJobs.filter(j => j.status === 'completed').length;
  const runningJobs = allUserJobs.filter(j => j.status === 'running').length;

  // 3. Fetch latest export date
  const latestExports = await db
    .select({ created_at: exports.created_at })
    .from(exports)
    .where(eq(exports.user_id, userId as string))
    .orderBy(desc(exports.created_at))
    .limit(1);

  const latestExportDate = latestExports[0]?.created_at
    ? new Date(latestExports[0].created_at).toLocaleDateString('sv-SE')
    : 'Ingen ännu';

  // 4. Fetch 5 most recent jobs
  const recentJobs = await db
    .select()
    .from(scrapeJobs)
    .where(eq(scrapeJobs.user_id, userId as string))
    .orderBy(desc(scrapeJobs.created_at))
    .limit(5);

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Välkommen tillbaka, {session.user.name || 'Användare'}!</h1>
          <p className="text-slate-500 text-sm mt-1">
            Här är en översikt över dina sökningar och dina tillgängliga credits.
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

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Credits */}
        <div className="p-5 rounded-2xl border border-[#F1F5F9] bg-white shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Credits kvar</span>
            <div className="text-2xl font-black text-slate-900">{credits} cr</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        {/* Total Jobs */}
        <div className="p-5 rounded-2xl border border-[#F1F5F9] bg-white shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Totalt antal sökningar</span>
            <div className="text-2xl font-black text-slate-900">{totalJobs} st</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <History className="h-5 w-5" />
          </div>
        </div>

        {/* Completed Jobs */}
        <div className="p-5 rounded-2xl border border-[#F1F5F9] bg-white shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Klara sökningar</span>
            <div className="text-2xl font-black text-slate-900">{completedJobs} st</div>
          </div>
          <div className="p-3 rounded-xl bg-[#ECFDF5] text-[#10B981]">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Latest Export */}
        <div className="p-5 rounded-2xl border border-[#F1F5F9] bg-white shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Senaste export</span>
            <div className="text-lg font-black text-slate-900 truncate">{latestExportDate}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Active Runs Banner */}
      {runningJobs > 0 && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="font-semibold">Du har <strong>{runningJobs} aktiv(a)</strong> leadinsamlingar som körs just nu.</span>
          </div>
          <Link href="/dashboard/jobs" className="text-xs font-bold text-blue-600 hover:text-blue-800 underline">
            Följ status
          </Link>
        </div>
      )}

      {/* Recent Jobs Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-950">Senaste sökningar</h2>
          <Link href="/dashboard/jobs" className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1">
            Visa alla sökningar
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-[#F1F5F9] bg-white shadow-sm">
            <div className="p-3.5 rounded-full bg-slate-50 text-slate-400 inline-block mb-3">
              <History className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Inga sökjobb ännu</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Kom igång genom att skapa din allra första söklista från Google Maps.
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
            >
              Kom igång gratis
            </Link>
          </div>
        ) : (
          <div className="border border-[#F1F5F9] bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-[#F1F5F9] text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                    <th className="px-6 py-4">Datum</th>
                    <th className="px-6 py-4">Sökord</th>
                    <th className="px-6 py-4">Stad</th>
                    <th className="px-6 py-4">Antal leads</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ladda ner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-slate-600 font-semibold text-xs">
                  {recentJobs.map((job) => {
                    const dateStr = new Date(job.created_at).toLocaleDateString('sv-SE', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    
                    const input = job.normalized_input_json as any;
                    const searchTerm = input?.searchTerm || 'Okänt';
                    const region = input?.region || 'Okänt';
                    const maxResults = input?.maxResults || job.estimated_credits;

                    return (
                      <tr key={job.id} className="hover:bg-slate-50/25 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-400">
                          {dateStr}
                        </td>
                        <td className="px-6 py-4 font-extrabold text-slate-900">
                          {searchTerm}
                        </td>
                        <td className="px-6 py-4 text-slate-900">
                          {region}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {job.status === 'completed' ? `${job.result_count} st` : `upp till ${maxResults} st`}
                        </td>
                        <td className="px-6 py-4">
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
                        <td className="px-6 py-4 text-right">
                          {job.status === 'completed' ? (
                            <a
                              href={job.export_csv_url || ''}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E2E8F0] hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
                            >
                              <Download className="h-3.5 w-3.5 text-slate-500" /> CSV
                            </a>
                          ) : (
                            <Link
                              href={`/dashboard/jobs/${job.id}`}
                              className="text-xs text-blue-600 hover:text-blue-700 font-bold"
                            >
                              Visa
                            </Link>
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
    </div>
  );
}
export const dynamic = 'force-dynamic';
