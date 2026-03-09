import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart3, Building2, Eye, TrendingUp, Users } from 'lucide-react';
import { db } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  inArray,
  memberships,
  sites,
  sql,
  trackingEvents,
} from '@b2b/db';
import { Suspense } from 'react';
import { DashboardFilters } from './dashboard-filters';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ site?: string; range?: string }>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const siteFilter = params.site ?? '';
  const rangeFilter = params.range ?? 'today';
  let user: { id: string } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.error('Dashboard auth error:', err);
  }

  let userSites: { id: string; name: string }[] = [];
  let stats = {
    eventsToday: 0,
    totalEvents: 0,
    uniqueSessions: 0,
    uniqueVisitors: 0,
    topPaths: [] as { path: string; count: number }[],
  };
  let recentEvents: {
    path: string;
    createdAt: Date;
    siteName: string;
    visitorId: string;
  }[] = [];

  if (user) {
    try {
      const membership = await db.query.memberships.findFirst({
        where: eq(memberships.userId, user.id),
        with: { workspace: true },
      });

      if (membership?.workspace) {
        userSites = await db.query.sites.findMany({
          where: eq(sites.workspaceId, membership.workspace.id),
          columns: { id: true, name: true },
        });
        let siteIds = userSites.map((s) => s.id);
        if (siteFilter && userSites.some((s) => s.id === siteFilter)) {
          siteIds = [siteFilter];
        }
        const siteNames = Object.fromEntries(
          userSites.map((s) => [s.id, s.name])
        );

        // Datumbereik
        const now = new Date();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        let fromDate: Date;
        if (rangeFilter === '7d') {
          fromDate = new Date(now);
          fromDate.setDate(fromDate.getDate() - 7);
        } else if (rangeFilter === '30d') {
          fromDate = new Date(now);
          fromDate.setDate(fromDate.getDate() - 30);
        } else {
          fromDate = today;
        }

        if (siteIds.length > 0) {
          const dateCondition = gte(trackingEvents.createdAt, fromDate);
          const siteCondition = inArray(trackingEvents.siteId, siteIds);
          const whereClause = and(siteCondition, dateCondition);

          // Echte counts via SQL (gefilterd op site + datum)
          const [totalResult] = await db
            .select({ value: count() })
            .from(trackingEvents)
            .where(whereClause);

          const [todayResult] = await db
            .select({ value: count() })
            .from(trackingEvents)
            .where(
              and(siteCondition, gte(trackingEvents.createdAt, today))
            );

          const [sessionsResult] = await db
            .select({ value: countDistinct(trackingEvents.sessionId) })
            .from(trackingEvents)
            .where(whereClause);

          const [visitorsResult] = await db
            .select({ value: countDistinct(trackingEvents.visitorId) })
            .from(trackingEvents)
            .where(whereClause);

          stats.totalEvents = totalResult?.value ?? 0;
          stats.eventsToday =
            rangeFilter === 'today'
              ? (totalResult?.value ?? 0)
              : (todayResult?.value ?? 0);
          stats.uniqueSessions = sessionsResult?.value ?? 0;
          stats.uniqueVisitors = visitorsResult?.value ?? 0;

          // Top paths (gefilterd)
          const pathRows = await db
            .select({
              path: trackingEvents.path,
              cnt: count(),
            })
            .from(trackingEvents)
            .where(whereClause)
            .groupBy(trackingEvents.path)
            .orderBy(desc(sql`count(*)`))
            .limit(5);

          stats.topPaths = pathRows.map((r) => ({
            path: r.path,
            count: Number(r.cnt),
          }));

          // Recente events (laatste 10)
          const recentRows = await db.query.trackingEvents.findMany({
            where: whereClause,
            orderBy: desc(trackingEvents.createdAt),
            limit: 10,
            columns: { path: true, createdAt: true, siteId: true, visitorId: true },
          });

          recentEvents = recentRows.map((e) => ({
            path: e.path,
            createdAt: e.createdAt,
            siteName: siteNames[e.siteId] || 'Onbekend',
            visitorId: e.visitorId,
          }));
        }
      }
    } catch (err) {
      console.error('Dashboard data error:', err);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overzicht van je websitebezoekers. Installeer de snippet op je site
            om data te verzamelen.
          </p>
        </div>
        <Suspense fallback={null}>
          <DashboardFilters sites={userSites} />
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Bezoeken vandaag
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.eventsToday}</div>
            <p className="text-xs text-muted-foreground">
              Pageviews vandaag
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Totaal events
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {rangeFilter === 'today'
                ? 'Alle pageviews vandaag'
                : rangeFilter === '7d'
                  ? 'Pageviews (7 dagen)'
                  : 'Pageviews (30 dagen)'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unieke bezoekers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueVisitors}</div>
            <p className="text-xs text-muted-foreground">
              Unieke visitor_id&apos;s
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sessies</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueSessions}</div>
            <p className="text-xs text-muted-foreground">
              Unieke sessies
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top pagina&apos;s</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.topPaths.length > 0 ? (
              <ul className="text-sm space-y-1">
                {stats.topPaths.map((p) => (
                  <li key={p.path}>
                    <code className="text-xs">{p.path}</code> ({p.count})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">—</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recente bezoeken</CardTitle>
          <CardDescription>
            Laatste pageviews op je sites.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nog geen bezoeken. Voeg een site toe op de Sites pagina en
              installeer de tracking snippet.
            </div>
          ) : (
            <div className="space-y-2">
              {recentEvents.map((e, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm py-2 border-b last:border-0"
                >
                  <span>
                    <code className="bg-muted px-1 rounded">{e.path}</code>
                    <span className="text-muted-foreground ml-2">
                      {e.siteName}
                    </span>
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(e.createdAt).toLocaleString('nl-NL')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
