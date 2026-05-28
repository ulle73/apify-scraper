// SuperScraper Unit Tests

import { getAdapter } from './scrapers/registry';
import { dedupeResults } from './jobs/dedup';
import { estimateJobCredits } from './pricing/estimate';
import { NormalizedScrapeResult } from './scrapers/types';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passedTests++;
    console.log(`✅ [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`❌ [FAIL] ${message}`);
  }
}

function runTests() {
  console.log('🧪 Kör SuperScraper testsvit...\n');

  // Test 1: Registry lookup
  try {
    const mapsAdapter = getAdapter('google-maps');
    assert(!!mapsAdapter, 'Hitta google-maps i scraperRegistry');
    assert(mapsAdapter?.id === 'google-maps', 'Hittad scraper har ID google-maps');
    assert(mapsAdapter?.enabled === true, 'Google Maps scraper är aktiverad');

    const searchAdapter = getAdapter('google-search');
    assert(!!searchAdapter, 'Hitta google-search i scraperRegistry');
    assert(searchAdapter?.enabled === false, 'Google Search scraper är avaktiverad');

    const invalidAdapter = getAdapter('invalid-id');
    assert(invalidAdapter === undefined, 'Sökning på okänt ID returnerar undefined');
  } catch (e: any) {
    console.error('Test 1 fel:', e);
    failedTests++;
  }

  // Test 2: Credit Estimation
  try {
    const input = { maxResults: 250 };
    const estimate = estimateJobCredits('google-maps', input);
    assert(estimate === 250, 'Credit-beräkning för 250 leads returnerar 250 credits');
  } catch (e: any) {
    console.error('Test 2 fel:', e);
    failedTests++;
  }

  // Test 3: Disabled Scraper validation
  try {
    const searchAdapter = getAdapter('google-search');
    const validation = searchAdapter?.validateInput({});
    assert(validation?.success === false, 'Avaktiverad scraper tillåter inte körning (validering failar)');
    assert(validation?.error === 'Denna scraper är inte aktiverad ännu.', 'Avaktiverad scraper returnerar rätt felmeddelande');
  } catch (e: any) {
    console.error('Test 3 fel:', e);
    failedTests++;
  }

  // Test 4: Deduplication Logic
  try {
    const mockResults: NormalizedScrapeResult[] = [
      { company_name: 'Bil AB', website: 'https://bil.se', domain: 'bil.se', phone: '123' },
      { company_name: 'Annat Företag AB', website: 'https://bil.se', domain: 'bil.se', phone: '456' }, // duplicate by domain
      { company_name: 'Tredje AB', website: 'https://tredje.se', domain: 'tredje.se', phone: '123' }, // duplicate by phone
      { company_name: 'Bil AB', address: 'Gatan 1', phone: '999' },
      { company_name: 'Bil AB', address: 'Gatan 1', phone: '888' }, // duplicate by company_name + address
      { company_name: 'Unikt AB', address: 'Gatan 2', phone: '777' }, // unique
    ];

    const deduped = dedupeResults(mockResults);
    assert(deduped.length === 3, `Deduplicering tog bort dubbletter korrekt (förväntade 3 unika, fick ${deduped.length})`);
    assert(deduped[0].company_name === 'Bil AB', 'Första unika lead behölls');
    assert(deduped[1].company_name === 'Bil AB' && deduped[1].address === 'Gatan 1', 'Fjärde lead (med unik telefon) behölls');
    assert(deduped[2].company_name === 'Unikt AB', 'Sjätte lead (helt unik) behölls');
  } catch (e: any) {
    console.error('Test 4 fel:', e);
    failedTests++;
  }

  // Test 5: Google Maps Normalization
  try {
    const mapsAdapter = getAdapter('google-maps');
    const rawGooglePlace = {
      title: 'Volvo Göteborg',
      website: 'https://volvo.se/goteborg',
      phone: '+46 31 123456',
      address: 'Väg 1, Göteborg',
      city: 'Göteborg',
      region: 'Västra Götaland',
      country: 'Sverige',
      categoryName: 'Bilförsäljare',
      totalScore: 4.8,
      reviewsCount: 15,
      url: 'https://maps.google.com/?cid=123',
    };

    const normalized = mapsAdapter?.normalizeItem(rawGooglePlace);
    assert(normalized?.company_name === 'Volvo Göteborg', 'Normalisering mappar title till company_name');
    assert(normalized?.website === 'https://volvo.se/goteborg', 'Normalisering mappar website');
    assert(normalized?.domain === 'volvo.se', 'Normalisering extraherar domän från webbadress');
    assert(normalized?.phone === '+46 31 123456', 'Normalisering behåller telefon');
    assert(normalized?.rating === 4.8, 'Normalisering mappar totalScore till rating');
    assert(normalized?.review_count === 15, 'Normalisering mappar reviewsCount till review_count');
    assert(normalized?.source === 'google-maps', 'Källa sätts till google-maps');
  } catch (e: any) {
    console.error('Test 5 fel:', e);
    failedTests++;
  }

  console.log(`\n📊 Sammanfattning: ${passedTests} passed, ${failedTests} failed.`);
  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Run if called directly
runTests();
