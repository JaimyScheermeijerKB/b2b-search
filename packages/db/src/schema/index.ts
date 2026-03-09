import { relations } from 'drizzle-orm';
import { memberships } from './memberships';
import { sites } from './sites';
import { trackingEvents } from './tracking-events';
import { workspaces } from './workspaces';

export * from './workspaces';
export * from './memberships';
export * from './sites';
export * from './tracking-events';

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  memberships: many(memberships),
  sites: many(sites),
}));

export const sitesRelations = relations(sites, ({ one, many }) => ({
  workspace: one(workspaces),
  trackingEvents: many(trackingEvents),
}));

export const trackingEventsRelations = relations(trackingEvents, ({ one }) => ({
  site: one(sites),
}));
