import { ScraperConfig } from '../../types';

export const builtwithConfig: ScraperConfig = {
  id: 'builtwith',
  name: 'BuiltWith Technology Lookup',
  description: 'Segmentera företag baserat på deras tech stack (t.ex. e-handelsplattformar, CRM, analytics och hosting).',
  actorId: 'apify/builtwith-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/builtwith.svg',
  creditCostPerResult: 3.0,
  fields: [
    {
      name: 'domains',
      label: 'Domäner att söka upp (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nklarna.com\nspotify.com',
    },
  ],
  buildApifyInput(input) {
    const domains = String(input.domains || '').split('\n').map(d => d.trim()).filter(Boolean);
    return {
      domains,
    };
  },
  normalizeItem(item) {
    return {
      domain: typeof item.domain === 'string' ? item.domain : undefined,
      website: typeof item.domain === 'string' ? `https://${item.domain}` : undefined,
      source: 'builtwith',
      source_url: typeof item.domain === 'string' ? `https://builtwith.com/${item.domain}` : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        technologies: item.technologies, // array av strings/objekt
        ecommerce: item.ecommercePlatform, // t.ex. "Shopify" eller "WooCommerce"
        analytics: item.analyticsTools, // array av strings
        crm: item.crmTools, // t.ex. "Hubspot"
        paymentGateways: item.paymentGateways,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { domain: 'klarna.com', ecommercePlatform: null, analyticsTools: ['Google Analytics', 'Hotjar'], crmTools: ['Salesforce'], paymentGateways: ['Klarna'], technologies: ['React', 'Webpack', 'Cloudflare'] },
      { domain: 'swedishdesign.se', ecommercePlatform: 'Shopify', analyticsTools: ['Google Analytics 4', 'Facebook Pixel'], crmTools: ['HubSpot'], paymentGateways: ['Shopify Payments', 'PayPal'], technologies: ['Shopify', 'Liquid', 'Google Tag Manager'] },
    ].slice(0, maxResults);
  },
};
