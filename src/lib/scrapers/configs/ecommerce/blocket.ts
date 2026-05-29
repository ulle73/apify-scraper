import { ScraperConfig } from '../../types';

export const blocketConfig: ScraperConfig = {
  id: 'blocket',
  name: 'Blocket Annonser',
  description: 'Hämta fordon, bostäder, möbler, jobberbjudanden och butiksannonser från svenska Blocket.',
  actorId: 'apify/blocket-scraper',
  category: 'ecommerce',
  enabled: true,
  icon: '/icons/blocket.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'queries',
      label: 'Sökord eller Blocket URL:er (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nvolvo xc60\nhttps://www.blocket.se/annonser/hela_sverige/fordon/bilar',
    },
    {
      name: 'maxResults',
      label: 'Max annonser',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 300,
    },
  ],
  buildApifyInput(input) {
    const lines = String(input.queries || '').split('\n').map(l => l.trim()).filter(Boolean);
    const startUrls = lines.filter(l => l.startsWith('http')).map(url => ({ url }));
    const searchQueries = lines.filter(l => !l.startsWith('http'));
    return {
      startUrls: startUrls.length ? startUrls : undefined,
      queries: searchQueries.length ? searchQueries : undefined,
      maxResults: typeof input.maxResults === 'number' ? input.maxResults : 50,
    };
  },
  normalizeItem(item) {
    return {
      title: typeof item.title === 'string' ? item.title : undefined,
      city: typeof item.location === 'string' ? item.location : undefined,
      source: 'blocket',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        price: item.price, // t.ex. 150000 eller "150 000 kr"
        sellerName: item.sellerName,
        sellerType: item.sellerType, // t.ex. "Företag" / "Privat"
        publishedAt: item.publishedDate,
        category: item.category,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'Volvo XC60 D4 AWD M-Design', location: 'Stockholm', url: 'https://www.blocket.se/annons/123456', price: '289 000 kr', sellerName: 'Bilhuset Stockholm', sellerType: 'Företag', publishedDate: '2026-05-20', category: 'Bilar' },
      { title: 'Soffa Söderhamn IKEA 3-sits', location: 'Göteborg', url: 'https://www.blocket.se/annons/678901', price: '3 500 kr', sellerName: 'Marie S', sellerType: 'Privat', publishedDate: '2026-05-19', category: 'Möbler & heminredning' },
    ].slice(0, maxResults);
  },
};
