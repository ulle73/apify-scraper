import { ScraperAdapter, ParsedInput, ExportColumn } from './types';
import { scrapersConfig, ScraperConfig } from './configs';

function genericValidateInput(config: ScraperConfig, input: Record<string, unknown>): { success: boolean; data?: ParsedInput; error?: string } {
  const data: Record<string, unknown> = {};
  for (const field of config.fields) {
    const val = input[field.name];
    if (field.required && (val === undefined || val === null || val === '')) {
      return { success: false, error: `Fältet "${field.label}" är obligatoriskt.` };
    }
    if (val !== undefined && val !== null && val !== '') {
      if (field.type === 'number') {
        const num = Number(val);
        if (isNaN(num)) {
          return { success: false, error: `Fältet "${field.label}" måste vara ett nummer.` };
        }
        if (field.min !== undefined && num < field.min) {
          return { success: false, error: `Fältet "${field.label}" måste vara minst ${field.min}.` };
        }
        if (field.max !== undefined && num > field.max) {
          return { success: false, error: `Fältet "${field.label}" får vara högst ${field.max}.` };
        }
        data[field.name] = num;
      } else if (field.type === 'checkbox') {
        data[field.name] = val === true || val === 'true';
      } else {
        data[field.name] = val;
      }
    } else {
      if (field.defaultValue !== undefined) {
        data[field.name] = field.defaultValue;
      }
    }
  }
  return { success: true, data: data as unknown as ParsedInput };
}

function genericCreditEstimate(config: ScraperConfig, input: Record<string, unknown>): number {
  const maxResultsField = config.fields.find(f => f.name === 'maxResults' || f.name === 'resultsLimit' || f.name === 'limit');
  const resultsCount = maxResultsField ? Number(input[maxResultsField.name]) || 100 : 100;
  const costPerResult = config.creditCostPerResult !== undefined ? config.creditCostPerResult : 1;
  const fixedCost = config.fixedCreditCost !== undefined ? config.fixedCreditCost : 0;
  return Math.ceil(resultsCount * costPerResult + fixedCost);
}

function genericExportColumns(): ExportColumn[] {
  return [
    { key: 'company_name', header: 'Företagsnamn' },
    { key: 'person_name', header: 'Kontaktperson/Profil' },
    { key: 'title', header: 'Titel/Inlägg' },
    { key: 'phone', header: 'Telefon' },
    { key: 'email', header: 'E-post' },
    { key: 'website', header: 'Hemsida' },
    { key: 'domain', header: 'Domän' },
    { key: 'address', header: 'Adress' },
    { key: 'city', header: 'Stad' },
    { key: 'region', header: 'Region' },
    { key: 'country', header: 'Land' },
    { key: 'category', header: 'Kategori' },
    { key: 'rating', header: 'Rating' },
    { key: 'review_count', header: 'Antal recensioner' },
    { key: 'source', header: 'Källa' },
    { key: 'source_url', header: 'Käll-URL' },
    { key: 'scraped_at', header: 'Hämtad datum' },
  ];
}

export const scraperRegistry: ScraperAdapter[] = scrapersConfig.map(config => {
  return {
    id: config.id,
    name: config.name,
    description: config.description,
    provider: 'apify',
    actorIdEnvKey: config.actorIdEnvKey || `APIFY_${config.id.replace(/-/g, '_').toUpperCase()}_ACTOR_ID`,
    category: config.category,
    enabled: config.enabled,
    icon: config.icon,
    fields: config.fields,
    creditEstimate(input) {
      return genericCreditEstimate(config, input);
    },
    validateInput(input) {
      return genericValidateInput(config, input);
    },
    buildApifyInput(input) {
      return config.buildApifyInput(input);
    },
    normalizeItem(item) {
      return config.normalizeItem(item);
    },
    getExportColumns() {
      if (config.getExportColumns) {
        return config.getExportColumns();
      }
      return genericExportColumns();
    },
    getMockData(maxResults) {
      if (config.getMockData) {
        return config.getMockData(maxResults);
      }
      return [];
    }
  };
});

export function getAdapter(scraperId: string): ScraperAdapter | undefined {
  return scraperRegistry.find(adapter => adapter.id === scraperId);
}

export function getEnabledAdapters(): ScraperAdapter[] {
  return scraperRegistry.filter(adapter => adapter.enabled);
}

export function getAllAdapters(): ScraperAdapter[] {
  return scraperRegistry;
}

export function getAdaptersByCategory(category: ScraperAdapter['category']): ScraperAdapter[] {
  return scraperRegistry.filter(adapter => adapter.category === category);
}
