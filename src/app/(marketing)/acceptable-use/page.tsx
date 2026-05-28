export default function AcceptableUsePage() {
  return (
    <div className="relative bg-navy-950 text-white min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold mb-8 text-white">Acceptabel Användning (Acceptable Use Policy)</h1>
        
        <div className="space-y-6 text-sm text-navy-300 leading-relaxed">
          <p className="text-xs text-navy-500">Senast uppdaterad: 28 maj 2026</p>
          
          <p>
            Denna policy beskriver reglerna för tillåten användning av SuperScraper. Genom att använda vår plattform förbinder du dig att följa dessa regler. Brott mot denna policy kan leda till att ditt konto stängs av utan återbetalning av credits.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Förbjudna aktiviteter</h2>
            <p>
              Du får inte under några omständigheter använda SuperScraper för att:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Skicka spam eller massutskick i strid med marknadsföringslagen eller lokala e-postlagstiftningar (t.ex. spam till enskilda firmor utan medgivande).
              </li>
              <li>
                Försöka kringgå inloggningar, brandväggar eller begränsningar på SuperScraper-plattformen eller våra underleverantörers servrar (t.ex. Apify).
              </li>
              <li>
                Hämta känsliga personuppgifter (t.ex. politisk åsikt, sexuell läggning, hälsa) eller data som rör minderåriga.
              </li>
              <li>
                Sälja vidare rå API-access till vår plattform eller på annat sätt paketera om tjänsten utan skriftligt godkännande.
              </li>
              <li>
                Utföra olaglig övervakning eller trakasserier av enskilda individer eller företag.
              </li>
              <li>
                Skapa falska konton för att försöka missbruka eventuella gratis-test eller kampanjkoder.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. B2B och marknadsföringssed</h2>
            <p>
              SuperScraper är byggt för professionell affärskontakt och nätverkande. Vi förutsätter att du använder exporterad data med god marknadsföringssed:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Utskicken ska vara nischade och erbjuda ett genuint värde för mottagarens yrkesroll.</li>
              <li>Du ska alltid inkludera en länk för att kunna avregistrera sig enkelt.</li>
              <li>Du ska tydligt uppge vem du representerar och hur ni fått tag på uppgifterna (publika källor) om mottagaren frågar.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Tillsyn och avstängning</h2>
            <p>
              Vi övervakar plattformen för att upptäcka onormalt beteende eller tecken på missbruk (t.ex. extremt höga frekvenser av nyskapade jobb, försök till kodinjektioner eller ogiltiga Stripe-betalningar). Vi förbehåller oss rätten att spärra misstänkta konton omedelbart i väntan på utredning.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
