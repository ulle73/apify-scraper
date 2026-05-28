import Link from 'next/link';
import { Check, ShieldCheck, HelpCircle } from 'lucide-react';
import { PLANS } from '@/lib/pricing/plans';

export default function PricingPage() {
  return (
    <div className="relative overflow-hidden bg-navy-950 text-white min-h-screen py-20">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4 sm:text-5xl">
            Enkla priser, inga löpande abonnemang
          </h1>
          <p className="text-lg text-navy-300">
            Köp credits i paket. Dina credits har ingen utgångsdatum och du betalar bara för de leads du faktiskt laddar ner.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {PLANS.map((plan) => {
            const isPro = plan.id === 'pro';
            return (
              <div 
                key={plan.id}
                className={`relative rounded-2xl border bg-navy-900/40 p-8 flex flex-col justify-between ${
                  isPro 
                    ? 'border-brand-500/80 shadow-xl shadow-brand-500/5 scale-[1.03] z-10' 
                    : 'border-navy-850'
                }`}
              >
                {isPro && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 translate-y-[-50%] px-3 py-1 rounded-full bg-brand-500 text-navy-950 text-xs font-extrabold uppercase tracking-wide">
                    Rekommenderas
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-4xl font-extrabold text-white">{plan.priceSEK} kr</span>
                    <span className="text-xs text-navy-400">engångsavgift</span>
                  </div>

                  <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-850 mb-6">
                    <div className="text-2xl font-black text-brand-400 mb-0.5">{plan.credits} st</div>
                    <div className="text-xs text-navy-300 font-medium">Credits (= upp till {plan.credits} leads)</div>
                  </div>

                  <ul className="space-y-3 mb-8 text-sm text-navy-300">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-brand-400 shrink-0" />
                      Credits sparas för alltid
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-brand-400 shrink-0" />
                      Geografisk sökning i Norden
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-brand-400 shrink-0" />
                      Max {plan.maxPerJob} leads per sökning
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-brand-400 shrink-0" />
                      Automatisk deduplicering
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-brand-400 shrink-0" />
                      CSV & framtida Excel-exporter
                    </li>
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className={`w-full py-3 rounded-xl text-center text-sm font-semibold tracking-wide block ${
                    isPro 
                      ? 'bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white shadow-md' 
                      : 'border border-navy-700 bg-navy-850 text-navy-200 hover:bg-navy-850/80 hover:text-white'
                  } hover:scale-[1.01] transition-all duration-200`}
                >
                  Köp credit-paket
                </Link>
              </div>
            );
          })}
        </div>

        {/* Custom Pricing Alert */}
        <div className="max-w-3xl mx-auto p-6 rounded-2xl border border-navy-850 bg-navy-900/30 flex flex-col sm:flex-row items-center justify-between gap-6 mb-20">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Behöver du anpassade volymer?</h3>
            <p className="text-sm text-navy-300">
              Vi kan sätta upp skräddarsydda integrationer och bulk-exporter för över 100 000 leads per månad.
            </p>
          </div>
          <a
            href="mailto:support@superscraper.se"
            className="px-6 py-3 rounded-xl text-sm font-semibold border border-navy-700 bg-navy-850 hover:bg-navy-800 text-white whitespace-nowrap transition"
          >
            Kontakta supporten
          </a>
        </div>

        {/* Bottom Trust Banner */}
        <div className="max-w-xl mx-auto text-center border-t border-navy-900 pt-10">
          <div className="inline-flex text-brand-400 gap-2 mb-3 items-center justify-center text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            Säkra betalningar via Stripe
          </div>
          <p className="text-xs text-navy-500">
            Moms tillkommer för företagskunder. Alla transaktioner sker krypterat och säkert.
          </p>
        </div>
      </div>
    </div>
  );
}
