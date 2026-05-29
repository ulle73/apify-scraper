import { ScraperConfig } from '../../types';

export const googleMapsConfig: ScraperConfig = {
  id: 'google-maps',
  name: 'Google Maps Leadlista',
  description: 'Hitta företag baserat på plats och sökord via Google Maps.',
  actorId: 'compass/crawler-google-places',
  actorIdEnvKey: 'APIFY_GOOGLE_MAPS_ACTOR_ID',
  category: 'leads',
  enabled: true,
  icon: '/icons/google-maps-platform-svgrepo-com.svg',
  creditCostPerResult: 1,
  fields: [
    {
      name: 'country',
      label: 'Land',
      type: 'select',
      required: true,
      defaultValue: 'Sverige',
      options: [
        { value: 'Sverige', label: 'Sverige' },
        { value: 'Norge', label: 'Norge' },
        { value: 'Danmark', label: 'Danmark' },
        { value: 'Finland', label: 'Finland' },
        { value: 'Tyskland', label: 'Tyskland' },
        { value: 'Storbritannien', label: 'Storbritannien' },
      ],
    },
    {
      name: 'region',
      label: 'Stad / Region',
      type: 'text',
      required: true,
      placeholder: 't.ex. Göteborg eller Skåne',
    },
    {
      name: 'searchTerm',
      label: 'Sökord / Bransch',
      type: 'text',
      required: true,
      placeholder: 't.ex. bilverkstad, restaurang eller frisör',
    },
    {
      name: 'maxResults',
      label: 'Max antal leads',
      type: 'number',
      required: true,
      defaultValue: 100,
      min: 10,
      max: 1000,
    },
  ],
  buildApifyInput(input) {
    const searchTerm = String(input.searchTerm || '');
    const region = String(input.region || '');
    const country = String(input.country || '');
    const maxResults = typeof input.maxResults === 'number' ? input.maxResults : 100;
    return {
      searchStringsArray: [`${searchTerm} ${region} ${country}`],
      maxCrawledPlacesPerSearch: maxResults,
      language: 'sv',
      includeWebResults: false,
    };
  },
  normalizeItem(item) {
    const website = typeof item.website === 'string' ? item.website : undefined;
    let domain: string | undefined = undefined;
    if (website) {
      try {
        const urlObj = new URL(website.startsWith('http') ? website : `http://${website}`);
        domain = urlObj.hostname.replace('www.', '');
      } catch (e) {}
    }
    return {
      company_name: typeof item.title === 'string' ? item.title : undefined,
      website,
      domain,
      phone: typeof item.phone === 'string' ? item.phone : undefined,
      email: typeof item.email === 'string' ? item.email : undefined,
      address: typeof item.address === 'string' ? item.address : undefined,
      city: typeof item.city === 'string' ? item.city : undefined,
      region: typeof item.region === 'string' ? item.region : undefined,
      country: typeof item.country === 'string' ? item.country : undefined,
      category: typeof item.categoryName === 'string' ? item.categoryName : undefined,
      rating: typeof item.totalScore === 'number' ? item.totalScore : undefined,
      review_count: typeof item.reviewsCount === 'number' ? item.reviewsCount : undefined,
      source: 'google-maps',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        subTitle: item.subTitle,
        category: item.categoryName,
        reviewsCount: item.reviewsCount,
        rating: item.totalScore,
        location: item.location,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'Göteborgs Bilverkstad AB', website: 'goteborgsbilverkstad.se', phone: '031-123 45 67', email: 'info@goteborgsbilverkstad.se', address: 'Bultgatan 12', city: 'Göteborg', region: 'Västra Götalands', country: 'Sverige', categoryName: 'Bilverkstad', totalScore: 4.6, reviewsCount: 124, url: 'https://google.com/maps' },
      { title: 'Meca Göteborg - Hisingens Bilservice', website: 'meca.se', phone: '031-987 65 43', email: 'hisingen@meca.se', address: 'Herkulesgatan 24', city: 'Göteborg', region: 'Västra Götalands', country: 'Sverige', categoryName: 'Bilverkstad', totalScore: 4.2, reviewsCount: 87, url: 'https://google.com/maps' },
      { title: 'Bilia Göteborg - Almedal', website: 'bilia.se', phone: '0771-400 000', email: 'almedal@bilia.se', address: 'Almedalsvägen 15', city: 'Göteborg', region: 'Västra Götalands', country: 'Sverige', categoryName: 'Verkstad', totalScore: 4.0, reviewsCount: 342, url: 'https://google.com/maps' },
      { title: 'Mekonomen Heden', website: 'mekonomen.se', phone: '031-711 22 33', email: 'heden@mekonomen.se', address: 'Södra Vägen 18', city: 'Göteborg', region: 'Västra Götalands', country: 'Sverige', categoryName: 'Bilverkstad', totalScore: 4.4, reviewsCount: 56, url: 'https://google.com/maps' },
    ].slice(0, maxResults);
  },
};
