import Papa from 'papaparse';
import { NormalizedScrapeResult, ExportColumn } from '../scrapers/types';

export function generateCSV(results: NormalizedScrapeResult[], columns: ExportColumn[]): string {
  const data = results.map(item => {
    const row: Record<string, unknown> = {};
    for (const col of columns) {
      const value = item[col.key as keyof NormalizedScrapeResult];
      
      if (value === undefined || value === null) {
        row[col.header] = '';
      } else if (typeof value === 'object') {
        row[col.header] = JSON.stringify(value);
      } else {
        row[col.header] = value;
      }
    }
    return row;
  });

  return Papa.unparse(data, {
    quotes: true,
    newline: '\r\n',
  });
}
