# Duely — Deployment Guide

## Services Needed (all have free tiers)

| Service  | Purpose         | Free Tier                          |
| -------- | --------------- | ---------------------------------- |
| Supabase | Database + Auth | 500MB DB, 50k monthly active users |
| Resend   | Email delivery  | 3,000 emails/month                 |
| Vercel   | Hosting + Cron  | Hobby plan — free                  |
| GitHub   | Repo + CI/CD    | Free                               |

---

## Step 1 — Supabase Setup

1. Go to supabase.com → New project
2. Name it `duely`, choose a region close to your users
3. Save the database password somewhere safe
4. Go to **Project Settings → API**:
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to **SQL Editor** → run migrations **in order**:
   - Paste and run `001_init.sql`
   - Paste and run `002_reminders.sql`
   - Paste and run `003_seed_demo_data.sql`
   - Paste and run `004_security_hardening.sql`
   - Paste and run `005_revoke_public_rpc.sql`
   - Paste and run `006_fix_demo_auth_tokens.sql`
6. Go to **Authentication → Settings**:
   - Add your site URL: `https://duely.tech` (or your Vercel URL)
   - Add redirect URLs: `https://duely.tech/auth/callback`

---

## Step 2 — Resend Setup

1. Go to resend.com → Sign up
2. Add and verify your domain (or use their sandbox for testing)
3. Go to **API Keys** → Create API Key
4. Copy key → `RESEND_API_KEY`
5. For testing without a domain: emails can only be sent to your own email
6. For production: verify a domain and update the `from` address in `src/lib/email.tsx`

---

## Step 3 — GitHub Setup

```bash
git init
git add .
git commit -m "feat: initial Duely setup"
git remote add origin https://github.com/yourusername/duely.git
git push -u origin main
```

Make sure `.env.local` is in `.gitignore`:

```
# .gitignore (already set up)
.env.local
.env
```

---

## Step 4 — Vercel Deployment (Import from GitHub)

Use this flow when deploying from GitHub in the Vercel dashboard.

1. Go to vercel.com → **Add New...** → **Project**
2. Import your GitHub repository
3. In **Configure Project**, use these values:

| Field            | Value                     |
| ---------------- | ------------------------- |
| Framework Preset | Next.js (auto-detected)   |
| Root Directory   | `duely`                   |
| Build Command    | `npm run build` (default) |
| Install Command  | `npm install` (default)   |
| Output Directory | `.next` (default/auto)    |

> **Important:** `Root Directory` must be `duely` because the Next.js app lives in the `duely/` subfolder, while the repo root contains docs and assets.

4. Add all environment variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
NEXT_PUBLIC_APP_URL         -> https://your-project.vercel.app
CRON_SECRET                 -> generate: openssl rand -hex 32
```

5. Click **Deploy** (Vercel will build from your default branch)
6. Set custom domain if desired (Settings → Domains)

---

## Step 5 — Cron Job Verification

The `vercel.json` cron config runs daily at 9am UTC:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-overdue",
      "schedule": "0 9 * * *"
    }
  ]
}
```

The cron endpoint requires a `CRON_SECRET` bearer token. Vercel passes this automatically via the `Authorization` header when triggering the cron.

Check **Vercel Dashboard → Functions → Cron Jobs** to verify it's registered.

To test manually:

```bash
curl -X POST https://your-project.vercel.app/api/cron/check-overdue \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## Step 6 — Middleware (proxy.ts) Verification

Duely uses `src/proxy.ts` instead of the conventional `middleware.ts` to be compatible with
Next.js 16's Edge runtime. The root `middleware.ts` imports and delegates to `proxy()`.

Verify:
- `src/proxy.ts` exports a `proxy()` function and a `config` object with a `matcher`
- Root `middleware.ts` imports `proxy` from `@/proxy` and re-exports `config`
- The matcher excludes `_next/static`, `_next/image`, `favicon.ico`, and image extensions

If you see `MIDDLEWARE_INVOCATION_FAILED` on Vercel, check that:
1. No Node.js-only imports are used in the proxy/middleware chain
2. `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel env vars

---

## Step 7 — Supabase Auth Redirect

The auth callback route is at `src/app/api/auth/callback/route.ts`:

```typescript
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
```

---

## Environment Variables Checklist

Before deploying, confirm all are set in Vercel:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` — from Supabase project settings
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase project settings
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — from Supabase project settings (secret, server only)
- [ ] `RESEND_API_KEY` — from Resend dashboard
- [ ] `NEXT_PUBLIC_APP_URL` — your Vercel deployment URL
- [ ] `CRON_SECRET` — random string (use `openssl rand -hex 32`)

---

## Post-Deployment Checklist

- [ ] Landing page loads at `/` with dark mode toggle working
- [ ] Signup creates a user + organization + profile (check Supabase table editor)
- [ ] Login redirects to `/dashboard`
- [ ] "See how it works" auto-fills demo credentials and logs in as demo user
- [ ] Dashboard stats load correctly (falls back to demo data if Supabase is slow)
- [ ] Creating an invoice appears in Supabase invoices table
- [ ] Reminder schedule rows created on invoice creation
- [ ] Send reminder actually delivers email (check Resend dashboard)
- [ ] `reminder_logs` row created after sending
- [ ] Client create/edit/delete dialogs work correctly
- [ ] Cron endpoint returns 200 with Bearer token, 401 without
- [ ] App works on mobile screen sizes (bottom nav visible, sidebar hidden)
- [ ] No env vars or secrets in git history

---

## Common Issues

### `MIDDLEWARE_INVOCATION_FAILED` on Vercel

→ This happens when middleware uses Node.js-only APIs not available in the Edge runtime.
→ Ensure `src/proxy.ts` only imports from `next/server` and `@supabase/ssr` (both Edge-compatible).
→ Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel env vars.

### "Invalid API key" from Supabase

→ Check you're using anon key for client-side, service role for server-side cron only.

### Email not delivered

→ Check Resend dashboard for delivery status. For testing, use your verified email address as recipient.
→ Ensure the `from` address in `src/lib/email.tsx` matches your verified Resend domain.

### RLS blocking data

→ Make sure the `handle_new_user` trigger ran and created the profile row. Check `profiles` table in Supabase.

### Cron returning 401

→ Make sure `CRON_SECRET` in Vercel matches exactly what's used in the cron route's Authorization check.

### Port conflict on local dev

→ If `npm run dev` says port 3000 is in use, kill the conflicting process: `kill <PID>` then re-run.
→ Or use `PORT=3001 npm run dev` to start on a different port.

### Demo data not showing

→ The demo data fallback in `lib/data.ts` activates when Supabase throws an error or the user is not authenticated.
→ If real data is missing, check the Supabase RLS policies and that the `handle_new_user` trigger is set up.
