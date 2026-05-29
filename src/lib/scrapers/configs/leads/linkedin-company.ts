import { ScraperConfig } from '../../types';

export const linkedinCompanyConfig: ScraperConfig = {
  id: 'linkedin-company',
  name: 'LinkedIn Företagssök',
  description: 'Extrahera information om företag, bransch, storlek och anställda från LinkedIn.',
  actorId: 'apify/linkedin-company-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/linkedin-svgrepo-com.svg',
  creditCostPerResult: 3,
  fields: [
    {
      name: 'companies',
      label: 'LinkedIn företags-URL:er (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.linkedin.com/company/spotify/\nhttps://www.linkedin.com/company/klarna/',
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.companies || '').split('\n').map(u => u.trim()).filter(Boolean);
    return { urls };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.name === 'string' ? item.name : undefined,
      website: typeof item.website === 'string' ? item.website : undefined,
      address: typeof item.headquarters === 'string' ? item.headquarters : undefined,
      category: typeof item.industry === 'string' ? item.industry : undefined,
      source: 'linkedin',
      source_url: typeof item.linkedinUrl === 'string' ? item.linkedinUrl : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        companySize: item.companySize,
        founded: item.founded,
        description: item.description,
        specialties: item.specialties,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { name: 'Spotify', website: 'https://spotify.com', headquarters: 'Stockholm, Sweden', industry: 'Music & Audio Streaming', linkedinUrl: 'https://linkedin.com/company/spotify', companySize: '5001-10000 employees', founded: 2006, description: 'Spotify is a digital music service that gives you access to millions of songs.' },
      { name: 'Klarna', website: 'https://klarna.com', headquarters: 'Stockholm, Sweden', industry: 'Financial Services', linkedinUrl: 'https://linkedin.com/company/klarna', companySize: '1001-5000 employees', founded: 2005, description: 'Klarna makes shopping smoooth. We help you buy now and pay later.' },
    ].slice(0, maxResults);
  },
};
