import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Provide a fallback schema to prevent Next.js static build from failing if DATABASE_URL is not set yet
const databaseUrl = process.env.DATABASE_URL || 'postgres://placeholder_user:placeholder_pass@localhost:5432/placeholder_db';
const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
export * from './schema';
