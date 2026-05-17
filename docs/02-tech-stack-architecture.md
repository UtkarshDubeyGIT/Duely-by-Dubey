# Duely — Tech Stack & Architecture

## Stack Decisions

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16.2 (App Router + Turbopack) | SSR, API routes, file-based routing, Vercel-native; Turbopack for fast dev builds |
| Language | TypeScript 5 | Type safety, better DX, scales well |
| Styling | Tailwind CSS 4 | Rapid UI, zero-config PostCSS, significant perf improvements over v3 |
| UI Library | shadcn/ui (base-nova) + Base UI | Components copied into codebase (full ownership), Tailwind-native, zero bundle bloat |
| Animations | Aceternity UI + Motion (Framer Motion v12) | WavyBackground, DiaTextReveal on landing; purposeful micro-animations |
| Font | Geist (next/font/google) | Clean, modern, variable font |
| Theme | next-themes | Light / dark / system toggle with zero flicker |
| Database | Supabase (PostgreSQL) | Auth + DB + RLS + free tier + instant REST |
| Auth | Supabase Auth (@supabase/ssr) | Multi-tenant ready, session management, Edge-compatible |
| Email | Resend + React Email | Best developer experience, React templates, free tier |
| Forms | React Hook Form + Zod | Performant, schema-validated, type-inferred |
| Date handling | date-fns v4 | Lightweight, tree-shakeable, consistent |
| Charts | Recharts | Lightweight, composable, works with Tailwind |
| Deployment | Vercel | Zero-config Next.js deploy, cron jobs, env management |
| Cron | Vercel Cron Jobs | Daily overdue check at 9am UTC, auto-reminder scheduling |
| Icons | Lucide React | Consistent, tree-shakeable icon set |

---

## Architecture Overview

