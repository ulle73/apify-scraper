import { ScraperAdapter, NormalizedScrapeResult, ExportColumn, ParsedInput } from '../types';
import { z } from 'zod';

const googleMapsInputSchema = z.object({
  country: z.string().min(1, 'Land måste väljas'),
  region: z.string().min(2, 'Region/stad måste innehålla minst 2 tecken'),
  searchTerm: z.string().min(2, 'Sökord/bransch måste innehålla minst 2 tecken'),
  maxResults: z.number().min(10).max(1000).default(100),
});

export const googleMapsAdapter: ScraperAdapter = {
  id: 'google-maps',
  name: 'Google Maps Leadlista',
  description: 'Hitta företag baserat på plats och sökord via Google Maps.',
  provider: 'apify',
  actorIdEnvKey: 'APIFY_GOOGLE_MAPS_ACTOR_ID',
  category: 'leads',
  enabled: true,
  icon: 'MapPin',
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

  creditEstimate(input: Record<string, unknown>): number {
    const maxResults = typeof input.maxResults === 'number' ? input.maxResults : 100;
    return maxResults;
  },

  validateInput(input: Record<string, unknown>): { success: boolean; data?: ParsedInput; error?: string } {
    try {
      const parsed = googleMapsInputSchema.parse({
        country: input.country,
        region: input.region,
        searchTerm: input.searchTerm,
        maxResults: typeof input.maxResults === 'string' ? parseInt(input.maxResults, 10) : input.maxResults,
      });
      return { success: true, data: parsed as unknown as ParsedInput };
    } catch (err) {
      if (err instanceof z.ZodError) {
        return { success: false, error: err.issues.map((e: { message: string }) => e.message).join(', ') };
      }
      return { success: false, error: 'Ogiltig indata' };
    }
  },

  buildApifyInput(input: ParsedInput): Record<string, unknown> {
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

  normalizeItem(item: Record<string, unknown>): NormalizedScrapeResult {
    const website = typeof item.website === 'string' ? item.website : undefined;
    let domain: string | undefined = undefined;
    if (website) {
      try {
        const urlObj = new URL(website.startsWith('http') ? website : `http://${website}`);
        domain = urlObj.hostname.replace('www.', '');
      } catch (e) {
        // Ignorera felaktiga URL:er
      }
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
        openingHours: item.openingHours,
      },
    };
  },

  getExportColumns(): ExportColumn[] {
    return [
      { key: 'company_name', header: 'Företagsnamn' },
      { key: 'phone', header: 'Telefon' },
      { key: 'email', header: 'E-post' },
      { key: 'website', header: 'Hemsida' },
      { key: 'domain', header: 'Domän' },
      { key: 'address', header: 'Adress' },
      { key: 'city', header: 'Stad' },
      { key: 'region', header: 'Region' },
      { key: 'country', header: 'Land' },
      { key: 'category', header: 'Kategori' },
      { key: 'rating', header: 'Rating' },
      { key: 'review_count', header: 'Antal recensioner' },
      { key: 'source', header: 'Källa' },
      { key: 'source_url', header: 'Käll-URL' },
      { key: 'scraped_at', header: 'Hämtad datum' },
    ];
  },
};
