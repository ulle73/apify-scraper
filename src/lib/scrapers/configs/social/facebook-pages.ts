import { ScraperConfig } from '../../types';

export const facebookPagesConfig: ScraperConfig = {
  id: 'facebook-pages',
  name: 'Facebook Pages Scraper',
  description: 'Hämta kontaktinformation, likes, telefonnummer och e-postadresser från publika Facebooksidor.',
  actorId: 'apify/facebook-pages-scraper',
  category: 'social',
  enabled: true,
  icon: '/icons/facebook-1-svgrepo-com.svg',
  creditCostPerResult: 2,
  fields: [
    {
      name: 'urls',
      label: 'Facebook-sidlänkar (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.facebook.com/IKEA/\nhttps://www.facebook.com/VolvoCars/',
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.urls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return { startUrls: urls.map(url => ({ url })) };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.title === 'string' ? item.title : undefined,
      website: typeof item.website === 'string' ? item.website : undefined,
      email: typeof item.email === 'string' ? item.email : undefined,
      phone: typeof item.phone === 'string' ? item.phone : undefined,
      address: typeof item.address === 'string' ? item.address : undefined,
      category: typeof item.category === 'string' ? item.category : undefined,
      source: 'facebook',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        likes: item.likesCount,
        followers: item.followersCount,
        description: item.description,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'IKEA Sverige', website: 'https://www.ikea.com/se', email: 'info@ikea.se', phone: '077-520 00 00', address: 'Älmhult, Sweden', category: 'Home Improvement Retailer', url: 'https://facebook.com/IKEA', likesCount: 4500000, followersCount: 4600000, description: 'Välkommen till vår Facebooksida för inspiration och erbjudanden.' },
      { title: 'Volvo Cars', website: 'https://www.volvocars.com', email: 'support@volvocars.com', phone: '020-55 55 55', address: 'Gothenburg, Sweden', category: 'Motor Vehicle Company', url: 'https://facebook.com/VolvoCars', likesCount: 9200000, followersCount: 9400000, description: 'Official Volvo Cars Facebook Page.' },
    ].slice(0, maxResults);
  },
};
