import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import path from 'path';

// Laad .env uit monorepo root
config({ path: path.resolve(process.cwd(), '../../.env') });
config({ path: path.resolve(process.cwd(), '../../apps/web/.env') });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is niet gezet. Zet het in .env of apps/web/.env'
  );
}

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  driver: 'pg',
  dbCredentials: {
    connectionString: databaseUrl,
  },
});
