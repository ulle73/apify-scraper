import { ShieldCheck, Scale, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="relative overflow-hidden bg-navy-950 text-white min-h-screen py-20">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16 border-b border-navy-900 pb-10">
          <div className="inline-flex p-3 bg-brand-500/10 text-brand-400 rounded-2xl mb-4 border border-brand-500/20">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4 sm:text-5xl">
            Riktlinjer & Compliance (GDPR)
          </h1>
          <p className="text-lg text-navy-300">
            Hur SuperScraper förhåller sig till dataskyddsförordningen och hur du som kund använder vår tjänst på ett lagligt sätt.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-12 text-navy-300">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-brand-400" />
              1. Varifrån kommer datan?
            </h2>
            <p className="leading-relaxed">
              SuperScraper är en s.k. "scraper-wrapper". Datan vi hämtar är publikt tillgänglig information från öppna källor, främst Google Maps platsprofiler. Detta inkluderar uppgifter som företagsnamn, publika telefonnummer, kategorisering, hemsidor samt i vissa fall publika e-postadresser. Datan har publicerats av företagen själva i syfte att hållas tillgänglig för allmänheten.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Scale className="h-6 w-6 text-brand-400" />
              2. GDPR och B2B-kontaktuppgifter
            </h2>
            <p className="leading-relaxed font-semibold text-white">
              GDPR reglerar hantering av personuppgifter för fysiska personer. Det gäller i regel inte för aktiebolag (juridiska personer).
            </p>
            <p className="leading-relaxed">
              B2B-kontaktuppgifter såsom generella e-postadresser (t.ex. <code className="text-brand-300">info@foretag.se</code>) och kontorstelefonnummer klassas inte som personuppgifter. Personuppgifter kan dock uppstå om insamlad information rör enskilda firmor (där organisationsnumret är ägarens personnummer) eller om e-postadressen är personlig (t.ex. <code className="text-brand-300">fornamn.efternamn@foretag.se</code>).
            </p>
            <p className="leading-relaxed">
              När du laddar ner leads som innehåller personliga e-postadresser, har du stöd av <strong>intresseavvägning (Artikel 6.1 f GDPR)</strong> som rättslig grund för att kontakta dem i marknadsföringssyfte, under förutsättning att ditt erbjudande är relevant för deras yrkesroll.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              3. Kundens ansvar (Viktigt!)
            </h2>
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-navy-300 leading-relaxed text-sm space-y-3">
              <p>
                När du exporterar data från SuperScraper blir du <strong>personuppgiftsansvarig</strong> för hur den datan lagras och används i dina egna system.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Marknadsföringslagen:</strong> Du får kontakta aktiebolag via telefon och e-post utan föregående samtycke (opt-in). Däremot får du inte skicka e-postreklam till enskilda firmor eller privatpersoner utan föregående samtycke.
                </li>
                <li>
                  <strong>Opt-out:</strong> Du måste erbjuda ett enkelt och kostnadsfritt sätt för mottagaren att avregistrera sig (opt-out) från framtida utskick. Om en person begär att bli borttagen måste du respektera detta omgående.
                </li>
                <li>
                  <strong>Ingen mass-spam:</strong> Vi tillåter inte att SuperScraper används för att skicka massutskick av låg kvalitet till tusentals adresser utan relevans. Utskicken måste vara riktade och affärsmässigt motiverade.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-brand-400" />
              4. Hur SuperScraper skyddar integriteten
            </h2>
            <p className="leading-relaxed">
              Vi säljer aldrig dina exporterade filer vidare. All data lagras temporärt i våra databaser för att du ska kunna ladda ner dina köpta listor från din personliga dashboard. Vi använder branschstandardkryptering för att skydda din data.
            </p>
            <p className="leading-relaxed">
              Om du representerar ett företag som finns listat på Google Maps och inte vill att era uppgifter ska kunna exporteras via vårt sökverktyg, kan du kontakta oss på <a href="mailto:optout@superscraper.se" className="text-brand-400 hover:underline">optout@superscraper.se</a> så lägger vi till era uppgifter i vår spärrlista.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
