# B2B Visitor Identification SaaS – Architectuur

## 1. Projectstructuur

```
b2b/
├── apps/
│   ├── web/                    # Next.js: marketing, dashboard, admin
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   └── lib/
│   │   └── ...
│   └── worker/                 # Trigger.dev background jobs
│       ├── src/
│       │   └── tasks/
│       └── ...
├── packages/
│   ├── db/                     # Drizzle schema, migrations, client
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   ├── migrations/
│   │   │   └── index.ts
│   │   └── drizzle.config.ts
│   ├── core/                   # Shared types, validation, business logic
│   │   └── src/
│   │       ├── types/
│   │       ├── validation/
│   │       └── index.ts
│   └── tracking/               # Snippet, ingest types, event schemas
│       └── src/
│           ├── snippet.ts
│           ├── types.ts
│           └── index.ts
├── pnpm-workspace.yaml
├── package.json
├── .env.example
├── .gitignore
├── ARCHITECTURE.md
└── README.md
```

## 2. Waarom deze structuur?

| Keuze                 | Reden                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| **Lichte monorepo**   | Eén repo, duidelijke scheiding. Geen microservices, wel herbruikbare packages.                   |
| **apps/web**          | Marketing, dashboard en admin in één Next.js app. Eenvoudiger dan 3 apps, route-based scheiding. |
| **apps/worker**       | Trigger.dev workers apart. Schone scheiding van lange jobs en web requests.                      |
| **packages/db**       | Drizzle als single source of truth. Migraties in code, geen handmatig schema-beheer.             |
| **packages/core**     | Gedeelde types, Zod-schema’s, business rules. Voorkomt duplicatie en type-mismatches.            |
| **packages/tracking** | Snippet en event-typen apart. Kan later als aparte npm-package of CDN-bundle.                    |
| **pnpm**              | Snel, goede monorepo-ondersteuning, strikte dependency resolution.                               |

## 3. Stappenplan per fase

### Fase 0 – Repo setup

- pnpm workspaces
- TypeScript config (root + per package)
- ESLint + Prettier
- .env structuur
- Basis README

### Fase 1 – Next.js basis ✓

- Next.js App Router in apps/web
- Tailwind CSS
- shadcn/ui
- Layout, landing page, dashboard shell

### Fase 2 – Supabase + Auth ✓

- Supabase client
- Auth (login/signup)
- Protected routes
- Workspace-concept (basis)

### Fase 3 – Drizzle setup ✓

- Drizzle in packages/db
- Schema's (users, workspaces, memberships, sites, tracking_events)
- Migraties
- DB client export

### Fase 4 – Multi-tenant datamodel ✓

- users, workspaces, memberships, sites
- RLS-voorbereiding (indien Supabase RLS)

### Fase 5 – Tracking ingest ✓

- Ingest API endpoint (`/api/ingest`)
- Event opslag (tracking_events)
- packages/tracking snippet
- CORS voor cross-origin tracking

### Fase 6 – Sessies + dashboard ✓

- Sessie-logica (visitor_id, session_id)
- Dashboard schermen (stats, top pagina's, recente bezoeken)
- Bedrijfsidentificatie via IPinfo (company_name, company_domain)
- Top bedrijven-card
- Versieweergave in sidebar (v0.6.0)

### Fase 7 – Trigger.dev

- Worker setup in apps/worker
- Enrichment jobs (extra IP/company lookup)
- Confidence scoring voor lead-kwaliteit
- Retry-logica voor failed jobs

### Fase 8 – Admin panel

- Interne admin sectie (aparte route of subdomain)
- Overzicht workspaces, sites, ingest status
- Job inspectie (Trigger.dev dashboard of eigen UI)
- Gebruikersbeheer

### Fase 9 – Webhooks & alerts

- Webhook delivery
- Alerts
- CRM-ready hooks

### Fase 10 – Hardening

- Logging (structuur, niveaus)
- Error states (graceful degradation)
- Docs (API, deploy)
- Deployment instructies (zie DEPLOY.md)
