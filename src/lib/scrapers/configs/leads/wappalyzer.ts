import { ScraperConfig } from '../../types';

export const wappalyzerConfig: ScraperConfig = {
  id: 'wappalyzer',
  name: 'Wappalyzer Technology Detector',
  description: 'Identifiera webbtekniker, ramverk, e-handel och CMS på valfria hemsidor.',
  actorId: 'apify/wappalyzer-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/wappalyzer.svg',
  creditCostPerResult: 2.0,
  fields: [
    {
      name: 'urls',
      label: 'Hemsidor att skanna (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.ikea.com\nhttps://www.volvocars.com',
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.urls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      urls,
    };
  },
  normalizeItem(item) {
    return {
      domain: typeof item.domain === 'string' ? item.domain : undefined,
      website: typeof item.url === 'string' ? item.url : undefined,
      source: 'wappalyzer',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        technologies: item.technologies, // array av teknologier
        categories: item.categories,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { domain: 'ikea.com', url: 'https://www.ikea.com', technologies: [{ name: 'Optimizely', confidence: 100, categories: ['CMS'] }, { name: 'Google Analytics', confidence: 100, categories: ['Analytics'] }] },
      { domain: 'volvocars.com', url: 'https://www.volvocars.com', technologies: [{ name: 'Adobe Experience Manager', confidence: 100, categories: ['CMS'] }, { name: 'React', confidence: 100, categories: ['JavaScript libraries'] }] },
    ].slice(0, maxResults);
  },
};
