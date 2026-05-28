import { pgTable, uuid, text, integer, numeric, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  full_name: text('full_name'),
  company_name: text('company_name'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Credit Balances Table
export const creditBalances = pgTable('credit_balances', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  credits: integer('credits').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Credit Transactions Table
export const creditTransactions = pgTable('credit_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  amount: integer('amount').notNull(), // Positive for purchase, negative for usage, positive for refund
  type: text('type').notNull(), // 'purchase' | 'usage' | 'refund'
  reference_id: text('reference_id'), // Stripe session ID or Job ID
  metadata: jsonb('metadata'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// 4. Scrape Jobs Table
export const scrapeJobs = pgTable('scrape_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  scraper_id: text('scraper_id').notNull(),
  scraper_name: text('scraper_name'),
  provider: text('provider'),
  type: text('type').notNull().default('scrape'),
  status: text('status').notNull().default('draft'), // draft, pending_payment, paid, queued, running, fetching_results, processing_results, completed, failed, cancelled
  input_json: jsonb('input_json').notNull(),
  normalized_input_json: jsonb('normalized_input_json'),
  estimated_credits: integer('estimated_credits').notNull(),
  charged_credits: integer('charged_credits').default(0).notNull(),
  customer_price_sek: integer('customer_price_sek'),
  stripe_session_id: text('stripe_session_id'),
  apify_actor_id: text('apify_actor_id'),
  apify_run_id: text('apify_run_id'),
  apify_dataset_id: text('apify_dataset_id'),
  result_count: integer('result_count').default(0).notNull(),
  export_csv_url: text('export_csv_url'),
  export_xlsx_url: text('export_xlsx_url'),
  error_message: text('error_message'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  started_at: timestamp('started_at'),
  completed_at: timestamp('completed_at'),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// 5. Scrape Results Table
export const scrapeResults = pgTable('scrape_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  job_id: uuid('job_id').references(() => scrapeJobs.id, { onDelete: 'cascade' }).notNull(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  scraper_id: text('scraper_id'),
  result_type: text('result_type'),
  company_name: text('company_name'),
  person_name: text('person_name'),
  title: text('title'),
  website: text('website'),
  domain: text('domain'),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  city: text('city'),
  region: text('region'),
  country: text('country'),
  category: text('category'),
  rating: numeric('rating'),
  review_count: integer('review_count'),
  source: text('source'),
  source_url: text('source_url'),
  normalized_json: jsonb('normalized_json'),
  raw_json: jsonb('raw_json'),
  scraped_at: timestamp('scraped_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// 6. Exports Table
export const exports = pgTable('exports', {
  id: uuid('id').primaryKey().defaultRandom(),
  job_id: uuid('job_id').references(() => scrapeJobs.id, { onDelete: 'cascade' }).notNull(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  format: text('format').notNull(), // 'csv' | 'xlsx'
  file_url: text('file_url').notNull(),
  row_count: integer('row_count'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// 7. Apify Run Logs Table
export const apifyRunLogs = pgTable('apify_run_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  job_id: uuid('job_id').references(() => scrapeJobs.id, { onDelete: 'cascade' }).notNull(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  apify_run_id: text('apify_run_id'),
  status: text('status'),
  message: text('message'),
  raw_json: jsonb('raw_json'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations definitions for Drizzle ORM queries
export const usersRelations = relations(users, ({ one, many }) => ({
  creditBalance: one(creditBalances, {
    fields: [users.id],
    references: [creditBalances.user_id],
  }),
  transactions: many(creditTransactions),
  jobs: many(scrapeJobs),
}));

export const scrapeJobsRelations = relations(scrapeJobs, ({ one, many }) => ({
  user: one(users, {
    fields: [scrapeJobs.user_id],
    references: [users.id],
  }),
  results: many(scrapeResults),
  exports: many(exports),
  logs: many(apifyRunLogs),
}));

export const scrapeResultsRelations = relations(scrapeResults, ({ one }) => ({
  job: one(scrapeJobs, {
    fields: [scrapeResults.job_id],
    references: [scrapeJobs.id],
  }),
}));
