import { ScraperConfig } from '../../types';

export const websiteCrawlerConfig: ScraperConfig = {
  id: 'website-crawler',
  name: 'Hemsideinnehåll (HTML & Text)',
  description: 'Crawla och hämta all ren text från webbplatser – perfekt för AI-träning eller analys.',
  actorId: 'apify/website-content-crawler',
  category: 'content',
  enabled: true,
  icon: '/icons/web-search-svgrepo-com.svg',
  creditCostPerResult: 1.2,
  fields: [
    {
      name: 'urls',
      label: 'Start-URL:er (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://leadify.se/om-oss\nhttps://example.com',
    },
    {
      name: 'maxPages',
      label: 'Max antal sidor per webbplats',
      type: 'number',
      required: true,
      defaultValue: 25,
      min: 5,
      max: 200,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.urls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      startUrls: urls.map(url => ({ url })),
      maxCrawlPages: typeof input.maxPages === 'number' ? input.maxPages : 25,
    };
  },
  normalizeItem(item) {
    return {
      title: typeof item.title === 'string' ? item.title : undefined,
      website: typeof item.url === 'string' ? item.url : undefined,
      source: 'website-crawler',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        text: typeof item.text === 'string' ? item.text.substring(0, 1000) : '',
        description: item.description,
        h1: item.h1,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'Om oss - Leadify Sverige', url: 'https://leadify.se/om-oss', text: 'Vi är ett litet team passionerade utvecklare som bygger framtidens verktyg för automatisk informationsinsamling och prospektering. Vår vision är...', description: 'Läs mer om vårt team och vår vision på Leadify.', h1: 'Vi gör leadinsamling enkelt' },
      { title: 'Example Domain', url: 'https://example.com', text: 'This domain is established to be used for illustrative examples in documents. You may use this domain in examples without prior coordination...', description: 'An illustrative example website', h1: 'Example Domain' },
    ].slice(0, maxResults);
  },
};
