import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { scrapeJobs, scrapeResults } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { JobDetailClient } from './job-detail-client';

export default async function JobDetailPage(context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/login');
  }

  const params = await context.params;
  const id = params?.id;
  const userId = session.user.id;

  if (!id) {
    redirect('/dashboard/jobs');
  }

  // 1. Fetch the job details
  const jobs = await db
    .select()
    .from(scrapeJobs)
    .where(and(eq(scrapeJobs.id, id), eq(scrapeJobs.user_id, userId as string)))
    .limit(1);

  if (jobs.length === 0) {
    redirect('/dashboard/jobs');
  }

  const job = jobs[0];

  // 2. Fetch results preview (up to 25 leads)
  const results = job.status === 'completed'
    ? await db
        .select({
          id: scrapeResults.id,
          company_name: scrapeResults.company_name,
          phone: scrapeResults.phone,
          website: scrapeResults.website,
          domain: scrapeResults.domain,
          category: scrapeResults.category,
          rating: scrapeResults.rating,
          review_count: scrapeResults.review_count,
        })
        .from(scrapeResults)
        .where(and(eq(scrapeResults.job_id, id), eq(scrapeResults.user_id, userId as string)))
        .limit(25)
    : [];

  // Serialize dates to strings for client component
  const serializedJob = {
    id: job.id,
    status: job.status,
    scraper_id: job.scraper_id,
    scraper_name: job.scraper_name,
    result_count: job.result_count,
    charged_credits: job.charged_credits,
    estimated_credits: job.estimated_credits,
    export_csv_url: job.export_csv_url,
    error_message: job.error_message,
    normalized_input_json: job.normalized_input_json as Record<string, unknown> | null,
    created_at: job.created_at?.toISOString() || '',
    started_at: job.started_at?.toISOString() || null,
    completed_at: job.completed_at?.toISOString() || null,
  };

  return (
    <JobDetailClient
      jobId={id}
      initialJob={serializedJob}
      initialResults={results}
    />
  );
}
export const dynamic = 'force-dynamic';
