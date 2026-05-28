import Link from 'next/link';
import { 
  Zap, 
  MapPin, 
  Search, 
  Mail, 
  Camera, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Phone, 
  Globe, 
  Star, 
  ListFilter,
  Check
} from 'lucide-react';
import { PLANS } from '@/lib/pricing/plans';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-navy-950 text-white min-h-screen">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[700px] h-[700px] rounded-full bg-cyan-500/5 blur-[140px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-navy-800 bg-navy-900/60 backdrop-blur text-brand-400 text-xs font-semibold tracking-wide mb-6">
            <Zap className="h-3 w-3 fill-current" />
            Svensk B2B Leads-MVP i V1
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-6">
            Skapa färdiga B2B-listor från öppna källor på <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-400">några minuter</span>
          </h1>
          
          <p className="text-lg md:text-xl text-navy-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Välj bransch, plats och max antal leads. Vår motor hämtar, validerar, deduplicerar och exporterar datan direkt åt dig. Ingen egen Apify-nyckel behövs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:from-brand-400 hover:to-brand-600 shadow-lg shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Skapa din första lista
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold border border-navy-700 bg-navy-900/40 hover:bg-navy-800/80 hover:border-navy-600 transition-all duration-200"
            >
              Se prissättning
            </Link>
          </div>

          {/* Interactive UI Mockup */}
          <div className="relative max-w-5xl mx-auto rounded-2xl border border-navy-800 bg-navy-900/60 p-2 shadow-2xl backdrop-blur-sm">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-navy-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-xl border border-navy-800 overflow-hidden bg-navy-950 p-6 text-left">
              {/* Fake Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-navy-900 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="text-xs text-navy-500 font-mono">superscraper.se/dashboard/create</div>
                <div className="w-12" />
              </div>

              {/* Fake Page Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left panel: Form */}
                <div className="md:col-span-1 space-y-4">
                  <div className="p-4 rounded-xl border border-brand-500/30 bg-brand-500/5">
                    <label className="block text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">Aktiv Scraper</label>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-brand-400" />
                      <div>
                        <div className="text-sm font-bold text-white">Google Maps Leads</div>
                        <div className="text-xs text-brand-300">1 credit = 1 lead</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy-400 uppercase tracking-wider mb-1.5">Stad / Region</label>
                    <div className="w-full px-3 py-2 bg-navy-900 border border-navy-800 rounded-lg text-sm text-white font-medium">Göteborg</div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy-400 uppercase tracking-wider mb-1.5">Sökord / Bransch</label>
                    <div className="w-full px-3 py-2 bg-navy-900 border border-navy-800 rounded-lg text-sm text-white font-medium">bilverkstad</div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy-400 uppercase tracking-wider mb-1.5">Max antal resultat</label>
                    <div className="w-full px-3 py-2 bg-navy-900 border border-navy-800 rounded-lg text-sm text-white font-medium">100 st</div>
                  </div>
                </div>

                {/* Right panel: Table Preview */}
                <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
                  <div className="border border-navy-900 rounded-xl overflow-hidden bg-navy-950/80">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-navy-900 text-navy-400 border-b border-navy-900">
                          <th className="px-4 py-2 text-left">Företag</th>
                          <th className="px-4 py-2 text-left">Telefon</th>
                          <th className="px-4 py-2 text-left">Hemsida</th>
                          <th className="px-4 py-2 text-left">Rating</th>
                        </tr>
                      </thead>
                      <tbody className="text-navy-300 divide-y divide-navy-900/40">
                        <tr>
                          <td className="px-4 py-2.5 font-bold text-white">Göteborgs Bilverkstad AB</td>
                          <td className="px-4 py-2.5">031-123 45 67</td>
                          <td className="px-4 py-2.5 text-brand-400">goteborgsbilverkstad.se</td>
                          <td className="px-4 py-2.5 flex items-center gap-1"><Star className="h-3 w-3 fill-current text-yellow-400" />4.6</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-bold text-white">Meca Göteborg - Hisingens Bilservice</td>
                          <td className="px-4 py-2.5">031-987 65 43</td>
                          <td className="px-4 py-2.5 text-brand-400">meca.se/hisingen</td>
                          <td className="px-4 py-2.5 flex items-center gap-1"><Star className="h-3 w-3 fill-current text-yellow-400" />4.2</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-bold text-white">Bilia Göteborg - Almedal</td>
                          <td className="px-4 py-2.5">0771-400 000</td>
                          <td className="px-4 py-2.5 text-brand-400">bilia.se/almedal</td>
                          <td className="px-4 py-2.5 flex items-center gap-1"><Star className="h-3 w-3 fill-current text-yellow-400" />4.0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 rounded-xl border border-navy-800 bg-navy-900/30 flex items-center justify-between">
                    <div className="text-xs text-navy-400">
                      <span className="font-bold text-white">Kalkylerad kostnad:</span> 100 credits (motsvarar 100 kr)
                    </div>
                    <div className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      Redo att köra
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-navy-900/40 border-y border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Så fungerar det
            </h2>
            <p className="text-navy-300 max-w-2xl mx-auto">
              Att samla in högkvalitativa leads från publika källor ska inte kräva komplexa script eller dyra plattformar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl border border-navy-800 bg-navy-900/60 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-lg mb-6 border border-brand-500/20">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Välj datakälla & parameter</h3>
              <p className="text-sm text-navy-400 leading-relaxed">
                Välj scraper (t.ex. Google Maps) och ställ in önskat sökord (t.ex. "frisör"), stad ("Uppsala") och land ("Sverige").
              </p>
            </div>
            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl border border-navy-800 bg-navy-900/60 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-lg mb-6 border border-brand-500/20">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Vi hämtar & deduplicerar</h3>
              <p className="text-sm text-navy-400 leading-relaxed">
                Vår scraper startar i bakgrunden och hämtar all information. Datan körs genom vår tvätt som sorterar bort dubbletter automatiskt.
              </p>
            </div>
            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl border border-navy-800 bg-navy-900/60 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-lg mb-6 border border-brand-500/20">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ladda ner din lista</h3>
              <p className="text-sm text-navy-400 leading-relaxed">
                När körningen är klar laddar du ner din rena B2B-leadlista i CSV-format, fylld med validerade företagsnamn, telefonnummer och hemsidor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT'S INCLUDED SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Vad ingår i exporten?
            </h2>
            <p className="text-navy-300 max-w-2xl mx-auto">
              Vi sköter mappningen så att du alltid får ett enhetligt och strukturerat format med följande datapunkter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="p-5 rounded-xl border border-navy-800/80 bg-navy-900/20 flex gap-4">
              <div className="p-2 rounded bg-navy-800 text-brand-400 self-start">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Företagsnamn</h3>
                <p className="text-xs text-navy-400">Det fullständiga publika företagsnamnet registrerat på platsen.</p>
              </div>
            </div>
            {/* Column 2 */}
            <div className="p-5 rounded-xl border border-navy-800/80 bg-navy-900/20 flex gap-4">
              <div className="p-2 rounded bg-navy-800 text-brand-400 self-start">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Telefonnummer</h3>
                <p className="text-xs text-navy-400">Direktnummer till företaget, perfekt för kallsamtal eller sms.</p>
              </div>
            </div>
            {/* Column 3 */}
            <div className="p-5 rounded-xl border border-navy-800/80 bg-navy-900/20 flex gap-4">
              <div className="p-2 rounded bg-navy-800 text-brand-400 self-start">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Hemsida & Domän</h3>
                <p className="text-xs text-navy-400">Länkar samt renodlad domän (t.ex. "företag.se") för CRM-matchning.</p>
              </div>
            </div>
            {/* Column 4 */}
            <div className="p-5 rounded-xl border border-navy-800/80 bg-navy-900/20 flex gap-4">
              <div className="p-2 rounded bg-navy-800 text-brand-400 self-start">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Adress, Stad & Land</h3>
                <p className="text-xs text-navy-400">Fullständig postadress separerad i gata, stad och region.</p>
              </div>
            </div>
            {/* Column 5 */}
            <div className="p-5 rounded-xl border border-navy-800/80 bg-navy-900/20 flex gap-4">
              <div className="p-2 rounded bg-navy-800 text-brand-400 self-start">
                <Star className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Betyg & Recensioner</h3>
                <p className="text-xs text-navy-400">Snittbetyg och totala antalet recensioner för kvalitetsbedömning.</p>
              </div>
            </div>
            {/* Column 6 */}
            <div className="p-5 rounded-xl border border-navy-800/80 bg-navy-900/20 flex gap-4">
              <div className="p-2 rounded bg-navy-800 text-brand-400 self-start">
                <ListFilter className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Kategori</h3>
                <p className="text-xs text-navy-400">Huvudkategori (t.ex. "Däckverkstad") för enkel segmentering.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOURCES SECTION */}
      <section className="py-20 bg-navy-900/30 border-t border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Stöd för flera scrapers
            </h2>
            <p className="text-navy-300 max-w-2xl mx-auto">
              SuperScraper är byggt med ett modernt adapter-system för att snabbt kunna ansluta nya datakällor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Active source: Google Maps */}
            <div className="p-6 rounded-2xl border border-brand-500/40 bg-brand-500/5 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-emerald-400 flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 fill-current text-navy-950" />
                Aktiv i V1
              </div>
              <MapPin className="h-8 w-8 text-brand-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Google Maps Leadlista</h3>
              <p className="text-sm text-navy-300">
                Hitta lokala företag, butiker och tjänster baserat på geografiskt sökord och betyg.
              </p>
            </div>

            {/* Coming Soon sources */}
            <div className="p-6 rounded-2xl border border-navy-850 bg-navy-900/30 relative opacity-75">
              <div className="absolute top-4 right-4 text-navy-500 flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                <Clock className="h-4 w-4" />
                Kommer snart
              </div>
              <Search className="h-8 w-8 text-navy-500 mb-4" />
              <h3 className="text-lg font-bold text-navy-300 mb-2">Google Sökresultat</h3>
              <p className="text-sm text-navy-500">
                Hämta och indexera organiska sökresultat från Google Sök.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-navy-850 bg-navy-900/30 relative opacity-75">
              <div className="absolute top-4 right-4 text-navy-500 flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                <Clock className="h-4 w-4" />
                Kommer snart
              </div>
              <Mail className="h-8 w-8 text-navy-500 mb-4" />
              <h3 className="text-lg font-bold text-navy-300 mb-2">Kontaktuppgifter</h3>
              <p className="text-sm text-navy-500">
                Extrahera verifierade e-postadresser och sociala medielänkar direkt från hemsidor.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-navy-850 bg-navy-900/30 relative opacity-75">
              <div className="absolute top-4 right-4 text-navy-500 flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                <Clock className="h-4 w-4" />
                Kommer snart
              </div>
              <Camera className="h-8 w-8 text-navy-500 mb-4" />
              <h3 className="text-lg font-bold text-navy-300 mb-2">Sociala Medier</h3>
              <p className="text-sm text-navy-500">
                Scrapa profiler, följarantal och inläggsdata från Instagram & TikTok.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-navy-850 bg-navy-900/30 relative opacity-75">
              <div className="absolute top-4 right-4 text-navy-500 flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                <Clock className="h-4 w-4" />
                Kommer snart
              </div>
              <FileText className="h-8 w-8 text-navy-500 mb-4" />
              <h3 className="text-lg font-bold text-navy-300 mb-2">LinkedIn Företag</h3>
              <p className="text-sm text-navy-500">
                Hämta företagsstorlek, kontorsplatser och publika detaljer från LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section className="py-20 bg-navy-950 border-t border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Flexibla credit-paket
            </h2>
            <p className="text-navy-300 max-w-2xl mx-auto">
              Inga löpande prenumerationer. Köp credits när du behöver och använd dem i din egen takt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan) => {
              const isPro = plan.id === 'pro';
              return (
                <div 
                  key={plan.id}
                  className={`relative rounded-2xl border bg-navy-900/50 p-8 flex flex-col justify-between ${
                    isPro 
                      ? 'border-brand-500/80 shadow-xl shadow-brand-500/5 scale-[1.03] z-10' 
                      : 'border-navy-850'
                  }`}
                >
                  {isPro && (
                    <div className="absolute top-0 right-1/2 translate-x-1/2 translate-y-[-50%] px-3 py-1 rounded-full bg-brand-500 text-navy-950 text-xs font-extrabold uppercase tracking-wide">
                      Mest populär
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1.5 mb-6">
                      <span className="text-4xl font-extrabold text-white">{plan.priceSEK} kr</span>
                      <span className="text-xs text-navy-400">engångsköp</span>
                    </div>

                    <div className="p-4 rounded-xl bg-navy-950/60 border border-navy-850 mb-6">
                      <div className="text-2xl font-black text-brand-400 mb-0.5">{plan.credits} st</div>
                      <div className="text-xs text-navy-300 font-medium">Credits (= upp till {plan.credits} st leads)</div>
                    </div>

                    <ul className="space-y-3 mb-8 text-sm text-navy-300">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-brand-400 shrink-0" />
                        Obegränsad giltighetstid
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-brand-400 shrink-0" />
                        Max {plan.maxPerJob} leads per körning
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-brand-400 shrink-0" />
                        Deduplicering ingår kostnadsfritt
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-brand-400 shrink-0" />
                        Export till rent CSV-format
                      </li>
                    </ul>
                  </div>

                  <Link
                    href="/signup"
                    className={`w-full py-3 rounded-xl text-center text-sm font-semibold tracking-wide block ${
                      isPro 
                        ? 'bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-400 hover:to-brand-600 text-white shadow-md' 
                        : 'border border-navy-700 bg-navy-850 text-navy-200 hover:bg-navy-850/80 hover:text-white'
                    } hover:scale-[1.01] active:scale-[0.99] transition-all duration-200`}
                  >
                    Köp nu
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. TRUST & COMPLIANCE SECTION */}
      <section className="py-16 bg-navy-900/20 border-t border-navy-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 bg-brand-500/10 text-brand-400 rounded-2xl mb-6 border border-brand-500/20">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Tryggt & GDPR-kompatibelt
          </h2>
          <p className="text-navy-300 text-sm md:text-base leading-relaxed mb-6">
            Datan vi samlar in kommer från publika källor där informationen publicerats i syfte att hållas tillgänglig för allmänheten. Vi lagrar inte rådata längre än nödvändigt för att generera din export och vi säljer aldrig dina filer vidare.
          </p>
          <Link href="/compliance" className="text-brand-400 hover:text-brand-300 font-semibold text-sm inline-flex items-center gap-1">
            Läs mer i våra riktlinjer
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-20 border-t border-navy-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Vanliga frågor
            </h2>
            <p className="text-navy-300">
              Här hittar du svar på de vanligaste frågorna om credits, scraping och laglighet.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-navy-850 bg-navy-900/30">
              <h3 className="font-bold text-white text-base mb-2">Var kommer datan ifrån?</h3>
              <p className="text-sm text-navy-405 leading-relaxed text-navy-400">
                I V1 hämtas datan direkt från Google Maps och publika platsprofiler. Datan innehåller företagsuppgifter som registrerats för att vara sökbara för allmänheten.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl border border-navy-850 bg-navy-900/30">
              <h3 className="font-bold text-white text-base mb-2">Är detta lagligt enligt GDPR?</h3>
              <p className="text-sm text-navy-405 leading-relaxed text-navy-400">
                Ja, att samla in publik kontaktinformation om juridiska personer (företag) för B2B-ändamål är tillåtet under intresseavvägning. Du som kund ansvarar dock för hur du använder datan, t.ex. att du inte skickar spam till enskilda firmor (fysiska personer) utan laglig grund.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-navy-850 bg-navy-900/30">
              <h3 className="font-bold text-white text-base mb-2">Hur fungerar credits?</h3>
              <p className="text-sm text-navy-405 leading-relaxed text-navy-400">
                1 credit motsvarar 1 insamlat lead. Om du beställer en sökning på 100 leads dras 100 credits. Om det bara hittas 80 leads på platsen återbetalas de återstående 20 credits till din dashboard automatiskt efter att jobbet slutförts.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-navy-850 bg-navy-900/30">
              <h3 className="font-bold text-white text-base mb-2">Behöver jag en egen Apify-nyckel?</h3>
              <p className="text-sm text-navy-405 leading-relaxed text-navy-400">
                Nej. Vi hanterar alla API-anrop, servrar och proxy-kostnader bakom kulisserna. Du betalar bara för resultaten via våra credit-paket.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA SECTION */}
      <section className="py-20 border-t border-navy-900 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
            Redo att skapa din första leadlista?
          </h2>
          <p className="text-navy-300 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            Skapa ett konto kostnadsfritt och utforska gränssnittet. Du kan köpa credits via Stripe och starta din första sökning direkt.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:from-brand-400 hover:to-brand-600 shadow-lg shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Registrera dig nu
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
