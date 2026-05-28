import { getAdapter } from '../scrapers/registry';

export function estimateJobCredits(scraperId: string, input: Record<string, unknown>): number {
  const adapter = getAdapter(scraperId);
  if (!adapter) {
    throw new Error(`Scraper med id "${scraperId}" hittades inte.`);
  }
  
  if (!adapter.enabled) {
    throw new Error(`Scraper med id "${scraperId}" är inte aktiverad.`);
  }

  return adapter.creditEstimate(input);
}
