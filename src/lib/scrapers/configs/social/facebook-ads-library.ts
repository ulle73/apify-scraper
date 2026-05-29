import { ScraperConfig } from '../../types';

export const facebookAdsLibraryConfig: ScraperConfig = {
  id: 'facebook-ads-library',
  name: 'Facebook Ads Library',
  description: 'Hitta aktiva och historiska annonser på Facebook och Instagram för konkurrensbevakning och säljsignaler.',
  actorId: 'apify/facebook-ads-library-scraper',
  category: 'social',
  enabled: true,
  icon: '/icons/facebook-ads.svg',
  creditCostPerResult: 2.0,
  fields: [
    {
      name: 'query',
      label: 'Sökord eller Sida (företagsnamn)',
      type: 'text',
      required: true,
      placeholder: 't.ex. Klarna, Mathem',
    },
    {
      name: 'country',
      label: 'Land',
      type: 'select',
      required: true,
      defaultValue: 'SE',
      options: [
        { value: 'SE', label: 'Sverige (SE)' },
        { value: 'DK', label: 'Danmark (DK)' },
        { value: 'NO', label: 'Norge (NO)' },
        { value: 'FI', label: 'Finland (FI)' },
        { value: 'ALL', label: 'Alla länder' },
      ],
    },
    {
      name: 'maxResults',
      label: 'Max annonser',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 200,
    },
  ],
  buildApifyInput(input) {
    return {
      searchQuery: String(input.query || ''),
      country: String(input.country || 'SE'),
      maxResults: typeof input.maxResults === 'number' ? input.maxResults : 50,
      activeStatus: 'active',
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.pageName === 'string' ? item.pageName : undefined,
      title: typeof item.adText === 'string' ? item.adText.substring(0, 300) : undefined,
      source: 'facebook-ads-library',
      source_url: typeof item.adDetailUrl === 'string' ? item.adDetailUrl : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        pageName: item.pageName,
        landingPage: item.landingPage,
        creativeUrl: item.creativeUrl,
        startDate: item.startDate,
        platforms: item.platforms, // t.ex. ['facebook', 'instagram']
        isActive: item.isActive,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { pageName: 'Mathem', adText: 'Handla veckans matkasse med 20% rabatt! Fri frakt över 500 kr. Gäller nya kunder.', adDetailUrl: 'https://www.facebook.com/ads/library/?id=12345', landingPage: 'https://www.mathem.se/kampanj/nykund', creativeUrl: 'https://scontent.xx.fbcdn.net/v/t39.35430', startDate: '2026-05-15', platforms: ['facebook', 'instagram'], isActive: true },
      { pageName: 'Mathem', adText: 'Spara tid i vardagen. Beställ din mat direkt till dörren. Upptäck vårt stora ekologiska sortiment.', adDetailUrl: 'https://www.facebook.com/ads/library/?id=67890', landingPage: 'https://www.mathem.se/ekologiskt', creativeUrl: 'https://scontent.xx.fbcdn.net/v/t39.35431', startDate: '2026-05-10', platforms: ['facebook', 'instagram', 'messenger'], isActive: true },
    ].slice(0, maxResults);
  },
};
