# Apify-scrapers att lägga till efter befintliga configs

Syfte: ge AI-agenten en tydlig lista över resterande scrapers från topp-50-idén, efter att de som redan finns i repot har tagits bort.

Repo: `ulle73/apify-scraper`

## Redan befintliga i repot

`google-maps`, `google-search`, `instagram-profile`, `tiktok-scraper`, `linkedin-company`, `contact-details`, `website-crawler`, `youtube-scraper`, `ecommerce-product-scraper`, `news-scraper`, `facebook-pages`, `twitter-scraper`, `tripadvisor-scraper`, `reddit-scraper`, `indeed-scraper`

## Standardmönster för varje ny scraper

1. Öppna Apify Store-sökningen i tabellen.
2. Välj den actor som är mest stabil/populär och kontrollera input/output-exempel.
3. Lägg till ett nytt `ScraperConfig`-objekt i `src/lib/scrapers/configs.ts` eller, helst, i ny uppdelad struktur `src/lib/scrapers/configs/<kategori>/<scraper>.ts`.
4. Sätt `actorId` till exakt Apify actor-id, t.ex. `owner/actor-name`.
5. Implementera `fields`, `buildApifyInput()`, `normalizeItem()` och `getMockData()`.
6. Testa i mock-läge först, sedan med liten live-run.

## Apify API-endpoints

```txt
Run actor:
POST https://api.apify.com/v2/acts/{ACTOR_ID}/runs?token=$APIFY_TOKEN

Run actor sync and get dataset items:
POST https://api.apify.com/v2/acts/{ACTOR_ID}/run-sync-get-dataset-items?token=$APIFY_TOKEN

Get dataset items:
GET https://api.apify.com/v2/datasets/{DATASET_ID}/items?clean=true&format=json&token=$APIFY_TOKEN
```

> Obs: actor-id kan ändras och flera liknande actors kan finnas. Använd Store-söklänken och välj den mest aktiva/stabila. För svenska datakällor som Hitta, Eniro, Allabolag, Hemnet och Bolagsverket krävs extra kontroll av ToS/licens/GDPR innan produktion.

## Rekommenderad backlog

