import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { scrapeJobs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
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

    return NextResponse.json(jobs[0]);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Kunde inte hämta jobbet.' },
      { status: 500 }
    );
  }
});
