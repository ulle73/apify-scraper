import { ScraperAdapter, NormalizedScrapeResult, ExportColumn, ParsedInput } from '../types';

// TODO: Connect to relevant news scraping actor
export const newsScraperAdapter: ScraperAdapter = {
  id: 'news-scraper',
  name: 'Nyhetsscraper',
  description: 'Hämta nyhetsartiklar och pressmeddelanden. (Kommer snart)',
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