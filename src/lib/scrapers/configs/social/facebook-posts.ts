import { ScraperConfig } from '../../types';

export const facebookPostsConfig: ScraperConfig = {
  id: 'facebook-posts',
  name: 'Facebook-inlägg',
  description: 'Hämta inlägg, kampanjer, nyheter och aktiviteter från publika Facebook-sidor.',
  actorId: 'apify/facebook-posts-scraper',
  category: 'social',
  enabled: true,
  icon: '/icons/facebook.svg',
  creditCostPerResult: 1.2,
  fields: [
    {
      name: 'pageUrls',
      label: 'Facebook-sidlänkar (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.facebook.com/volvocars',
    },
    {
      name: 'maxPosts',
      label: 'Max inlägg per sida',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 5,
      max: 200,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.pageUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      startUrls: urls.map(url => ({ url })),
      resultsLimit: typeof input.maxPosts === 'number' ? input.maxPosts : 50,
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.pageName === 'string' ? item.pageName : undefined,
      title: typeof item.text === 'string' ? item.text.substring(0, 300) : undefined,
      source: 'facebook-posts',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        publishedAt: item.time,
        likes: item.likes,
        commentsCount: item.comments,
        shares: item.shares,
        postType: item.type, // image, video, link, text
      },
    };
  },
  getMockData(maxResults) {
    return [
      { pageName: 'Volvo Cars', text: 'Idag presenterar vi vår nya helelektriska SUV, laddad med ny säkerhetsteknik.', url: 'https://www.facebook.com/volvocars/posts/101', time: '2026-05-20T10:00:00Z', likes: 1250, comments: 243, shares: 98, type: 'video' },
      { pageName: 'Volvo Cars', text: 'Glad sommar önskar vi på Volvo! Kör försiktigt på vägarna i helgen.', url: 'https://www.facebook.com/volvocars/posts/102', time: '2026-05-18T14:30:00Z', likes: 890, comments: 12, shares: 5, type: 'image' },
    ].slice(0, maxResults);
  },
};
