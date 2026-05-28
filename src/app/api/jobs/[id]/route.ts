import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { scrapeJobs, scrapeResults } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const GET = auth(async (req, context) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json(
      { error: 'Du måste vara inloggad för att hämta jobbinformation.' },
      { status: 401 }
    );
  }

  try {
    const params = await context.params;
    const id = params?.id;
    const userId = req.auth.user.id;

    if (!id) {
      return NextResponse.json({ error: 'Jobb-ID saknas.' }, { status: 400 });
    }

    const jobs = await db
      .select()
      .from(scrapeJobs)
      .where(and(eq(scrapeJobs.id, id), eq(scrapeJobs.user_id, userId)))
      .limit(1);

    if (jobs.length === 0) {
      return NextResponse.json({ error: 'Jobbet hittades inte.' }, { status: 404 });
    }

    const job = jobs[0];

    // Include results preview if the job is completed
    let results: any[] = [];
    if (job.status === 'completed') {
      results = await db
        .select({
          id: scrapeResults.id,
          company_name: scrapeResults.company_name,
          phone: scrapeResults.phone,
          website: scrapeResults.website,
          domain: scrapeResults.domain,
          category: scrapeResults.category,
          rating: scrapeResults.rating,
          review_count: scrapeResults.review_count,
          email: scrapeResults.email,
          address: scrapeResults.address,
          source: scrapeResults.source,
          scraped_at: scrapeResults.scraped_at,
        })
        .from(scrapeResults)
        .where(eq(scrapeResults.job_id, id))
        .orderBy(desc(scrapeResults.created_at))
        .limit(20);
    }

    return NextResponse.json({ job, results });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Kunde inte hämta jobbet.' },
      { status: 500 }
    );
  }
});
