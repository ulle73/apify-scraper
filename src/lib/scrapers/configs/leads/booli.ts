import { ScraperConfig } from '../../types';

export const booliConfig: ScraperConfig = {
  id: 'booli',
  name: 'Booli',
  description: 'Fastighetsanalys, slutpriser och värderingar från Booli som komplement till Hemnet.',
  actorId: 'apify/booli-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/booli.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'searchUrls',
      label: 'Booli sök-URL:er (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.booli.se/sok/till-salu?areaIds=1',
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
      source: 'booli',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        price: item.price,
        squareMeterPrice: item.squareMeterPrice,
        rooms: item.rooms,
        area: item.livingArea,
        brokerAgency: item.brokerAgency,
        soldDate: item.soldDate,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'Modern lägenhet i Nacka', streetAddress: 'Järla Sjöväg 5', city: 'Nacka', url: 'https://www.booli.se/annons/1234', price: 4200000, rooms: 2, livingArea: 55, brokerAgency: 'Länsförsäkringar Fastighetsförmedling' },
      { title: 'Villa med sjöutsikt', streetAddress: 'Strandvägen 40', city: 'Värmdö', url: 'https://www.booli.se/annons/5678', price: 12500000, rooms: 7, livingArea: 210, brokerAgency: 'Svensk Fastighetsförmedling' },
    ].slice(0, maxResults);
  },
};
