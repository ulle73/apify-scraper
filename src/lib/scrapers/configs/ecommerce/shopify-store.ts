import { ScraperConfig } from '../../types';

export const shopifyStoreConfig: ScraperConfig = {
  id: 'shopify-store',
  name: 'Shopify-butiker',
  description: 'Hämta produkter, priser, lagersaldo och kategorier från e-handelsbutiker som kör Shopify.',
  actorId: 'apify/shopify-scraper',
  category: 'ecommerce',
  enabled: true,
  icon: '/icons/shopify.svg',
  creditCostPerResult: 1.0,
  fields: [
    {
      name: 'storeUrls',
      label: 'Shopify butiks-URL:er (en per rad, t.ex. https://hursomhelst.com)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.gymshark.com',
    },
    {
      name: 'maxProducts',
      label: 'Max produkter per butik',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 500,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.storeUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      startUrls: urls.map(url => ({ url })),
      maxProducts: typeof input.maxProducts === 'number' ? input.maxProducts : 50,
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.vendor === 'string' ? item.vendor : undefined,
      title: typeof item.title === 'string' ? item.title : undefined,
      website: typeof item.url === 'string' ? item.url : undefined,
      source: 'shopify-store',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        price: item.price,
        currency: item.currency,
        vendor: item.vendor,
        category: item.productType,
        images: item.images,
        variants: item.variants,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'Seamless Sport-BH Black', vendor: 'Gymshark', url: 'https://www.gymshark.com/products/seamless-sport-bh-black', price: 349, currency: 'SEK', productType: 'Sportkläder', images: ['https://gymshark.cdn.com/123.jpg'], variants: [{ title: 'S', price: 349 }] },
      { title: 'Gymshark Energy T-shirt White', vendor: 'Gymshark', url: 'https://www.gymshark.com/products/energy-t-shirt-white', price: 299, currency: 'SEK', productType: 'Sportkläder', images: ['https://gymshark.cdn.com/456.jpg'], variants: [{ title: 'M', price: 299 }] },
    ].slice(0, maxResults);
  },
};
