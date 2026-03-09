'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type Site = { id: string; name: string };

export function DashboardFilters({ sites }: { sites: Site[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const siteId = searchParams.get('site') ?? '';
  const range = searchParams.get('range') ?? 'today';

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/dashboard?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-3">
      {sites.length > 1 && (
        <div className="flex items-center gap-2">
        <label htmlFor="site" className="text-sm text-muted-foreground">
          Site:
        </label>
        <select
          id="site"
          value={siteId}
          onChange={(e) => update('site', e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="">Alle sites</option>
          {sites.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        </div>
      )}
      <div className="flex items-center gap-2">
        <label htmlFor="range" className="text-sm text-muted-foreground">
          Periode:
        </label>
        <select
          id="range"
          value={range}
          onChange={(e) => update('range', e.target.value)}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="today">Vandaag</option>
          <option value="7d">7 dagen</option>
          <option value="30d">30 dagen</option>
        </select>
      </div>
    </div>
  );
}
