# Duely — Deployment Guide

## Services Needed (all have free tiers)

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Supabase | Database + Auth | 500MB DB, 50k monthly active users |
| Resend | Email delivery | 3,000 emails/month |
| Vercel | Hosting + Cron | Hobby plan — free |
| GitHub | Repo + CI/CD | Free |

---

## Step 1 — Supabase Setup

1. Go to supabase.com → New project
2. Name it `duely`, choose a region close to your users
3. Save the database password somewhere safe
4. Go to Project Settings → API:
   - Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to SQL Editor → run migrations in order:
   - Paste and run `001_init.sql`
   - Paste and run `002_reminders.sql`
6. Go to Authentication → Settings:
   - Add your site URL: `https://duely.vercel.app`
   - Add redirect URLs: `https://duely.vercel.app/auth/callback`

---

## Step 2 — Resend Setup

1. Go to resend.com → Sign up
2. Add and verify your domain (or use their sandbox for testing)
3. Go to API Keys → Create API Key
4. Copy key → `RESEND_API_KEY`
5. For testing without a domain: emails can only be sent to your own email
6. For production: verify a domain and update the `from` address in the remind route

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
# .gitignore additions
.env.local
.env
```

---

## Step 4 — Vercel Deployment

1. Go to vercel.com → Import Git Repository → select `duely`
2. Framework: Next.js (auto-detected)
3. Add all environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   RESEND_API_KEY
   NEXT_PUBLIC_APP_URL         → https://your-project.vercel.app
   CRON_SECRET                 → generate: openssl rand -hex 32
   ```
4. Deploy → Vercel auto-builds from main branch
5. Set custom domain if desired (Settings → Domains)

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

Vercel automatically calls this with the `Authorization: Bearer <CRON_SECRET>` header.
Check Vercel Dashboard → Functions → Cron Jobs to verify it's registered.

To test manually:
```bash
curl -X POST https://your-project.vercel.app/api/cron/check-overdue \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## Step 6 — Supabase Auth Redirect (Required)

Add this route for OAuth/magic link callbacks:

### src/app/auth/callback/route.ts
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
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

- [ ] Signup creates a user + organization + profile (check Supabase table editor)
- [ ] Login redirects to /dashboard
- [ ] Creating an invoice appears in Supabase invoices table
- [ ] Reminder schedule rows created on invoice creation
- [ ] Send reminder actually delivers email (check Resend dashboard)
- [ ] reminder_logs row created after sending
- [ ] Dashboard stats load correctly
- [ ] Cron endpoint returns 200 with Bearer token, 401 without
- [ ] App works on mobile screen sizes
- [ ] No env vars or secrets in git history

---

## Common Issues

### "Invalid API key" from Supabase
→ Check you're using anon key for client-side, service role for server-side cron only

### Email not delivered
→ Check Resend dashboard for delivery status. For testing, use your verified email address as recipient

### RLS blocking data
→ Make sure the `handle_new_user` trigger ran and created the profile row. Check profiles table in Supabase

### Cron returning 401
→ Make sure CRON_SECRET in Vercel matches exactly what's in vercel.json header logic

### Middleware redirect loop
→ Check middleware matcher config — make sure /api/ routes and static files are excluded
