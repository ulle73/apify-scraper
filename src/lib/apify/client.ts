import { ApifyClient } from 'apify-client';

const token = process.env.APIFY_API_TOKEN || '';

export const apifyClient = new ApifyClient({
  token: token,
});

export default apifyClient;
