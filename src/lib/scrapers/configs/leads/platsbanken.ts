import { ScraperConfig } from '../../types';

export const platsbankenConfig: ScraperConfig = {
  id: 'platsbanken',
  name: 'Platsbanken Jobbannonser',
  description: 'Hämta svenska jobbannonser från Arbetsförmedlingen Platsbanken för säljsignaler.',
  actorId: 'apify/platsbanken-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/arbetsformedlingen.svg',
  creditCostPerResult: 1.0,
  fields: [
    {
      name: 'keywords',
      label: 'Sökord',
      type: 'text',
      required: true,
      placeholder: 't.ex. Fullstack-utvecklare, B2B-säljare',
    },
    {
      name: 'location',
      label: 'Ort / Region (valfritt)',
      type: 'text',
      required: false,
      placeholder: 't.ex. Stockholm, Skåne',
    },
    {
      name: 'maxResults',
      label: 'Max annonser',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 500,
    },
  ],
  buildApifyInput(input) {
    return {
      query: String(input.keywords || ''),
      location: String(input.location || ''),
      maxResults: typeof input.maxResults === 'number' ? input.maxResults : 50,
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.employer === 'string' ? item.employer : undefined,
      title: typeof item.title === 'string' ? item.title : undefined,
      city: typeof item.location === 'string' ? item.location : undefined,
      source: 'platsbanken',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        publishedAt: item.publishedDate,
        applicationDeadline: item.applicationDeadline,
        salaryType: item.salaryType,
        employmentType: item.employmentType,
        description: item.description,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { employer: 'Leadify Technologies AB', title: 'Senior JavaScript Developer', location: 'Stockholm', url: 'https://arbetsformedlingen.se/platsbanken/annonser/123', publishedDate: '2026-05-20', applicationDeadline: '2026-06-20', employmentType: 'Tillsvidare', description: 'Vi söker en duktig utvecklare som vill arbeta med datainsamling...' },
      { employer: 'E-com Agency Sweden', title: 'Junior Growth Marketer', location: 'Göteborg', url: 'https://arbetsformedlingen.se/platsbanken/annonser/456', publishedDate: '2026-05-18', applicationDeadline: '2026-06-18', employmentType: 'Tillsvidare', description: 'Vill du hjälpa våra kunder växa på nätet? Vi söker en marknadsförare...' },
    ].slice(0, maxResults);
  },
};
