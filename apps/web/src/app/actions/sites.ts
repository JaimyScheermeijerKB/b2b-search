'use server';

import { db } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { eq, memberships, sites } from '@b2b/db';
import { revalidatePath } from 'next/cache';

function generateIngestKey(): string {
  return `b2b_${crypto.randomUUID().replace(/-/g, '')}`;
}

export async function createSite(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Niet ingelogd' };

  const membership = await db.query.memberships.findFirst({
    where: eq(memberships.userId, user.id),
    with: { workspace: true },
  });

  if (!membership?.workspace) {
    return { error: 'Geen workspace gevonden' };
  }

  const name = formData.get('name') as string;
  const domain = formData.get('domain') as string;

  if (!name?.trim() || !domain?.trim()) {
    return { error: 'Naam en domein zijn verplicht' };
  }

  const normalizedDomain = domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .trim();

  const ingestKey = generateIngestKey();

  try {
    await db.insert(sites).values({
      workspaceId: membership.workspace.id,
      name: name.trim(),
      domain: normalizedDomain,
      ingestKey,
    });
  } catch (err) {
    return { error: 'Site bestaat al voor dit domein' };
  }

  revalidatePath('/dashboard/sites');
  return { success: true, ingestKey };
}
