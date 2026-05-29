import { ScraperConfig } from '../../types';

export const hittaSeConfig: ScraperConfig = {
  id: 'hitta-se',
  name: 'Hitta.se',
  description: 'Svensk lokal B2B-data: företag, telefon, adress och kategori.',
  actorId: 'apify/hitta-se-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/hitta.svg',
  creditCostPerResult: 1.0,
  fields: [
    {
      name: 'query',
      label: 'Sökord',
      type: 'text',
      required: true,
      placeholder: 't.ex. Frisör, Snickare',
    },
    {
      name: 'location',
      label: 'Ort / Område (valfritt)',
      type: 'text',
      required: false,
      placeholder: 't.ex. Stockholm, Göteborg',
    },
    {
      name: 'maxResults',
      label: 'Max resultat',
      type: 'number',
      required: true,
      defaultValue: 100,
      min: 10,
      max: 1000,
    },
  ],
  buildApifyInput(input) {
    return {
      queries: String(input.query || '').split(',').map(q => q.trim()).filter(Boolean),
      location: String(input.location || ''),
      maxResults: typeof input.maxResults === 'number' ? input.maxResults : 100,
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.name === 'string' ? item.name : undefined,
      phone: typeof item.phone === 'string' ? item.phone : undefined,
      address: typeof item.address === 'string' ? item.address : undefined,
      city: typeof item.city === 'string' ? item.city : undefined,
      website: typeof item.website === 'string' ? item.website : undefined,
      category: typeof item.category === 'string' ? item.category : undefined,
      source: 'hitta-se',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        orgNumber: item.orgNumber,
        email: item.email,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { name: 'Svenska Frisörsalongen AB', phone: '08-123 45 67', address: 'Sveavägen 45', city: 'Stockholm', website: 'https://frisorsalongen.se', category: 'Frisör', url: 'https://hitta.se/frisorsalongen', orgNumber: '556123-4567' },
      { name: 'Bygg & Snickeri Göteborg', phone: '031-987 65 43', address: 'Avenyn 12', city: 'Göteborg', website: 'https://byggsnickeri.se', category: 'Snickare', url: 'https://hitta.se/byggsnickeri', orgNumber: '559876-5432' },
    ].slice(0, maxResults);
  },
};
