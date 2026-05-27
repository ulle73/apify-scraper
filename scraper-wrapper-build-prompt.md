# Build Prompt: Scraper Wrapper SaaS / Nordic Lead Platform

Du är en senior fullstack-utvecklare, produktarkitekt och SaaS-byggare.

Bygg en komplett MVP för en egen scraper-wrapper/SaaS där kunder kan skapa färdiga B2B-leadlistor via ett svenskt webbgränssnitt. Produkten ska använda Apify API som backend för scraping, men kunden ska aldrig se Apify eller behöva egen Apify-nyckel.

## Viktigt

Detta ska inte marknadsföras som “sälj vidare Apify-access”. Det ska byggas som en egen lead/data-produkt där Apify används som datamotor bakom kulisserna. Lägg in tydliga spärrar så att inga Apify-körningar kan startas innan kund har betalat eller har credits.

MVP ska byggas som en generell scraper-plattform med adapter/registry-arkitektur, men endast EN scraper ska vara aktiv i V1:

**Google Maps Leadlista**

## Teknisk stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Stripe Checkout
- Apify API via `apify-client`
- Background jobs via Inngest eller Trigger.dev
- Vercel deployment

## Design

- Innan du bygger UI: kontrollera om det finns en `DESIGN.md` i repot.
- Om `DESIGN.md` finns ska den användas som primär designkälla.
- Om `DESIGN.md` saknas: skapa ett tydligt `DESIGN.md`-förslag först och vänta på godkännande innan större UI byggs.
- Designen ska vara seriös, nordisk, B2B, premium, ren och trovärdig.
- Undvik generisk AI-SaaS-design.
- Fokus: hög konvertering, tydlig pricing, trygghet, GDPR/compliance, enkelhet.

## Produktnamn

Produktnamn tills vidare:

- LeadScraper
- Nordic Lead Lists
- alternativt använd placeholder `BRAND_NAME`

## Mål

Bygg en MVP där en kund kan:

1. Skapa konto
2. Logga in
3. Köpa credits eller ett leadpaket
4. Skapa ett scraping-jobb
5. Välja scraper från en scraper-registry
6. För V1: välja land, stad/region, sökord/bransch och max antal leads
7. Se uppskattat pris innan körning
8. Betala via Stripe eller använda credits
9. Starta scraping via Apify först efter betalning/credits
10. Följa status på jobbet
11. När jobbet är klart: ladda ner CSV/XLSX
12. Se historik över tidigare jobb

## MVP-produkt: Google Maps Leadlista

Kunden fyller i:

- Land
- Stad/region
- Sökord/bransch
- Max antal leads
- Exportformat: CSV och senare XLSX
- Option: “Försök hitta hemsida/e-post” ska finnas i UI men kan vara disabled eller markeras som “kommer snart” i V1 om det blir för stort.

## Apify Actor

Använd Google Maps/Google Places Actor via Apify API.

Lägg actor-id i env:

```env
APIFY_GOOGLE_MAPS_ACTOR_ID=
```

Exempel:

```env
APIFY_API_TOKEN=
APIFY_GOOGLE_MAPS_ACTOR_ID=
```

Bygg inte hårdkodat mot en enda actor. Skapa en adapter-struktur så att fler actors kan läggas till senare.

## Scraper Adapter Architecture

VIKTIGT: Arkitekturen måste vara byggd för att enkelt kunna lägga till fler scrapers/actors senare.

Bygg därför ett generiskt scraper-adapter-system, inte hårdkodad logik för Google Maps.

Skapa en central scraper-registry:

```txt
/lib/scrapers/registry.ts
/lib/scrapers/types.ts
/lib/scrapers/adapters/google-maps.ts
/lib/scrapers/adapters/google-search.ts
/lib/scrapers/adapters/contact-details.ts
/lib/scrapers/adapters/website-crawler.ts
```

Varje scraper-adapter ska följa samma interface:

