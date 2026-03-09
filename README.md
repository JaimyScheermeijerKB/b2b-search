# B2B Visitor Identification SaaS

Leadinfo-achtige SaaS voor B2B website visitor identification. Bedrijven koppelen hun website, installeren een tracking snippet, en zien in een dashboard welke bedrijven hun site mogelijk hebben bezocht.

## Stack

- **Frontend/App**: Next.js (App Router), Tailwind, shadcn/ui
- **Database**: Supabase Postgres, Drizzle ORM
- **Auth**: Supabase Auth
- **Background jobs**: Trigger.dev
- **Validatie**: Zod

## Projectstructuur

```
b2b/
├── apps/
│   ├── web/          # Next.js: marketing, dashboard, admin
│   └── worker/       # Trigger.dev jobs
├── packages/
│   ├── db/           # Drizzle schema, migrations
│   ├── core/         # Shared types, validation
│   └── tracking/     # Snippet, event types
└── ...
```

Zie [ARCHITECTURE.md](./ARCHITECTURE.md) voor het volledige stappenplan.

## Vereisten

- Node.js 20+
- pnpm 9+
- Supabase account
- Trigger.dev account
- Vercel account (voor deploy)

## Lokale setup

### 1. Dependencies installeren

```bash
pnpm install
```

### 2. Environment variabelen

```bash
cp .env.example .env
# Vul .env in met je Supabase en Trigger.dev credentials

# Belangrijk: kopieer ook naar apps/web (Next.js laadt van daar)
cp .env apps/web/.env
```

### 3. Development server (na Fase 1)

```bash
pnpm dev
```

## Scripts

| Script              | Beschrijving                |
| ------------------- | --------------------------- |
| `pnpm dev`          | Start Next.js dev server    |
| `pnpm build`        | Build alle packages         |
| `pnpm lint`         | Lint alle packages          |
| `pnpm format`       | Format met Prettier         |
| `pnpm format:check` | Check Prettier              |
| `pnpm db:generate`  | Genereer Drizzle migrations |
| `pnpm db:migrate`   | Run migrations              |
| `pnpm db:studio`    | Open Drizzle Studio         |

## Fases

| Fase | Beschrijving | Status |
|------|--------------|--------|
| 0 | Repo setup (pnpm, TypeScript, ESLint) | ✓ |
| 1 | Next.js, Tailwind, shadcn/ui | ✓ |
| 2 | Supabase + Auth | ✓ |
| 3 | Drizzle + schema's | ✓ |
| 4 | Multi-tenant datamodel (workspaces, sites) | ✓ |
| 5 | Tracking ingest (snippet, API, events) | ✓ |
| 6 | Sessies + dashboard (stats, top pagina's, bedrijfsidentificatie via IPinfo) | ✓ |
| 7 | Trigger.dev jobs (enrichment, confidence scoring) | 🔲 |
| 8 | Admin panel (workspaces, sites, job inspectie) | 🔲 |
| 9 | Webhooks & alerts (CRM-hooks) | 🔲 |
| 10 | Hardening & deploy (logging, error states, docs) | 🔲 |

## Licentie

Proprietary
