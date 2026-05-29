import { ScraperConfig } from '../../types';

export const youtubeScraperConfig: ScraperConfig = {
  id: 'youtube-scraper',
  name: 'YouTube Sök & Kanaler',
  description: 'Hämta information om videor, visningar, speltid och kanaler från YouTube.',
  actorId: 'apify/youtube-scraper',
  category: 'content',
  enabled: true,
  icon: '/icons/youtube-color-svgrepo-com.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'searchQueries',
      label: 'Sökord / Kanallänkar (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nlead generation tutorial\nhttps://www.youtube.com/@TED',
    },
    {
      name: 'maxResults',
      label: 'Max videoklipp',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 500,
    },
  ],
  buildApifyInput(input) {
    const searchQueries = String(input.searchQueries || '').split('\n').map(q => q.trim()).filter(Boolean);
    return {
      searchQueries,
      maxResultRows: typeof input.maxResults === 'number' ? input.maxResults : 50,
    };
  },
  normalizeItem(item) {
    return {
      title: typeof item.title === 'string' ? item.title : undefined,
      person_name: typeof item.channelName === 'string' ? item.channelName : undefined,
      source: 'youtube',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      review_count: typeof item.viewCount === 'number' ? item.viewCount : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        duration: item.duration,
        uploadedAt: item.uploadedAt,
        likesCount: item.likesCount,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'B2B Lead Generation Guide for 2026 (Step-by-Step)', channelName: 'Sales Academy', url: 'https://youtube.com/watch?v=123', viewCount: 15400, duration: '15:24', uploadedAt: '3 days ago', likesCount: 950 },
      { title: 'How to Build a Scraper in Next.js', channelName: 'TechWithJohan', url: 'https://youtube.com/watch?v=456', viewCount: 3200, duration: '24:10', uploadedAt: '1 month ago', likesCount: 180 },
    ].slice(0, maxResults);
  },
};
