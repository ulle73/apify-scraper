import { ScraperConfig } from '../../types';

export const contactDetailsConfig: ScraperConfig = {
  id: 'contact-details',
  name: 'Kontaktuppgifter från hemsida',
  description: 'Cravla valfri hemsida och hitta automatiskt dolda e-postadresser, telefonnummer och sociala profiler.',
  actorId: 'apify/contact-info-scraper',
  category: 'leads',
  enabled: true,
  icon: '/icons/contact-details.svg',
  creditCostPerResult: 1.5,
  fields: [
    {
      name: 'urls',
      label: 'Hemsidor att söka på (en per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nleadify.se\ngoteborgsbilverkstad.se',
    },
    {
      name: 'maxDepth',
      label: 'Max djup (antal länkar in)',
      type: 'number',
      required: true,
      defaultValue: 2,
      min: 1,
      max: 5,
    },
  ],
  buildApifyInput(input) {
    const urls = String(input.urls || '').split('\n').map(u => {
      let url = u.trim();
      if (!url.startsWith('http')) url = `https://${url}`;
      return url;
    }).filter(Boolean);
    return {
      startUrls: urls.map(url => ({ url })),
      maxDepth: typeof input.maxDepth === 'number' ? input.maxDepth : 2,
    };
  },
  normalizeItem(item) {
    const emails = Array.isArray(item.emails) ? item.emails : [];
    const phones = Array.isArray(item.phones) ? item.phones : [];
    return {
      website: typeof item.url === 'string' ? item.url : undefined,
      email: emails.length > 0 ? emails[0] : undefined,
      phone: phones.length > 0 ? phones[0] : undefined,
      source: 'website-crawler',
      source_url: typeof item.url === 'string' ? item.url : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        all_emails: emails,
        all_phones: phones,
        facebook: item.facebook,
        instagram: item.instagram,
        linkedin: item.linkedin,
        twitter: item.twitter,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { url: 'https://leadify.se', emails: ['kontakt@leadify.se', 'sales@leadify.se'], phones: ['08-123 45 67'], facebook: 'https://facebook.com/leadify', linkedin: 'https://linkedin.com/company/leadify' },
      { url: 'https://goteborgsbilverkstad.se', emails: ['info@goteborgsbilverkstad.se'], phones: ['031-123 45 67'], instagram: 'https://instagram.com/goteborgsbilverkstad' },
    ].slice(0, maxResults);
  },
};
