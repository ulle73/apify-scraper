import { ScraperAdapter, NormalizedScrapeResult, ExportColumn, ParsedInput } from '../types';

// TODO: Connect to LinkedIn scraping is restricted
export const linkedinCompanyAdapter: ScraperAdapter = {
  id: 'linkedin-company',
  name: 'LinkedIn Företag',
  description: 'Hämta företagsinformation från LinkedIn. (Begränsad åtkomst) (Kommer snart)',
  provider: 'apify',
  category: 'leads',
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