import { createDbClient } from '@b2b/db';

const globalForDb = globalThis as unknown as { db: ReturnType<typeof createDbClient> };

export const db = globalForDb.db ?? createDbClient();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db;
}
