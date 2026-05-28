import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { scrapeResults, scrapeJobs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getAdapter } from '@/lib/scrapers/registry';
import { generateCSV } from '@/lib/exports/csv';

export const GET = auth(async (req, context) => {
  if (!req.auth || !req.auth.user || !req.auth.user.id) {
    return new NextResponse('Du måste vara inloggad för att ladda ner exporter.', {
      status: 401,
    });
  }

  try {
    const params = await context.params;
    const id = params?.id;
    const userId = req.auth.user.id;

    if (!id) {
      return new NextResponse('Jobb-ID saknas.', { status: 400 });
    }

    // Fetch the job
    const jobs = await db
      .select()
      .from(scrapeJobs)
      .where(and(eq(scrapeJobs.id, id), eq(scrapeJobs.user_id, userId)))
      .limit(1);

    if (jobs.length === 0) {
      return new NextResponse('Jobbet hittades inte.', { status: 404 });
    }

    const job = jobs[0];
    const adapter = getAdapter(job.scraper_id);
    if (!adapter) {
      return new NextResponse('Scraper-adapter hittades inte.', { status: 500 });
    }

    // Fetch all results for this job
    const results = await db
      .select()
      .from(scrapeResults)
      .where(and(eq(scrapeResults.job_id, id), eq(scrapeResults.user_id, userId)));

    // Map database rows to NormalizedScrapeResult type
    const normalized = results.map(r => ({
      company_name: r.company_name || undefined,
      person_name: r.person_name || undefined,
      title: r.title || undefined,
      website: r.website || undefined,
      domain: r.domain || undefined,
      phone: r.phone || undefined,
      email: r.email || undefined,
      address: r.address || undefined,
      city: r.city || undefined,
      region: r.region || undefined,
      country: r.country || undefined,
      category: r.category || undefined,
      rating: r.rating ? parseFloat(r.rating.toString()) : undefined,
      review_count: r.review_count !== null ? r.review_count : undefined,
      source: r.source || undefined,
      source_url: r.source_url || undefined,
      scraped_at: r.scraped_at ? r.scraped_at.toISOString() : undefined,
    }));

    const columns = adapter.getExportColumns();
    const csvContent = generateCSV(normalized, columns);

    // Format filename (clean up query/scraper details)
    const sanitizedSearch = String(job.normalized_input_json && (job.normalized_input_json as any).searchTerm || 'export')
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    const filename = `superscraper_${job.scraper_id}_${sanitizedSearch}_${id.substring(0, 8)}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    return new NextResponse(error.message || 'Kunde inte generera exportfilen.', {
      status: 500,
    });
  }
});
