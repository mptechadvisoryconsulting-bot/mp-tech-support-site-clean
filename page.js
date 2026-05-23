# MP Technology QR

Customer-login QR SaaS for branded codes, saved libraries, dynamic redirect links, and scan tracking.

## Local Setup

```powershell
Copy-Item .env.example .env.local
npm run dev
```

Fill `.env.local` with Supabase keys before using auth or the dashboard.

## Supabase

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. In Vercel, add these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Vercel

This is now a Next.js app. Vercel can detect it automatically.

Build command:

```text
npm run build
```

## Desktop Build

```powershell
npm run build:win
```

The packaged Windows app is generated in `dist/`. The desktop build is still available for one-off customer packaging.
