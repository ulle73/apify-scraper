export default function TermsPage() {
  return (
    <div className="relative bg-navy-950 text-white min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold mb-8 text-white">Användarvillkor (Terms of Service)</h1>
        
        <div className="space-y-6 text-sm text-navy-300 leading-relaxed">
          <p className="text-xs text-navy-500">Senast uppdaterad: 28 maj 2026</p>
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Avtalets omfattning</h2>
            <p>
              Dessa användarvillkor reglerar din användning av plattformen SuperScraper ("Tjänsten"). Genom att skapa ett konto godkänner du dessa villkor i sin helhet. Om du representerar ett företag garanterar du att du har behörighet att binda företaget till dessa villkor.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Konto och registrering</h2>
            <p>
              För att använda vissa delar av Tjänsten måste du registrera ett konto. Du ansvarar för att hålla ditt lösenord hemligt och är fullt ansvarig för all aktivitet som sker under ditt konto. Konton är personliga och får inte delas eller överlåtas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Credits och Betalning</h2>
            <p>
              SuperScraper säljer credits i form av engångsköp. Credits används för att köra scraping-jobb och generera leadlistor. 
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Credits har ingen utgångstid och är giltiga så länge plattformen är i drift.</li>
              <li>Återbetalning sker automatiskt om ett jobb genererar färre resultat än beräknat (de resterande credits läggs tillbaka på ditt saldo).</li>
              <li>Köp av credits är slutgiltiga och återbetalas ej i pengar när transaktionen slutförts via Stripe, såvida inte lagstadgad ångerrätt är tillämplig för dig som konsument.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Immaterialrätt</h2>
            <p>
              Tjänstens kod, design, logotyper och gränssnitt tillhör SuperScraper och skyddas av upphovsrätt. Du får inte kopiera, sälja vidare eller modifiera plattformen utan skriftligt godkännande. Data som du samlar in och exporterar tillhör dig och du har full rätt att använda den i din verksamhet.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Ansvarsbegränsning</h2>
            <p>
              SuperScraper tillhandahåller data insamlad från publika tredjepartskällor. Vi garanterar inte att datan är 100% korrekt, uppdaterad eller komplett då den kan ha ändrats på källan. SuperScraper ansvarar inte för direkta eller indirekta skador som uppstår till följd av felaktig data eller avbrott i tjänsten.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">6. Ändring av villkor</h2>
            <p>
              Vi förbehåller oss rätten att uppdatera dessa villkor vid behov. Vid större ändringar kommer du att aviseras via e-post eller på din dashboard.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
