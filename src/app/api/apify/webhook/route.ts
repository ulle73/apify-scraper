import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scrapeJobs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventData } = body;
    
    // Apify webhook payload contains actor run details in eventData
    const runId = eventData?.actorRunId;
    
    if (!runId) {
      return NextResponse.json(
        { error: 'actorRunId saknas i webhook-payload.' },
        { status: 400 }
      );
    }

    console.log(`Apify Webhook: Run ${runId} har avslutats.`);

    // Find the corresponding job
    const jobs = await db
      .select()
      .from(scrapeJobs)
      .where(eq(scrapeJobs.apify_run_id, runId))
      .limit(1);

    if (jobs.length > 0) {
      const job = jobs[0];
      
      // If the job is queued or running, we can trigger processJob.
      // Since polling in process-job.ts is running, this webhook acts as a safety fallback.
      if (job.status === 'running' || job.status === 'queued') {
        const { processJob } = await import('@/lib/jobs/process-job');
        // Trigger processing asynchronously
        processJob(job.id).catch(err => {
          console.error('Error running processJob from webhook fallback:', err);
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Apify Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Kunde inte hantera webhook.' },
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic';
