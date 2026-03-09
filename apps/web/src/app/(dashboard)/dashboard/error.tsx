'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-lg font-semibold">Er ging iets mis</h2>
      <p className="text-muted-foreground text-sm">
        {error.message || 'Onbekende fout'}
      </p>
      <Button onClick={reset}>Opnieuw proberen</Button>
    </div>
  );
}
