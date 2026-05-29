import { ScraperConfig } from '../../types';

export const amazonReviewsConfig: ScraperConfig = {
  id: 'amazon-reviews',
  name: 'Amazon Produktrecensioner',
  description: 'Hämta produktomdömen, betyg, rubriker, text och författarinfo från Amazon (stödjer Amazon.se).',
  actorId: 'apify/amazon-reviews-scraper',
  category: 'ecommerce',
  enabled: true,
  icon: '/icons/amazon.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'productUrls',
      label: 'Amazon produkt-URL:er eller ASINs (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.amazon.se/dp/B08N5LNXC5',
    },
    {
      name: 'maxReviews',
      label: 'Max recensioner per produkt',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 500,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.productUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      productUrls: urls,
      maxReviews: typeof input.maxReviews === 'number' ? input.maxReviews : 50,
    };
  },
  normalizeItem(item) {
    return {
      title: typeof item.reviewText === 'string' ? item.reviewText.substring(0, 300) : undefined,
      person_name: typeof item.reviewerName === 'string' ? item.reviewerName : undefined,
      rating: typeof item.rating === 'number' ? item.rating : undefined,
      source: 'amazon-reviews',
      source_url: typeof item.reviewUrl === 'string' ? item.reviewUrl : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        productName: item.productTitle,
        asin: item.asin,
        reviewTitle: item.reviewTitle,
        reviewDate: item.reviewDate,
        verifiedPurchase: item.verified,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { reviewerName: 'Kalle K', reviewTitle: 'Mycket bra hörlurar', reviewText: 'Ljudet är fantastiskt och brusreduceringen fungerar perfekt på tåget. Rekommenderas starkt!', rating: 5, reviewUrl: 'https://www.amazon.se/gp/customer-reviews/1', productTitle: 'Wireless Noise Cancelling Headphones', asin: 'B08N5LNXC5', reviewDate: '2026-05-18', verified: true },
      { reviewerName: 'Sara L', reviewTitle: 'Helt ok för priset', reviewText: 'Lite plastig känsla men ljudet är godkänt. Batteritiden stämmer bra med beskrivningen.', rating: 3, reviewUrl: 'https://www.amazon.se/gp/customer-reviews/2', productTitle: 'Wireless Noise Cancelling Headphones', asin: 'B08N5LNXC5', reviewDate: '2026-05-14', verified: true },
    ].slice(0, maxResults);
  },
};
