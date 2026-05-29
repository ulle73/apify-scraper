import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Search, 
  Mail, 
  Camera, 
  FileText, 
  Globe,
  ArrowRight, 
  Check,
  MousePointerClick,
  Coins,
  Download,
  Play,
  CheckCircle2,
  ShieldCheck,
  Star,
  Clock
} from 'lucide-react';
import { getEnabledAdapters } from '@/lib/scrapers/registry';

export default function HomePage() {
  const enabledScrapers = getEnabledAdapters();

  return (
    <div className="relative overflow-hidden bg-[#f9fafc] text-slate-800 min-h-screen">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-blue-200/40 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-[100px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-xs font-bold tracking-wide">
                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Get ready-to-use data in minutes
              </div> */}
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Buy data scrapes.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">Get clean results.</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed">
                Choose a scraper, enter a few details, pay securely and download your data as CSV or Excel.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/signup"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                >
                  Browse scrapers
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
                <Link
                  href="/#how-it-works"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all duration-200"
                >
                  <Play className="h-4 w-4 fill-slate-700 text-slate-700" />
                  How it works
                </Link>
              </div>
            </div>

            {/* Right Column: Premium CSS Graphic */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* Blur backdrop sphere */}
              <div className="absolute w-[320px] h-[320px] rounded-full bg-blue-200/50 blur-[80px] pointer-events-none" />
              
              <div className="relative w-full max-w-[480px] h-[340px] flex items-center justify-center">
                
                {/* Main Results Table Panel */}
                <div className="absolute w-[280px] sm:w-[320px] bg-white rounded-2xl border border-slate-100 p-5 shadow-2xl z-10">
                  <div className="flex items-center gap-3.5 mb-4 pb-3 border-b border-slate-100">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-sm">
                      <Check className="h-5 w-5 stroke-[3]" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Leads exported successfully</div>
                      <div className="text-[10px] text-slate-400 font-medium">100 leads validated & deduped</div>
                    </div>
                  </div>
                  {/* Fake spreadsheet rows */}
                  <div className="space-y-2.5">
                    <div className="flex gap-2 items-center">
                      <div className="h-2 w-16 bg-slate-100 rounded" />
                      <div className="h-2 w-28 bg-slate-100 rounded" />
                      <div className="h-2 w-8 bg-slate-100 rounded ml-auto" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="h-2 w-20 bg-slate-100 rounded" />
                      <div className="h-2 w-20 bg-slate-100 rounded" />
                      <div className="h-2 w-8 bg-slate-100 rounded ml-auto" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="h-2 w-14 bg-slate-100 rounded" />
                      <div className="h-2 w-24 bg-slate-100 rounded" />
                      <div className="h-2 w-8 bg-slate-100 rounded ml-auto" />
                    </div>
                  </div>
                </div>

                {/* Floating Elements (Tilted white round cards with icons) */}
                
                {/* MapPin */}
                <div className="absolute top-[5%] left-[5%] bg-white rounded-2xl border border-slate-100 p-3 shadow-xl flex items-center justify-center z-20 animate-float-1">
                  <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-sm">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>

                {/* Web Globe */}
                <div className="absolute top-[-5%] right-[15%] bg-white rounded-2xl border border-slate-100 p-3 shadow-xl flex items-center justify-center z-20 animate-float-2">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm">
                    <Globe className="h-5 w-5" />
                  </div>
                </div>

                {/* Instagram */}
                <div className="absolute bottom-[10%] left-[2%] bg-white rounded-2xl border border-slate-100 p-3 shadow-xl flex items-center justify-center z-20 animate-float-3">
                  <div className="h-9 w-9 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center shadow-sm">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                </div>

                {/* TikTok */}
                <div className="absolute bottom-[15%] right-[5%] bg-white rounded-2xl border border-slate-100 p-3 shadow-xl flex items-center justify-center z-20 animate-float-1">
                  <div className="h-9 w-9 rounded-xl bg-slate-50 text-slate-800 flex items-center justify-center shadow-sm">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.41-.43-.6-.67-.04 2.87-.01 5.75-.02 8.62-.05 1.55-.47 3.16-1.43 4.39-1.37 1.83-3.72 2.63-5.97 2.37-2.1-.21-4.04-1.54-4.95-3.46-.99-2.01-.84-4.52.41-6.38 1.05-1.6 2.86-2.55 4.77-2.58.12 0 .24 0 .36.01v4.1c-1.12-.13-2.31.29-3.01 1.2-.68.87-.69 2.16-.06 3.07.68.96 1.93 1.34 3.01 1 .98-.28 1.67-1.2 1.75-2.22.08-2.98.03-5.96.05-8.94V0c-.88.01-1.76.01-2.65.02z" />
                    </svg>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. POPULAR SCRAPERS SECTION */}
      <section id="popular-scrapers" className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Popular scrapers
              </h2>
            </div>
            <Link 
              href="/signup" 
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition"
            >
              View all
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid showing only REAL and CONNECTED scrapers (google-maps) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enabledScrapers.map((scraper) => {
              return (
                <Link
                  key={scraper.id}
                  href={`/signup`}
                  className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-blue-200 hover:scale-[1.01] active:scale-[0.99] transition duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-2xl border border-slate-100 shadow-sm bg-slate-50 shrink-0 flex items-center justify-center p-1.5">
                      <Image
                        src={scraper.icon || '/icons/default.svg'}
                        alt={scraper.name}
                        width={40}
                        height={40}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {scraper.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        {scraper.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      From {scraper.id === 'google-maps' ? '10' : '10'} credits
                    </span>
                    <div className="h-8.5 w-8.5 rounded-full bg-slate-50 text-slate-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                      <ArrowRight className="h-4.5 w-4.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-[#f9fafc]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto relative">
            
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center group">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100/50 mb-6 group-hover:scale-105 transition-transform duration-200">
                <MousePointerClick className="h-6.5 w-6.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">1. Choose scraper</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Pick the scraper you need from our catalog.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center group">
              <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm border border-amber-100/50 mb-6 group-hover:scale-105 transition-transform duration-200">
                <Coins className="h-6.5 w-6.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">2. Pay or use credits</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Secure checkout or use your existing credits.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center group">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100/50 mb-6 group-hover:scale-105 transition-transform duration-200">
                <Download className="h-6.5 w-6.5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">3. Get your results</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                We run the scrape and you download clean data.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. COMPLIANCE & GDPR SECTION */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 text-center space-y-6">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100/50 shadow-sm">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Tryggt & GDPR-kompatibelt
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto">
            Datan vi samlar in kommer från publika källor där informationen publicerats i syfte att hållas tillgänglig för allmänheten. Vi lagrar inte rådata längre än nödvändigt för att generera din export och vi säljer aldrig dina filer vidare.
          </p>
          <Link href="/compliance" className="text-blue-600 hover:text-blue-700 font-bold text-sm inline-flex items-center gap-1 group transition">
            Läs mer i våra riktlinjer
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-20 bg-[#f9fafc] border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
              Vanliga frågor
            </h2>
            <p className="text-slate-500 text-sm">
              Här hittar du svar på de vanligaste frågorna om credits, scraping och laglighet.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Var kommer datan ifrån?</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                I V1 hämtas datan direkt från Google Maps och publika platsprofiler. Datan innehåller företagsuppgifter som registrerats för att vara sökbara för allmänheten.
              </p>
            </div>
            
            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Är detta lagligt enligt GDPR?</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Ja, att samla in publik kontaktinformation om juridiska personer (företag) för B2B-ändamål är tillåtet under intresseavvägning. Du som kund ansvarar dock för hur du använder datan, t.ex. att du inte skickar spam till enskilda firmor (fysiska personer) utan laglig grund.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Hur fungerar credits?</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                1 credit motsvarar 1 insamlat lead. Om du beställer en sökning på 100 leads dras 100 credits. Om det bara hittas 80 leads på platsen återbetalas de återstående 20 credits till din dashboard automatiskt efter att jobbet slutförts.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Behöver jag en egen Apify-nyckel?</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Nej. Vi hanterar alla API-anrop, servrar och proxy-kostnader bakom kulisserna. Du betalar bara för resultaten via våra credit-paket.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-20 bg-white border-t border-slate-100 relative">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl p-12 text-center shadow-lg relative overflow-hidden space-y-6">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight max-w-xl mx-auto">
              Redo att skapa din första leadlista?
            </h2>
            <p className="text-blue-100 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
              Skapa ett konto kostnadsfritt och utforska gränssnittet. Du kan köpa credits via Stripe och starta din första sökning direkt.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-white text-blue-600 hover:bg-slate-50 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
              >
                Registrera dig nu
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
