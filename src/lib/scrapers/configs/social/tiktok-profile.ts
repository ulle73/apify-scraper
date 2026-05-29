import { ScraperConfig } from '../../types';

export const tiktokProfileConfig: ScraperConfig = {
  id: 'tiktok-profile',
  name: 'TikTok Profiler',
  description: 'Hämta detaljerad profilinformation, följarantal, gillamarkeringar och biografi för TikTok-konton.',
  actorId: 'apify/tiktok-profile-scraper',
  category: 'social',
  enabled: true,
  icon: '/icons/tiktok.svg',
  creditCostPerResult: 2.0,
  fields: [
    {
      name: 'usernames',
      label: 'TikTok-användarnamn (en per rad, utan @)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nspotify\nredbull',
    },
  ],
  buildApifyInput(input) {
    const usernames = String(input.usernames || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      profiles: usernames,
    };
  },
  normalizeItem(item) {
    return {
      person_name: typeof item.username === 'string' ? item.username : undefined,
      company_name: typeof item.nickname === 'string' ? item.nickname : undefined,
      website: typeof item.bioLink === 'string' ? item.bioLink : undefined,
      source: 'tiktok-profile',
      source_url: typeof item.username === 'string' ? `https://www.tiktok.com/@${item.username}` : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        bio: item.signature,
        followers: item.followerCount,
        following: item.followingCount,
        heartCount: item.heartCount,
        videoCount: item.videoCount,
        isVerified: item.verified,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { username: 'spotify', nickname: 'Spotify', signature: 'Listening is everything.', followerCount: 4200000, followingCount: 120, heartCount: 154000000, videoCount: 890, verified: true, bioLink: 'https://spotify.com' },
      { username: 'volvocars', nickname: 'Volvo Cars', signature: 'For life. 🇸🇪', followerCount: 350000, followingCount: 45, heartCount: 2800000, videoCount: 142, verified: true, bioLink: 'https://volvocars.com' },
    ].slice(0, maxResults);
  },
};
