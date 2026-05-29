import { ScraperConfig } from '../../types';

export const tripadvisorConfig: ScraperConfig = {
  id: 'tripadvisor-scraper',
  name: 'Tripadvisor Hotell & Restauranger',
  description: 'Hämta omdömen, priser, betyg och adresser för restauranger, hotell och sevärdheter.',
  actorId: 'apify/tripadvisor-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/tripadvisor.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'urls',
      label: 'Tripadvisor-länkar till hotell/restauranger (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.tripadvisor.se/Restaurant_Review-g189894-d1357608-Reviews-Heaven_23-Gothenburg.html',
    },
    {
      name: 'maxReviews',
      label: 'Max antal omdömen att hämta',
      type: 'number',
      required: true,
      defaultValue: 20,
      min: 5,
      max: 100,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.urls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      urls,
      maxReviews: typeof input.maxReviews === 'number' ? input.maxReviews : 20,
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.name === 'string' ? item.name : undefined,
      website: typeof item.website === 'string' ? item.website : undefined,
      phone: typeof item.phone === 'string' ? item.phone : undefined,
      address: typeof item.address === 'string' ? item.address : undefined,
      category: typeof item.category === 'string' ? item.category : undefined,
      rating: typeof item.rating === 'number' ? item.rating : undefined,
      review_count: typeof item.reviewsCount === 'number' ? item.reviewsCount : undefined,
      source: 'tripadvisor',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        priceRange: item.priceRange,
        reviews: item.reviews,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { name: 'Heaven 23', website: 'http://www.heaven23.se', phone: '031-750 88 00', address: 'Mässans Gata 24, Gothenburg, Sweden', category: 'Restaurang', rating: 4.2, reviewsCount: 1450, url: 'https://www.tripadvisor.se/Heaven_23', priceRange: '$$$$' },
    ].slice(0, maxResults);
  },
};
