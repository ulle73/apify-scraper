import { ScraperConfig } from '../../types';

export const recoSeConfig: ScraperConfig = {
  id: 'reco-se',
  name: 'Reco.se Recensioner',
  description: 'Sveriges ledande recensionssajt för lokala tjänsteföretag. Hämta omdömen, betyg och kontaktinfo.',
  actorId: 'apify/reco-se-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/reco-se.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'searchQuery',
      label: 'Sökord / Bransch',
      type: 'text',
      required: false,
      placeholder: 't.ex. hantverkare, städfirma, elektriker',
    },
    {
      name: 'location',
      label: 'Stad / Område',
      type: 'text',
      required: false,
      placeholder: 't.ex. Göteborg, Stockholm',
    },
    {
      name: 'urls',
      label: 'Direktlänkar till Reco-sidor (en per rad)',
      type: 'textarea',
      required: false,
      placeholder: 't.ex.\nhttps://www.reco.se/tjanster/stadning/goteborg',
    },
    {
      name: 'maxResults',
      label: 'Max antal företag',
      type: 'number',
      required: true,
      defaultValue: 30,
      min: 5,
      max: 200,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.urls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      startUrls: urls.length > 0 ? urls.map(url => ({ url })) : undefined,
      searchQuery: String(input.searchQuery || ''),
      location: String(input.location || ''),
      maxResults: typeof input.maxResults === 'number' ? input.maxResults : 30,
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.companyName === 'string' ? item.companyName : undefined,
      phone: typeof item.phone === 'string' ? item.phone : undefined,
      address: typeof item.address === 'string' ? item.address : undefined,
      city: typeof item.city === 'string' ? item.city : undefined,
      category: typeof item.category === 'string' ? item.category : undefined,
      rating: typeof item.rating === 'number' ? item.rating : undefined,
      review_count: typeof item.reviewCount === 'number' ? item.reviewCount : undefined,
      source: 'reco-se',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        reviewText: item.reviewText,
        reviewDate: item.reviewDate,
        memberSince: item.memberSince,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { companyName: 'Städproffs Göteborg', phone: '031-456 78 90', address: 'Avenyn 1', city: 'Göteborg', category: 'Städning', rating: 4.8, reviewCount: 234, url: 'https://reco.se/stadproffs-goteborg', memberSince: '2019' },
      { companyName: 'Handy Hantverkare AB', phone: '031-222 33 44', address: 'Kungsportsavenyn 10', city: 'Göteborg', category: 'Hantverkare', rating: 4.6, reviewCount: 118, url: 'https://reco.se/handy-hantverkare', memberSince: '2021' },
    ].slice(0, maxResults);
  },
};
