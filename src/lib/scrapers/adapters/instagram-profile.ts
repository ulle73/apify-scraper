import { ScraperAdapter, NormalizedScrapeResult, ExportColumn, ParsedInput } from '../types';

// TODO: Connect to apify/instagram-profile-scraper
export const instagramProfileAdapter: ScraperAdapter = {
  id: 'instagram-profile',
  name: 'Instagram Profiler',
  description: 'Hämta profildata från Instagram. (Kommer snart)',
  provider: 'apify',
  category: 'social',
  enabled: false,
  fields: [],
  creditEstimate(): number {
    return 0;
  },
  validateInput(): { success: boolean; data?: ParsedInput; error?: string } {
    return { success: false, error: 'Denna scraper är inte aktiverad ännu.' };
  },
  buildApifyInput(): Record<string, unknown> {
    return {};
  },
  normalizeItem(): NormalizedScrapeResult {
    return {};
  },
  getExportColumns(): ExportColumn[] {
    return [];
  },
};