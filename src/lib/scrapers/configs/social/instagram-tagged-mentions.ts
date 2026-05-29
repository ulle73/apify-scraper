import { ScraperConfig } from '../../types';

export const instagramTaggedMentionsConfig: ScraperConfig = {
  id: 'instagram-tagged-mentions',
  name: 'Instagram Taggar & Omnämnanden',
  description: 'Hämta publika inlägg där ditt eller konkurrenters varumärken taggats eller omnämnts.',
  actorId: 'apify/instagram-scraper',
  category: 'social',
  enabled: true,
  icon: '/icons/instagram.svg',
  creditCostPerResult: 2.0,
  fields: [
    {
      name: 'usernames',
      label: 'Användarnamn att övervaka (en per rad, utan @)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nvolvocars\nspotify',
    },
    {
      name: 'maxResults',
      label: 'Max inlägg',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 200,
    },
  ],
  buildApifyInput(input) {
    const usernames = String(input.usernames || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      queries: usernames.map(u => `https://www.instagram.com/${u}/tagged/`),
      resultsLimit: typeof input.maxResults === 'number' ? input.maxResults : 50,
    };
  },
  normalizeItem(item) {
    return {
      person_name: typeof item.ownerUsername === 'string' ? item.ownerUsername : undefined,
      title: typeof item.caption === 'string' ? item.caption.substring(0, 300) : undefined,
      source: 'instagram-tagged-mentions',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        likes: item.likesCount,
        commentsCount: item.commentsCount,
        timestamp: item.timestamp,
        taggedUsers: item.taggedUsers, // array av taggade användare
      },
    };
  },
  getMockData(maxResults) {
    return [
      { ownerUsername: 'tech_traveler', caption: 'Roadtrip ready with the family. Loving the comfort of this ride. @volvocars', url: 'https://www.instagram.com/p/98765', likesCount: 450, commentsCount: 15, timestamp: '2026-05-20T08:15:00Z', taggedUsers: ['volvocars'] },
      { ownerUsername: 'music_lover99', caption: 'Weekend playlist sorted. Thanks @spotify for the suggestions.', url: 'https://www.instagram.com/p/54321', likesCount: 120, commentsCount: 4, timestamp: '2026-05-19T18:40:00Z', taggedUsers: ['spotify'] },
    ].slice(0, maxResults);
  },
};
