import { NormalizedScrapeResult } from '../scrapers/types';

export function dedupeResults(items: NormalizedScrapeResult[]): NormalizedScrapeResult[] {
  const seenDomains = new Set<string>();
  const seenPhones = new Set<string>();
  const seenNameAddresses = new Set<string>();

  const deduped: NormalizedScrapeResult[] = [];

  for (const item of items) {
    // Normalize phone number to digits only for comparison
    const phoneNormal = item.phone ? item.phone.replace(/\D/g, '') : '';
    const domainNormal = item.domain ? item.domain.toLowerCase().trim() : '';
    
    const companyName = item.company_name ? item.company_name.toLowerCase().trim() : '';
    const address = item.address ? item.address.toLowerCase().trim() : '';
    const nameAddressKey = companyName && address ? `${companyName}|${address}` : '';

    let isDuplicate = false;

    // 1. Deduplicate by domain if domain exists
    if (domainNormal && seenDomains.has(domainNormal)) {
      isDuplicate = true;
    }
    // 2. Deduplicate by phone if phone exists
    else if (phoneNormal && seenPhones.has(phoneNormal)) {
      isDuplicate = true;
    }
    // 3. Deduplicate by company name + address fallback
    else if (nameAddressKey && seenNameAddresses.has(nameAddressKey)) {
      isDuplicate = true;
    }

    if (!isDuplicate) {
      if (domainNormal) seenDomains.add(domainNormal);
      if (phoneNormal) seenPhones.add(phoneNormal);
      if (nameAddressKey) seenNameAddresses.add(nameAddressKey);
      deduped.push(item);
    }
  }

  return deduped;
}
