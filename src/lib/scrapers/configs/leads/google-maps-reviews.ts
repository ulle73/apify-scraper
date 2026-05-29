import { ScraperConfig } from '../../types';

export const googleMapsReviewsConfig: ScraperConfig = {
  id: 'google-maps-reviews',
  name: 'Google Maps Reviews',
  description: 'Hitta recensioner, betyg och sentiment för företag via Google Maps.',
  actorId: 'apify/google-maps-reviews-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/google-maps-platform-svgrepo-com.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'placeUrls',
      label: 'Google Maps-länkar (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.google.com/maps/place/Heaven+23',
    },
    {
      name: 'maxReviews',
      label: 'Max recensioner per ställe',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 5,
      max: 500,
    },
    {
      name: 'language',
      label: 'Språk',
      type: 'select',
      required: true,
      defaultValue: 'sv',
      options: [
        { value: 'sv', label: 'Svenska' },
        { value: 'en', label: 'Engelska' },
      ],
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.placeUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      startUrls: urls.map(url => ({ url })),
      maxReviews: typeof input.maxReviews === 'number' ? input.maxReviews : 50,
      language: String(input.language || 'sv'),
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.placeName === 'string' ? item.placeName : undefined,
      person_name: typeof item.reviewerName === 'string' ? item.reviewerName : undefined,
      title: typeof item.text === 'string' ? item.text : undefined,
      rating: typeof item.stars === 'number' ? item.stars : undefined,
      source: 'google-maps-reviews',
      source_url: typeof item.placeUrl === 'string' ? item.placeUrl : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        reviewDate: item.publishedAtDate,
        likes: item.likesCount,
        placeRating: item.placeRating,
        placeReviewCount: item.placeReviewCount,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { placeName: 'Heaven 23', reviewerName: 'Anna Svensson', text: 'Fantastisk mat och service! Rekommenderar varmt till alla.', stars: 5, publishedAtDate: '2026-05-10', likesCount: 4, placeRating: 4.2, placeReviewCount: 1450, placeUrl: 'https://g.co/maps/heaven23' },
      { placeName: 'Heaven 23', reviewerName: 'Lars Björk', text: 'Bra läge men lite dyrt. Maten var god men portionerna lite små.', stars: 3, publishedAtDate: '2026-04-22', likesCount: 1, placeRating: 4.2, placeReviewCount: 1450, placeUrl: 'https://g.co/maps/heaven23' },
    ].slice(0, maxResults);
  },
};
