import { ScraperConfig } from '../../types';

export const googleTrendsConfig: ScraperConfig = {
  id: 'google-trends',
  name: 'Google Trends Sökordstrender',
  description: 'Hämta sökvolymtrender, geografiskt intresse och relaterade sökningar från Google Trends.',
  actorId: 'apify/google-trends-scraper',
  category: 'search',
  enabled: true,
  icon: '/icons/google-search.svg',
  creditCostPerResult: 2.0,
  fields: [
    {
      name: 'keywords',
      label: 'Sökord (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nsolceller\nelbil',
    },
    {
      name: 'timeframe',
      label: 'Tidsperiod',
      type: 'select',
      required: true,
      defaultValue: 'today 12-m',
      options: [
        { value: 'now 1-d', label: 'Senaste dygnet' },
        { value: 'today 7-d', label: 'Senaste 7 dagarna' },
        { value: 'today 1-m', label: 'Senaste månaden' },
        { value: 'today 3-m', label: 'Senaste 3 månaderna' },
        { value: 'today 12-m', label: 'Senaste 12 månaderna' },
        { value: 'today 5-y', label: 'Senaste 5 åren' },
      ],
    },
    {
      name: 'geo',
      label: 'Geografiskt område (landskod)',
      type: 'text',
      required: true,
      defaultValue: 'SE',
      placeholder: 't.ex. SE för Sverige, US för USA',
    },
  ],
  buildApifyInput(input) {
    const keywords = String(input.keywords || '').split('\n').map(k => k.trim()).filter(Boolean);
    return {
      searchTerms: keywords,
      timeframe: String(input.timeframe || 'today 12-m'),
      geo: String(input.geo || 'SE'),
    };
  },
  normalizeItem(item) {
    return {
      title: typeof item.keyword === 'string' ? item.keyword : undefined,
      source: 'google-trends',
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        keyword: item.keyword,
        geo: item.geo,
        timeframe: item.timeframe,
        averages: item.averages, // genomsnittligt intresse per region/tid
        relatedQueries: item.relatedQueries, // array av relaterade sökningar
        interestOverTime: item.interestOverTime, // array av datapunkter
      },
    };
  },
  getMockData(maxResults) {
    return [
      { keyword: 'solceller', geo: 'SE', timeframe: 'today 12-m', averages: { stockholm: 65, goteborg: 58 }, relatedQueries: ['köpa solceller priser', 'solceller bäst i test'], interestOverTime: [{ date: '2025-06-01', value: 80 }, { date: '2025-07-01', value: 95 }] },
      { keyword: 'elbil', geo: 'SE', timeframe: 'today 12-m', averages: { stockholm: 72, goteborg: 69 }, relatedQueries: ['billig elbil 2026', 'ladda elbil hemma'], interestOverTime: [{ date: '2025-06-01', value: 60 }, { date: '2025-07-01', value: 68 }] },
    ].slice(0, maxResults);
  },
};
