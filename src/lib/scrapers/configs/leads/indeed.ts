import { ScraperConfig } from '../../types';

export const indeedConfig: ScraperConfig = {
  id: 'indeed-scraper',
  name: 'Indeed Jobbannonser',
  description: 'Samla jobbannonser, arbetsbeskrivningar, löner och arbetsgivare från Indeed.',
  actorId: 'apify/indeed-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/indeed.svg',
  creditCostPerResult: 2,
  fields: [
    {
      name: 'position',
      label: 'Yrkestitel / Roll',
      type: 'text',
      required: true,
      placeholder: 't.ex. fullstack developer',
    },
    {
      name: 'location',
      label: 'Plats / Stad',
      type: 'text',
      required: true,
      placeholder: 't.ex. Stockholm',
    },
    {
      name: 'maxResults',
      label: 'Max antal jobb',
      type: 'number',
      required: true,
      defaultValue: 25,
      min: 10,
      max: 100,
    },
  ],
  buildApifyInput(input) {
    return {
      position: String(input.position || ''),
      location: String(input.location || ''),
      limit: typeof input.maxResults === 'number' ? input.maxResults : 25,
    };
  },
  normalizeItem(item) {
    return {
      title: typeof item.positionName === 'string' ? item.positionName : undefined,
      company_name: typeof item.company === 'string' ? item.company : undefined,
      address: typeof item.location === 'string' ? item.location : undefined,
      source: 'indeed',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        salary: item.salary,
        jobType: item.jobType,
        description: item.description,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { positionName: 'Senior Fullstack Developer', company: 'Spotify AB', location: 'Stockholm, Sweden', url: 'https://indeed.com/viewjob?jk=123', salary: '65,000 - 75,000 SEK / month', jobType: 'Full-time', description: 'Spotify is looking for a senior engineer to join our core payments infrastructure team.' },
    ].slice(0, maxResults);
  },
};
