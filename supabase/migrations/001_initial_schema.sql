-- Migration 001: Initial Schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Credit Balances Table
CREATE TABLE IF NOT EXISTS credit_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Credit Transactions Table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'purchase', 'usage', 'refund'
  reference_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Scrape Jobs Table
CREATE TABLE IF NOT EXISTS scrape_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scraper_id TEXT NOT NULL,
  scraper_name TEXT,
  provider TEXT,
  type TEXT NOT NULL DEFAULT 'scrape',
  status TEXT NOT NULL DEFAULT 'draft',
  input_json JSONB NOT NULL,
  normalized_input_json JSONB,
  estimated_credits INTEGER NOT NULL,
  charged_credits INTEGER NOT NULL DEFAULT 0,
  customer_price_sek INTEGER,
  stripe_session_id TEXT,
  apify_actor_id TEXT,
  apify_run_id TEXT,
  apify_dataset_id TEXT,
  result_count INTEGER NOT NULL DEFAULT 0,
  export_csv_url TEXT,
  export_xlsx_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Create Scrape Results Table
CREATE TABLE IF NOT EXISTS scrape_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES scrape_jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scraper_id TEXT,
  result_type TEXT,
  company_name TEXT,
  person_name TEXT,
  title TEXT,
  website TEXT,
  domain TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  region TEXT,
  country TEXT,
  category TEXT,
  rating NUMERIC,
  review_count INTEGER,
  source TEXT,
  source_url TEXT,
  normalized_json JSONB,
  raw_json JSONB,
  scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Create Exports Table
CREATE TABLE IF NOT EXISTS exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES scrape_jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  format TEXT NOT NULL, -- 'csv', 'xlsx'
  file_url TEXT NOT NULL,
  row_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Create Apify Run Logs Table
CREATE TABLE IF NOT EXISTS apify_run_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES scrape_jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  apify_run_id TEXT,
  status TEXT,
  message TEXT,
  raw_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_credit_balances_user_id ON credit_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_user_id ON scrape_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_scrape_jobs_status ON scrape_jobs(status);
CREATE INDEX IF NOT EXISTS idx_scrape_results_job_id ON scrape_results(job_id);
CREATE INDEX IF NOT EXISTS idx_scrape_results_user_id ON scrape_results(user_id);
CREATE INDEX IF NOT EXISTS idx_scrape_results_domain ON scrape_results(domain);
CREATE INDEX IF NOT EXISTS idx_scrape_results_phone ON scrape_results(phone);
CREATE INDEX IF NOT EXISTS idx_exports_job_id ON exports(job_id);
CREATE INDEX IF NOT EXISTS idx_exports_user_id ON exports(user_id);
CREATE INDEX IF NOT EXISTS idx_apify_run_logs_job_id ON apify_run_logs(job_id);
