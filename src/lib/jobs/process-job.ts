import { db } from '../db';
import { scrapeJobs, scrapeResults, creditBalances, creditTransactions, exports } from '../db/schema';
import { getAdapter } from '../scrapers/registry';
import { getMockLeads } from '../mock/leads';
import { dedupeResults } from './dedup';
import { generateCSV } from '../exports/csv';
import { eq } from 'drizzle-orm';
import { startActorRun } from '../apify/start-run';
import { fetchDatasetItems } from '../apify/fetch-dataset';
import apifyClient from '../apify/client';
import { NormalizedScrapeResult } from '../scrapers/types';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function processJob(jobId: string): Promise<void> {
  const jobList = await db.select().from(scrapeJobs).where(eq(scrapeJobs.id, jobId)).limit(1);
  if (jobList.length === 0) {
    console.error(`processJob: Jobb ${jobId} hittades inte.`);
    return;
  }

  const job = jobList[0];
  if (job.status !== 'queued') {
    console.warn(`processJob: Jobb ${jobId} har status ${job.status}, förväntade 'queued'. Avbryter.`);
    return;
  }

  const adapter = getAdapter(job.scraper_id);
  if (!adapter) {
    await failJob(jobId, job.user_id, job.estimated_credits, `Scraper "${job.scraper_id}" hittades inte.`);
    return;
  }

  try {
    // 1. Update job to running
    await db
      .update(scrapeJobs)
      .set({
        status: 'running',
        started_at: new Date(),
        updated_at: new Date(),
      })
      .where(eq(scrapeJobs.id, jobId));

    let rawItems: Record<string, unknown>[] = [];
    const isMock = process.env.MOCK_APIFY === 'true';

    if (isMock) {
      console.log(`processJob: Kör jobb ${jobId} i MOCK MODE.`);
      // Simulate network request
      await sleep(3000);
      
      const input = job.input_json as Record<string, unknown>;
      const maxResults = typeof input.maxResults === 'number' ? input.maxResults : 100;
      rawItems = getMockLeads(maxResults);
    } else {
      console.log(`processJob: Startar real Apify actor för jobb ${jobId}`);
      if (!job.apify_actor_id) {
        throw new Error('Apify actor ID saknas på jobbrekordet.');
      }

      // Build input using adapter
      const apifyInput = adapter.buildApifyInput(job.normalized_input_json as Record<string, unknown>);
      
      // Start run
      const run = await startActorRun(job.apify_actor_id, apifyInput);
      
      // Save run details to db
      await db
        .update(scrapeJobs)
        .set({
          apify_run_id: run.id,
          apify_dataset_id: run.defaultDatasetId,
          updated_at: new Date(),
        })
        .where(eq(scrapeJobs.id, jobId));

      // Poll run status
      console.log(`processJob: Väntar på Apify run ${run.id} att slutföras...`);
      let runStatus = run.status;
      let datasetId = run.defaultDatasetId;
      const startTime = Date.now();
      const timeoutMs = 10 * 60 * 1000; // 10 minutes timeout

      while (
        runStatus === 'RUNNING' ||
        runStatus === 'READY' ||
        runStatus === 'RUNNING-WEBHOOK'
      ) {
        if (Date.now() - startTime > timeoutMs) {
          throw new Error('Apify-körningen tog för lång tid (timeout 10 minuter).');
        }

        await sleep(10000); // Poll every 10s
        const updatedRun = await apifyClient.run(run.id).get();
        if (updatedRun) {
          runStatus = updatedRun.status;
          datasetId = updatedRun.defaultDatasetId;
        } else {
          throw new Error('Misslyckades att hämta körningsstatus från Apify.');
        }
      }

      if (runStatus !== 'SUCCEEDED') {
        throw new Error(`Apify-körningen misslyckades med status: ${runStatus}`);
      }

      // Fetch dataset results
      console.log(`processJob: Hämtar resultat från dataset ${datasetId}...`);
      rawItems = await fetchDatasetItems(datasetId);
    }

    // 2. Normalize results
    console.log(`processJob: Normaliserar ${rawItems.length} resultat...`);
    const normalizedResults = rawItems.map(item => adapter.normalizeItem(item));

    // 3. Deduplicate results
    const dedupedResults = dedupeResults(normalizedResults);
    console.log(`processJob: Deduplicering klar. Från ${normalizedResults.length} till ${dedupedResults.length} unika leads.`);

    // 4. Save results to DB
    if (dedupedResults.length > 0) {
      const dbInsertResults = dedupedResults.map(item => ({
        job_id: jobId,
        user_id: job.user_id,
        scraper_id: job.scraper_id,
        result_type: 'lead',
        company_name: item.company_name || null,
        person_name: item.person_name || null,
        title: item.title || null,
        website: item.website || null,
        domain: item.domain || null,
        phone: item.phone || null,
        email: item.email || null,
        address: item.address || null,
        city: item.city || null,
        region: item.region || null,
        country: item.country || null,
        category: item.category || null,
        rating: item.rating ? item.rating.toString() : null,
        review_count: item.review_count || 0,
        source: item.source || null,
        source_url: item.source_url || null,
        normalized_json: item.normalized_json || null,
        raw_json: item.raw_json || null,
        scraped_at: item.scraped_at ? new Date(item.scraped_at) : new Date(),
        created_at: new Date(),
      }));

      // Insert results in chunks of 100 to prevent query size limit issues
      const chunkSize = 100;
      for (let i = 0; i < dbInsertResults.length; i += chunkSize) {
        const chunk = dbInsertResults.slice(i, i + chunkSize);
        await db.insert(scrapeResults).values(chunk);
      }
    }

    // 5. Generate CSV export and save CSV content (mocking S3/Supabase Storage using download stream route)
    const columns = adapter.getExportColumns();
    const csvContent = generateCSV(dedupedResults, columns);

    // Save CSV to an export URL (we will stream the file directly from database scrape_results in our download route,
    // so we can set export_csv_url pointing to our download API endpoint)
    const exportCsvUrl = `/api/jobs/${jobId}/download?format=csv`;

    // 6. Complete job
    await db
      .update(scrapeJobs)
      .set({
        status: 'completed',
        result_count: dedupedResults.length,
        export_csv_url: exportCsvUrl,
        completed_at: new Date(),
        updated_at: new Date(),
      })
      .where(eq(scrapeJobs.id, jobId));

    // 7. Add export row
    await db.insert(exports).values({
      job_id: jobId,
      user_id: job.user_id,
      format: 'csv',
      file_url: exportCsvUrl,
      row_count: dedupedResults.length,
      created_at: new Date(),
    });

    console.log(`processJob: Jobb ${jobId} slutfördes framgångsrikt.`);

  } catch (error: any) {
    console.error(`processJob error on job ${jobId}:`, error);
    const errorMsg = error.message || 'Okänt fel inträffade vid datainsamling.';
    await failJob(jobId, job.user_id, job.estimated_credits, errorMsg);
  }
}

async function failJob(
  jobId: string,
  userId: string,
  creditsToRefund: number,
  errorMessage: string
): Promise<void> {
  // Update status to failed
  await db
    .update(scrapeJobs)
    .set({
      status: 'failed',
      error_message: errorMessage,
      completed_at: new Date(),
      updated_at: new Date(),
    })
      .where(eq(scrapeJobs.id, jobId));

  // Refund credits
  if (creditsToRefund > 0) {
    const balances = await db
      .select()
      .from(creditBalances)
      .where(eq(creditBalances.user_id, userId))
      .limit(1);

    const currentCredits = balances[0]?.credits ?? 0;
    
    await db
      .update(creditBalances)
      .set({
        credits: currentCredits + creditsToRefund,
        updated_at: new Date(),
      })
      .where(eq(creditBalances.user_id, userId));

    await db.insert(creditTransactions).values({
      user_id: userId,
      amount: creditsToRefund,
      type: 'refund',
      reference_id: jobId,
      metadata: {
        reason: 'Job failed, credits refunded',
        error: errorMessage,
      },
    });
  }

  console.log(`processJob: Jobb ${jobId} markerat som misslyckat. ${creditsToRefund} credits återbetalda.`);
}
