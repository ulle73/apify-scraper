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
  AlertCircle
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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Välkommen tillbaka, {session.user.name || 'Användare'}!</h1>
          <p className="text-navy-400 text-sm mt-1">
            Här är en översikt över dina leadlistor och dina tillgängliga credits.
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:from-brand-400 hover:to-brand-600 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 hover:scale-[1.01] transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          Skapa ny leadlista
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Credits */}
        <div className="p-5 rounded-2xl border border-navy-850 bg-navy-900/40 backdrop-blur-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-navy-400 font-semibold uppercase tracking-wider">Credits kvar</span>
            <div className="text-2xl font-black text-white">{credits} cr</div>
          </div>
          <div className="p-3.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Coins className="h-6 w-6" />
          </div>
        </div>

        {/* Total Jobs */}
        <div className="p-5 rounded-2xl border border-navy-850 bg-navy-900/40 backdrop-blur-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-navy-400 font-semibold uppercase tracking-wider">Totalt antal jobb</span>
            <div className="text-2xl font-black text-white">{totalJobs} st</div>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <History className="h-6 w-6" />
          </div>
        </div>

        {/* Completed Jobs */}
        <div className="p-5 rounded-2xl border border-navy-850 bg-navy-900/40 backdrop-blur-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-navy-400 font-semibold uppercase tracking-wider">Klara sökningar</span>
            <div className="text-2xl font-black text-white">{completedJobs} st</div>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Latest Export */}
        <div className="p-5 rounded-2xl border border-navy-850 bg-navy-900/40 backdrop-blur-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-navy-400 font-semibold uppercase tracking-wider">Senaste export</span>
            <div className="text-lg font-black text-white truncate">{latestExportDate}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Calendar className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Active Runs Banner */}
      {runningJobs > 0 && (
        <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Du har <strong>{runningJobs} aktiv(a)</strong> leadinsamlingar som körs just nu.</span>
          </div>
          <Link href="/dashboard/jobs" className="text-xs font-bold underline hover:text-white">
            Följ status
          </Link>
        </div>
      )}

      {/* Recent Jobs Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Senaste sökningar</h2>
          <Link href="/dashboard/jobs" className="text-xs text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1">
            Visa alla sökningar
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-navy-850 bg-navy-900/20">
            <div className="p-3 rounded-full bg-navy-900 text-navy-500 inline-block mb-3">
              <History className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Inga sökjobb ännu</h3>
            <p className="text-xs text-navy-500 max-w-sm mx-auto mb-4">
              Kom igång genom att skapa din allra första söklista från Google Maps.
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-navy-800 hover:bg-navy-750 text-white border border-navy-800 transition"
            >
              Kom igång gratis
            </Link>
          </div>
        ) : (
          <div className="border border-navy-850 bg-navy-900/20 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy-900/60 border-b border-navy-850 text-navy-400 text-xs">
                    <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Datum</th>
                    <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Sökord</th>
                    <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Stad</th>
                    <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Antal leads</th>
                    <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-right font-bold uppercase tracking-wider">Ladda ner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-850/60 text-navy-300">
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
                      <tr key={job.id} className="hover:bg-navy-900/30 transition-colors">
                        <td className="px-6 py-4.5 font-medium whitespace-nowrap text-navy-400 text-xs">
                          {dateStr}
                        </td>
                        <td className="px-6 py-4.5 font-bold text-white whitespace-nowrap">
                          {searchTerm}
                        </td>
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          {region}
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
                              <AlertCircle className="h-3 w-3" /> Fel
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4.5 text-right whitespace-nowrap">
                          {job.status === 'completed' ? (
                            <a
                              href={job.export_csv_url || ''}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-500 hover:bg-brand-400 text-navy-950 transition"
                            >
                              <Download className="h-3 w-3" /> CSV
                            </a>
                          ) : (
                            <Link
                              href={`/dashboard/jobs/${job.id}`}
                              className="text-xs text-navy-500 hover:text-navy-300 font-semibold"
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
