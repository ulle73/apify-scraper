import { ScraperAdapter, NormalizedScrapeResult, ExportColumn, ParsedInput } from '../types';

// TODO: Connect to bernardo/youtube-scraper
export const youtubeScraperAdapter: ScraperAdapter = {
  id: 'youtube-scraper',
  name: 'YouTube Scraper',
  description: 'Hämta kanaldata och videoinformation från YouTube. (Kommer snart)',
  provider: 'apify',
  category: 'content',
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