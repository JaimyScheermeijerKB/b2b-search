import { db } from '@/lib/db';
import { eq, sites, trackingEvents } from '@b2b/db';
import { trackingEventSchema } from '@b2b/tracking';
import { NextRequest, NextResponse } from 'next/server';

// CORS: nodig voor cross-origin requests van tracking snippet op externe sites
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Ingest-Key',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function POST(request: NextRequest) {
  // Key via header (fetch) of query param (sendBeacon kan geen headers)
  const ingestKey =
    request.headers.get('x-ingest-key') ||
    new URL(request.url).searchParams.get('key');
  if (!ingestKey) {
    return NextResponse.json(
      { error: 'Missing X-Ingest-Key header or ?key= query param' },
      { status: 401 }
    );
  }

  const site = await db.query.sites.findFirst({
    where: eq(sites.ingestKey, ingestKey),
  });

  if (!site) {
    return NextResponse.json({ error: 'Invalid ingest key' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const parsed = trackingEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    null;
  const userAgent = request.headers.get('user-agent') || null;

  await db.insert(trackingEvents).values({
    siteId: site.id,
    path: parsed.data.path,
    referrer: parsed.data.referrer ?? '',
    title: parsed.data.title ?? '',
    utmSource: parsed.data.utm_source ?? null,
    utmMedium: parsed.data.utm_medium ?? null,
    utmCampaign: parsed.data.utm_campaign ?? null,
    utmTerm: parsed.data.utm_term ?? null,
    utmContent: parsed.data.utm_content ?? null,
    visitorId: parsed.data.visitor_id,
    sessionId: parsed.data.session_id,
    ip,
    userAgent,
  });

  return NextResponse.json({ ok: true }, {
    status: 202,
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
