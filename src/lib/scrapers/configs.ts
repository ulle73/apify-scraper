/**
 * Aggregator – importerar alla enskilda scraper-configs och exporterar
 * dem som en samlad array. Lägg till nya scrapers här och skapa en
 * ny fil i rätt kategori-mapp under configs/.
 *
 * Struktur:
 *   configs/leads/        – B2B-leads, företagsdata, jobblistor
 *   configs/social/       – Sociala medier (Instagram, TikTok, …)
 *   configs/search/       – Sökmotorer (Google, Bing, …)
 *   configs/content/      – Webbcrawling, nyheter, YouTube
 *   configs/ecommerce/    – Amazon, Shopify, prisdata
 */

// ── Leads ────────────────────────────────────────────────────────────────────
import { googleMapsConfig }                      from './configs/leads/google-maps';
import { linkedinCompanyConfig }                 from './configs/leads/linkedin-company';
import { contactDetailsConfig }                  from './configs/leads/contact-details';
import { tripadvisorConfig }                     from './configs/leads/tripadvisor';
import { indeedConfig }                          from './configs/leads/indeed';
import { googleMapsReviewsConfig }               from './configs/leads/google-maps-reviews';
import { googleMapsContactEnricherConfig }       from './configs/leads/google-maps-contact-enricher';
import { linkedinJobsConfig }                    from './configs/leads/linkedin-jobs';
import { linkedinAdsConfig }                     from './configs/leads/linkedin-ads';
import { trustpilotConfig }                      from './configs/leads/trustpilot';
import { recoSeConfig }                          from './configs/leads/reco-se';
import { hittaSeConfig }                         from './configs/leads/hitta-se';
import { eniroConfig }                           from './configs/leads/eniro';
import { allabolagConfig }                       from './configs/leads/allabolag';
import { bolagsverketCompanyRegistryConfig }     from './configs/leads/bolagsverket-company-registry';
import { hemnetConfig }                          from './configs/leads/hemnet';
import { booliConfig }                           from './configs/leads/booli';
import { platsbankenConfig }                     from './configs/leads/platsbanken';
import { theOrgConfig }                          from './configs/leads/the-org';
import { builtwithConfig }                       from './configs/leads/builtwith';
import { wappalyzerConfig }                      from './configs/leads/wappalyzer';
import { googleReviewsAiAnalyzerConfig }         from './configs/leads/google-reviews-ai-analyzer';
import { competitiveIntelligenceAgentConfig }    from './configs/leads/competitive-intelligence-agent';

// ── Social ───────────────────────────────────────────────────────────────────
import { instagramProfileConfig }                from './configs/social/instagram-profile';
import { tiktokScraperConfig }                   from './configs/social/tiktok-scraper';
import { facebookPagesConfig }                   from './configs/social/facebook-pages';
import { twitterScraperConfig }                  from './configs/social/twitter-scraper';
import { redditScraperConfig }                   from './configs/social/reddit-scraper';
import { facebookPostsConfig }                   from './configs/social/facebook-posts';
import { facebookAdsLibraryConfig }              from './configs/social/facebook-ads-library';
import { instagramPostsConfig }                  from './configs/social/instagram-posts';
import { instagramReelsConfig }                  from './configs/social/instagram-reels';
import { instagramCommentsConfig }               from './configs/social/instagram-comments';
import { instagramTaggedMentionsConfig }         from './configs/social/instagram-tagged-mentions';
import { tiktokProfileConfig }                   from './configs/social/tiktok-profile';

// ── Search ───────────────────────────────────────────────────────────────────
import { googleSearchConfig }                    from './configs/search/google-search';
import { googleTrendsConfig }                    from './configs/search/google-trends';

// ── Content ──────────────────────────────────────────────────────────────────
import { websiteCrawlerConfig }                  from './configs/content/website-crawler';
import { newsScraperConfig }                     from './configs/content/news-scraper';
import { youtubeScraperConfig }                  from './configs/content/youtube-scraper';
import { youtubeShortsConfig }                   from './configs/content/youtube-shorts';
import { youtubeCommentsConfig }                 from './configs/content/youtube-comments';
import { sitemapScraperConfig }                  from './configs/content/sitemap-scraper';

// ── Ecommerce ────────────────────────────────────────────────────────────────
import { ecommerceProductScraperConfig }         from './configs/ecommerce/ecommerce-product-scraper';
import { blocketConfig }                         from './configs/ecommerce/blocket';
import { amazonReviewsConfig }                   from './configs/ecommerce/amazon-reviews';
import { shopifyStoreConfig }                    from './configs/ecommerce/shopify-store';
import { woocommerceStoreConfig }                from './configs/ecommerce/woocommerce-store';
import { pricerunnerConfig }                     from './configs/ecommerce/pricerunner';
import { klarnaStoreMerchantConfig }             from './configs/ecommerce/klarna-store-merchant';

// Re-export ScraperConfig so existing imports from './configs' keep working
export type { ScraperConfig } from './types';

export const scrapersConfig = [
  // Leads
  googleMapsConfig,
  linkedinCompanyConfig,
  contactDetailsConfig,
  tripadvisorConfig,
  indeedConfig,
  googleMapsReviewsConfig,
  googleMapsContactEnricherConfig,
  linkedinJobsConfig,
  linkedinAdsConfig,
  trustpilotConfig,
  recoSeConfig,
  hittaSeConfig,
  eniroConfig,
  allabolagConfig,
  bolagsverketCompanyRegistryConfig,
  hemnetConfig,
  booliConfig,
  platsbankenConfig,
  theOrgConfig,
  builtwithConfig,
  wappalyzerConfig,
  googleReviewsAiAnalyzerConfig,
  competitiveIntelligenceAgentConfig,

  // Social
  instagramProfileConfig,
  tiktokScraperConfig,
  facebookPagesConfig,
  twitterScraperConfig,
  redditScraperConfig,
  facebookPostsConfig,
  facebookAdsLibraryConfig,
  instagramPostsConfig,
  instagramReelsConfig,
  instagramCommentsConfig,
  instagramTaggedMentionsConfig,
  tiktokProfileConfig,

  // Search
  googleSearchConfig,
  googleTrendsConfig,

  // Content
  websiteCrawlerConfig,
  newsScraperConfig,
  youtubeScraperConfig,
  youtubeShortsConfig,
  youtubeCommentsConfig,
  sitemapScraperConfig,

  // Ecommerce
  ecommerceProductScraperConfig,
  blocketConfig,
  amazonReviewsConfig,
  shopifyStoreConfig,
  woocommerceStoreConfig,
  pricerunnerConfig,
  klarnaStoreMerchantConfig,
];
