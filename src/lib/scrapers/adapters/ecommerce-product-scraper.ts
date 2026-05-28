import { ScraperAdapter, NormalizedScrapeResult, ExportColumn, ParsedInput } from '../types';

// TODO: Connect to relevant Apify actor
export const ecommerceProductScraperAdapter: ScraperAdapter = {
  id: 'ecommerce-product-scraper',
  name: 'E-handelsproduktdata',
  description: 'Hämta produktdata från e-handelsplatser. (Kommer snart)',
  provider: 'apify',
  category: 'ecommerce',
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