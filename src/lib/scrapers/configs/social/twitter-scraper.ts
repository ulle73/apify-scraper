import { ScraperConfig } from '../../types';

export const twitterScraperConfig: ScraperConfig = {
  id: 'twitter-scraper',
  name: 'Twitter/X Sökning',
  description: 'Sök efter specifika nyckelord eller trender på Twitter/X och hämta inlägg, datum och statistik.',
  actorId: 'apify/twitter-scraper',
  category: 'social',
  enabled: true,
  icon: '/icons/x.svg',
  creditCostPerResult: 2.5,
  fields: [
    {
      name: 'searchQuery',
      label: 'Sökord / Hashtags på X',
      type: 'text',
      required: true,
      placeholder: 't.ex. artificial intelligence sweden',
    },
    {
      name: 'maxResults',
      label: 'Max antal inlägg',
      type: 'number',
      required: true,
      defaultValue: 25,
      min: 10,
      max: 200,
    },
  ],
  buildApifyInput(input) {
    return {
      searchTerms: [String(input.searchQuery || '')],
      maxTweets: typeof input.maxResults === 'number' ? input.maxResults : 25,
    };
  },
  normalizeItem(item) {
    return {
      title: typeof item.text === 'string' ? item.text : undefined,
      person_name: typeof item.user === 'object' && item.user ? (item.user as any).screen_name : undefined,
      source: 'twitter',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        likes: item.favorite_count,
        retweets: item.retweet_count,
        createdAt: item.created_at,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { text: 'Just had an amazing session discussing B2B lead generation in Sweden! The market is growing super fast. 🚀 #sales #marketing', user: { screen_name: 'johandev' }, url: 'https://twitter.com/johandev/status/123', favorite_count: 85, retweet_count: 14, created_at: '2026-05-28T14:20:00Z' },
      { text: 'Next.js 16 is making server-side web app architectures extremely clean. Loving the new dev tools!', user: { screen_name: 'techgirl' }, url: 'https://twitter.com/techgirl/status/456', favorite_count: 240, retweet_count: 45, created_at: '2026-05-27T09:15:00Z' },
    ].slice(0, maxResults);
  },
};
