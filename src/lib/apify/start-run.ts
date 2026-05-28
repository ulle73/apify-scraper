import { apifyClient } from './client';

interface ApifyRunResult {
  id: string;
  actId: string;
  status: string;
  defaultDatasetId: string;
  defaultKeyValueStoreId: string;
  [key: string]: unknown;
}

export async function startActorRun(
  actorId: string,
  input: Record<string, unknown>,
  webhookUrl?: string
): Promise<ApifyRunResult> {
  if (!process.env.APIFY_API_TOKEN) {
    throw new Error('APIFY_API_TOKEN saknas i miljövariablerna.');
  }

  const run = await apifyClient.actor(actorId).start(input, {
    webhooks: webhookUrl ? [
      {
        eventTypes: [
          'ACTOR.RUN.SUCCEEDED',
          'ACTOR.RUN.FAILED',
          'ACTOR.RUN.TIMED_OUT',
          'ACTOR.RUN.ABORTED',
        ],
        requestUrl: webhookUrl,
      },
    ] : undefined,
  });

  return run as unknown as ApifyRunResult;
}
