import { ScraperConfig } from '../../types';

export const youtubeShortsConfig: ScraperConfig = {
  id: 'youtube-shorts',
  name: 'YouTube Shorts',
  description: 'Hämta Shorts-videor, visningar, gilla-markeringar och kommentarer från YouTube-kanaler.',
  actorId: 'apify/youtube-shorts-scraper',
  category: 'content',
  enabled: true,
  icon: '/icons/youtube.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'channelUrls',
      label: 'YouTube kanallänkar eller sökord (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.youtube.com/@Spotify',
    },
    {
      name: 'maxResults',
      label: 'Max Shorts-videor per sökning',
      type: 'number',
      required: true,
      defaultValue: 20,
      min: 5,
      max: 100,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.channelUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      startUrls: urls.map(url => ({ url })),
      maxResults: typeof input.maxResults === 'number' ? input.maxResults : 20,
    };
  },
  normalizeItem(item) {
    return {
      title: typeof item.title === 'string' ? item.title : undefined,
      person_name: typeof item.channelName === 'string' ? item.channelName : undefined,
      source: 'youtube-shorts',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        channelName: item.channelName,
        viewCount: item.viewCount,
        likes: item.likesCount,
        commentsCount: item.commentsCount,
        publishedAt: item.publishedAtText,
        duration: item.duration,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'The new track you need to hear this summer! ☀️', channelName: 'Spotify', url: 'https://www.youtube.com/shorts/123', viewCount: 154000, likesCount: 8900, commentsCount: 142, publishedAtText: '3 days ago', duration: '45s' },
      { title: 'Behind the scenes at the recording studio 🎙️', channelName: 'Spotify', url: 'https://www.youtube.com/shorts/456', viewCount: 220000, likesCount: 12500, commentsCount: 230, publishedAtText: '1 week ago', duration: '30s' },
    ].slice(0, maxResults);
  },
};
