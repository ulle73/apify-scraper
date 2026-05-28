import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { creditBalances, creditTransactions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { PLANS } from '@/lib/pricing/plans';
import CheckoutButton from '@/components/dashboard/checkout-button';
import { 
  CreditCard, 
  Coins, 
  CoinsIcon, 
  Check, 
  History, 
  PlusCircle,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default async function BillingPage(context: { searchParams: Promise<{ status?: string }> }) {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/login');
  }

  const searchParams = await context.searchParams;
  const paymentStatus = searchParams?.status;

  const userId = session.user.id;

  // 1. Fetch current credit balance
  const balances = await db
    .select({ credits: creditBalances.credits })
    .from(creditBalances)
    .where(eq(creditBalances.user_id, userId as string))
    .limit(1);

  const credits = balances[0]?.credits ?? 0;

  // 2. Fetch transaction logs
  const transactions = await db
    .select()
    .from(creditTransactions)
    .where(eq(creditTransactions.user_id, userId as string))
    .orderBy(desc(creditTransactions.created_at))
    .limit(20);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Fakturering & Credits</h1>
        <p className="text-navy-400 text-sm mt-1">
          Köp fler credits eller visa historik över dina transaktioner.
        </p>
      </div>

      {/* Stripe Payment Notifications */}
      {paymentStatus === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex gap-2 items-center">
          <PlusCircle className="h-4.5 w-4.5 shrink-0" />
          <span>Köp genomfört! Dina credits har lagts till på ditt saldo. Det kan ta upp till en minut innan Stripe synkar helt.</span>
        </div>
      )}
      {paymentStatus === 'cancelled' && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-2 items-center">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>Köp avbröts. Inga pengar drogs från ditt kort.</span>
        </div>
      )}

      {/* Stripe Sandbox Mode Banner */}
      {process.env.STRIPE_MODE === 'test' && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm space-y-1.5">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-base">🧪</span>
            <span>Stripe Sandbox / Test-läge aktivt</span>
          </div>
          <p className="text-xs text-amber-400/80 leading-relaxed">
            Inga riktiga betalningar genomförs. Använd Stripes testkort för att simulera köp:
          </p>
          <div className="flex flex-wrap gap-4 mt-1">
            <div className="text-xs font-mono bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
              <span className="text-amber-500 font-bold">Kortnummer: </span>
              <span className="text-white tracking-widest">4242 4242 4242 4242</span>
            </div>
            <div className="text-xs font-mono bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
              <span className="text-amber-500 font-bold">Utgångsdatum: </span>
              <span className="text-white">valfritt i framtiden</span>
            </div>
            <div className="text-xs font-mono bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
              <span className="text-amber-500 font-bold">CVC: </span>
              <span className="text-white">valfri 3 siffror</span>
            </div>
          </div>
        </div>
      )}


      {/* Credits Card Display */}
      <div className="p-6 rounded-2xl border border-navy-850 bg-navy-900/40 backdrop-blur-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-inner">
            <Coins className="h-8 w-8" />
          </div>
          <div>
            <div className="text-xs text-navy-400 font-semibold uppercase tracking-wider">Credits saldo</div>
            <div className="text-4xl font-black text-white">{credits} credits</div>
            <div className="text-[10px] text-navy-500 mt-1">1 credit ger upp till 1 hämtad lead</div>
          </div>
        </div>
        <div className="text-xs text-navy-400 max-w-xs leading-relaxed">
          Inga fasta avgifter eller dolda kostnader. Dina credits sparas för alltid och kan användas till alla framtida scrapers.
        </div>
      </div>

      {/* Credit Packages Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-brand-400" />
          Köp fler credits
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isPro = plan.id === 'pro';
            return (
              <div 
                key={plan.id}
                className={`p-6 rounded-2xl border bg-navy-900/20 flex flex-col justify-between ${
                  isPro ? 'border-brand-500/50 shadow-md bg-brand-500/[0.02]' : 'border-navy-850'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white text-base">{plan.name}</h3>
                    {isPro && (
                      <span className="px-2.5 py-0.5 rounded bg-brand-500 text-navy-950 font-black text-[9px] uppercase tracking-wide">
                        Populär
                      </span>
                    )}
                  </div>
                  
                  <div className="text-3xl font-black text-white mb-2">{plan.priceSEK} kr</div>
                  <div className="text-2xl font-black text-brand-400 mb-4">{plan.credits} credits</div>
                  
                  <ul className="space-y-2 text-xs text-navy-300 mb-6">
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-400" /> Sparas obegränsat</li>
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-400" /> Max {plan.maxPerJob} leads per sökning</li>
                    <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-400" /> Ingen egen nyckel krävs</li>
                  </ul>
                </div>

                <CheckoutButton
                  planId={plan.id}
                  price={plan.priceSEK}
                  label="Köp nu"
                  className={
                    isPro 
                      ? 'bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white shadow'
                      : 'border border-navy-700 bg-navy-850 hover:bg-navy-800 text-white'
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="h-5 w-5 text-brand-400" />
          Transaktionshistorik
        </h2>

        {transactions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-navy-850 bg-navy-900/10 text-xs text-navy-500">
            Du har inga transaktioner registrerade på ditt konto ännu.
          </div>
        ) : (
          <div className="border border-navy-850 bg-navy-900/20 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy-900/60 border-b border-navy-850 text-navy-400 text-xs">
                    <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Datum</th>
                    <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Typ</th>
                    <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Antal credits</th>
                    <th className="px-6 py-3.5 text-left font-bold uppercase tracking-wider">Referens / Händelse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-850/60 text-navy-300">
                  {transactions.map((tx) => {
                    const dateStr = new Date(tx.created_at).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    const isCreditAdded = tx.amount > 0;
                    
                    let typeLabel = '';
                    if (tx.type === 'purchase') typeLabel = 'Köp';
                    else if (tx.type === 'usage') typeLabel = 'Sökning';
                    else if (tx.type === 'refund') typeLabel = 'Återbetalning';

                    return (
                      <tr key={tx.id} className="hover:bg-navy-900/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-navy-400 text-xs">
                          {dateStr}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-xs">
                          <span className={`px-2 py-0.5 rounded ${
                            tx.type === 'purchase'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : tx.type === 'usage'
                              ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {typeLabel}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap font-bold text-xs flex items-center gap-1 ${
                          isCreditAdded ? 'text-emerald-400' : 'text-navy-300'
                        }`}>
                          {isCreditAdded ? (
                            <span className="inline-flex items-center gap-0.5"><TrendingUp className="h-3.5 w-3.5" /> +{tx.amount}</span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5"><TrendingDown className="h-3.5 w-3.5 text-navy-500" /> {tx.amount}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-navy-400">
                          {tx.type === 'usage' ? (
                            <Link href={`/dashboard/jobs/${tx.reference_id}`} className="text-brand-400 hover:underline">
                              Visa sökjobb
                            </Link>
                          ) : tx.type === 'refund' ? (
                            <Link href={`/dashboard/jobs/${tx.reference_id}`} className="text-brand-400 hover:underline">
                              Körningsfel: återbetalad
                            </Link>
                          ) : (
                            <span className="font-mono text-[10px] text-navy-500">Stripe ID: {tx.reference_id?.substring(0, 15)}...</span>
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
