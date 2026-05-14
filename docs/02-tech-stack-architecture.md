# Duely — Tech Stack & Architecture

## Stack Decisions

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 (App Router) | SSR, API routes, file-based routing, Vercel-native |
| Language | TypeScript | Type safety, better DX, scales well |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI, consistent components, fully customizable |
| Database | Supabase (PostgreSQL) | Auth + DB + RLS + free tier + instant REST/realtime |
| Auth | Supabase Auth | Multi-tenant ready, supports SSO, session management |
| Email | Resend + React Email | Best developer experience, React templates, free tier |
| Deployment | Vercel | Zero-config Next.js deploy, cron jobs, env management |
| Cron | Vercel Cron Jobs | Daily overdue check, auto-reminder scheduling |
| Validation | Zod | Runtime type validation for all API inputs |
| Forms | React Hook Form + Zod | Performant forms with schema validation |
| Charts | Recharts | Lightweight, composable, works with Tailwind |
| Date handling | date-fns | Lightweight, tree-shakeable, consistent |

---

## Architecture Overview

```
Browser (Next.js App Router)
  │
  ├── (auth) routes        → login, signup — no auth guard
  ├── (dashboard) routes   → all app pages — auth guarded via middleware
  └── api routes           → REST endpoints + cron

Supabase
  ├── Auth                 → JWT sessions, user management
  ├── PostgreSQL           → all data storage
  └── Row Level Security   → org-level data isolation (multi-tenant)

Resend
  └── Email delivery       → reminder emails, templates via React Email

Vercel
  ├── Hosting              → Next.js SSR + static
  └── Cron                 → daily /api/cron/check-overdue
```

---

## Multi-Tenancy Model

Every business that signs up creates an **Organization**.
Every database table has an `org_id` column.
Supabase Row Level Security (RLS) policies ensure:
- A user can only read/write rows where `org_id` matches their organization
- No business can ever see another business's data
- Service role key (server-side only) bypasses RLS for cron operations

---

## Key Architectural Decisions

### Why Supabase over Prisma + raw Postgres?
- Supabase gives us auth, database, and RLS in one service
- No separate auth provider needed
- Free tier is generous enough for a demo/MVP
- Easy to migrate to raw Postgres later if needed

### Why Resend over SendGrid/Nodemailer?
- React Email templates = type-safe, component-based emails
- Excellent DX, clear docs, reliable delivery
- Free tier: 3,000 emails/month
- Single npm package, no complex SMTP setup

### Why App Router over Pages Router?
- Server Components reduce client bundle size
- Layouts handle auth guard cleanly
- Route groups (auth) and (dashboard) for clean separation
- Native support for server actions

### Why Vercel Cron over a separate worker?
- Zero additional infrastructure
- Integrated with the same Next.js deployment
- Simple vercel.json config
- Sufficient for daily overdue checks

---

## API Structure

```
/api/invoices          GET (list), POST (create)
/api/invoices/[id]     GET, PATCH, DELETE
/api/invoices/[id]/remind    POST — trigger reminder email
/api/clients           GET (list), POST (create)
/api/clients/[id]      GET, PATCH, DELETE
/api/dashboard         GET — aggregated stats
/api/cron/check-overdue  POST — Vercel cron, daily
```

---

## File Structure

```
duely/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Dashboard
│   │   │   ├── invoices/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── reminders/page.tsx
│   │   ├── api/
│   │   │   ├── invoices/route.ts
│   │   │   ├── invoices/[id]/route.ts
│   │   │   ├── invoices/[id]/remind/route.ts
│   │   │   ├── clients/route.ts
│   │   │   ├── clients/[id]/route.ts
│   │   │   ├── dashboard/route.ts
│   │   │   └── cron/check-overdue/route.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                             # shadcn primitives
│   │   ├── invoices/
│   │   │   ├── InvoiceTable.tsx
│   │   │   ├── InvoiceFilters.tsx
│   │   │   ├── InvoiceForm.tsx
│   │   │   ├── InvoiceStatusBadge.tsx
│   │   │   └── SendReminderDialog.tsx
│   │   ├── clients/
│   │   │   ├── ClientTable.tsx
│   │   │   └── ReliabilityBadge.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── OverdueList.tsx
│   │   │   ├── UpcomingReminders.tsx
│   │   │   └── PaidVsUnpaidChart.tsx
│   │   ├── reminders/
│   │   │   └── ReminderTimeline.tsx
│   │   └── shared/
│   │       ├── Sidebar.tsx
│   │       ├── TopBar.tsx
│   │       ├── MobileNav.tsx
│   │       └── FileUploadDialog.tsx
│   ├── emails/
│   │   ├── PaymentReminder.tsx
│   │   ├── OverdueNotice.tsx
│   │   └── FinalNotice.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── resend.ts
│   │   ├── validations.ts
│   │   ├── reminder-scheduler.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useInvoices.ts
│   │   ├── useClients.ts
│   │   └── useDashboardStats.ts
│   └── types/index.ts
├── supabase/
│   └── migrations/
│       ├── 001_init.sql
│       └── 002_reminders.sql
├── middleware.ts
├── vercel.json
├── .env.example
└── .env.local              # never commit
```

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-side only, never expose to client

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=                      # random string, secures cron endpoint
```

---

## Scalability Notes

- Multi-tenancy via `org_id` + RLS → no data leaks between businesses
- Cron job is stateless → can be moved to a queue (BullMQ, Inngest) later
- Email templates are React components → easy to white-label per org
- API routes are thin → business logic lives in lib/ → easy to test
- Adding SMS (Twilio), webhooks, or a client payment portal requires only new routes
- Supabase → can migrate to self-hosted Postgres + Auth.js if needed at scale
