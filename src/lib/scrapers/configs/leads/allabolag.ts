import { ScraperConfig } from '../../types';

export const allabolagConfig: ScraperConfig = {
  id: 'allabolag',
  name: 'Allabolag',
  description: 'Extremt relevant svensk B2B-enrichment: organisationsnummer, omsättning, anställda, bransch och status.',
  actorId: 'apify/allabolag-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/allabolag.svg',
  creditCostPerResult: 2.0,
  fields: [
    {
      name: 'queries',
      label: 'Sökord eller Organisationsnummer (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\n556123-4567\nVolvo Personvagnar Aktiebolag',
    },
    {
      name: 'maxResults',
      label: 'Max resultat',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 5,
      max: 200,
    },
  ],
  buildApifyInput(input) {
    const queries = String(input.queries || '').split('\n').map(q => q.trim()).filter(Boolean);
    return {
      queries,
      maxResults: typeof input.maxResults === 'number' ? input.maxResults : 50,
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.companyName === 'string' ? item.companyName : undefined,
      phone: typeof item.phone === 'string' ? item.phone : undefined,
      address: typeof item.address === 'string' ? item.address : undefined,
      city: typeof item.city === 'string' ? item.city : undefined,
      website: typeof item.website === 'string' ? item.website : undefined,
      category: typeof item.industry === 'string' ? item.industry : undefined,
      source: 'allabolag',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        orgNumber: item.orgNumber,
        revenue: item.revenue, // t.ex. "15 000 tkr"
        employees: item.employees, // t.ex. "10-19"
        status: item.status, // t.ex. "Aktivt"
        profit: item.profit,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { companyName: 'Volvo Personvagnar Aktiebolag', orgNumber: '556074-3089', revenue: '312 000 000 tkr', employees: '10 000+', city: 'Göteborg', industry: 'Tillverkning av personbilar', status: 'Aktivt', url: 'https://www.allabolag.se/5560743089/volvo-personvagnar-ab' },
      { companyName: 'Leadify Sweden AB', orgNumber: '559123-4567', revenue: '2 500 tkr', employees: '5-9', city: 'Stockholm', industry: 'Databehandling, hosting o.d.', status: 'Aktivt', url: 'https://www.allabolag.se/5591234567/leadify-sweden-ab' },
    ].slice(0, maxResults);
  },
};
