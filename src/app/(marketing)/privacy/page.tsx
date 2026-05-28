export default function PrivacyPage() {
  return (
    <div className="relative bg-navy-950 text-white min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold mb-8 text-white">Integritetspolicy (Privacy Policy)</h1>
        
        <div className="space-y-6 text-sm text-navy-300 leading-relaxed">
          <p className="text-xs text-navy-500">Senast uppdaterad: 28 maj 2026</p>
          
          <p>
            På SuperScraper värnar vi om din integritet. Denna policy beskriver hur vi samlar in, använder och skyddar information som rör våra kunder samt data som samlas in via vårt verktyg.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Information vi samlar in om dig</h2>
            <p>
              När du skapar ett konto eller genomför ett köp hos oss samlar vi in:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Namn och e-postadress.</li>
              <li>Företagsnamn (valfritt).</li>
              <li>Betalningsinformation via Stripe (vi sparar inte dina kortuppgifter, de hanteras helt av Stripe).</li>
              <li>Användningsdata (historik över dina sökningar och credit-transaktioner).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Hur vi använder din information</h2>
            <p>
              Vi använder dina uppgifter för att:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tillhandahålla Tjänsten och administrera ditt konto.</li>
              <li>Genomföra betalningar och debitera rätt antal credits.</li>
              <li>Skicka systemspecifik information (t.ex. när ett sökjobb är slutfört eller kvitto på betalning).</li>
              <li>Förbättra plattformens funktionalitet.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Lagring av scraping-resultat</h2>
            <p>
              Data som samlas in under dina scraping-jobb lagras säkert i våra databaser på Neon Postgres. Resultaten är endast tillgängliga för det konto som startade jobbet. Vi sparar denna data för att du ska kunna förhandsgranska och ladda ner din leadlista. Du kan när som helst radera dina tidigare körda jobb från din dashboard.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Cookies</h2>
            <p>
              Vi använder nödvändiga cookies för att hantera din inloggningssession (via NextAuth.js) och bibehålla din session. Inga spårningscookies eller tredjepartscookies används på vår dashboard.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Dina rättigheter</h2>
            <p>
              Du har rätt att begära ett registerutdrag över den data vi har sparad om dig, begära rättelse eller radera ditt konto helt. Kontakta oss på <a href="mailto:support@superscraper.se" className="text-brand-400 hover:underline">support@superscraper.se</a> så hjälper vi dig.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
