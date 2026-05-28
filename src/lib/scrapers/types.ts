export type ScraperFieldType = 'text' | 'number' | 'select' | 'checkbox' | 'textarea';

export interface ScraperFieldOption {
  value: string;
  label: string;
}

export interface ScraperField {
  name: string;
  label: string;
  type: ScraperFieldType;
  required: boolean;
  placeholder?: string;
  description?: string;
  min?: number;
  max?: number;
  defaultValue?: string | number | boolean;
  options?: ScraperFieldOption[];
}

export interface ExportColumn {
  key: string;
  header: string;
}

export interface NormalizedScrapeResult {
  company_name?: string;
  person_name?: string;
  title?: string;
  website?: string;
  domain?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  category?: string;
  rating?: number;
  review_count?: number;
  source?: string;
  source_url?: string;
  scraped_at?: string;
  normalized_json?: Record<string, unknown>;
  raw_json?: Record<string, unknown>;
}

export interface ParsedInput {
  [key: string]: unknown;
}

export interface ScraperAdapter {
  id: string;
  name: string;
  description: string;
  provider: 'apify' | 'custom';
  actorIdEnvKey?: string;
  category: 'leads' | 'search' | 'social' | 'content' | 'ecommerce';
  enabled: boolean;
  icon?: string;
  fields: ScraperField[];
  creditEstimate(input: Record<string, unknown>): number;
  validateInput(input: Record<string, unknown>): { success: boolean; data?: ParsedInput; error?: string };
  buildApifyInput(input: ParsedInput): Record<string, unknown>;
  normalizeItem(item: Record<string, unknown>): NormalizedScrapeResult;
  getExportColumns(): ExportColumn[];
}
