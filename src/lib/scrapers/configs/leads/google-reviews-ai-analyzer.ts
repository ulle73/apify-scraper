import { ScraperConfig } from '../../types';

export const googleReviewsAiAnalyzerConfig: ScraperConfig = {
  id: 'google-reviews-ai-analyzer',
  name: 'AI-analys av Google Recensioner',
  description: 'Gör en AI-analys av Google Maps-recensioner för att hitta kunders problemområden, smärtpunkter och tillväxtmöjligheter.',
  actorId: 'apify/google-reviews-ai-analyzer',
  category: 'leads',
  enabled: true,
  icon: '/icons/google-maps-platform-svgrepo-com.svg',
  creditCostPerResult: 5.0,
  fields: [
    {
      name: 'placeUrls',
      label: 'Google Maps-länkar (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nhttps://www.google.com/maps/place/Heaven+23',
    },
    {
      name: 'analysisType',
      label: 'Analystyp',
      type: 'select',
      required: true,
      defaultValue: 'problems',
      options: [
        { value: 'sentiment', label: 'Övergripande sentiment' },
        { value: 'problems', label: 'Hitta problem och klagomål (Pain Points)' },
        { value: 'opportunities', label: 'Förbättringsmöjligheter & Säljöppningar' },
      ],
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.placeUrls || '').split('\n').map(u => u.trim()).filter(Boolean);
    return {
      startUrls: urls.map(url => ({ url })),
      analysisType: String(input.analysisType || 'problems'),
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.placeName === 'string' ? item.placeName : undefined,
      source: 'google-reviews-ai-analyzer',
      source_url: typeof item.placeUrl === 'string' ? item.placeUrl : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        sentiment: item.overallSentiment, // t.ex. "Positivt" / "Negativt"
        painPoints: item.painPoints, // array av problem
        opportunities: item.opportunities, // array av säljsignaler/råd
        summary: item.summaryText,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { placeName: 'Heaven 23', placeUrl: 'https://g.co/maps/heaven23', overallSentiment: 'Blandat', painPoints: ['Långa väntetider på dryck', 'Högljudd miljö vid fönsterborden'], opportunities: ['Inför ett digitalt beställningssystem för barområdet', 'Erbjud ljuddämpande gardiner/paneler'], summaryText: 'Analys av 45 recensioner visar att servicenivån är hög men logistiken i baren brister vid rusningstid.' },
    ].slice(0, maxResults);
  },
};
