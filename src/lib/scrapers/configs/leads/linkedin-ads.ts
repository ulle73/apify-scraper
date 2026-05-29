import { ScraperConfig } from '../../types';

export const linkedinAdsConfig: ScraperConfig = {
  id: 'linkedin-ads',
  name: 'LinkedIn Ads Scraper',
  description: 'Hitta bolag som aktivt annonserar på LinkedIn – stark köpsignal för byråer och leadlistor.',
  actorId: 'apify/linkedin-ads-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/linkedin-svgrepo-com.svg',
  creditCostPerResult: 3,
  fields: [
    {
      name: 'companyUrls',
      label: 'LinkedIn-företagsURLer (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.linkedin.com/company/spotify/\nhttps://www.linkedin.com/company/klarna/',
    },
    {
      name: 'maxAds',
      label: 'Max antal annonser per företag',
      type: 'number',
      required: true,
      defaultValue: 20,
      min: 5,
      max: 100,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.companyUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      companyUrls: urls,
      maxAds: typeof input.maxAds === 'number' ? input.maxAds : 20,
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.companyName === 'string' ? item.companyName : undefined,
      title: typeof item.adText === 'string' ? item.adText.substring(0, 200) : undefined,
      website: typeof item.landingPage === 'string' ? item.landingPage : undefined,
      source: 'linkedin-ads',
      source_url: typeof item.adUrl === 'string' ? item.adUrl : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        adText: item.adText,
        creativeUrl: item.creativeUrl,
        landingPage: item.landingPage,
        firstSeen: item.firstSeen,
        impressionsRange: item.impressionsRange,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { companyName: 'Spotify', adText: 'Join Spotify — where music meets technology. We are hiring talented engineers across Sweden.', landingPage: 'https://spotify.com/careers', adUrl: 'https://linkedin.com/ad/123', creativeUrl: 'https://cdn.linkedin.com/img/ad123.jpg', firstSeen: '2026-05-01', impressionsRange: '10000-50000' },
      { companyName: 'Klarna', adText: 'Smooth payments for your business. Try Klarna for Shopify merchants today.', landingPage: 'https://klarna.com/business', adUrl: 'https://linkedin.com/ad/456', creativeUrl: 'https://cdn.linkedin.com/img/ad456.jpg', firstSeen: '2026-04-15', impressionsRange: '5000-10000' },
    ].slice(0, maxResults);
  },
};
