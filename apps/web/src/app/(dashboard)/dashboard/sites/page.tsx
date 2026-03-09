import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createSite } from '@/app/actions/sites';
import { db } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { eq, memberships, sites } from '@b2b/db';
import { AddSiteForm } from './add-site-form';
import { headers } from 'next/headers';
import { SiteSnippet } from './site-snippet';

export default async function SitesPage() {
  // NEXT_PUBLIC_APP_URL = deployed URL (verplicht voor tracking op externe sites!)
  // Zonder dit: localhost werkt alleen als BEIDE app en site lokaal draaien
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userSites: { id: string; name: string; domain: string; ingestKey: string }[] = [];

  if (user) {
    const membership = await db.query.memberships.findFirst({
      where: eq(memberships.userId, user.id),
      with: { workspace: true },
    });

    if (membership?.workspace) {
      const siteList = await db.query.sites.findMany({
        where: eq(sites.workspaceId, membership.workspace.id),
      });
      userSites = siteList.map((s) => ({
        id: s.id,
        name: s.name,
        domain: s.domain,
        ingestKey: s.ingestKey,
      }));
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Sites</h1>
        <p className="text-muted-foreground">
          Beheer de websites die je wilt tracken.
        </p>
      </div>

      <AddSiteForm createSite={createSite} />

      <Card>
        <CardHeader>
          <CardTitle>Je sites</CardTitle>
          <CardDescription>
            Installeer de tracking snippet op je website om bezoekers te
            verzamelen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userSites.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nog geen sites. Voeg hierboven een site toe om te beginnen.
            </div>
          ) : (
            <div className="space-y-4">
              {userSites.map((site) => (
                <SiteSnippet
                  key={site.id}
                  site={site}
                  baseUrl={baseUrl}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
