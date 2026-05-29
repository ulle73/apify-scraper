import { ScraperConfig } from '../../types';

export const hemnetConfig: ScraperConfig = {
  id: 'hemnet',
  name: 'Hemnet',
  description: 'Hämta fastighetsannonser, priser, mäklaruppgifter och områdesstatistik från Hemnet.',
  actorId: 'apify/hemnet-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/hemnet.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'searchUrls',
      label: 'Hemnet sök-URL:er (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.hemnet.se/bostader?location_ids%5B%5D=17744',
    },
    {
      name: 'maxResults',
      label: 'Max bostäder',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 300,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.searchUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      startUrls: urls.map(url => ({ url })),
      maxResults: typeof input.maxResults === 'number' ? input.maxResults : 50,
    };
  },
  normalizeItem(item) {
    return {
      title: typeof item.title === 'string' ? item.title : undefined,
      address: typeof item.streetAddress === 'string' ? item.streetAddress : undefined,
      city: typeof item.city === 'string' ? item.city : undefined,
      source: 'hemnet',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        price: item.price, // t.ex. 4500000
        rooms: item.rooms,
        area: item.livingArea,
        brokerName: item.brokerName,
        brokerAgency: item.brokerAgency,
        publishedDate: item.publishedDate,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'Ljus 3:a med balkong', streetAddress: 'Kungsgatan 14B', city: 'Stockholm', url: 'https://www.hemnet.se/bostad/12345', price: 5495000, rooms: 3, livingArea: 78, brokerName: 'Johan Falk', brokerAgency: 'Fastighetsbyrån' },
      { title: 'Charmig sekelskiftesvilla', streetAddress: 'Gröna Vägen 2', city: 'Göteborg', url: 'https://www.hemnet.se/bostad/67890', price: 8950000, rooms: 6, livingArea: 165, brokerName: 'Sofia Lind', brokerAgency: 'Bjurfors' },
    ].slice(0, maxResults);
  },
};
