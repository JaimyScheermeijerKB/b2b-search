'use server';

import { db } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { eq, memberships, workspaces } from '@b2b/db';
import { revalidatePath } from 'next/cache';

export async function getOrCreateWorkspaceForUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const existing = await db.query.memberships.findFirst({
    where: eq(memberships.userId, user.id),
    with: { workspace: true } as const,
  });

  if (existing) {
    return existing.workspace;
  }

  const slug = `workspace-${user.id.slice(0, 8)}`;
  const [workspace] = await db
    .insert(workspaces)
    .values({
      name: 'Mijn werkruimte',
      slug,
    })
    .returning();

  if (!workspace) return null;

  await db.insert(memberships).values({
    userId: user.id,
    workspaceId: workspace.id,
    role: 'owner',
  });

  revalidatePath('/dashboard');
  return workspace;
}
