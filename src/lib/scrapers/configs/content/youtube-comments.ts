import { ScraperConfig } from '../../types';

export const youtubeCommentsConfig: ScraperConfig = {
  id: 'youtube-comments',
  name: 'YouTube Kommentarer',
  description: 'Hämta kommentarer, användare, gilla-markeringar och svar för specifika YouTube-videor.',
  actorId: 'apify/youtube-comments-scraper',
  category: 'content',
  enabled: true,
  icon: '/icons/youtube.svg',
  creditCostPerResult: 1.0,
  fields: [
    {
      name: 'videoUrls',
      label: 'YouTube video-länkar (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      name: 'maxComments',
      label: 'Max kommentarer per video',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 500,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.videoUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      startUrls: urls.map(url => ({ url })),
      maxComments: typeof input.maxComments === 'number' ? input.maxComments : 50,
    };
  },
  normalizeItem(item) {
    return {
      person_name: typeof item.authorDisplayName === 'string' ? item.authorDisplayName : undefined,
      title: typeof item.textOriginal === 'string' ? item.textOriginal.substring(0, 300) : undefined,
      source: 'youtube-comments',
      source_url: typeof item.videoUrl === 'string' ? item.videoUrl : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        likes: item.likeCount,
        publishedAt: item.publishedAt,
        replyCount: item.replyCount,
        authorChannelUrl: item.authorChannelUrl,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { authorDisplayName: 'TechFan99', textOriginal: 'This product looks like a game changer. Can we buy it in Sweden yet?', videoUrl: 'https://youtube.com/watch?v=123', likeCount: 52, publishedAt: '2026-05-20T11:00:00Z', replyCount: 3, authorChannelUrl: 'https://youtube.com/channel/abc' },
      { authorDisplayName: 'User1000', textOriginal: 'Great walkthrough! Thanks for highlighting the pros and cons clearly.', videoUrl: 'https://youtube.com/watch?v=123', likeCount: 15, publishedAt: '2026-05-19T17:40:00Z', replyCount: 0, authorChannelUrl: 'https://youtube.com/channel/def' },
    ].slice(0, maxResults);
  },
};
