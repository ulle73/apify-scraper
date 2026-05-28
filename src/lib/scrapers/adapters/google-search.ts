import { ScraperAdapter, NormalizedScrapeResult, ExportColumn, ParsedInput } from '../types';

// TODO: Connect to apify/google-search-scraper
export const googleSearchAdapter: ScraperAdapter = {
  id: 'google-search',
  name: 'Google Sökresultat',
  description: 'Hämta organiska sökresultat från Google. (Kommer snart)',
  provider: 'apify',
  category: 'search',
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