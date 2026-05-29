import { ScraperConfig } from '../../types';

export const googleMapsContactEnricherConfig: ScraperConfig = {
  id: 'google-maps-contact-enricher',
  name: 'Google Maps Kontaktberikning',
  description: 'Komplement till Google Maps: hämta e-post och sociala länkar från företagens hemsidor.',
  actorId: 'apify/google-maps-email-extractor',
  category: 'leads',
  enabled: true,
  icon: '/icons/google-maps-platform-svgrepo-com.svg',
  creditCostPerResult: 2,
  fields: [
    {
      name: 'placeUrls',
      label: 'Google Maps-länkar eller hemsidor (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.google.com/maps/place/...\nhttps://foretaget.se',
    },
    {
      name: 'maxDepth',
      label: 'Crawldjup per sida',
      type: 'number',
      required: true,
      defaultValue: 2,
      min: 1,
      max: 4,
    },
    {
      name: 'includeSocials',
      label: 'Inkludera sociala profiler',
      type: 'checkbox',
      required: false,
      defaultValue: true,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.placeUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      startUrls: urls.map(url => ({ url })),
      maxDepth: typeof input.maxDepth === 'number' ? input.maxDepth : 2,
      includeSocials: input.includeSocials !== false,
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.companyName === 'string' ? item.companyName : undefined,
      website: typeof item.website === 'string' ? item.website : undefined,
      domain: typeof item.domain === 'string' ? item.domain : undefined,
      email: typeof item.email === 'string' ? item.email : undefined,
      phone: typeof item.phone === 'string' ? item.phone : undefined,
      source: 'google-maps-enricher',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        facebook: item.facebook,
        instagram: item.instagram,
        linkedin: item.linkedin,
        allEmails: item.emails,
        allPhones: item.phones,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { companyName: 'Göteborgs Bilverkstad AB', website: 'https://goteborgsbilverkstad.se', domain: 'goteborgsbilverkstad.se', email: 'info@goteborgsbilverkstad.se', phone: '031-123 45 67', url: 'https://goteborgsbilverkstad.se', facebook: 'https://facebook.com/goteborgsbilverkstad', instagram: 'https://instagram.com/goteborgsbilverkstad', emails: ['info@goteborgsbilverkstad.se', 'jobb@goteborgsbilverkstad.se'], phones: ['031-123 45 67'] },
    ].slice(0, maxResults);
  },
};
