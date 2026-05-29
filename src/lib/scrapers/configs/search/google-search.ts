import { ScraperConfig } from '../../types';

export const googleSearchConfig: ScraperConfig = {
  id: 'google-search',
  name: 'Google Sökresultat',
  description: 'Extrahera organiska sökresultat från Google baserat på sökord.',
  actorId: 'apify/google-search-scraper',
  category: 'search',
  enabled: true,
  icon: '/icons/google-svgrepo-com.svg',
  creditCostPerResult: 1,
  fields: [
    {
      name: 'queries',
      label: 'Sökord / Frågor (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nbästa hotellen i Stockholm\nlead generation software sweden',
    },
    {
      name: 'maxResults',
      label: 'Max resultat per sökord',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 10,
      max: 500,
    },
  ],
  buildApifyInput(input) {
    const queries = String(input.queries || '').split('\n').map(q => q.trim()).filter(Boolean);
    const maxResults = typeof input.maxResults === 'number' ? input.maxResults : 50;
    return {
      queries: queries.join('\n'),
      maxPagesPerQuery: Math.ceil(maxResults / 10),
      resultsPerPage: 10,
      mobileResults: false,
    };
  },
  normalizeItem(item) {
    const url = typeof item.url === 'string' ? item.url : '';
    let domain: string | undefined = undefined;
    if (url) {
      try {
        const urlObj = new URL(url);
        domain = urlObj.hostname.replace('www.', '');
      } catch (e) {}
    }
    return {
      title: typeof item.title === 'string' ? item.title : undefined,
      website: url,
      domain,
      source: 'google-search',
      source_url: url,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        description: item.description,
        displayedUrl: item.displayedUrl,
        position: item.position,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { title: 'Bästa hotellen i Stockholm - Vår topplista', url: 'https://travelguides.se/stockholm-hotels', description: 'Hitta de absolut mysigaste och mest prisvärda hotellen mitt i centrala Stockholm. Läs omdömen, priser och rekommendationer.', displayedUrl: 'travelguides.se › stockholm', position: 1 },
      { title: 'Hotell i Stockholm - Sök och boka på Booking.com', url: 'https://booking.com/stockholm-hotels', description: 'Boka online på Booking.com. Bra priser och ingen bokningsavgift. Läs gästrecensioner från riktiga besökare.', displayedUrl: 'booking.com › sweden', position: 2 },
      { title: 'Lead Generation Software for Swedish Businesses', url: 'https://leadify.se/software', description: 'Automate your lead generation efforts in Sweden with Leadify. Find clients, verify emails and sync to your CRM.', displayedUrl: 'leadify.se › product', position: 1 },
    ].slice(0, maxResults);
  },
};
