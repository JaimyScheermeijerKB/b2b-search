import { z } from 'zod';

export const trackingEventSchema = z.object({
  path: z.string(),
  referrer: z.string().optional().default(''),
  title: z.string().optional().default(''),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  visitor_id: z.string(),
  session_id: z.string(),
});

export type TrackingEventPayload = z.infer<typeof trackingEventSchema>;
