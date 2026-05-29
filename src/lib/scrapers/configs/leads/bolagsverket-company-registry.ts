import { ScraperConfig } from '../../types';

export const bolagsverketCompanyRegistryConfig: ScraperConfig = {
  id: 'bolagsverket-company-registry',
  name: 'Bolagsverket Företagsregister',
  description: 'Nyregistrerade bolag, organisationsnummer och registreringsstatus i Sverige.',
  actorId: 'apify/bolagsverket-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/bolagsverket.svg',
  creditCostPerResult: 2.5,
  fields: [
    {
      name: 'dateFrom',
      label: 'Registrerat från (datum)',
      type: 'text',
      required: true,
      defaultValue: '2026-05-01',
      placeholder: 'YYYY-MM-DD',
    },
    {
      name: 'dateTo',
      label: 'Registrerat till (datum)',
      type: 'text',
      required: true,
      defaultValue: '2026-05-29',
      placeholder: 'YYYY-MM-DD',
    },
    {
      name: 'companyType',
      label: 'Bolagsform',
      type: 'select',
      required: true,
      defaultValue: 'AB',
      options: [
        { value: 'AB', label: 'Aktiebolag (AB)' },
        { value: 'EF', label: 'Enskild firma (EF)' },
        { value: 'HB/KB', label: 'Handelsbolag / Kommanditbolag' },
      ],
    },
  ],
  buildApifyInput(input) {
    return {
      dateFrom: String(input.dateFrom || '2026-05-01'),
      dateTo: String(input.dateTo || '2026-05-29'),
      companyType: String(input.companyType || 'AB'),
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.companyName === 'string' ? item.companyName : undefined,
      city: typeof item.city === 'string' ? item.city : undefined,
      region: typeof item.region === 'string' ? item.region : undefined,
      source: 'bolagsverket',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        orgNumber: item.orgNumber,
        registrationDate: item.registrationDate,
        companyType: item.companyType,
        status: item.status,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { companyName: 'Stockholm Tech Ventures AB', orgNumber: '559555-4321', registrationDate: '2026-05-15', city: 'Stockholm', region: 'Stockholms län', companyType: 'AB', status: 'Registrerat' },
      { companyName: 'Göteborgs Gröna Kaffe EF', orgNumber: '861012-9876', registrationDate: '2026-05-18', city: 'Göteborg', region: 'Västra Götalands län', companyType: 'EF', status: 'Registrerat' },
    ].slice(0, maxResults);
  },
};
