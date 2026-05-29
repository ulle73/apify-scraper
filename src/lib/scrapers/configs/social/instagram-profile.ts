import { ScraperConfig } from '../../types';

export const instagramProfileConfig: ScraperConfig = {
  id: 'instagram-profile',
  name: 'Instagram Profiler',
  description: 'Hämta e-post, följare, biografi och kontaktinfo från Instagram-konton.',
  actorId: 'apify/instagram-profile-scraper',
  category: 'social',
  enabled: true,
  icon: '/icons/instagram-1-svgrepo-com.svg',
  creditCostPerResult: 2,
  fields: [
    {
      name: 'usernames',
      label: 'Användarnamn (ett per rad)',
      type: 'textarea',
      required: true,
      placeholder: 't.ex.\nspotify\nikeasverige',
    },
  ],
  buildApifyInput(input) {
    const usernames = String(input.usernames || '').split('\n').map(u => u.trim()).filter(Boolean);
    return { usernames };
  },
  normalizeItem(item) {
    return {
      company_name: typeof item.fullName === 'string' ? item.fullName : undefined,
      person_name: typeof item.username === 'string' ? item.username : undefined,
      website: typeof item.externalUrl === 'string' ? item.externalUrl : undefined,
      email: typeof item.email === 'string' ? item.email : undefined,
      phone: typeof item.phone === 'string' ? item.phone : undefined,
      category: typeof item.businessCategoryName === 'string' ? item.businessCategoryName : undefined,
      source: 'instagram',
      source_url: typeof item.username === 'string' ? `https://instagram.com/${item.username}` : undefined,
      scraped_at: new Date().toISOString(),
      raw_json: item,
      normalized_json: {
        biography: item.biography,
        followersCount: item.followersCount,
        followsCount: item.followsCount,
        postsCount: item.postsCount,
        isBusiness: item.isBusinessAccount,
      },
    };
  },
  getMockData(maxResults) {
    return [
      { fullName: 'Spotify Sweden', username: 'spotifysweden', externalUrl: 'https://spotify.se', email: 'info@spotify.com', phone: '+46 8 123 456', businessCategoryName: 'Media/News Company', biography: 'Det bästa inom musik och poddar. Häng med!', followersCount: 154000, followsCount: 450, postsCount: 1200, isBusinessAccount: true },
      { fullName: 'IKEA Sverige', username: 'ikeasverige', externalUrl: 'https://ikea.se', email: 'support@ikea.se', businessCategoryName: 'Furniture/Home Store', biography: 'Välkommen till IKEA Sverige! Tagga oss med #IKEAsverige för chans att synas.', followersCount: 890000, followsCount: 180, postsCount: 3400, isBusinessAccount: true },
    ].slice(0, maxResults);
  },
};
