import { ScraperConfig } from '../../types';

export const instagramCommentsConfig: ScraperConfig = {
  id: 'instagram-comments',
  name: 'Instagram Kommentarer',
  description: 'Hämta kommentarer, användarnamn, gillamarkeringar och datum för specifika Instagram-inlägg.',
  actorId: 'apify/instagram-comment-scraper',
  category: 'social',
  enabled: true,
  icon: '/icons/instagram.svg',
  creditCostPerResult: 1.2,
  fields: [
    {
      name: 'postUrls',
      label: 'Instagram inläggs-länkar (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.instagram.com/p/C7dEfgGIAfg/',
    },
    {
      name: 'maxComments',
      label: 'Max kommentarer per inlägg',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 500,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.postUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      directUrls: urls,
      resultsLimit: typeof input.maxComments === 'number' ? input.maxComments : 50,
    };
  },
  normalizeItem(item) {
    return {
      person_name: typeof item.ownerUsername === 'string' ? item.ownerUsername : undefined,
      title: typeof item.text === 'string' ? item.text.substring(0, 300) : undefined,
      source: 'instagram-comments',
      source_url: typeof item.postUrl === 'string' ? item.postUrl : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        likes: item.likesCount,
        timestamp: item.timestamp,
        commentId: item.id,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { ownerUsername: 'karl_svensson', text: 'Bästa köpet jag gjort i år! Snabbt levererat också.', postUrl: 'https://instagram.com/p/123', likesCount: 14, timestamp: '2026-05-20T14:22:00Z', id: '179012345' },
      { ownerUsername: 'elins_liv', text: 'Är den här produkten vegansk? Hittar inte info på hemsidan.', postUrl: 'https://instagram.com/p/123', likesCount: 2, timestamp: '2026-05-20T14:45:00Z', id: '179012346' },
    ].slice(0, maxResults);
  },
};
