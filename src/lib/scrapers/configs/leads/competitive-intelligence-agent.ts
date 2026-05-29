import { ScraperConfig } from '../../types';

export const competitiveIntelligenceAgentConfig: ScraperConfig = {
  id: 'competitive-intelligence-agent',
  name: 'Konkurrentbevakning (Competitive Intelligence)',
  description: 'Premium-analys: sammanfatta dina konkurrenters styrkor, svagheter, marknadsföringskanaler och erbjudanden.',
  actorId: 'apify/competitive-intelligence-agent',
  category: 'leads',
  enabled: true,
  icon: '/icons/competitors.svg',
  creditCostPerResult: 8.0,
  fields: [
    {
      name: 'companyNames',
      label: 'Konkurrenters namn eller domäner (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nklarna.com\nadyen.com',
    },
    {
      name: 'location',
      label: 'Marknadsområde / Region',
      type: 'text',
      required: false,
      defaultValue: 'Sverige',
      placeholder: 't.ex. Sverige, Norden',
    },
  ],
  buildApifyInput(input) {
    const targets = String(input.companyNames || '').split('\n').map(t => t.trim()).filter(Boolean);
    return {
      targets,
      location: String(input.location || 'Sverige'),
    };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.companyName === 'string' ? item.companyName : undefined,
      source: 'competitive-intelligence-agent',
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        competitorName: item.competitorName,
        strengths: item.strengths, // array av styrkor
        weaknesses: item.weaknesses, // array av svagheter
        marketingChannels: item.marketingChannels, // t.ex. SEO, Meta Ads
        opportunities: item.opportunities,
        summary: item.summaryText,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { companyName: 'Klarna', competitorName: 'Adyen', strengths: ['Global täckning', 'Hög teknisk prestanda och drifttid'], weaknesses: ['Mindre känt varumärke hos slutkonsumenter', 'Komplicerad prissättning för mindre e-handlare'], marketingChannels: ['LinkedIn Ads', 'Sökordsannonsering B2B', 'Branschkonferenser'], opportunities: ['Attrahera mindre till medelstora e-handlare genom enklare integration och billigare startavgifter'], summaryText: 'Adyen är starkt etablerat hos enterprise-bolag men har en sårbarhet i det lägre segmentet där Klarna och Stripe dominerar.' },
    ].slice(0, maxResults);
  },
};
