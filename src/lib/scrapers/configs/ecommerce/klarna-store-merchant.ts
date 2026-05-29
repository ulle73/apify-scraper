import { ScraperConfig } from '../../types';

export const klarnaStoreMerchantConfig: ScraperConfig = {
  id: 'klarna-store-merchant',
  name: 'Klarna-anslutna butiker',
  description: 'Hitta och segmentera e-handlare som erbjuder Klarna som betalningsalternativ på sin sajt.',
  actorId: 'apify/klarna-store-scraper',
  category: 'ecommerce',
  enabled: true,
  icon: '/icons/klarna.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'queries',
      label: 'Sökord eller Butikskategorier på Klarna (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nKläder & Accessoarer\nSkönhet\nHem & Trädgård',
    },
    {
      name: 'maxResults',
      label: 'Max butiker',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 300,
    },
  ],
  buildApifyInput(input) {
    const categories = String(input.queries || '').split('\n').map(c => c.trim()).filter(Boolean);
    return {
      categories,
      limit: typeof input.maxResults === 'number' ? input.maxResults : 50,
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.storeName === 'string' ? item.storeName : undefined,
      website: typeof item.websiteUrl === 'string' ? item.websiteUrl : undefined,
      source: 'klarna-store-merchant',
      source_url: typeof item.klarnaStoreUrl === 'string' ? item.klarnaStoreUrl : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        categoryName: item.categoryName,
        country: item.country || 'SE',
        rating: item.rating,
        reviewsCount: item.reviewsCount,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { storeName: 'Boozt.com', websiteUrl: 'https://www.boozt.com', klarnaStoreUrl: 'https://www.klarna.com/se/stores/boozt', categoryName: 'Kläder & Accessoarer', country: 'SE', rating: 4.5, reviewsCount: 1540 },
      { storeName: 'Apoteket', websiteUrl: 'https://www.apoteket.se', klarnaStoreUrl: 'https://www.klarna.com/se/stores/apoteket', categoryName: 'Skönhet & Hälsa', country: 'SE', rating: 4.7, reviewsCount: 3200 },
    ].slice(0, maxResults);
  },
};
