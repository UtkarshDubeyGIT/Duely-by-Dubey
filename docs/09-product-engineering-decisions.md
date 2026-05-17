# Duely — Product & Engineering Decisions

This document explains every significant decision made in building Duely.
Prepared for the BinaryAutomates review session.

---

## Why These Features, Why Not Others

### What I built
1. Invoice CRUD with line items (create, view, edit status, delete)
2. Client management with full CRUD (create, edit, delete) and reliability scoring
3. Smart auto-reminder scheduling on invoice creation (5-step schedule)
4. Manual reminder sending with tone control (Friendly / Firm / Final Notice)
5. Real email delivery via Resend with a React Email template
6. Reminder activity log (Reminders page with timeline)
7. Dashboard with key stats, overdue list, upcoming reminders, and recent invoices
8. Search and filtering on invoices and clients
9. Multi-tenant auth (each business is isolated via Supabase RLS)
10. Responsive UI (mobile bottom nav + desktop sidebar)
11. Dark mode support (next-themes, light/dark/system)
12. Demo data layer (seamless demo flow with static fallback data)
13. Landing page with Features, How To Use, and Future Upgrades sections

### What I deliberately left out

| Feature | Why skipped |
|---------|------------|
| Invoice PDF generation | Complex, adds 2-3 hours, lower value than core reminder flow |
| Stripe payment integration | Out of scope for a reminder tool — adds significant complexity |
| SMS via Twilio | Nice-to-have, email covers the core requirement |
| Multi-user orgs | Over-engineering for v1; schema already supports it via `profiles.role` |
| Magic link auth | Nice, but email+password is more universally familiar |
| Email reply webhook | Requires domain setup and inbound email routing — planned but not MVP |

**Principle:** A smaller, polished implementation beats a large, incomplete one.

---

## Engineering Decisions

### 1. Next.js 16 + Turbopack over Next.js 14/15
- Turbopack provides < 500ms dev server startup vs ~3s with webpack
- React 19 Server Components + React `cache()` for efficient data deduplication
- Route groups `(auth)` and `(dashboard)` cleanly separate public and protected pages
- Middleware-based auth guard — one file protects all app routes

### 2. `proxy.ts` instead of `middleware.ts`
- Next.js 16 Edge runtime only allows Edge-compatible APIs in middleware
- The original `middleware.ts` caused `MIDDLEWARE_INVOCATION_FAILED` on Vercel after upgrade
- Solution: `src/proxy.ts` exports a `proxy()` function + `config` object
  that are imported by a root-level `middleware.ts` shim
- This keeps the auth logic identical but ensures Edge compatibility
- Also uses `getSupabaseUrl()`/`getSupabaseAnonKey()` helper from `lib/env.ts` to safely
  read env vars without crashing when they're missing (graceful fallback)

### 3. shadcn/ui (base-nova) over Base UI primitives exclusively
- Base UI provides unstyled primitives — powerful but requires a lot of custom CSS
- shadcn/ui copies components directly into the codebase (no dependency, full ownership)
- The `base-nova` style provides a modern, premium aesthetic aligned with Duely's design
- No CSS specificity conflicts since everything is Tailwind-native
- Refactored existing custom table/dialog/input components to shadcn equivalents for
  better accessibility, responsive behavior, and maintainability

### 4. Supabase over Prisma + separate auth
- **Auth + DB + RLS in one service** — significant DX advantage
- Row Level Security means multi-tenancy is enforced at the database level, not just the
  application layer. Even a bug in the app code can't leak cross-org data
- Free tier is generous enough for demo + early users
- Reduces infrastructure complexity — no separate auth server
- 6 migrations covering core tables, reminders, demo data seeding, and security hardening

### 5. Resend over SendGrid or Nodemailer
- React Email = type-safe, component-based email templates
- One npm package (`resend`) — no SMTP config, no XML API
- Excellent deliverability out of the box
- Dashboard shows delivery status, bounces, opens
- 3,000 free emails/month covers real small business usage

### 6. Vercel Cron over external worker
- Zero additional infrastructure for the assignment
- Integrated with the same deployment
- Simple `vercel.json` config (0 9 * * * = 9am UTC daily)
- Sufficient for daily overdue checks
- Can be replaced with Inngest/BullMQ when volume demands it

### 7. Zod for validation everywhere
- Same schema validates both the form (client-side) and the API route (server-side)
- Type inference means the TypeScript types come for free
- Error messages are developer-friendly and user-friendly
- Used in: invoice creation, client creation, send reminder, signup, login

