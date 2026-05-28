import { ScraperAdapter } from './types';
import { googleMapsAdapter } from './adapters/google-maps';
import { googleSearchAdapter } from './adapters/google-search';
import { contactDetailsAdapter } from './adapters/contact-details';
import { websiteCrawlerAdapter } from './adapters/website-crawler';
import { instagramProfileAdapter } from './adapters/instagram-profile';
import { tiktokScraperAdapter } from './adapters/tiktok-scraper';
import { linkedinCompanyAdapter } from './adapters/linkedin-company';
import { ecommerceProductScraperAdapter } from './adapters/ecommerce-product-scraper';
import { youtubeScraperAdapter } from './adapters/youtube-scraper';
import { newsScraperAdapter } from './adapters/news-scraper';
import { genericWebScraperAdapter } from './adapters/generic-web-scraper';

export const scraperRegistry: ScraperAdapter[] = [
  googleMapsAdapter,
  googleSearchAdapter,
  contactDetailsAdapter,
  websiteCrawlerAdapter,
  instagramProfileAdapter,
  tiktokScraperAdapter,
  linkedinCompanyAdapter,
  ecommerceProductScraperAdapter,
  youtubeScraperAdapter,
  newsScraperAdapter,
  genericWebScraperAdapter,
];

export function getAdapter(scraperId: string): ScraperAdapter | undefined {
  return scraperRegistry.find(adapter => adapter.id === scraperId);
}

export function getEnabledAdapters(): ScraperAdapter[] {
  return scraperRegistry.filter(adapter => adapter.enabled);
}

export function getAllAdapters(): ScraperAdapter[] {
  return scraperRegistry;
}

export function getAdaptersByCategory(category: ScraperAdapter['category']): ScraperAdapter[] {
  return scraperRegistry.filter(adapter => adapter.category === category);
}
