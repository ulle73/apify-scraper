import { auth } from '@/lib/auth';
import { createJob } from '@/lib/jobs/create-job';
import { inngest } from '@/inngest/client';
import { NextResponse } from 'next/server';

export const POST = auth(async (req) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return NextResponse.json(
      { error: 'Du måste vara inloggad för att utföra denna åtgärd.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { scraperId, input } = body;
    const userId = req.auth.user.id;

    if (!scraperId || !input) {
      return NextResponse.json(
        { error: 'Både "scraperId" och "input" krävs.' },
        { status: 400 }
      );
    }

    // 1. Create the job in DB and deduct credits
    const jobId = await createJob(userId, scraperId, input);

    // 2. Dispatch background scraping process via Inngest
    let inngestOk = false;
    try {
      await inngest.send({
        name: 'scraper/job.created',
        data: {
          jobId,
          userId,
        },
      });
      inngestOk = true;
    } catch (inngestError) {
      console.warn('[Inngest] Kunde inte skicka event (är Inngest Dev Server igång?). Kör jobbet direkt:', inngestError);
    }

    // Inline fallback: kör jobbet synkront om Inngest inte är tillgänglig
    // OBS: Detta blockerar svaret tills jobbet är klart – perfekt för dev
    if (!inngestOk) {
      const { processJob } = await import('@/lib/jobs/process-job');
      await processJob(jobId);
    }

    return NextResponse.json({ jobId });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Kunde inte starta jobbet.' },
      { status: 400 }
    );
  }
});
