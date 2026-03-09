import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sites } from './sites';

export const trackingEvents = pgTable('tracking_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  siteId: uuid('site_id')
    .notNull()
    .references(() => sites.id, { onDelete: 'cascade' }),
  path: text('path').notNull(),
  referrer: text('referrer').default(''),
  title: text('title').default(''),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  utmTerm: text('utm_term'),
  utmContent: text('utm_content'),
  visitorId: text('visitor_id').notNull(),
  sessionId: text('session_id').notNull(),
  ip: text('ip'),
  userAgent: text('user_agent'),
  companyName: text('company_name'), // bijv. "Google LLC" via IPinfo
  companyDomain: text('company_domain'), // bijv. "google.com"
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type TrackingEvent = typeof trackingEvents.$inferSelect;
export type NewTrackingEvent = typeof trackingEvents.$inferInsert;