```ts
type ScraperAdapter = {
  id: string;
  name: string;
  description: string;
  provider: "apify" | "custom";
  actorIdEnvKey?: string;
  category: "leads" | "search" | "social" | "content" | "ecommerce";
  enabled: boolean;
  fields: ScraperField[];
  creditEstimate(input: unknown): number;
  validateInput(input: unknown): ParsedInput;
  buildApifyInput(input: ParsedInput): Record<string, unknown>;
  normalizeItem(item: unknown): NormalizedScrapeResult;
  getExportColumns(): ExportColumn[];
};
```

Google Maps ska bara vara första implementerade adaptern.

All job creation ska gå via `scraperId`, till exempel:

```http
POST /api/jobs/create
```

Input:

```json
{
  "scraperId": "google-maps",
  "input": {
    "country": "Sweden",
    "region": "Göteborg",
    "searchTerm": "bilverkstad",
    "maxResults": 500
  }
}
```

Backend ska sedan:

1. Slå upp `scraperId` i `scraperRegistry`
2. Kontrollera att scrapern är `enabled`
3. Validera input via adaptern
4. Räkna credits via adaptern
5. Bygga Apify-input via adaptern
6. Starta rätt actor
7. Normalisera resultat via adaptern
8. Skapa export med adapterns exportkolumner

## Databasstöd för flera scrapers

Databasen ska stödja flera scrapers från start.

`scrape_jobs` ska ha:

- `scraper_id text not null`
- `scraper_name text`
- `provider text`
- `apify_actor_id text`
- `input_json jsonb`
- `normalized_input_json jsonb`

`scrape_results` ska ha:

- `scraper_id text`
- `result_type text`
- `normalized_json jsonb`
- `raw_json jsonb`

Gör inte separata tabeller för varje scraper i V1. Använd en gemensam result-tabell med normaliserade standardfält + `normalized_json`/`raw_json` för scraper-specifika fält.

Standardfält i `scrape_results`:

- `company_name`
- `person_name`
- `title`
- `website`
- `domain`
- `phone`
- `email`
- `address`
- `city`
- `region`
- `country`
- `category`
- `source`
- `source_url`
- `scraped_at`
- `normalized_json`
- `raw_json`

För sociala scrapers senare ska samma tabell kunna bära följande i `normalized_json` även om standardkolumnerna inte räcker:

- `profile_name`
- `username`
- `platform`
- `followers`
- `post_url`
- `bio`

## Dynamisk UI från scraper-registry

UI ska också byggas dynamiskt från scraper-registry.

På `/dashboard/create`:

- Visa lista över enabled scrapers
- När användaren väljer scraper, rendera rätt formulärfält
- Google Maps-formuläret byggs först
- Övriga scrapers kan visas som disabled/coming soon

Skapa en konfig för varje scraper:

```ts
{
  id: "google-maps",
  name: "Google Maps Leadlista",
  description: "Hitta företag baserat på plats och sökord.",
  category: "leads",
  enabled: true,
  fields: [
    { name: "country", type: "select", required: true },
    { name: "region", type: "text", required: true },
    { name: "searchTerm", type: "text", required: true },
    { name: "maxResults", type: "number", min: 10, max: 1000 }
  ]
}
```

Lägg till placeholder-adapters för minst dessa, men markera dem som `enabled: false`:

- `google-search`
- `contact-details`
- `website-content-crawler`
- `instagram-profile`
- `tiktok-scraper`
- `linkedin-company`, endast placeholder och disabled
- `ecommerce-product-scraper`
- `youtube-scraper`
- `news-scraper`
- `generic-web-scraper`

Varje disabled adapter ska ha:

- `id`
- `name`
- `description`
- `category`
- `enabled: false`
- TODO-kommentar om vilken Apify Actor eller custom scraper som ska kopplas senare

Målet är att det senare ska räcka med att:

1. Skapa ny adapterfil
2. Lägga till den i registry
3. Lägga in actor-id i `.env`
4. Eventuellt lägga till form fields
5. Sedan fungerar create job, credits, Apify run, normalisering, export och historik utan att bygga om hela systemet.

