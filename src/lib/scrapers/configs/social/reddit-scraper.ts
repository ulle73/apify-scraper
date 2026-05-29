import { ScraperConfig } from '../../types';

export const redditScraperConfig: ScraperConfig = {
  id: 'reddit-scraper',
  name: 'Reddit Inlägg & Diskussioner',
  description: 'Sök efter trådar, nyckelord eller diskussioner på Reddit och samla kommentarer och användardata.',
  actorId: 'apify/reddit-scraper',
  category: 'social',
  enabled: true,
  icon: '/icons/reddit.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'subreddits',
      label: 'Subreddits (kommaseparerat, valfritt)',
      type: 'text',
      required: false,
      placeholder: 't.ex. startup, sweden',
    },
    {
      name: 'searchQuery',
      label: 'Sökord / Fras',
      type: 'text',
      required: true,
      placeholder: 't.ex. lead generation tools',
    },
    {
      name: 'maxResults',
      label: 'Max antal inlägg',
      type: 'number',
      required: true,
      defaultValue: 30,
      min: 10,
      max: 200,
    },
  ],
  buildApifyInput(input) {
    const subreddits = String(input.subreddits || '').split(',').map(s => s.trim()).filter(Boolean);
    return {
      subreddits,
      searchQuery: String(input.searchQuery || ''),
      limit: typeof input.maxResults === 'number' ? input.maxResults : 30,
    };
  },
  normalizeItem(item) {
    return {
      title: typeof item.title === 'string' ? item.title : undefined,
      person_name: typeof item.author === 'string' ? item.author : undefined,
      source: 'reddit',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      review_count: typeof item.numComments === 'number' ? item.numComments : undefined,
      rating: typeof item.score === 'number' ? item.score : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        subreddit: item.subreddit,
        text: typeof item.selfText === 'string' ? item.selfText.substring(0, 1000) : '',
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'What are the best B2B lead generation tools for Nordic companies?', author: 'startup_founder_se', url: 'https://reddit.com/r/startup/comments/123', numComments: 45, score: 54, subreddit: 'startup', selfText: 'Hey guys! We are looking to scale our outreach in Sweden and Norway. Currently doing cold email, but we need high quality databases. Any tips?' },
    ].slice(0, maxResults);
  },
};
