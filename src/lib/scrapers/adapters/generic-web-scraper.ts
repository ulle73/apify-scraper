import { ScraperAdapter, NormalizedScrapeResult, ExportColumn, ParsedInput } from '../types';

// TODO: Connect to apify/web-scraper
export const genericWebScraperAdapter: ScraperAdapter = {
  id: 'generic-web-scraper',
  name: 'Generell Webscraper',
  description: 'Flexibel scraper för anpassad datainsamling från webbsidor. (Kommer snart)',
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