Bygg alltså systemet som en “scraper platform”, men aktivera bara Google Maps i MVP.

## Viktiga säkerhetsregler

- Exponera aldrig `APIFY_API_TOKEN` i frontend.
- Alla Apify-anrop ska gå via backend/server actions/API routes.
- Starta aldrig Apify-jobb innan betalning/credits är verifierade.
- Begränsa `maxResults` per jobb.
- Lägg global kostnadsspärr per jobb.
- Lägg user-level rate limits.
- Lägg daglig usage-limit per user.
- Lägg intern statuslogg för varje jobb.
- Spara input, actor id, run id, dataset id, status och felmeddelanden.
- Kunden ska inte kunna ändra `maxResults` i requesten efter betalning.
- Validera all input med Zod.
- Sanera textfält.

## Databas

Skapa Supabase migrations för följande tabeller.

### profiles

- `id uuid primary key references auth.users`
- `email text`
- `full_name text`
- `company_name text`
- `created_at timestamptz`
- `updated_at timestamptz`

### credit_balances

- `id uuid primary key`
- `user_id uuid references auth.users`
- `credits integer not null default 0`
- `created_at timestamptz`
- `updated_at timestamptz`

### credit_transactions

- `id uuid primary key`
- `user_id uuid references auth.users`
- `amount integer not null`
- `type text not null`
- `reference_id text`
- `metadata jsonb`
- `created_at timestamptz`

### scrape_jobs

- `id uuid primary key`
- `user_id uuid references auth.users`
- `scraper_id text not null`
- `scraper_name text`
- `provider text`
- `type text not null`
- `status text not null`
- `input_json jsonb not null`
- `normalized_input_json jsonb`
- `estimated_credits integer not null`
- `charged_credits integer default 0`
- `customer_price_sek integer`
- `stripe_session_id text`
- `apify_actor_id text`
- `apify_run_id text`
- `apify_dataset_id text`
- `result_count integer default 0`
- `export_csv_url text`
- `export_xlsx_url text`
- `error_message text`
- `created_at timestamptz`
- `started_at timestamptz`
- `completed_at timestamptz`
- `updated_at timestamptz`

### scrape_results

- `id uuid primary key`
- `job_id uuid references scrape_jobs`
- `user_id uuid references auth.users`
- `scraper_id text`
- `result_type text`
- `company_name text`
- `person_name text`
- `title text`
- `website text`
- `domain text`
- `phone text`
- `email text`
- `address text`
- `city text`
- `region text`
- `country text`
- `category text`
- `rating numeric`
- `review_count integer`
- `source text`
- `source_url text`
- `normalized_json jsonb`
- `raw_json jsonb`
- `scraped_at timestamptz`
- `created_at timestamptz`

### exports

- `id uuid primary key`
- `job_id uuid references scrape_jobs`
- `user_id uuid references auth.users`
- `format text not null`
- `file_url text not null`
- `row_count integer`
- `created_at timestamptz`

### apify_run_logs

- `id uuid primary key`
- `job_id uuid references scrape_jobs`
- `user_id uuid references auth.users`
- `apify_run_id text`
- `status text`
- `message text`
- `raw_json jsonb`
- `created_at timestamptz`

## RLS

Sätt RLS:

- User får bara läsa sina egna jobs/results/exports/credits.
- Service role får skriva backend-data.
- Ingen publik access till `scrape_results`.
- Exports ska antingen vara signed URLs eller skyddade download routes.

## Job statuses

Statusar för `scrape_jobs`:

- `draft`
- `pending_payment`
- `paid`
- `queued`
- `running`
- `fetching_results`
- `processing_results`
- `completed`
- `failed`
- `cancelled`

## Credits och pricing

Bygg V1 med credits.

Exempel:

- 1 lead = 1 credit
- Starter: 500 credits
- Pro: 2 500 credits
- Growth: 10 000 credits

Stripe-produkter ska hanteras via env eller config:

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Skapa pricing-sida:

- Starter: 500 leads
- Pro: 2 500 leads
- Growth: 10 000 leads
- Custom: kontakta oss

