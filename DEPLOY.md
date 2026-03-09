# B2B Visitor – Deploy naar Vercel

## 1. GitHub repository

Push je code naar GitHub (als dat nog niet is gedaan):

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/JOUW-USERNAME/b2b-visitor.git
git push -u origin main
```

## 2. Vercel-project aanmaken

1. Ga naar [vercel.com](https://vercel.com) en log in
2. Klik op **Add New** → **Project**
3. Importeer je GitHub-repository
4. **Root Directory:** zet op `apps/web` (Vercel detecteert dan automatisch de monorepo)
5. **Framework Preset:** Next.js (wordt automatisch herkend)

## 3. Environment variables

In **Settings** → **Environment Variables** voeg je toe:

| Naam | Waarde | Opmerking |
|------|--------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pmdrdibvirpktcdogvwg.supabase.co` | Uit Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | JWT anon key uit Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...` | Uit Supabase Dashboard |
| `DATABASE_URL` | `postgresql://postgres...@aws-1-ap-southeast-2.pooler...` | Pooler connection string |
| `NEXT_PUBLIC_APP_URL` | `https://jouw-app.vercel.app` | **Belangrijk:** je Vercel-URL na deploy |
| `IPINFO_TOKEN` | `xxx` | Gratis op [ipinfo.io](https://ipinfo.io/signup) – voor bedrijfsnaam bij bezoekers |

`NEXT_PUBLIC_APP_URL` moet je na de eerste deploy invullen met je echte Vercel-URL (bijv. `https://b2b-visitor-xxx.vercel.app`).

## 4. Build-instellingen (monorepo)

- **Root Directory:** `apps/web` – Vercel installeert dan automatisch vanuit de monorepo root
- **Build Command:** `pnpm build` (of laat leeg voor auto-detect)
- **Install Command:** `pnpm install` (of laat leeg)

## 5. Deploy

Klik op **Deploy**. Na de deploy:

1. Kopieer je Vercel-URL (bijv. `https://b2b-visitor-abc123.vercel.app`)
2. Ga naar **Settings** → **Environment Variables**
3. Zet `NEXT_PUBLIC_APP_URL` op die URL
4. **Redeploy** zodat de nieuwe env var wordt geladen

## 6. Custom domein (b2b.eigendomein.nl)

Om de app te hosten op je eigen domein:

1. Ga in Vercel naar je project → **Settings** → **Domains**
2. Klik op **Add** en vul in: `b2b.eigendomein.nl`
3. Vercel toont DNS-instructies. Voeg bij je domeinprovider toe:
   - **CNAME-record:** `b2b` → `cname.vercel-dns.com`
   - Of **A-record:** `b2b` → `76.76.21.21` (Vercel’s IP)
4. Wacht op DNS-propagation (vaak 5–30 minuten)
5. Vercel regelt automatisch SSL (HTTPS)

**Belangrijk:** Zet daarna `NEXT_PUBLIC_APP_URL` op `https://b2b.eigendomein.nl` en redeploy.

## 7. Tracking snippet

Na deploy gebruik je in de Sites-pagina de nieuwe snippet-URL. Die wijst nu naar je live app (of custom domein), dus tracking werkt op externe websites.
