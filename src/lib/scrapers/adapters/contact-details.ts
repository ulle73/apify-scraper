import { ScraperAdapter, NormalizedScrapeResult, ExportColumn, ParsedInput } from '../types';

// TODO: Connect to lukaskrivka/contact-info-scraper
export const contactDetailsAdapter: ScraperAdapter = {
  id: 'contact-details',
  name: 'Kontaktuppgifter från hemsida',
  description: 'Extrahera e-post, telefon och sociala medier från hemsidor. (Kommer snart)',
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