Vid köp:

1. Skapa Stripe Checkout Session
2. När webhook `checkout.session.completed` kommer:
   - Lägg till credits till user
   - Skapa `credit_transaction`
3. Kunden kan sedan skapa scraping-jobb med credits

Alternativt kan man också stödja “pay per job” senare, men V1 ska använda credits.

## API routes / server actions

Bygg dessa endpoints.

### POST /api/jobs/estimate

- Input: `scraperId`, `input`
- För Google Maps input: `country`, `region`, `searchTerm`, `maxResults`
- Slå upp adapter i registry
- Validera input med adapter
- Returnera `estimatedCredits`, `estimatedPrice`, validation warnings

### POST /api/jobs/create

- Kräver auth
- Input: `scraperId`, `input`
- Slå upp adapter i registry
- Kontrollera att adapter är enabled
- Validera input
- Kontrollera credits
- Skapa `scrape_job` med status `queued`
- Dra credits direkt eller reservera credits
- Starta background job
- Returnera `jobId`

### POST /api/jobs/[id]/start

- Endast backend/admin eller intern route
- Startar Apify Actor
- Uppdaterar `apify_run_id` och `dataset_id`

### POST /api/apify/webhook

- Tar emot Apify webhook
- Verifiera om möjligt webhook secret
- Hitta `scrape_job` via run id
- Uppdatera status
- Starta result processing

### GET /api/jobs/[id]

- Returnera job status till rätt user

### GET /api/jobs/[id]/results

- Returnera paginerade resultat

### GET /api/jobs/[id]/download?format=csv

- Returnera signed URL eller streama fil

### POST /api/stripe/checkout

- Skapa checkout session för credit-paket

### POST /api/stripe/webhook

- Hantera betalning och credits

## Background flow

När användare skapar ett jobb:

1. Validate input
2. Check credits
3. Create `scrape_jobs` row
4. Deduct/reserve credits
5. Trigger background job
6. Background job starts Apify Actor
7. Save run id and dataset id
8. Poll Apify or wait for webhook
9. When complete, fetch dataset items
10. Normalize items via selected adapter
11. Deduplicate
12. Save `scrape_results`
13. Generate CSV
14. Upload CSV to Supabase Storage
15. Update `scrape_jobs` status `completed`
16. Create export row

Om Apify-jobbet failar:

- Markera job `failed`
- Spara `error_message`
- Återbetala credits om inget resultat skapades
- Logga i `apify_run_logs`

## Apify-integration

Skapa:

```txt
/lib/apify/client.ts
/lib/apify/start-run.ts
/lib/apify/fetch-dataset.ts
/lib/apify/actors/google-maps.ts
```

Men all scraper-specifik logik ska ligga i:

```txt
/lib/scrapers/adapters/google-maps.ts
```

`/lib/apify/*` ska vara generiskt och bara kunna:

- starta actor
- läsa run status
- hämta dataset
- hantera Apify-fel

## Kodstruktur

```txt
/app
  /(marketing)
    page.tsx
    pricing/page.tsx
    compliance/page.tsx
  /(dashboard)
    dashboard/page.tsx
    dashboard/jobs/page.tsx
    dashboard/jobs/[id]/page.tsx
    dashboard/create/page.tsx
    dashboard/billing/page.tsx
  /api
/components
  marketing
  dashboard
  forms
  tables
  ui
/lib
  apify
  stripe
  supabase
  jobs
  exports
  validation
  pricing
  scrapers
    registry.ts
    types.ts
    adapters
      google-maps.ts
      google-search.ts
      contact-details.ts
      website-crawler.ts
      instagram-profile.ts
      tiktok-scraper.ts
      linkedin-company.ts
      ecommerce-product-scraper.ts
      youtube-scraper.ts
      news-scraper.ts
      generic-web-scraper.ts
/supabase
  migrations
```

## Normalisering

Skapa en funktion `normalizeGoogleMapsItem(item)` som mappar Apify-data till:

