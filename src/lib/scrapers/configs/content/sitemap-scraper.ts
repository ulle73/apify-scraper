import { ScraperConfig } from '../../types';

export const sitemapScraperConfig: ScraperConfig = {
  id: 'sitemap-scraper',
  name: 'Sitemap Scraper',
  description: 'Hitta och extrahera alla indexerade sidor på en webbplats via dess sitemap.xml.',
  actorId: 'apify/sitemap-scraper',
  category: 'content',
  enabled: true,
  icon: '/icons/sitemap.svg',
  creditCostPerResult: 0.5,
  fields: [
    {
      name: 'sitemapUrls',
      label: 'Sitemap URL:er (en per rad, t.ex. https://example.com/sitemap.xml)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://klarna.com/sitemap.xml',
    },
    {
      name: 'maxUrls',
      label: 'Max URL:er att hämta',
      type: 'number',
      required: true,
      defaultValue: 100,
      min: 10,
      max: 1000,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.sitemapUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      sitemaps: urls,
      maxUrls: typeof input.maxUrls === 'number' ? input.maxUrls : 100,
    };
  },
  normalizeItem(item) {
    return {
      website: typeof item.sitemapUrl === 'string' ? item.sitemapUrl : undefined,
      source_url: typeof item.url === 'string' ? item.url : undefined,
      source: 'sitemap-scraper',
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        pageUrl: item.url,
        lastmod: item.lastmod,
        changefreq: item.changefreq,
        priority: item.priority,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { sitemapUrl: 'https://klarna.com/sitemap.xml', url: 'https://www.klarna.com/se/', lastmod: '2026-05-20T10:00:00Z', changefreq: 'daily', priority: 1.0 },
      { sitemapUrl: 'https://klarna.com/sitemap.xml', url: 'https://www.klarna.com/se/kort/', lastmod: '2026-05-18T14:30:00Z', changefreq: 'weekly', priority: 0.8 },
    ].slice(0, maxResults);
  },
};
