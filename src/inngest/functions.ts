import { inngest } from './client';
import { processJob } from '@/lib/jobs/process-job';

export const processScrapeJob = inngest.createFunction(
  { id: 'process-scrape-job', name: 'Process Scrape Job', triggers: [{ event: 'scraper/job.created' }] },
  async ({ event, step }) => {
    const { jobId } = event.data;

    await step.run('run-scraping-logic', async () => {
      await processJob(jobId);
      return { success: true };
    });
  }
);
export default [processScrapeJob];
