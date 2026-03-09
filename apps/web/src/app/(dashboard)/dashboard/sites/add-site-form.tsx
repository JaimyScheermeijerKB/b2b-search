'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createSite } from '@/app/actions/sites';

type CreateSiteResult = { error?: string; success?: boolean; ingestKey?: string };

export function AddSiteForm({
  createSite,
}: {
  createSite: (formData: FormData) => Promise<CreateSiteResult>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await createSite(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4 flex-wrap items-end">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium block">
            Naam
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Mijn website"
            className="px-3 py-2 border rounded-md bg-background w-48"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="domain" className="text-sm font-medium block">
            Domein
          </label>
          <input
            id="domain"
            name="domain"
            type="text"
            required
            placeholder="example.com"
            className="px-3 py-2 border rounded-md bg-background w-48"
          />
        </div>
        <Button type="submit">Site toevoegen</Button>
      </div>
      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}
      {success && (
        <div className="text-sm text-green-600">
          Site toegevoegd! Vernieuw de pagina om de snippet te zien.
        </div>
      )}
    </form>
  );
}
