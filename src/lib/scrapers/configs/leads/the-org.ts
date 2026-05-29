import { ScraperConfig } from '../../types';

export const theOrgConfig: ScraperConfig = {
  id: 'the-org',
  name: 'The Org Organisationsstruktur',
  description: 'Hitta organisationsstrukturer, chefer och anställda hos svenska och internationella företag.',
  actorId: 'apify/the-org-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/theorg.svg',
  creditCostPerResult: 2.0,
  fields: [
    {
      name: 'companyUrls',
      label: 'The Org företagssidor (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://theorg.com/org/klarna\nhttps://theorg.com/org/spotify',
    },
    {
      name: 'maxPeople',
      label: 'Max personer per företag',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 5,
      max: 200,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.companyUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      startUrls: urls.map(url => ({ url })),
      maxPeople: typeof input.maxPeople === 'number' ? input.maxPeople : 50,
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.companyName === 'string' ? item.companyName : undefined,
      person_name: typeof item.name === 'string' ? item.name : undefined,
      title: typeof item.position === 'string' ? item.position : undefined,
      source: 'the-org',
      source_url: typeof item.profileUrl === 'string' ? item.profileUrl : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        linkedin: item.linkedin,
        email: item.email,
        department: item.department,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { companyName: 'Klarna', name: 'Sebastian Siemiatkowski', position: 'CEO & Co-founder', profileUrl: 'https://theorg.com/org/klarna/member/sebastian-siemiatkowski', linkedin: 'https://www.linkedin.com/in/siemiatkowski', department: 'Management' },
      { companyName: 'Klarna', name: 'Yngve Andersson', position: 'CTO', profileUrl: 'https://theorg.com/org/klarna/member/yngve-andersson', linkedin: 'https://www.linkedin.com/in/yngve-andersson', department: 'Engineering' },
    ].slice(0, maxResults);
  },
};
