import { db } from '../db';
import { scrapeJobs, creditBalances, creditTransactions } from '../db/schema';
import { getAdapter } from '../scrapers/registry';
import { eq } from 'drizzle-orm';

export async function createJob(
  userId: string,
  scraperId: string,
  input: Record<string, unknown>
): Promise<string> {
  const adapter = getAdapter(scraperId);
  
  if (!adapter) {
    throw new Error(`Ogiltig scraper: ${scraperId}`);
  }
  
  if (!adapter.enabled) {
    throw new Error(`Denna scraper är inte aktiverad: ${adapter.name}`);
  }

  // 1. Validate Input
  const validation = adapter.validateInput(input);
  if (!validation.success) {
    throw new Error(validation.error || 'Valideringsfel i indata.');
  }

  const validatedInput = validation.data || input;
  const estimatedCredits = adapter.creditEstimate(validatedInput);

  // 2. Perform database transaction to deduct credits and create job
  const jobId = await db.transaction(async (tx) => {
    // Get user credit balance
    const balances = await tx
      .select()
      .from(creditBalances)
      .where(eq(creditBalances.user_id, userId))
      .limit(1);

    let userBalance = 0;
    if (balances.length === 0) {
      // Create a balance record if it missing for some reason
      await tx.insert(creditBalances).values({
        user_id: userId,
        credits: 0,
      });
    } else {
      userBalance = balances[0].credits;
    }

    if (userBalance < estimatedCredits) {
      throw new Error(
        `Otillräckliga credits. Jobbet kräver ${estimatedCredits} credits, men du har bara ${userBalance}.`
      );
    }

    // Deduct credits
    await tx
      .update(creditBalances)
      .set({
        credits: userBalance - estimatedCredits,
        updated_at: new Date(),
      })
      .where(eq(creditBalances.user_id, userId));

    // Create job record
    const actorIdKey = adapter.actorIdEnvKey || '';
    const actorId = actorIdKey ? process.env[actorIdKey] || '' : '';

    const newJobs = await tx
      .insert(scrapeJobs)
      .values({
        user_id: userId,
        scraper_id: scraperId,
        scraper_name: adapter.name,
        provider: adapter.provider,
        status: 'queued',
        input_json: input,
        normalized_input_json: validatedInput,
        estimated_credits: estimatedCredits,
        charged_credits: estimatedCredits,
        apify_actor_id: actorId || null,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    const job = newJobs[0];

    // Log the transaction with reference to the job
    await tx.insert(creditTransactions).values({
      user_id: userId,
      amount: -estimatedCredits,
      type: 'usage',
      reference_id: job.id,
      metadata: {
        scraper_id: scraperId,
        maxResults: validatedInput.maxResults,
      },
    });

    return job.id;
  });

  return jobId;
}
