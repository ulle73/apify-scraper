import { ScraperConfig } from '../../types';

export const instagramReelsConfig: ScraperConfig = {
  id: 'instagram-reels',
  name: 'Instagram Reels',
  description: 'Hämta reels, visningssiffror, engagemang och videobeskrivningar från specifika Instagram-konton.',
  actorId: 'apify/instagram-reel-scraper',
  category: 'social',
  enabled: true,
  icon: '/icons/instagram.svg',
  creditCostPerResult: 2.0,
  fields: [
    {
      name: 'usernames',
      label: 'Användarnamn (en per rad, utan @)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nspotify\nklarna',
    },
    {
      name: 'maxResults',
      label: 'Max reels per konto',
      type: 'number',
      required: true,
      defaultValue: 20,
      min: 5,
      max: 100,
    },
  ],
  buildApifyInput(input) {
    const usernames = String(input.usernames || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      usernames,
      resultsLimit: typeof input.maxResults === 'number' ? input.maxResults : 20,
    };
  },
  normalizeItem(item) {
    return {
      person_name: typeof item.ownerUsername === 'string' ? item.ownerUsername : undefined,
      title: typeof item.caption === 'string' ? item.caption.substring(0, 300) : undefined,
      source: 'instagram-reels',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        playCount: item.videoPlayCount,
        likes: item.likesCount,
        commentsCount: item.commentsCount,
        duration: item.videoDuration,
        timestamp: item.timestamp,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { ownerUsername: 'spotify', caption: 'Live session with your favorite artist. 🎧 Link in bio to listen to the full playlist.', url: 'https://www.instagram.com/reel/123', videoPlayCount: 250000, likesCount: 15400, commentsCount: 430, videoDuration: 15.5, timestamp: '2026-05-18T16:00:00Z' },
      { ownerUsername: 'klarna', caption: 'Smooth shopping hack! How to split your payments interest-free. 💸 #Klarna', url: 'https://www.instagram.com/reel/456', videoPlayCount: 85000, likesCount: 3200, commentsCount: 98, videoDuration: 28.2, timestamp: '2026-05-15T09:00:00Z' },
    ].slice(0, maxResults);
  },
};
