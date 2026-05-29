import { ScraperConfig } from '../../types';

export const woocommerceStoreConfig: ScraperConfig = {
  id: 'woocommerce-store',
  name: 'WooCommerce-butiker',
  description: 'Hämta produkter, priser, lagersaldo och kategorier från e-handelsbutiker som kör WooCommerce.',
  actorId: 'apify/woocommerce-scraper',
  category: 'ecommerce',
  enabled: true,
  icon: '/icons/woocommerce.svg',
  creditCostPerResult: 1.0,
  fields: [
    {
      name: 'storeUrls',
      label: 'WooCommerce butiks-URL:er (en per rad, t.ex. https://exempelbutik.se)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.exempelbutik.se',
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
      company_name: typeof item.brand === 'string' ? item.brand : undefined,
      title: typeof item.name === 'string' ? item.name : undefined,
      website: typeof item.permalink === 'string' ? item.permalink : undefined,
      source: 'woocommerce-store',
      source_url: typeof item.permalink === 'string' ? item.permalink : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        price: item.price,
        regularPrice: item.regularPrice,
        salePrice: item.salePrice,
        currency: item.currency || 'SEK',
        sku: item.sku,
        category: item.categories,
        images: item.images,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { name: 'Klassisk Träsko Svart', brand: 'Svenska Träskor AB', permalink: 'https://www.exempelbutik.se/produkt/klassisk-trasko-svart', price: '450', regularPrice: '450', salePrice: null, sku: 'TS-001', categories: ['Skor'], images: ['https://exempelbutik.se/wp-content/1.jpg'] },
      { name: 'Ekologisk Ullfilt Grå', brand: 'Ull & Design', permalink: 'https://www.exempelbutik.se/produkt/ekologisk-ullfilt-gra', price: '899', regularPrice: '999', salePrice: '899', sku: 'UF-002', categories: ['Heminredning'], images: ['https://exempelbutik.se/wp-content/2.jpg'] },
    ].slice(0, maxResults);
  },
};
