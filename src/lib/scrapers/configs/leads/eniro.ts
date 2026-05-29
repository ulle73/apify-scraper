import { ScraperConfig } from '../../types';

export const eniroConfig: ScraperConfig = {
  id: 'eniro',
  name: 'Eniro',
  description: 'Svensk och nordisk företagskatalog. Sök på företag, telefon och adresser.',
  actorId: 'apify/eniro-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/eniro.svg',
  creditCostPerResult: 1.0,
  fields: [
    {
      name: 'query',
      label: 'Sökord',
      type: 'text',
      required: true,
      placeholder: 't.ex. Restaurang, Tandläkare',
    },
    {
      name: 'location',
      label: 'Ort / Område (valfritt)',
      type: 'text',
      required: false,
      placeholder: 't.ex. Malmö, Uppsala',
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
      source: 'eniro',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        orgNumber: item.orgNumber,
        email: item.email,
        latitude: item.latitude,
        longitude: item.longitude,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { name: 'Kvarterskrogen Malmö', phone: '040-99 88 77', address: 'Lilla Torg 4', city: 'Malmö', website: 'https://kvarterskrogen.se', category: 'Restaurang', url: 'https://eniro.se/kvarterskrogen', orgNumber: '556222-1111' },
      { name: 'Tandläkarkliniken Uppsala', phone: '018-44 55 66', address: 'Drottninggatan 8', city: 'Uppsala', website: 'https://tandlakareuppsala.se', category: 'Tandläkare', url: 'https://eniro.se/tandlakare', orgNumber: '559333-2222' },
    ].slice(0, maxResults);
  },
};
