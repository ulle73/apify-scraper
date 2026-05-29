import { ScraperField, NormalizedScrapeResult, ExportColumn, ParsedInput } from './types';

export interface ScraperConfig {
  id: string;
  name: string;
  description: string;
  actorId: string;
  actorIdEnvKey?: string;
  category: 'leads' | 'search' | 'social' | 'content' | 'ecommerce';
  enabled: boolean;
  icon: string;
  creditCostPerResult?: number;
  fixedCreditCost?: number;
  fields: ScraperField[];
  
  // Custom builders and normalization (declared inline)
  buildApifyInput: (input: ParsedInput) => Record<string, unknown>;
  normalizeItem: (item: Record<string, unknown>) => NormalizedScrapeResult;
  getExportColumns?: () => ExportColumn[];
  getMockData?: (maxResults: number) => Record<string, unknown>[];
}

export const scrapersConfig: ScraperConfig[] = [
  {
    id: 'google-maps',
    name: 'Google Maps Leadlista',
    description: 'Hitta företag baserat på plats och sökord via Google Maps.',
    actorId: 'compass/crawler-google-places',
    actorIdEnvKey: 'APIFY_GOOGLE_MAPS_ACTOR_ID',
    category: 'leads',
    enabled: true,
    icon: '/icons/google-maps-platform-svgrepo-com.svg',
    creditCostPerResult: 1,
    fields: [
      {
        name: 'country',
        label: 'Land',
        type: 'select',
        required: true,
        defaultValue: 'Sverige',
        options: [
          { value: 'Sverige', label: 'Sverige' },
          { value: 'Norge', label: 'Norge' },
          { value: 'Danmark', label: 'Danmark' },
          { value: 'Finland', label: 'Finland' },
          { value: 'Tyskland', label: 'Tyskland' },
          { value: 'Storbritannien', label: 'Storbritannien' },
        ],
      },
      {
        name: 'region',
        label: 'Stad / Region',
        type: 'text',
        required: true,
        placeholder: 't.ex. Göteborg eller Skåne',
      },
      {
        name: 'searchTerm',
        label: 'Sökord / Bransch',
        type: 'text',
        required: true,
        placeholder: 't.ex. bilverkstad, restaurang eller frisör',
      },
      {
        name: 'maxResults',
        label: 'Max antal leads',
        type: 'number',
        required: true,
        defaultValue: 100,
        min: 10,
        max: 1000,
      },
    ],
    buildApifyInput(input) {
      const searchTerm = String(input.searchTerm || '');
      const region = String(input.region || '');
      const country = String(input.country || '');
      const maxResults = typeof input.maxResults === 'number' ? input.maxResults : 100;
      return {
        searchStringsArray: [`${searchTerm} ${region} ${country}`],
        maxCrawledPlacesPerSearch: maxResults,
        language: 'sv',
        includeWebResults: false,
      };
    },
    normalizeItem(item) {
      const website = typeof item.website === 'string' ? item.website : undefined;
      let domain: string | undefined = undefined;
      if (website) {
        try {
          const urlObj = new URL(website.startsWith('http') ? website : `http://${website}`);
          domain = urlObj.hostname.replace('www.', '');
        } catch (e) {}
      }
      return {
        company_name: typeof item.title === 'string' ? item.title : undefined,
        website: website,
        domain: domain,
        phone: typeof item.phone === 'string' ? item.phone : undefined,
        email: typeof item.email === 'string' ? item.email : undefined,
        address: typeof item.address === 'string' ? item.address : undefined,
        city: typeof item.city === 'string' ? item.city : undefined,
        region: typeof item.region === 'string' ? item.region : undefined,
        country: typeof item.country === 'string' ? item.country : undefined,
        category: typeof item.categoryName === 'string' ? item.categoryName : undefined,
        rating: typeof item.totalScore === 'number' ? item.totalScore : undefined,
        review_count: typeof item.reviewsCount === 'number' ? item.reviewsCount : undefined,
        source: 'google-maps',
        source_url: typeof item.url === 'string' ? item.url : undefined,
        scraped_at: new Date().toISOString(),
        raw_json: item,
        normalized_json: {
          subTitle: item.subTitle,
          category: item.categoryName,
          reviewsCount: item.reviewsCount,
          rating: item.totalScore,
          location: item.location,
        },
      };
    },
    getMockData(maxResults) {
      return [
        { title: "Göteborgs Bilverkstad AB", website: "goteborgsbilverkstad.se", phone: "031-123 45 67", email: "info@goteborgsbilverkstad.se", address: "Bultgatan 12", city: "Göteborg", region: "Västra Götalands", country: "Sverige", categoryName: "Bilverkstad", totalScore: 4.6, reviewsCount: 124, url: "https://google.com/maps" },
        { title: "Meca Göteborg - Hisingens Bilservice", website: "meca.se", phone: "031-987 65 43", email: "hisingen@meca.se", address: "Herkulesgatan 24", city: "Göteborg", region: "Västra Götalands", country: "Sverige", categoryName: "Bilverkstad", totalScore: 4.2, reviewsCount: 87, url: "https://google.com/maps" },
        { title: "Bilia Göteborg - Almedal", website: "bilia.se", phone: "0771-400 000", email: "almedal@bilia.se", address: "Almedalsvägen 15", city: "Göteborg", region: "Västra Götalands", country: "Sverige", categoryName: "Verkstad", totalScore: 4.0, reviewsCount: 342, url: "https://google.com/maps" },
        { title: "Mekonomen Heden", website: "mekonomen.se", phone: "031-711 22 33", email: "heden@mekonomen.se", address: "Södra Vägen 18", city: "Göteborg", region: "Västra Götalands", country: "Sverige", categoryName: "Bilverkstad", totalScore: 4.4, reviewsCount: 56, url: "https://google.com/maps" },
      ].slice(0, maxResults);
    }
  },
  {
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
        domain: domain,
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
        { title: "Bästa hotellen i Stockholm - Vår topplista", url: "https://travelguides.se/stockholm-hotels", description: "Hitta de absolut mysigaste och mest prisvärda hotellen mitt i centrala Stockholm. Läs omdömen, priser och rekommendationer.", displayedUrl: "travelguides.se › stockholm", position: 1 },
        { title: "Hotell i Stockholm - Sök och boka på Booking.com", url: "https://booking.com/stockholm-hotels", description: "Boka online på Booking.com. Bra priser och ingen bokningsavgift. Läs gästrecensioner från riktiga besökare.", displayedUrl: "booking.com › sweden", position: 2 },
        { title: "Lead Generation Software for Swedish Businesses", url: "https://leadify.se/software", description: "Automate your lead generation efforts in Sweden with Leadify. Find clients, verify emails and sync to your CRM.", displayedUrl: "leadify.se › product", position: 1 },
      ].slice(0, maxResults);
    }
  },
  {
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
      return {
        usernames,
      };
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
        { fullName: "Spotify Sweden", username: "spotifysweden", externalUrl: "https://spotify.se", email: "info@spotify.com", phone: "+46 8 123 456", businessCategoryName: "Media/News Company", biography: "Det bästa inom musik och poddar. Häng med!", followersCount: 154000, followsCount: 450, postsCount: 1200, isBusinessAccount: true },
        { fullName: "IKEA Sverige", username: "ikeasverige", externalUrl: "https://ikea.se", email: "support@ikea.se", businessCategoryName: "Furniture/Home Store", biography: "Välkommen till IKEA Sverige! Tagga oss med #IKEAsverige för chans att synas.", followersCount: 890000, followsCount: 180, postsCount: 3400, isBusinessAccount: true },
      ].slice(0, maxResults);
    }
  },
  {
    id: 'tiktok-scraper',
    name: 'TikTok Sökning',
    description: 'Hämta videoklipp, hashtags, användare och statistik från TikTok.',
    actorId: 'apify/tiktok-scraper',
    category: 'social',
    enabled: true,
    icon: '/icons/brand-tiktok-sq-svgrepo-com.svg',
    creditCostPerResult: 1.5,
    fields: [
      {
        name: 'hashtags',
        label: 'Hashtags eller sökord (kommaseparerat)',
        type: 'text',
        required: true,
        placeholder: 't.ex. leadgeneration, B2B, sales',
      },
      {
        name: 'maxResults',
        label: 'Max videor att hämta',
        type: 'number',
        required: true,
        defaultValue: 50,
        min: 10,
        max: 500,
      },
    ],
    buildApifyInput(input) {
      const hashtags = String(input.hashtags || '').split(',').map(h => h.trim().replace('#', '')).filter(Boolean);
      const maxResults = typeof input.maxResults === 'number' ? input.maxResults : 50;
      return {
        hashtags,
        resultsLimit: maxResults,
      };
    },
    normalizeItem(item) {
      const author = (item.authorMeta || {}) as Record<string, unknown>;
      return {
        person_name: typeof author.name === 'string' ? author.name : undefined,
        title: typeof item.text === 'string' ? item.text : undefined,
        source: 'tiktok',
        source_url: typeof item.webVideoUrl === 'string' ? item.webVideoUrl : undefined,
        scraped_at: new Date().toISOString(),
        raw_json: item,
        normalized_json: {
          nickname: author.nickName,
          diggCount: item.diggCount,
          playCount: item.playCount,
          shareCount: item.shareCount,
          commentCount: item.commentCount,
        },
      };
    },
    getMockData(maxResults) {
      return [
        { authorMeta: { name: "B2BSalesGuru", nickName: "B2B Sales Pro" }, text: "How to get 100 new leads per day using automated tools 📈 #leadgeneration #sales", webVideoUrl: "https://tiktok.com/@b2bsalesguru/video/123", diggCount: 4200, playCount: 89000, shareCount: 312, commentCount: 85 },
        { authorMeta: { name: "GrowthHackerSE", nickName: "Growth Hack Sverige" }, text: "Bästa sätten att skala din startup under 2026! 🚀 #startup #growth", webVideoUrl: "https://tiktok.com/@growthhackerse/video/456", diggCount: 1800, playCount: 32000, shareCount: 145, commentCount: 42 },
      ].slice(0, maxResults);
    }
  },
  {
    id: 'linkedin-company',
    name: 'LinkedIn Företagssök',
    description: 'Extrahera information om företag, bransch, storlek och anställda från LinkedIn.',
    actorId: 'apify/linkedin-company-scraper',
    category: 'leads',
    enabled: true,
    icon: '/icons/linkedin-svgrepo-com.svg',
    creditCostPerResult: 3,
    fields: [
      {
        name: 'companies',
        label: 'LinkedIn företags-URL:er (en per rad)',
        type: 'textarea',
        required: true,
        placeholder: 't.ex.\nhttps://www.linkedin.com/company/spotify/\nhttps://www.linkedin.com/company/klarna/',
      },
    ],
    buildApifyInput(input) {
      const urls = String(input.companies || '').split('\n').map(u => u.trim()).filter(Boolean);
      return {
        urls,
      };
    },
    normalizeItem(item) {
      return {
        company_name: typeof item.name === 'string' ? item.name : undefined,
        website: typeof item.website === 'string' ? item.website : undefined,
        address: typeof item.headquarters === 'string' ? item.headquarters : undefined,
        category: typeof item.industry === 'string' ? item.industry : undefined,
        source: 'linkedin',
        source_url: typeof item.linkedinUrl === 'string' ? item.linkedinUrl : undefined,
        scraped_at: new Date().toISOString(),
        raw_json: item,
        normalized_json: {
          companySize: item.companySize,
          founded: item.founded,
          description: item.description,
          specialties: item.specialties,
        },
      };
    },
    getMockData(maxResults) {
      return [
        { name: "Spotify", website: "https://spotify.com", headquarters: "Stockholm, Sweden", industry: "Music & Audio Streaming", linkedinUrl: "https://linkedin.com/company/spotify", companySize: "5001-10000 employees", founded: 2006, description: "Spotify is a digital music service that gives you access to millions of songs." },
        { name: "Klarna", website: "https://klarna.com", headquarters: "Stockholm, Sweden", industry: "Financial Services", linkedinUrl: "https://linkedin.com/company/klarna", companySize: "1001-5000 employees", founded: 2005, description: "Klarna makes shopping smoooth. We help you buy now and pay later." },
      ].slice(0, maxResults);
    }
  },
  {
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
        { url: "https://leadify.se", emails: ["kontakt@leadify.se", "sales@leadify.se"], phones: ["08-123 45 67"], facebook: "https://facebook.com/leadify", linkedin: "https://linkedin.com/company/leadify" },
        { url: "https://goteborgsbilverkstad.se", emails: ["info@goteborgsbilverkstad.se"], phones: ["031-123 45 67"], instagram: "https://instagram.com/goteborgsbilverkstad" },
      ].slice(0, maxResults);
    }
  },
  {
    id: 'website-crawler',
    name: 'Hemsideinnehåll (HTML & Text)',
    description: 'Crawla och hämta all ren text från webbplatser – perfekt för AI-träning eller analys.',
    actorId: 'apify/website-content-crawler',
    category: 'content',
    enabled: true,
    icon: '/icons/web-search-svgrepo-com.svg',
    creditCostPerResult: 1.2,
    fields: [
      {
        name: 'urls',
        label: 'Start-URL:er (en per rad)',
        type: 'textarea',
        required: true,
        placeholder: 't.ex.\nhttps://leadify.se/om-oss\nhttps://example.com',
      },
      {
        name: 'maxPages',
        label: 'Max antal sidor per webbplats',
        type: 'number',
        required: true,
        defaultValue: 25,
        min: 5,
        max: 200,
      },
    ],
    buildApifyInput(input) {
      const urls = String(input.urls || '').split('\n').map(u => u.trim()).filter(Boolean);
      return {
        startUrls: urls.map(url => ({ url })),
        maxCrawlPages: typeof input.maxPages === 'number' ? input.maxPages : 25,
      };
    },
    normalizeItem(item) {
      return {
        title: typeof item.title === 'string' ? item.title : undefined,
        website: typeof item.url === 'string' ? item.url : undefined,
        source: 'website-crawler',
        source_url: typeof item.url === 'string' ? item.url : undefined,
        scraped_at: new Date().toISOString(),
        raw_json: item,
        normalized_json: {
          text: typeof item.text === 'string' ? item.text.substring(0, 1000) : '',
          description: item.description,
          h1: item.h1,
        },
      };
    },
    getMockData(maxResults) {
      return [
        { title: "Om oss - Leadify Sverige", url: "https://leadify.se/om-oss", text: "Vi är ett litet team passionerade utvecklare som bygger framtidens verktyg för automatisk informationsinsamling och prospektering. Vår vision är...", description: "Läs mer om vårt team och vår vision på Leadify.", h1: "Vi gör leadinsamling enkelt" },
        { title: "Example Domain", url: "https://example.com", text: "This domain is established to be used for illustrative examples in documents. You may use this domain in examples without prior coordination...", description: "An illustrative example website", h1: "Example Domain" },
      ].slice(0, maxResults);
    }
  },
  {
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
        { title: "B2B Lead Generation Guide for 2026 (Step-by-Step)", channelName: "Sales Academy", url: "https://youtube.com/watch?v=123", viewCount: 15400, duration: "15:24", uploadedAt: "3 days ago", likesCount: 950 },
        { title: "How to Build a Scraper in Next.js", channelName: "TechWithJohan", url: "https://youtube.com/watch?v=456", viewCount: 3200, duration: "24:10", uploadedAt: "1 month ago", likesCount: 180 },
      ].slice(0, maxResults);
    }
  },
  {
    id: 'ecommerce-product-scraper',
    name: 'Amazon E-handelsprodukter',
    description: 'Hitta produkter, priser, betyg och återförsäljare på Amazon.',
    actorId: 'apify/amazon-crawler',
    category: 'ecommerce',
    enabled: true,
    icon: '/icons/amazon-color-svgrepo-com.svg',
    creditCostPerResult: 2,
    fields: [
      {
        name: 'queries',
        label: 'Sökord / Produktkategorier (en per rad)',
        type: 'textarea',
        required: true,
        placeholder: 't.ex.\niphone 15 pro\nmechanical keyboard',
      },
      {
        name: 'maxResults',
        label: 'Max produkter',
        type: 'number',
        required: true,
        defaultValue: 50,
        min: 10,
        max: 500,
      },
    ],
    buildApifyInput(input) {
      const queries = String(input.queries || '').split('\n').map(q => q.trim()).filter(Boolean);
      return {
        queries,
        maxProducts: typeof input.maxResults === 'number' ? input.maxResults : 50,
      };
    },
    normalizeItem(item) {
      return {
        title: typeof item.title === 'string' ? item.title : undefined,
        website: typeof item.url === 'string' ? item.url : undefined,
        category: typeof item.category === 'string' ? item.category : undefined,
        rating: typeof item.stars === 'number' ? item.stars : undefined,
        review_count: typeof item.reviewsCount === 'number' ? item.reviewsCount : undefined,
        source: 'amazon',
        source_url: typeof item.url === 'string' ? item.url : undefined,
        scraped_at: new Date().toISOString(),
        raw_json: item,
        normalized_json: {
          price: item.price,
          currency: item.currency,
          asin: item.asin,
          seller: item.seller,
        },
      };
    },
    getMockData(maxResults) {
      return [
        { title: "Apple iPhone 15 Pro (128 GB) - Natural Titanium", url: "https://amazon.se/dp/B0CHWX6N33", category: "Mobiltelefoner", stars: 4.7, reviewsCount: 1540, price: 13490, currency: "SEK", asin: "B0CHWX6N33", seller: "Apple" },
        { title: "Keychron K2 Mechanical Keyboard - Red Switch", url: "https://amazon.se/dp/B07QBPDW5S", category: "Tangentbord", stars: 4.5, reviewsCount: 342, price: 1100, currency: "SEK", asin: "B07QBPDW5S", seller: "Keychron" },
      ].slice(0, maxResults);
    }
  },
  {
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
        { title: "Svenska tech-bolag storsatsar på AI under 2026", author: "Maria Persson", sourceName: "Dagens Industri", sourceUrl: "https://di.se", url: "https://di.se/nyheter/svenska-tech-bolag-ai", description: "Investeringarna i artificiell intelligens slår nya rekord i den svenska startup-sektorn.", publishedDate: "2026-05-28" },
        { title: "AI-verktygen som förenklar vardagen för småföretagare", author: "Anders Ek", sourceName: "Breakit", sourceUrl: "https://breakit.se", url: "https://breakit.se/artikel/ai-verktyg-smaforetag", description: "Vi listar de mest effektiva AI-tjänsterna just nu för marknadsföring och kundtjänst.", publishedDate: "2026-05-25" },
      ].slice(0, maxResults);
    }
  },
  {
    id: 'facebook-pages',
    name: 'Facebook Pages Scraper',
    description: 'Hämta kontaktinformation, likes, telefonnummer och e-postadresser från publika Facebooksidor.',
    actorId: 'apify/facebook-pages-scraper',
    category: 'social',
    enabled: true,
    icon: '/icons/facebook-1-svgrepo-com.svg',
    creditCostPerResult: 2,
    fields: [
      {
        name: 'urls',
        label: 'Facebook-sidlänkar (en per rad)',
        type: 'textarea',
        required: true,
        placeholder: 't.ex.\nhttps://www.facebook.com/IKEA/\nhttps://www.facebook.com/VolvoCars/',
      },
    ],
    buildApifyInput(input) {
      const urls = String(input.urls || '').split('\n').map(u => u.trim()).filter(Boolean);
      return {
        startUrls: urls.map(url => ({ url })),
      };
    },
    normalizeItem(item) {
      return {
        company_name: typeof item.title === 'string' ? item.title : undefined,
        website: typeof item.website === 'string' ? item.website : undefined,
        email: typeof item.email === 'string' ? item.email : undefined,
        phone: typeof item.phone === 'string' ? item.phone : undefined,
        address: typeof item.address === 'string' ? item.address : undefined,
        category: typeof item.category === 'string' ? item.category : undefined,
        source: 'facebook',
        source_url: typeof item.url === 'string' ? item.url : undefined,
        scraped_at: new Date().toISOString(),
        raw_json: item,
        normalized_json: {
          likes: item.likesCount,
          followers: item.followersCount,
          description: item.description,
        },
      };
    },
    getMockData(maxResults) {
      return [
        { title: "IKEA Sverige", website: "https://www.ikea.com/se", email: "info@ikea.se", phone: "077-520 00 00", address: "Älmhult, Sweden", category: "Home Improvement Retailer", url: "https://facebook.com/IKEA", likesCount: 4500000, followersCount: 4600000, description: "Välkommen till vår Facebooksida för inspiration och erbjudanden." },
        { title: "Volvo Cars", website: "https://www.volvocars.com", email: "support@volvocars.com", phone: "020-55 55 55", address: "Gothenburg, Sweden", category: "Motor Vehicle Company", url: "https://facebook.com/VolvoCars", likesCount: 9200000, followersCount: 9400000, description: "Official Volvo Cars Facebook Page." },
      ].slice(0, maxResults);
    }
  },
  {
    id: 'twitter-scraper',
    name: 'Twitter/X Sökning',
    description: 'Sök efter specifika nyckelord eller trender på Twitter/X och hämta inlägg, datum och statistik.',
    actorId: 'apify/twitter-scraper',
    category: 'social',
    enabled: true,
    icon: '/icons/x.svg',
    creditCostPerResult: 2.5,
    fields: [
      {
        name: 'searchQuery',
        label: 'Sökord / Hashtags på X',
        type: 'text',
        required: true,
        placeholder: 't.ex. artificial intelligence sweden',
      },
      {
        name: 'maxResults',
        label: 'Max antal inlägg',
        type: 'number',
        required: true,
        defaultValue: 25,
        min: 10,
        max: 200,
      },
    ],
    buildApifyInput(input) {
      return {
        searchTerms: [String(input.searchQuery || '')],
        maxTweets: typeof input.maxResults === 'number' ? input.maxResults : 25,
      };
    },
    normalizeItem(item) {
      return {
        title: typeof item.text === 'string' ? item.text : undefined,
        person_name: typeof item.user === 'object' && item.user ? (item.user as any).screen_name : undefined,
        source: 'twitter',
        source_url: typeof item.url === 'string' ? item.url : undefined,
        scraped_at: new Date().toISOString(),
        raw_json: item,
        normalized_json: {
          likes: item.favorite_count,
          retweets: item.retweet_count,
          createdAt: item.created_at,
        },
      };
    },
    getMockData(maxResults) {
      return [
        { text: "Just had an amazing session discussing B2B lead generation in Sweden! The market is growing super fast. 🚀 #sales #marketing", user: { screen_name: "johandev" }, url: "https://twitter.com/johandev/status/123", favorite_count: 85, retweet_count: 14, created_at: "2026-05-28T14:20:00Z" },
        { text: "Next.js 16 is making server-side web app architectures extremely clean. Loving the new dev tools!", user: { screen_name: "techgirl" }, url: "https://twitter.com/techgirl/status/456", favorite_count: 240, retweet_count: 45, created_at: "2026-05-27T09:15:00Z" },
      ].slice(0, maxResults);
    }
  },
  {
    id: 'tripadvisor-scraper',
    name: 'Tripadvisor Hotell & Restauranger',
    description: 'Hämta omdömen, priser, betyg och adresser för restauranger, hotell och sevärdheter.',
    actorId: 'apify/tripadvisor-scraper',
    category: 'leads',
    enabled: true,
    icon: '/icons/tripadvisor.svg',
    creditCostPerResult: 1.5,
    fields: [
      {
        name: 'urls',
        label: 'Tripadvisor-länkar till hotell/restauranger (en per rad)',
        type: 'textarea',
        required: true,
        placeholder: 't.ex.\nhttps://www.tripadvisor.se/Restaurant_Review-g189894-d1357608-Reviews-Heaven_23-Gothenburg.html',
      },
      {
        name: 'maxReviews',
        label: 'Max antal omdömen att hämta',
        type: 'number',
        required: true,
        defaultValue: 20,
        min: 5,
        max: 100,
      },
    ],
    buildApifyInput(input) {
      const urls = String(input.urls || '').split('\n').map(u => u.trim()).filter(Boolean);
      return {
        urls,
        maxReviews: typeof input.maxReviews === 'number' ? input.maxReviews : 20,
      };
    },
    normalizeItem(item) {
      return {
        company_name: typeof item.name === 'string' ? item.name : undefined,
        website: typeof item.website === 'string' ? item.website : undefined,
        phone: typeof item.phone === 'string' ? item.phone : undefined,
        address: typeof item.address === 'string' ? item.address : undefined,
        category: typeof item.category === 'string' ? item.category : undefined,
        rating: typeof item.rating === 'number' ? item.rating : undefined,
        review_count: typeof item.reviewsCount === 'number' ? item.reviewsCount : undefined,
        source: 'tripadvisor',
        source_url: typeof item.url === 'string' ? item.url : undefined,
        scraped_at: new Date().toISOString(),
        raw_json: item,
        normalized_json: {
          priceRange: item.priceRange,
          reviews: item.reviews,
        },
      };
    },
    getMockData(maxResults) {
      return [
        { name: "Heaven 23", website: "http://www.heaven23.se", phone: "031-750 88 00", address: "Mässans Gata 24, Gothenburg, Sweden", category: "Restaurang", rating: 4.2, reviewsCount: 1450, url: "https://www.tripadvisor.se/Heaven_23", priceRange: "$$$$" },
      ].slice(0, maxResults);
    }
  },
  {
    id: 'reddit-scraper',
    name: 'Reddit Inlägg & Diskussioner',
    description: 'Sök efter trådar, nyckelord eller diskussioner på Reddit och samla kommentarer och användardata.',
    actorId: 'apify/reddit-scraper',
    category: 'social',
    enabled: true,
    icon: '/icons/reddit.svg',
    creditCostPerResult: 1.5,
    fields: [
      {
        name: 'subreddits',
        label: 'Subreddits (kommaseparerat, valfritt)',
        type: 'text',
        required: false,
        placeholder: 't.ex. startup, sweden',
      },
      {
        name: 'searchQuery',
        label: 'Sökord / Fras',
        type: 'text',
        required: true,
        placeholder: 't.ex. lead generation tools',
      },
      {
        name: 'maxResults',
        label: 'Max antal inlägg',
        type: 'number',
        required: true,
        defaultValue: 30,
        min: 10,
        max: 200,
      },
    ],
    buildApifyInput(input) {
      const subreddits = String(input.subreddits || '').split(',').map(s => s.trim()).filter(Boolean);
      return {
        subreddits,
        searchQuery: String(input.searchQuery || ''),
        limit: typeof input.maxResults === 'number' ? input.maxResults : 30,
      };
    },
    normalizeItem(item) {
      return {
        title: typeof item.title === 'string' ? item.title : undefined,
        person_name: typeof item.author === 'string' ? item.author : undefined,
        source: 'reddit',
        source_url: typeof item.url === 'string' ? item.url : undefined,
        review_count: typeof item.numComments === 'number' ? item.numComments : undefined,
        rating: typeof item.score === 'number' ? item.score : undefined,
        scraped_at: new Date().toISOString(),
        raw_json: item,
        normalized_json: {
          subreddit: item.subreddit,
          text: typeof item.selfText === 'string' ? item.selfText.substring(0, 1000) : '',
        },
      };
    },
    getMockData(maxResults) {
      return [
        { title: "What are the best B2B lead generation tools for Nordic companies?", author: "startup_founder_se", url: "https://reddit.com/r/startup/comments/123", numComments: 45, score: 54, subreddit: "startup", selfText: "Hey guys! We are looking to scale our outreach in Sweden and Norway. Currently doing cold email, but we need high quality databases. Any tips?" },
      ].slice(0, maxResults);
    }
  },
  {
    id: 'indeed-scraper',
    name: 'Indeed Jobbannonser',
    description: 'Samla jobbannonser, arbetsbeskrivningar, löner och arbetsgivare från Indeed.',
    actorId: 'apify/indeed-scraper',
    category: 'leads',
    enabled: true,
    icon: '/icons/indeed.svg',
    creditCostPerResult: 2,
    fields: [
      {
        name: 'position',
        label: 'Yrkestitel / Roll',
        type: 'text',
        required: true,
        placeholder: 't.ex. fullstack developer',
      },
      {
        name: 'location',
        label: 'Plats / Stad',
        type: 'text',
        required: true,
        placeholder: 't.ex. Stockholm',
      },
      {
        name: 'maxResults',
        label: 'Max antal jobb',
        type: 'number',
        required: true,
        defaultValue: 25,
        min: 10,
        max: 100,
      },
    ],
    buildApifyInput(input) {
      return {
        position: String(input.position || ''),
        location: String(input.location || ''),
        limit: typeof input.maxResults === 'number' ? input.maxResults : 25,
      };
    },
    normalizeItem(item) {
      return {
        title: typeof item.positionName === 'string' ? item.positionName : undefined,
        company_name: typeof item.company === 'string' ? item.company : undefined,
        address: typeof item.location === 'string' ? item.location : undefined,
        source: 'indeed',
        source_url: typeof item.url === 'string' ? item.url : undefined,
        scraped_at: new Date().toISOString(),
        raw_json: item,
        normalized_json: {
          salary: item.salary,
          jobType: item.jobType,
          description: item.description,
        },
      };
    },
    getMockData(maxResults) {
      return [
        { positionName: "Senior Fullstack Developer", company: "Spotify AB", location: "Stockholm, Sweden", url: "https://indeed.com/viewjob?jk=123", salary: "65,000 - 75,000 SEK / month", jobType: "Full-time", description: "Spotify is looking for a senior engineer to join our core payments infrastructure team." },
      ].slice(0, maxResults);
    }
  }
];
