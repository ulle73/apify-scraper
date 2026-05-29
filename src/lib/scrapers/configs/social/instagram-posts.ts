import { ScraperConfig } from '../../types';

export const instagramPostsConfig: ScraperConfig = {
  id: 'instagram-posts',
  name: 'Instagram Inlägg & Hashtags',
  description: 'Hämta inlägg, hashtags, bildtexter och engagemangsdata från Instagram.',
  actorId: 'apify/instagram-post-scraper',
  category: 'social',
  enabled: true,
  icon: '/icons/instagram.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'hashtagsOrUsers',
      label: 'Användarnamn eller Hashtags (en per rad, t.ex. #sverige eller volvocars)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\n#ehandel\nvolvocars',
    },
    {
      name: 'maxResults',
      label: 'Max resultat',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 200,
    },
  ],
  buildApifyInput(input) {
    const lines = String(input.hashtagsOrUsers || '').split('\n').map(l => l.trim()).filter(Boolean);
    const hashtags = lines.filter(l => l.startsWith('#')).map(h => h.substring(1));
    const usernames = lines.filter(l => !l.startsWith('#'));
    return {
      hashtags,
      usernames,
      resultsLimit: typeof input.maxResults === 'number' ? input.maxResults : 50,
    };
  },
  normalizeItem(item) {
    return {
      person_name: typeof item.ownerUsername === 'string' ? item.ownerUsername : undefined,
      title: typeof item.caption === 'string' ? item.caption.substring(0, 300) : undefined,
      source: 'instagram-posts',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        likes: item.likesCount,
        comments: item.commentsCount,
        timestamp: item.timestamp,
        hashtags: item.hashtags,
        imageUrl: item.displayUrl,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { ownerUsername: 'volvocars', caption: 'Exploring the quiet Swedish archipelago in our new electric EX90. #VolvoEX90 #ElectricFuture', url: 'https://www.instagram.com/p/12345', likesCount: 4500, commentsCount: 180, timestamp: '2026-05-20T12:00:00Z', hashtags: ['VolvoEX90', 'ElectricFuture'], displayUrl: 'https://instagram.fsve.fbcdn.net/v/123' },
      { ownerUsername: 'sweden_travel', caption: 'Summer mornings in Stockholm are magic. ✨ Who wants to be here? #Stockholm #Sweden', url: 'https://www.instagram.com/p/67890', likesCount: 8900, commentsCount: 320, timestamp: '2026-05-19T06:30:00Z', hashtags: ['Stockholm', 'Sweden'], displayUrl: 'https://instagram.fsve.fbcdn.net/v/456' },
    ].slice(0, maxResults);
  },
};