```ts
{
  company_name,
  website,
  domain,
  phone,
  email,
  address,
  city,
  region,
  country,
  category,
  rating,
  review_count,
  source,
  source_url,
  raw_json,
  normalized_json,
  scraped_at
}
```

## Deduplicering

Deduplicera enligt:

1. `domain` om `website` finns
2. `phone` om `phone` finns
3. `company_name + address` fallback

## Export

Skapa CSV med kolumner:

- Företagsnamn
- Telefon
- E-post
- Hemsida
- Domän
- Adress
- Stad
- Region
- Land
- Kategori
- Rating
- Antal recensioner
- Källa
- Käll-URL
- Hämtad datum

XLSX kan läggas till om enkelt, annars bygg CSV först och lämna tydlig TODO.

Exports ska använda adapterns `getExportColumns()` så framtida scrapers kan ha egna exportkolumner.

## UI-sidor

### Marketing homepage

Hero:

```txt
Skapa färdiga B2B-listor från öppna källor på några minuter
```

Subtext:

```txt
Välj bransch, plats och antal leads. Vi hämtar, rensar och exporterar datan åt dig.
```

CTA:

- Skapa lista
- Se priser

Sections:

- Så fungerar det
- Exempel på listor
- Vad ingår
- Compliance/GDPR
- Pricing
- FAQ

### Dashboard

Overview cards:

- Credits kvar
- Antal jobb
- Klara jobb
- Senaste export

CTA:

- Skapa ny leadlista

### Create job page

Form:

- Välj scraper
- Dynamiska fält från selected adapter
- För Google Maps:
  - Land
  - Region/stad
  - Sökord/bransch
  - Max antal leads

Live estimate:

- Credits som krävs
- Vad exporten innehåller

Submit:

- Starta hämtning

### Jobs page

Table:

- Datum
- Scraper
- Sökning
- Region
- Antal
- Status
- Download

### Job detail page

- Status timeline
- Input summary
- Result count
- Preview table med första 25 results
- Download CSV
- Error panel om failed

### Billing page

- Current credits
- Köp fler credits
- Credit transaction history

## Compliance page

Förklara:

- Datan hämtas från öppna källor
- Kunden ansvarar för hur datan används
- Tjänsten får inte användas för spam, olaglig scraping, bedrägeri eller otillåten masskommunikation
- Visa källa och datum i exporter
- Lägg till opt-out-rutin som framtida feature/TODO

## Legal / ToS

Skapa enkla placeholder-sidor:

- `/terms`
- `/privacy`
- `/acceptable-use`

Acceptable use ska förbjuda:

- spam
- scraping av känsliga personuppgifter
- olaglig användning
- kringgående av inloggade system
- massutskick utan laglig grund
- vidareförsäljning av rå access
- användning mot förbjudna targets

## Env

