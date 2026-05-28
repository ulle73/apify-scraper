import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { scrapeResults, scrapeJobs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const GET = auth(async (req, context) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json(
      { error: 'Du måste vara inloggad för att hämta resultat.' },
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = (page - 1) * limit;

    // Fetch paginated results
    const results = await db
      .select()
      .from(scrapeResults)
      .where(and(eq(scrapeResults.job_id, id), eq(scrapeResults.user_id, userId)))
      .limit(limit)
      .offset(offset);

    // Fetch total result count from the job record
    const jobList = await db
      .select({ result_count: scrapeJobs.result_count })
      .from(scrapeJobs)
      .where(and(eq(scrapeJobs.id, id), eq(scrapeJobs.user_id, userId)))
      .limit(1);

    const totalCount = jobList[0]?.result_count ?? 0;

    return NextResponse.json({
      results,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Kunde inte hämta resultat.' },
      { status: 500 }
    );
  }
});
