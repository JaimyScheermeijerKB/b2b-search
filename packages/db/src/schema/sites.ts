import {
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';

export const sites = pgTable(
  'sites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    domain: text('domain').notNull(), // bijv. example.com
    ingestKey: text('ingest_key').notNull(), // API key voor tracking ingest
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    sitesWorkspaceDomainIdx: uniqueIndex('sites_workspace_domain_idx').on(
      table.workspaceId,
      table.domain
    ),
    sitesIngestKeyIdx: uniqueIndex('sites_ingest_key_idx').on(table.ingestKey),
  })
);

export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;
