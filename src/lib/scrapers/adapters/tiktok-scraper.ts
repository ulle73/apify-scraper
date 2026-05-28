import { ScraperAdapter, NormalizedScrapeResult, ExportColumn, ParsedInput } from '../types';

// TODO: Connect to clockworks/tiktok-scraper
export const tiktokScraperAdapter: ScraperAdapter = {
  id: 'tiktok-scraper',
  name: 'TikTok Scraper',
  description: 'Hämta profildata och videor från TikTok. (Kommer snart)',
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