import { ScraperConfig } from '../../types';

export const tiktokScraperConfig: ScraperConfig = {
  id: 'tiktok-scraper',
  name: 'TikTok Sökning',
  description: 'Hämta videoklipp, hashtags, användare och statistik från TikTok.',
  actorId: 'apify/tiktok-scraper',
  category: 'social',
  enabled: true,
  icon: '/icons/brand-tiktok-sq-svgrepo-com.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'hashtags',
      label: 'Hashtags eller sökord (kommaseparerat)',
      type: 'text',
      required: true,
      placeholder: 't.ex. leadgeneration, B2B, sales',
    },
    {
      name: 'maxResults',
      label: 'Max videor att hämta',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 500,
    },
  ],
  buildApifyInput(input) {
    const hashtags = String(input.hashtags || '').split(',').map(h => h.trim().replace('#', '')).filter(Boolean);
    const maxResults = typeof input.maxResults === 'number' ? input.maxResults : 50;
    return { hashtags, resultsLimit: maxResults };
  },
  normalizeItem(item) {
    const author = (item.authorMeta || {}) as Record<string, unknown>;
    return {
      person_name: typeof author.name === 'string' ? author.name : undefined,
      title: typeof item.text === 'string' ? item.text : undefined,
      source: 'tiktok',
      source_url: typeof item.webVideoUrl === 'string' ? item.webVideoUrl : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        nickname: author.nickName,
        diggCount: item.diggCount,
        playCount: item.playCount,
        shareCount: item.shareCount,
        commentCount: item.commentCount,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { authorMeta: { name: 'B2BSalesGuru', nickName: 'B2B Sales Pro' }, text: 'How to get 100 new leads per day using automated tools 📈 #leadgeneration #sales', webVideoUrl: 'https://tiktok.com/@b2bsalesguru/video/123', diggCount: 4200, playCount: 89000, shareCount: 312, commentCount: 85 },
      { authorMeta: { name: 'GrowthHackerSE', nickName: 'Growth Hack Sverige' }, text: 'Bästa sätten att skala din startup under 2026! 🚀 #startup #growth', webVideoUrl: 'https://tiktok.com/@growthhackerse/video/456', diggCount: 1800, playCount: 32000, shareCount: 145, commentCount: 42 },
    ].slice(0, maxResults);
  },
};
