import { ScraperAdapter, NormalizedScrapeResult, ExportColumn, ParsedInput } from '../types';

// TODO: Connect to apify/website-content-crawler
export const websiteCrawlerAdapter: ScraperAdapter = {
  id: 'website-crawler',
  name: 'Hemsideinnehåll',
  description: 'Crawla och extrahera text från hemsidor. (Kommer snart)',
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