Skapa `.env.example` med:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
APIFY_API_TOKEN=
APIFY_GOOGLE_MAPS_ACTOR_ID=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
MOCK_APIFY=true
```

För framtida scrapers, förbered env-nycklar men kommentera ut:

```env
# APIFY_GOOGLE_SEARCH_ACTOR_ID=
# APIFY_CONTACT_DETAILS_ACTOR_ID=
# APIFY_WEBSITE_CRAWLER_ACTOR_ID=
# APIFY_INSTAGRAM_PROFILE_ACTOR_ID=
# APIFY_TIKTOK_ACTOR_ID=
```

## Testing

- Lägg till enkla unit tests för:
  - estimate credits
  - normalizeGoogleMapsItem
  - dedupeResults
  - scraperRegistry lookup
  - disabled scraper cannot run
- Lägg till mock mode:

```env
MOCK_APIFY=true
```

Då ska appen kunna returnera fake-data utan att köra Apify.

Detta är viktigt så man kan bygga och testa utan kostnad.

## Mock-data

Skapa 20 exempel-leads i:

```txt
/lib/mock/leads.ts
```

Mock-flow ska använda samma normalisering/exportflöde som riktig Apify-data så att hela appen kan testas end-to-end utan extern kostnad.

## Kostnadskontroll

Bygg en fil:

```txt
/lib/pricing/estimate.ts
```

Regler:

- `maxResults` min 10
- `maxResults` max 1000 i V1
- `creditsRequired = maxResults`
- Om email enrichment aktiveras senare: +1 credit per website
- Stoppa jobb om user credits < creditsRequired
- Stoppa jobb om maxResults > plan limit

## Plan limits

Free/test user:

- max 25 mock leads

Starter:

- max 500 per job

Pro:

- max 2500 per job

Growth:

- max 10000 per job, men V1 kan låsa till 1000 tills backend är säker

V1 ska ha max 1000 leads per jobb oavsett plan.

## Error handling

- Visa tydliga fel i UI
- Logga backend-fel
- Om Apify saknar token: visa adminvänligt fel
- Om Apify actor saknas: faila snyggt
- Om dataset är tomt: slutför jobbet men visa “0 resultat hittades”

## README

Skapa en komplett `README.md` med:

- Vad projektet gör
- Setup
- Env vars
- Supabase migrations
- Stripe setup
- Apify setup
- Mock mode
- Deployment till Vercel
- Hur man lägger till en ny scraper-adapter
- Kända begränsningar
- Nästa steg

## Guide: lägga till ny scraper

README ska innehålla en sektion:

```md
## Add a new scraper

1. Create a new adapter in /lib/scrapers/adapters/[scraper-id].ts
2. Implement ScraperAdapter interface
3. Add form fields
4. Add actor env key if provider is Apify
5. Add adapter to /lib/scrapers/registry.ts
6. Add normalization and export columns
7. Set enabled: true when ready
8. Test with MOCK_APIFY=true first
9. Test with real Apify actor using low maxResults
```

## MVP-gräns

Bygg inte:

- Full adminpanel
- 10 aktiva scrapers
- Avancerad CRM-integration
- Email enrichment i V1 om det sinkar
- Multi-tenant teams i V1
- Komplex subscription billing

Men förbered arkitekturen så det går att lägga till senare.

## Arbetsordning

1. Läs befintlig repo-struktur
2. Skapa eller uppdatera `DESIGN.md` om det saknas
3. Sätt upp scraper adapter types och registry
4. Skapa Google Maps adapter
5. Skapa placeholder-adapters för framtida scrapers
6. Sätt upp Supabase types/migrations
7. Sätt upp auth
8. Bygg pricing/credits-modell
9. Bygg mock job flow utan Apify
10. Bygg dashboard UI
11. Bygg export CSV
12. Koppla Apify API generiskt via adapter-systemet
13. Koppla Stripe Checkout
14. Koppla webhooks
15. Lägg till guards/rate limits
16. Testa hela flödet i mock mode
17. Testa ett riktigt Apify-jobb med lågt maxResults
18. Skriv README och TODO

## Definition of Done

- En användare kan logga in
- En användare kan köpa credits
- Credits syns i dashboard
- En användare kan skapa ett leadjobb
- Jobbet använder `scraperId` och registry-systemet
- Google Maps är aktiv scraper i V1
- Övriga scrapers finns som disabled placeholders
- Jobbet kan köras i mock mode
- Jobbet kan köras via Apify om env finns
- Resultat sparas i DB
- CSV-export kan laddas ner
- Kund ser jobbhistorik
- Inga Apify-körningar sker före betalning/credits
- API-token exponeras aldrig i frontend
- MaxResults och credits-spärrar fungerar
- Disabled scrapers kan inte köras
- README är komplett
- README förklarar hur man lägger till fler scrapers
- `.env.example` finns
- Kod är typad och strukturerad
- Inga hemligheter commitas

## Implementeringsstil

När du implementerar:

- Gör små commits/steg.
- Förklara varje större ändring.
- Om något är oklart, välj den säkraste MVP-lösningen.
- Prioritera fungerande end-to-end-flöde över perfekta edge cases.
- Bygg systemet så att fler scrapers blir plugins/adapters, inte specialfall.
