import { apifyClient } from './client';

export async function fetchDatasetItems(
  datasetId: string,
  limit?: number,
  offset?: number
): Promise<Record<string, unknown>[]> {
  if (!process.env.APIFY_API_TOKEN) {
    throw new Error('APIFY_API_TOKEN saknas i miljövariablerna.');
  }

  const response = await apifyClient.dataset(datasetId).listItems({
    limit,
    offset,
  });

  return response.items as unknown as Record<string, unknown>[];
}
