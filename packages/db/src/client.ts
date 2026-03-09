import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// postgres.js met prepare: false voor Supabase connection pooler compatibility
export function createDbClient(connectionUrl?: string) {
  const url = connectionUrl ?? connectionString;
  const client = postgres(url, {
    prepare: false,
    max: 1,
    connect_timeout: 10,
  });
  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDbClient>;