### 8. React `cache()` in `lib/data.ts`
- All server data fetchers (`getClients`, `getInvoices`, `getDashboardData`, etc.)
  are wrapped with React's `cache()` for request-level deduplication
- If multiple Server Components on the same page call `getInvoices()`, Supabase
  is only queried once per render pass
- Each function also has a try/catch that falls back to static demo data on any error

### 9. Demo data in `lib/demo-data.ts`
- The demo account (demo@duely.tech) needs to work even if Supabase is experiencing issues
- Static demo data is rich enough to showcase all dashboard features
- The fallback pattern means the app never shows a blank/error state for the reviewer

---

## Product Decisions

### Why tone-escalating emails?
The #1 complaint about invoice reminders is that they feel robotic and damage client relationships. By automatically shifting tone (friendly early, firm later), Duely solves the awkwardness without the business owner having to think about wording.

The three tones map to real-world follow-up strategy:
- **Friendly** — before or on the due date: "hey, just a heads up"
- **Firm** — a few days overdue: "this needs attention"
- **Final Notice** — a week+ overdue: "we need to resolve this"

### Why auto-generate a reminder schedule?
Most invoice tools make you manually schedule each reminder. Duely generates a sensible 5-step schedule the moment an invoice is created. The business owner can approve, adjust, or delete entries — but the default schedule requires zero decision-making. This is the core insight: **the best UX is the one that does the thinking for you.**

### Why client reliability scores?
Over time, businesses learn which clients always pay late. Duely surfaces this as a data point — "At Risk" clients might get reminders sent earlier, or the business might require upfront payment. This is forward-looking product thinking: turn historical data into actionable insight.

### Why full client CRUD (not just read)?
The original implementation had a client table but no way to create, edit, or delete clients from the UI. Adding dedicated Create/Edit/Delete dialogs (backed by shadcn Dialog + React Hook Form + Zod) makes the client management workflow complete and production-ready.

### Why dark mode?
Dark mode is table stakes for any modern web app. Using `next-themes` with the `ThemeProvider` wrapper provides zero-flicker theme switching with system preference support. The `ModeToggle` component in both the TopBar and SiteHeader ensures the control is always accessible.

### Dashboard design philosophy
The dashboard answers three questions immediately:
1. How much money is outstanding?
2. What's overdue right now?
3. What reminders are going out soon?

Everything else is secondary. No charts for the sake of charts.

### Landing page sections
Three additional pages (Features, How To Use, Future Upgrades) linked from the SiteHeader
give reviewers and potential users a quick overview without logging in. These pages are
publicly accessible and serve as product marketing.

---

## What I'd Do With More Time

1. **Invoice PDF generation** — Using `@react-pdf/renderer` for a branded PDF attachment on every reminder email
2. **Client-facing payment page** — A simple `/pay/[token]` route where clients can mark an invoice as paid and upload a payment confirmation
3. **Email reply webhook** — Resend supports inbound email webhooks; would use this to auto-pause reminder sequences when a client replies
4. **Stripe integration** — One-click "Pay now" button in reminder emails that links to a Stripe checkout session
5. **Analytics** — Average days-to-payment per client, reminder effectiveness rate, revenue collected this month vs last
6. **Multi-user orgs** — The `profiles.role` column (`owner | admin | member`) is already in the schema; just needs invite flow + role-based UI gating

---

## Security Considerations

| Concern | How Duely handles it |
|---------|---------------------|
| Cross-org data access | Supabase RLS policies on every table |
| Secret exposure | Service role key only used server-side; never in client bundle |
| Cron abuse | CRON_SECRET bearer token required on cron endpoint |
| Auth session | Supabase handles JWT rotation; proxy.ts refreshes on every request |
| Input validation | Zod schemas on every API route and form |
| Private keys in git | `.env.local` in `.gitignore`; `.env.example` has no real values |
| Public RPC | Revoked in migration 005 (`005_revoke_public_rpc.sql`) |

---

## Scalability Path

Duely is built to scale without architectural rewrites:

| Now | At scale |
|-----|---------|
| Supabase free tier | Supabase Pro → self-hosted Postgres |
| Vercel cron | Inngest or BullMQ for queue-based processing |
| Resend free | Resend Pro or Amazon SES |
| Single-user orgs | Multi-user via `profiles.role` column (already in schema) |
| Manual send | Automated sequence engine with state machine |
| Static demo data | Real-time demo account with isolated sandbox org |
