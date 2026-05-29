import { ScraperConfig } from '../../types';

export const linkedinJobsConfig: ScraperConfig = {
  id: 'linkedin-jobs',
  name: 'LinkedIn Jobbannonser',
  description: 'Hämta företag som rekryterar på LinkedIn – en tydlig köpsignal med budget.',
  actorId: 'apify/linkedin-jobs-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/linkedin-svgrepo-com.svg',
  creditCostPerResult: 2,
  fields: [
    {
      name: 'keywords',
      label: 'Sökord / Roll',
      type: 'text',
      required: true,
      placeholder: 't.ex. software engineer, marknadschef',
    },
    {
      name: 'location',
      label: 'Plats',
      type: 'text',
      required: true,
      defaultValue: 'Sverige',
      placeholder: 't.ex. Stockholm, Göteborg, Sverige',
    },
    {
      name: 'maxResults',
      label: 'Max antal jobb',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 500,
    },
    {
      name: 'datePosted',
      label: 'Publicerat inom',
      type: 'select',
      required: false,
      defaultValue: 'past_week',
      options: [
        { value: 'past_24_hours', label: 'Senaste 24 timmar' },
        { value: 'past_week', label: 'Senaste veckan' },
        { value: 'past_month', label: 'Senaste månaden' },
        { value: 'any_time', label: 'Valfri tid' },
      ],
    },
  ],
  buildApifyInput(input) {
    return {
      keywords: String(input.keywords || ''),
      location: String(input.location || 'Sverige'),
      maxJobs: typeof input.maxResults === 'number' ? input.maxResults : 50,
      datePosted: String(input.datePosted || 'past_week'),
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.companyName === 'string' ? item.companyName : undefined,
      title: typeof item.title === 'string' ? item.title : undefined,
      address: typeof item.location === 'string' ? item.location : undefined,
      source: 'linkedin-jobs',
      source_url: typeof item.jobUrl === 'string' ? item.jobUrl : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        jobType: item.jobType,
        publishedAt: item.publishedAt,
        applicants: item.applicantCount,
        description: typeof item.description === 'string' ? item.description.substring(0, 500) : '',
        companyUrl: item.companyUrl,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'Senior Backend Developer', companyName: 'Klarna', location: 'Stockholm, Sweden', jobUrl: 'https://linkedin.com/jobs/view/123', jobType: 'Full-time', publishedAt: '2026-05-27', applicantCount: 45, description: 'We are looking for a Senior Backend Developer to join our Payments team...', companyUrl: 'https://linkedin.com/company/klarna' },
      { title: 'Marknadschef', companyName: 'Hemnet AB', location: 'Stockholm, Sweden', jobUrl: 'https://linkedin.com/jobs/view/456', jobType: 'Full-time', publishedAt: '2026-05-26', applicantCount: 32, description: 'Hemnet söker en erfaren marknadschef som vill leda vår kommunikation...', companyUrl: 'https://linkedin.com/company/hemnet' },
    ].slice(0, maxResults);
  },
};
