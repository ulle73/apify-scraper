import { ScraperConfig } from '../../types';

export const newsScraperConfig: ScraperConfig = {
  id: 'news-scraper',
  name: 'Nyheter & Bloggartiklar',
  description: 'Bevaka nyheter, artiklar och blogginlägg med fritextsökning.',
  actorId: 'apify/news-scraper',
  category: 'content',
  enabled: true,
  icon: '/icons/news-scraper.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'query',
      label: 'Nyckelfras / Ämne att bevaka',
      type: 'text',
      required: true,
      placeholder: 't.ex. artificiell intelligens sverige',
    },
    {
      name: 'maxResults',
      label: 'Max artiklar',
      type: 'number',
      required: true,
      defaultValue: 25,
      min: 10,
      max: 200,
    },
  ],
  buildApifyInput(input) {
    return {
      query: String(input.query || ''),
      limit: typeof input.maxResults === 'number' ? input.maxResults : 25,
    };
  },
  normalizeItem(item) {
    return {
      title: typeof item.title === 'string' ? item.title : undefined,
      person_name: typeof item.author === 'string' ? item.author : undefined,
      website: typeof item.sourceUrl === 'string' ? item.sourceUrl : undefined,
      source: typeof item.sourceName === 'string' ? item.sourceName : 'news',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        description: item.description,
        publishedDate: item.publishedDate,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'Svenska tech-bolag storsatsar på AI under 2026', author: 'Maria Persson', sourceName: 'Dagens Industri', sourceUrl: 'https://di.se', url: 'https://di.se/nyheter/svenska-tech-bolag-ai', description: 'Investeringarna i artificiell intelligens slår nya rekord i den svenska startup-sektorn.', publishedDate: '2026-05-28' },
      { title: 'AI-verktygen som förenklar vardagen för småföretagare', author: 'Anders Ek', sourceName: 'Breakit', sourceUrl: 'https://breakit.se', url: 'https://breakit.se/artikel/ai-verktyg-smaforetag', description: 'Vi listar de mest effektiva AI-tjänsterna just nu för marknadsföring och kundtjänst.', publishedDate: '2026-05-25' },
    ].slice(0, maxResults);
  },
};
