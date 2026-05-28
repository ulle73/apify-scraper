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
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fakturering & Credits</h1>
        <p className="text-slate-500 text-sm mt-1">
          Köp fler credits eller visa historik över dina transaktioner.
        </p>
      </div>

      {/* Stripe Payment Notifications */}
      {paymentStatus === 'success' && (
        <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] text-xs font-semibold flex gap-2.5 items-center">
          <PlusCircle className="h-4.5 w-4.5 shrink-0" />
          <span>Köp genomfört! Dina credits har lagts till på ditt saldo. Det kan ta upp till en minut innan Stripe synkar helt.</span>
        </div>
      )}
      {paymentStatus === 'cancelled' && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex gap-2.5 items-center">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>Köp avbröts. Inga pengar drogs från ditt kort.</span>
        </div>
      )}

      {/* Stripe Sandbox Mode Banner - styled to be extremely clean and readable */}
      {process.env.STRIPE_MODE === 'test' && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="text-base">🧪</span>
            <span>Stripe Sandbox / Test-läge aktivt</span>
          </div>
          <p className="text-xs text-amber-850/80 leading-relaxed font-semibold">
            Inga riktiga betalningar genomförs. Använd Stripes testkort för att simulera köp:
          </p>
          <div className="flex flex-wrap gap-3 mt-1">
            <div className="text-xs font-mono bg-amber-100/50 border border-amber-200/60 px-3.5 py-2 rounded-xl text-amber-900">
              <span className="font-bold">Kortnummer: </span>
              <span className="tracking-widest">4242 4242 4242 4242</span>
            </div>
            <div className="text-xs font-mono bg-amber-100/50 border border-amber-200/60 px-3.5 py-2 rounded-xl text-amber-900">
              <span className="font-bold">Utgångsdatum: </span>
              <span>valfritt i framtiden</span>
            </div>
            <div className="text-xs font-mono bg-amber-100/50 border border-amber-200/60 px-3.5 py-2 rounded-xl text-amber-900">
              <span className="font-bold">CVC: </span>
              <span>valfri 3 siffror</span>
            </div>
          </div>
        </div>
      )}

      {/* Credits Card Display */}
      <div className="p-6 rounded-2xl border border-[#F1F5F9] bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] border border-[#E2E8F0]">
            <Coins className="h-8 w-8" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Credits saldo</div>
            <div className="text-4xl font-black text-slate-900 mt-0.5">{credits} credits</div>
            <div className="text-[10px] text-slate-400 font-semibold mt-1">1 credit ger upp till 1 hämtad lead</div>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
          Inga fasta avgifter eller dolda kostnader. Dina credits sparas för alltid och kan användas till alla framtida scrapers.
        </div>
      </div>

      {/* Credit Packages Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#4F46E5]" />
          Köp fler credits
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isPro = plan.id === 'pro';
            return (
              <div 
                key={plan.id}
                className={`p-6 rounded-2xl border bg-white flex flex-col justify-between transition-all ${
                  isPro 
                    ? 'border-2 border-[#4F46E5] shadow-md shadow-[#4F46E5]/5' 
                    : 'border-[#F1F5F9] shadow-sm'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-900 text-base">{plan.name}</h3>
                    {isPro && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5] font-black text-[9px] uppercase tracking-wide">
                        Populär
                      </span>
                    )}
                  </div>
                  
                  <div className="text-3xl font-black text-slate-900 mb-2">{plan.priceSEK} kr</div>
                  <div className="text-2xl font-black text-[#4F46E5] mb-4">{plan.credits} credits</div>
                  
                  <ul className="space-y-2 text-xs text-slate-500 font-semibold mb-6">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#4F46E5] shrink-0" /> Sparas obegränsat</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#4F46E5] shrink-0" /> Max {plan.maxPerJob} leads per sökning</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#4F46E5] shrink-0" /> Ingen egen nyckel krävs</li>
                  </ul>
                </div>

                <CheckoutButton
                  planId={plan.id}
                  price={plan.priceSEK}
                  label="Köp nu"
                  className={
                    isPro 
                      ? 'bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-md shadow-[#4F46E5]/15 font-bold rounded-xl w-full py-3.5 transition-all text-sm'
                      : 'border border-[#E2E8F0] hover:bg-slate-50 bg-white text-slate-700 font-bold rounded-xl w-full py-3.5 transition-all text-sm'
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
          <History className="h-5 w-5 text-[#4F46E5]" />
          Transaktionshistorik
        </h2>

        {transactions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-[#F1F5F9] bg-white text-xs text-slate-400 shadow-sm font-semibold">
            Du har inga transaktioner registrerade på ditt konto ännu.
          </div>
        ) : (
          <div className="border border-[#F1F5F9] bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-[#F1F5F9] text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                    <th className="px-6 py-4">Datum</th>
                    <th className="px-6 py-4">Typ</th>
                    <th className="px-6 py-4">Antal credits</th>
                    <th className="px-6 py-4">Referens / Händelse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-slate-600 font-semibold text-xs">
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
                      <tr key={tx.id} className="hover:bg-slate-50/25 transition-colors">
                        <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                          {dateStr}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            tx.type === 'purchase'
                              ? 'bg-[#EAFDF5] text-[#10B981] border border-[#A7F3D0]'
                              : tx.type === 'usage'
                              ? 'bg-blue-50 text-blue-600 border border-blue-200'
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}>
                            {typeLabel}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap font-bold flex items-center gap-1 ${
                          isCreditAdded ? 'text-[#10B981]' : 'text-slate-900'
                        }`}>
                          {isCreditAdded ? (
                            <span className="inline-flex items-center gap-0.5"><TrendingUp className="h-3.5 w-3.5" /> +{tx.amount}</span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5"><TrendingDown className="h-3.5 w-3.5 text-slate-400" /> {tx.amount}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {tx.type === 'usage' ? (
                            <Link href={`/dashboard/jobs/${tx.reference_id}`} className="text-[#4F46E5] hover:underline font-bold">
                              Visa sökjobb
                            </Link>
                          ) : tx.type === 'refund' ? (
                            <Link href={`/dashboard/jobs/${tx.reference_id}`} className="text-[#4F46E5] hover:underline font-bold">
                              Körningsfel: återbetalad
                            </Link>
                          ) : (
                            <span className="font-mono text-[10px] text-slate-400 font-normal">Stripe ID: {tx.reference_id?.substring(0, 15)}...</span>
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
