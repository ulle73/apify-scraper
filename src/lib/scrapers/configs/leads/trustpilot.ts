import { ScraperConfig } from '../../types';

export const trustpilotConfig: ScraperConfig = {
  id: 'trustpilot',
  name: 'Trustpilot Recensioner',
  description: 'Hämta omdömen, betyg och kundrecensioner från Trustpilot för svenska bolag.',
  actorId: 'apify/trustpilot-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/trustpilot.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'companyUrls',
      label: 'Trustpilot-sidelänkar (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.trustpilot.com/review/klarna.com\nhttps://www.trustpilot.com/review/spotify.com',
    },
    {
      name: 'maxReviews',
      label: 'Max recensioner per företag',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 500,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.companyUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      startUrls: urls.map(url => ({ url })),
      maxReviews: typeof input.maxReviews === 'number' ? input.maxReviews : 50,
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.companyName === 'string' ? item.companyName : undefined,
      person_name: typeof item.reviewerName === 'string' ? item.reviewerName : undefined,
      title: typeof item.reviewText === 'string' ? item.reviewText.substring(0, 300) : undefined,
      rating: typeof item.stars === 'number' ? item.stars : undefined,
      source: 'trustpilot',
      source_url: typeof item.reviewUrl === 'string' ? item.reviewUrl : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        reviewTitle: item.reviewTitle,
        reviewDate: item.reviewDate,
        companyRating: item.companyRating,
        companyReviewCount: item.companyReviewCount,
        verifiedPurchase: item.verifiedPurchase,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { companyName: 'Klarna', reviewerName: 'Erik Gustafsson', reviewTitle: 'Smidig betalning!', reviewText: 'Klarna fungerar utmärkt för min e-handel. Enkelt att sätta upp och kunderna älskar det.', stars: 5, reviewDate: '2026-05-20', reviewUrl: 'https://trustpilot.com/reviews/123', companyRating: 3.2, companyReviewCount: 45000, verifiedPurchase: true },
      { companyName: 'Klarna', reviewerName: 'Maria Olsson', reviewTitle: 'Dålig kundservice', reviewText: 'Hade problem med en faktura och det tog lång tid att lösa. Kundtjänsten var svår att nå.', stars: 2, reviewDate: '2026-05-18', reviewUrl: 'https://trustpilot.com/reviews/456', companyRating: 3.2, companyReviewCount: 45000, verifiedPurchase: false },
    ].slice(0, maxResults);
  },
};
