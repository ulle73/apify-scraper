import { ScraperConfig } from '../../types';

export const ecommerceProductScraperConfig: ScraperConfig = {
  id: 'ecommerce-product-scraper',
  name: 'Amazon E-handelsprodukter',
  description: 'Hitta produkter, priser, betyg och återförsäljare på Amazon.',
  actorId: 'apify/amazon-crawler',
  category: 'ecommerce',
  enabled: true,
  icon: '/icons/amazon-color-svgrepo-com.svg',
  creditCostPerResult: 2,
  fields: [
    {
      name: 'queries',
      label: 'Sökord / Produktkategorier (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\niphone 15 pro\nmechanical keyboard',
    },
    {
      name: 'maxResults',
      label: 'Max produkter',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 500,
    },
  ],
  buildApifyInput(input) {
    const queries = String(input.queries || '').split('\n').map(q => q.trim()).filter(Boolean);
    return {
      queries,
      maxProducts: typeof input.maxResults === 'number' ? input.maxResults : 50,
    };
  },
  normalizeItem(item) {
    return {
      title: typeof item.title === 'string' ? item.title : undefined,
      website: typeof item.url === 'string' ? item.url : undefined,
      category: typeof item.category === 'string' ? item.category : undefined,
      rating: typeof item.stars === 'number' ? item.stars : undefined,
      review_count: typeof item.reviewsCount === 'number' ? item.reviewsCount : undefined,
      source: 'amazon',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        price: item.price,
        currency: item.currency,
        asin: item.asin,
        seller: item.seller,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'Apple iPhone 15 Pro (128 GB) - Natural Titanium', url: 'https://amazon.se/dp/B0CHWX6N33', category: 'Mobiltelefoner', stars: 4.7, reviewsCount: 1540, price: 13490, currency: 'SEK', asin: 'B0CHWX6N33', seller: 'Apple' },
      { title: 'Keychron K2 Mechanical Keyboard - Red Switch', url: 'https://amazon.se/dp/B07QBPDW5S', category: 'Tangentbord', stars: 4.5, reviewsCount: 342, price: 1100, currency: 'SEK', asin: 'B07QBPDW5S', seller: 'Keychron' },
    ].slice(0, maxResults);
  },
};
