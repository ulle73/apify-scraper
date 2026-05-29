import { ScraperConfig } from '../../types';

export const pricerunnerConfig: ScraperConfig = {
  id: 'pricerunner',
  name: 'PriceRunner Jämförelse',
  description: 'Hämta priser, återförsäljare, betyg och produktinformation från PriceRunner.',
  actorId: 'apify/pricerunner-scraper',
  category: 'ecommerce',
  enabled: true,
  icon: '/icons/pricerunner.svg',
  creditCostPerResult: 2.0,
  fields: [
    {
      name: 'queries',
      label: 'Sökord eller PriceRunner-kategorilänkar (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nPlaystation 5\nhttps://www.pricerunner.se/cl/37/Spelkonsoler',
    },
    {
      name: 'maxResults',
      label: 'Max produkter',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 200,
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
      title: typeof item.name === 'string' ? item.name : undefined,
      source: 'pricerunner',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        lowestPrice: item.lowestPrice,
        highestPrice: item.highestPrice,
        category: item.categoryName,
        rating: item.rating,
        reviewsCount: item.reviewsCount,
        offers: item.offers, // array av återförsäljare och deras priser
      },
    };
  },
  getMockData(maxResults) {
    return [
      { name: 'Sony PlayStation 5 (Slim) 1TB', url: 'https://www.pricerunner.se/pl/37-3200000/Spelkonsoler/Sony-PlayStation-5-Slim-1TB-priser', lowestPrice: 5290, highestPrice: 6100, categoryName: 'Spelkonsoler', rating: 4.8, reviewsCount: 345, offers: [{ merchant: 'Webhallen', price: 5290, stock: 'In stock' }, { merchant: 'NetOnNet', price: 5299, stock: 'In stock' }] },
      { name: 'Apple iPhone 15 Pro 128GB', url: 'https://www.pricerunner.se/pl/1-3205000/Mobiltelefoner/Apple-iPhone-15-Pro-128GB-priser', lowestPrice: 12490, highestPrice: 14500, categoryName: 'Mobiltelefoner', rating: 4.6, reviewsCount: 180, offers: [{ merchant: 'Elgiganten', price: 12490, stock: 'In stock' }, { merchant: 'MediaMarkt', price: 12495, stock: 'In stock' }] },
    ].slice(0, maxResults);
  },
};