| Prio | Config-id | Namn | Kategori | Apify Store-sökning | Varför | Föreslagna fields | Normalisera främst |
|---:|---|---|---|---|---|---|---|
| 1 | `google-maps-reviews` | Google Maps Reviews Scraper | `leads` | https://console.apify.com/store-search?search=Google+Maps+Reviews+Scraper&sortBy=popularity | Hitta företag med få/dåliga recensioner, sentiment och lokala förbättringsmöjligheter. | `placeUrls` eller `searchTerms + location`, `maxReviews`, `language=sv` | `company_name`, `rating`, `review_count`, `review_text`, `review_date`, `reviewer_name`, `source_url` |
| 2 | `google-maps-contact-enricher` | Google Maps Email / Contact Enricher | `leads` | https://console.apify.com/store-search?search=Google+Maps+email+extractor+contact+details&sortBy=popularity | Komplement till befintlig Google Maps: hämta e-post/sociala länkar från hemsidorna som hittas via Maps. | `placeUrls` eller `websiteUrls`, `maxDepth`, `includeSocials=true` | `company_name`, `website`, `domain`, `email`, `phone`, `facebook`, `instagram`, `linkedin` |
| 3 | `linkedin-jobs` | LinkedIn Jobs Scraper | `leads` | https://console.apify.com/store-search?search=LinkedIn+Jobs+Scraper&sortBy=popularity | Företag som rekryterar har ofta budget och tydlig köpsignal. | `keywords`, `location=Sweden/Stockholm/Gothenburg`, `maxResults`, `datePosted` | `company_name`, `title`, `location`, `source_url`, `job_type`, `published_at`, `description` |
| 4 | `linkedin-ads` | LinkedIn Ads Scraper | `leads` | https://console.apify.com/store-search?search=LinkedIn+Ads+Scraper&sortBy=popularity | Hitta bolag som aktivt annonserar och kan vara intressanta för byråer/leadlistor. | `companyUrls` eller `companyNames`, `maxAds` | `company_name`, `ad_text`, `creative_url`, `landing_page`, `first_seen`, `source_url` |
| 5 | `facebook-posts` | Facebook Posts Scraper | `social` | https://console.apify.com/store-search?search=Facebook+Posts+Scraper&sortBy=popularity | Bra för lokala svenska företag, kampanjer, events och konkurrensbevakning. | `pageUrls`, `maxPosts`, `dateFrom/dateTo` | `company_name`, `title/text`, `source_url`, `published_at`, `likes`, `comments`, `shares` |
| 6 | `facebook-ads-library` | Facebook Ads Library Scraper | `social` | https://console.apify.com/store-search?search=Facebook+Ads+Library+Scraper&sortBy=popularity | Konkurrentanalys och leadsignal: vilka svenska bolag annonserar just nu? | `query/companyName`, `country=SE`, `activeStatus=active`, `maxResults` | `company_name`, `ad_text`, `page_name`, `landing_page`, `creative_url`, `start_date`, `source_url` |
| 7 | `instagram-posts` | Instagram Scraper – posts/hashtags/locations | `social` | https://console.apify.com/store-search?search=Instagram+Scraper+posts+hashtags+locations&sortBy=popularity | Bredare än befintlig Instagram Profile: hitta inlägg, hashtags och lokala verksamheter. | `hashtags/usernames/locationUrls`, `maxResults` | `person_name/company_name`, `caption`, `source_url`, `likes`, `comments`, `timestamp`, `hashtags` |
| 8 | `instagram-reels` | Instagram Reels Scraper | `social` | https://console.apify.com/store-search?search=Instagram+Reels+Scraper&sortBy=popularity | Hitta content som faktiskt rör sig i Sverige inom retail, restaurang, träning, skönhet. | `usernames/hashtags`, `maxResults` | `caption`, `source_url`, `play_count`, `likes`, `comments`, `timestamp`, `author` |
| 9 | `instagram-comments` | Instagram Comments Scraper | `social` | https://console.apify.com/store-search?search=Instagram+Comments+Scraper&sortBy=popularity | Kundinsikter, leads och publikreaktioner på konkurrenters inlägg. | `postUrls`, `maxComments` | `comment_text`, `commenter_name`, `source_url`, `timestamp`, `likes` |
| 10 | `instagram-tagged-mentions` | Instagram Tagged / Mentions Scraper | `social` | https://console.apify.com/store-search?search=Instagram+tagged+posts+mentions+scraper&sortBy=popularity | Se vilka som taggar svenska varumärken och hitta UGC/influencers. | `usernames`, `maxResults` | `mentioned_profile`, `author`, `caption`, `source_url`, `timestamp`, `engagement` |
| 11 | `tiktok-profile` | TikTok Profile Scraper | `social` | https://console.apify.com/store-search?search=TikTok+Profile+Scraper&sortBy=popularity | Befintlig TikTok-scraper är sök/hashtag; profiler behövs för creator/brand-databas. | `usernames`, `maxResults` | `person_name/company_name`, `bio`, `followers`, `following`, `likes`, `website`, `source_url` |
| 12 | `youtube-shorts` | YouTube Shorts Scraper | `content` | https://console.apify.com/store-search?search=YouTube+Shorts+Scraper&sortBy=popularity | Kortvideo-trender och svenska creators/varumärken. | `channelUrls/searchQueries`, `maxResults` | `title`, `channel_name`, `source_url`, `view_count`, `likes`, `comments`, `published_at` |
| 13 | `youtube-comments` | YouTube Comments Scraper | `content` | https://console.apify.com/store-search?search=YouTube+Comments+Scraper&sortBy=popularity | Publikinsikter, invändningar och content research. | `videoUrls`, `maxComments` | `comment_text`, `author`, `source_url`, `likes`, `published_at` |
| 14 | `google-trends` | Google Trends Scraper | `search` | https://console.apify.com/store-search?search=Google+Trends+Scraper&sortBy=popularity | Svensk efterfrågan och trendbevakning per bransch/sökord. | `keywords`, `geo=SE`, `timeframe`, `category` | `keyword`, `value`, `date`, `geo`, `related_queries`, `source_url` |
| 15 | `trustpilot` | Trustpilot Scraper | `leads` | https://console.apify.com/store-search?search=Trustpilot+Scraper&sortBy=popularity | Bra för svenska bolag med starkt/svagt kundbetyg och review mining. | `companyUrls/searchQuery`, `maxReviews` | `company_name`, `rating`, `review_count`, `review_text`, `review_date`, `source_url` |
| 16 | `reco-se` | Reco.se Scraper | `leads` | https://console.apify.com/store-search?search=Reco.se+scraper&sortBy=popularity | Sverige-relevant recensionskälla för lokala tjänsteföretag. | `urls/searchQuery`, `maxResults/maxReviews` | `company_name`, `rating`, `review_count`, `review_text`, `city`, `category`, `source_url` |
| 17 | `hitta-se` | Hitta.se Scraper | `leads` | https://console.apify.com/store-search?search=Hitta.se+scraper&sortBy=popularity | Svensk lokal B2B-data: företag, telefon, adress, kategori. Kontrollera ToS/GDPR innan produktion. | `query`, `location`, `maxResults` | `company_name`, `phone`, `address`, `city`, `website`, `category`, `source_url` |
| 18 | `eniro` | Eniro Scraper | `leads` | https://console.apify.com/store-search?search=Eniro+scraper&sortBy=popularity | Svensk/nordisk företagskatalog. Kontrollera ToS/GDPR innan produktion. | `query`, `location`, `maxResults` | `company_name`, `phone`, `address`, `city`, `website`, `category`, `source_url` |
| 19 | `allabolag` | Allabolag Scraper | `leads` | https://console.apify.com/store-search?search=Allabolag+scraper&sortBy=popularity | Extremt relevant svensk B2B-enrichment: orgnr, omsättning, bransch, status. Kontrollera ToS/licens. | `orgNumbers/companyNames/searchQuery`, `maxResults` | `company_name`, `org_number`, `revenue`, `employees`, `city`, `industry`, `status`, `source_url` |
| 20 | `bolagsverket-company-registry` | Bolagsverket / Swedish Company Registry | `leads` | https://console.apify.com/store-search?search=Bolagsverket+company+registry+scraper+Sweden&sortBy=popularity | Nyregistrerade bolag och företagsstatus. Kan behöva custom actor/API snarare än färdig Apify-actor. | `dateFrom/dateTo`, `companyType=AB`, `status`, `region` | `company_name`, `org_number`, `registration_date`, `city`, `region`, `industry`, `status` |
| 21 | `blocket` | Blocket Scraper | `ecommerce` | https://console.apify.com/store-search?search=Blocket+Scraper&sortBy=popularity | Svensk marknadsplats: fordon, handlare, prisdata, annonser. | `searchUrl/query`, `category`, `location`, `maxResults` | `title`, `price`, `seller_name`, `location`, `source_url`, `published_at` |
| 22 | `hemnet` | Hemnet Scraper | `leads` | https://console.apify.com/store-search?search=Hemnet+Scraper&sortBy=popularity | Fastighetsdata, mäklare, områden, prisbevakning. | `searchUrls`, `maxResults` | `title`, `price`, `address`, `city`, `broker_name`, `agency`, `source_url` |
| 23 | `booli` | Booli Scraper | `leads` | https://console.apify.com/store-search?search=Booli+Scraper&sortBy=popularity | Komplement till Hemnet för fastighetsanalys. | `searchUrls`, `maxResults` | `title`, `price`, `address`, `city`, `broker/agency`, `source_url` |
| 24 | `platsbanken` | Platsbanken / Swedish Job Ads Scraper | `leads` | https://console.apify.com/store-search?search=Platsbanken+Arbetsf%C3%B6rmedlingen+scraper&sortBy=popularity | Svenska företag som anställer; bättre Sverige-matchning än Indeed. | `keywords`, `location`, `occupation`, `maxResults` | `company_name`, `title`, `city`, `published_at`, `application_deadline`, `source_url` |
| 25 | `the-org` | The Org / Company People Scraper | `leads` | https://console.apify.com/store-search?search=The+Org+scraper+company+people&sortBy=popularity | Beslutsfattare och organisationsstruktur hos större bolag. | `companyUrls/companyNames`, `maxPeople` | `company_name`, `person_name`, `job_title`, `linkedin`, `source_url` |
| 26 | `amazon-reviews` | Amazon Reviews Scraper | `ecommerce` | https://console.apify.com/store-search?search=Amazon+Reviews+Scraper&sortBy=popularity | Produktinsikter och review mining. Komplement till befintlig Amazon product scraper. | `productUrls/asins`, `maxReviews`, `amazonDomain=amazon.se` | `title/product_name`, `rating`, `review_text`, `review_date`, `reviewer_name`, `source_url` |
| 27 | `shopify-store` | Shopify Store Scraper | `ecommerce` | https://console.apify.com/store-search?search=Shopify+Store+Scraper&sortBy=popularity | Hitta produkter, priser och sortiment hos Shopify-butiker. | `storeUrls`, `maxProducts` | `company_name`, `product_title`, `price`, `currency`, `product_url`, `vendor`, `category` |
| 28 | `woocommerce-store` | WooCommerce Store Scraper | `ecommerce` | https://console.apify.com/store-search?search=WooCommerce+Store+Scraper&sortBy=popularity | Relevant för svenska små/medelstora e-handlare, även FAIV-liknande case. | `storeUrls`, `maxProducts` | `company_name`, `product_title`, `price`, `currency`, `product_url`, `sku`, `category` |
| 29 | `pricerunner` | PriceRunner Scraper | `ecommerce` | https://console.apify.com/store-search?search=PriceRunner+Scraper&sortBy=popularity | Svensk/nordisk prisbevakning och konkurrentdata. | `searchUrls/productUrls`, `maxResults` | `product_title`, `price`, `merchant`, `rating`, `review_count`, `source_url` |
| 30 | `klarna-store-merchant` | Klarna Store / Merchant Scraper | `ecommerce` | https://console.apify.com/store-search?search=Klarna+merchant+store+scraper&sortBy=popularity | Hitta e-handlare som använder Klarna och kan segmenteras som ecom-leads. | `storeUrls/searchQuery`, `maxResults` | `company_name`, `website`, `category`, `country`, `source_url` |
| 31 | `builtwith` | BuiltWith / Technology Lookup | `leads` | https://console.apify.com/store-search?search=BuiltWith+scraper+technology+lookup&sortBy=popularity | Segmentera svenska företag på tech stack: Shopify, WooCommerce, HubSpot, Klarna, WordPress. | `domains`, `technologies/filter`, `maxResults` | `company_name/domain`, `website`, `technologies`, `ecommerce_platform`, `analytics`, `crm` |
| 32 | `wappalyzer` | Wappalyzer Scraper | `leads` | https://console.apify.com/store-search?search=Wappalyzer+scraper+technology+lookup&sortBy=popularity | Liknande BuiltWith, ofta enklare tech-stack enrichment. | `urls/domains`, `maxResults` | `domain`, `website`, `technologies`, `categories`, `source_url` |
| 33 | `sitemap-scraper` | Sitemap Scraper | `content` | https://console.apify.com/store-search?search=Sitemap+Scraper&sortBy=popularity | Hitta alla viktiga sidor på företagshemsidor innan crawling/enrichment. | `urls`, `includeRobots=true`, `maxUrls` | `website`, `source_url`, `page_url`, `lastmod`, `priority` |
| 34 | `google-reviews-ai-analyzer` | AI Text Analyzer for Google Reviews | `leads` | https://console.apify.com/store-search?search=Google+reviews+AI+analyzer+Apify&sortBy=popularity | Paketerbar premium-feature: vad klagar kunder på hos konkurrenter? | `reviewsDatasetId` eller `placeUrls`, `analysisType=sentiment/problems/opportunities` | `company_name`, `sentiment`, `pain_points`, `opportunities`, `summary`, `source_url` |
| 35 | `competitive-intelligence-agent` | Competitive Intelligence Agent | `leads` | https://console.apify.com/store-search?search=Competitive+Intelligence+Agent+Apify&sortBy=popularity | Premium-output: sammanfatta konkurrenters styrkor/svagheter från Maps/social/webb. | `companyNames/domains`, `competitors`, `location`, `maxSources` | `company_name`, `competitor_name`, `strengths`, `weaknesses`, `opportunities`, `summary` |

## Förslag på implementeringsordning

Börja med dessa 10, eftersom de passar bäst för svensk lead-/prospekteringsprodukt:

1. `google-maps-reviews` – Google Maps Reviews Scraper
2. `google-maps-contact-enricher` – Google Maps Email / Contact Enricher
3. `linkedin-jobs` – LinkedIn Jobs Scraper
4. `linkedin-ads` – LinkedIn Ads Scraper
5. `facebook-posts` – Facebook Posts Scraper
6. `facebook-ads-library` – Facebook Ads Library Scraper
7. `instagram-posts` – Instagram Scraper – posts/hashtags/locations
8. `instagram-reels` – Instagram Reels Scraper
9. `instagram-comments` – Instagram Comments Scraper
10. `instagram-tagged-mentions` – Instagram Tagged / Mentions Scraper

Därefter: tech-stack/ecom (`builtwith`, `wappalyzer`, `shopify-store`, `woocommerce-store`) och svenska källor (`hitta-se`, `eniro`, `allabolag`, `platsbanken`) efter juridisk/kommersiell kontroll.