```
Browser (Next.js App Router)
  │
  ├── / (landing)          → public — SiteHeader, Hero, Features, SiteFooter
  ├── (auth) routes        → /login, /signup — no auth guard
  ├── (dashboard) routes   → /dashboard, /invoices, /clients, /reminders — auth guarded via proxy.ts
  └── api routes           → REST endpoints + cron

Middleware (src/proxy.ts — Edge-compatible)
  └── Validates Supabase JWT → redirects unauthenticated users to /login

Supabase
  ├── Auth                 → JWT sessions, user management
  ├── PostgreSQL           → all data storage (6 migrations)
  └── Row Level Security   → org-level data isolation (multi-tenant)

Resend
  └── Email delivery       → reminder emails via React Email template

Vercel
  ├── Hosting              → Next.js SSR + static
  └── Cron                 → daily /api/cron/check-overdue at 9am UTC
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

### Why Next.js 16 + Turbopack?
- Turbopack provides extremely fast local dev startup (< 500ms) and HMR
- React 19 Server Components reduce client-side JavaScript
- App Router route groups cleanly separate public, auth, and dashboard pages
- Native support for Server Actions

### Why shadcn/ui (base-nova) over MUI/Ant Design?
- Components are copied into the codebase — full ownership, zero bundle bloat from unused components
- Tailwind-native — no CSS specificity conflicts
- `base-nova` style provides a modern, premium aesthetic out of the box
- Easy to customize to match Duely's design system

### Why `proxy.ts` instead of `middleware.ts`?
- Next.js 16 Edge runtime requires middleware to use only Edge-compatible APIs
- `proxy.ts` exports a `proxy()` function used by a root `middleware.ts` shim
- This pattern avoids `MIDDLEWARE_INVOCATION_FAILED` errors on Vercel and is fully compatible
  with the newer `@supabase/ssr` base64url chunked cookie handling

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

### Why Vercel Cron over a separate worker?
- Zero additional infrastructure
- Integrated with the same Next.js deployment
- Simple vercel.json config
- Sufficient for daily overdue checks; can be replaced with Inngest/BullMQ at scale

### Why a demo-data fallback in `lib/data.ts`?
- All server data fetchers (`getClients`, `getInvoices`, `getDashboardData`, etc.) use React `cache()`
  and fall back to rich static demo data (`lib/demo-data.ts`) on any error or missing Supabase config
- This makes the demo account seamless without requiring a live DB connection for every page render

---

## API Structure

```
/api/invoices            GET (list w/ filters), POST (create + auto-schedule)
/api/invoices/[id]       GET, PATCH, DELETE
/api/invoices/[id]/remind  POST — trigger reminder email
/api/clients             GET (list), POST (create)
/api/clients/[id]        GET, PATCH, DELETE
/api/dashboard           GET — aggregated stats
/api/cron/check-overdue  POST — Vercel cron, daily 9am UTC (Bearer token secured)
/api/auth/callback       GET — Supabase OAuth/magic-link callback
```

---

## File Structure (Actual)

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
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── invoices/page.tsx
│   │   │   ├── clients/page.tsx
│   │   │   └── reminders/page.tsx
│   │   ├── api/
│   │   │   ├── invoices/route.ts
│   │   │   ├── invoices/[id]/route.ts
│   │   │   ├── invoices/[id]/remind/route.ts
│   │   │   ├── clients/route.ts
│   │   │   ├── clients/[id]/route.ts
│   │   │   ├── dashboard/route.ts
│   │   │   ├── auth/callback/route.ts
│   │   │   └── cron/check-overdue/route.ts
│   │   ├── features/page.tsx           # Landing section
│   │   ├── how-to-use/page.tsx         # Landing section
│   │   ├── future-upgrades/page.tsx    # Landing section
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   └── page.tsx                   # Landing page
│   ├── components/
│   │   ├── ui/                        # shadcn primitives + Aceternity components
│   │   │   ├── wavy-background.tsx
│   │   │   ├── dia-text-reveal.tsx
│   │   │   ├── sidebar.tsx            # shadcn Sidebar primitive
│   │   │   ├── button.tsx, card.tsx, dialog.tsx, table.tsx, ...
│   │   ├── clients/
│   │   │   ├── ClientTable.tsx
│   │   │   ├── CreateClientDialog.tsx
│   │   │   ├── EditClientDialog.tsx
│   │   │   └── DeleteClientDialog.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardOverview.tsx
│   │   │   ├── InvoiceDetailDialog.tsx
│   │   │   ├── MasterSearch.tsx
│   │   │   └── StatsCard.tsx
│   │   ├── invoices/
│   │   │   ├── InvoiceTable.tsx
│   │   │   ├── InvoiceActions.tsx
│   │   │   ├── CreateInvoiceDialog.tsx
│   │   │   ├── DeleteInvoiceDialog.tsx
│   │   │   └── SendReminderDialog.tsx
│   │   ├── reminders/
│   │   │   └── (reminder timeline components)
│   │   ├── shared/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── UserNav.tsx
│   │   │   ├── SiteHeader.tsx
│   │   │   ├── SiteFooter.tsx
│   │   │   ├── BrandLogoLink.tsx
│   │   │   ├── ModeToggle.tsx
│   │   │   ├── AppLoader.tsx
│   │   │   └── LoadingStates.tsx
│   │   └── ThemeProvider.tsx
│   ├── emails/
│   │   └── PaymentReminder.tsx        # Tone-aware React Email template
│   ├── hooks/
│   │   └── use-mobile.ts
│   ├── lib/
│   │   ├── data.ts                    # React-cache server fetchers + demo fallback
│   │   ├── demo-data.ts               # Static demo data
│   │   ├── email.tsx                  # Email sending helper
│   │   ├── env.ts                     # Safe env-var accessors
│   │   ├── reminder-scheduler.ts      # 5-step schedule generator
│   │   ├── resend.ts                  # Resend client instance
│   │   ├── utils.ts                   # cn, formatCurrency, formatDate, etc.
│   │   ├── validations.ts             # Zod schemas
│   │   └── supabase/
│   │       ├── client.ts              # Browser Supabase client
│   │       └── server.ts              # Server Supabase client
│   ├── proxy.ts                       # Edge-compatible auth proxy (replaces middleware.ts)
│   └── types/index.ts                 # All TypeScript types
├── supabase/
│   └── migrations/
│       ├── 001_init.sql               # Core tables
│       ├── 002_reminders.sql          # Reminder tables
│       ├── 003_seed_demo_data.sql     # Demo data seed
│       ├── 004_security_hardening.sql
│       ├── 005_revoke_public_rpc.sql
│       └── 006_fix_demo_auth_tokens.sql
├── vercel.json                        # Cron config
├── .env.example
└── .env.local                         # never commit
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
- Cron job is stateless → can be moved to Inngest/BullMQ queue later
- Email templates are React components → easy to white-label per org
- API routes are thin → business logic lives in lib/ → easy to test
- Adding SMS (Twilio), webhooks, or a client payment portal requires only new routes
- Supabase → can migrate to self-hosted Postgres + Auth.js if needed at scale
- `profiles.role` column already in schema → multi-user orgs require no DB changes
