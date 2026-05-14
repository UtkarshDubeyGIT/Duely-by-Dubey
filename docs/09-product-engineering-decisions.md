# Duely — Product & Engineering Decisions

This document explains every significant decision made in building Duely.
Prepared for the BinaryAutomates review session.

---

## Why These Features, Why Not Others

### What I built
1. Invoice CRUD with line items
2. Client management with reliability scoring
3. Smart auto-reminder scheduling on invoice creation
4. Manual reminder sending with tone control (Friendly / Firm / Final Notice)
5. Real email delivery via Resend
6. Reminder activity log
7. Dashboard with key stats
8. Search and filtering on invoices and clients
9. Multi-tenant auth (each business is isolated)
10. Responsive UI (mobile + desktop)

### What I deliberately left out

| Feature | Why skipped |
|---------|------------|
| Invoice PDF generation | Complex, adds 2-3 hours, lower value than core reminder flow |
| Stripe payment integration | Out of scope for a reminder tool — adds significant complexity |
| SMS via Twilio | Nice-to-have, email covers the core requirement |
| Multi-user orgs | Over-engineering for v1, schema supports it when needed |
| Magic link auth | Nice, but email+password is more universally familiar |

**Principle:** A smaller, polished implementation beats a large, incomplete one.

---

## Engineering Decisions

### 1. Next.js App Router over Pages Router
- Route groups `(auth)` and `(dashboard)` cleanly separate public and protected pages
- Middleware-based auth guard — one file protects all app routes
- Server Components reduce JavaScript sent to the browser
- Layouts handle sidebar/nav without prop drilling

### 2. Supabase over Prisma + separate auth
- **Auth + DB + RLS in one service** — significant DX advantage
- Row Level Security means multi-tenancy is enforced at the database level, not just the application layer. Even a bug in the app code can't leak cross-org data
- Free tier is generous enough for demo + early users
- Reduces infrastructure complexity — no separate auth server

### 3. Resend over SendGrid or Nodemailer
- React Email = type-safe, component-based email templates
- One npm package (`resend`) — no SMTP config, no XML API
- Excellent deliverability out of the box
- Dashboard shows delivery status, bounces, opens
- 3,000 free emails/month covers real small business usage

### 4. Vercel Cron over external worker
- Zero additional infrastructure for the assignment
- Integrated with the same deployment
- Simple `vercel.json` config
- Sufficient for daily overdue checks
- Can be replaced with Inngest/BullMQ when volume demands it

### 5. Zod for validation everywhere
- Same schema validates both the form (client-side) and the API route (server-side)
- Type inference means the TypeScript types come for free
- Error messages are developer-friendly and user-friendly

### 6. shadcn/ui over a full component library (MUI, Ant Design)
- Components are copied into the codebase — full ownership
- Tailwind-native — no CSS specificity conflicts
- Easily customizable to match Duely's design
- No bundle bloat from unused components

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

### Why pause-on-response?
Sending automated reminders to a client who has already replied "I'll pay Friday" is the #1 way to damage a client relationship. The pause-on-response feature (via email webhook from Resend) ensures the automation stays out of the way when a human conversation is already happening.

### Dashboard design philosophy
The dashboard answers three questions immediately:
1. How much money is outstanding?
2. What's overdue right now?
3. What reminders are going out soon?

Everything else is secondary. No charts for the sake of charts.

---

## What I'd Do With More Time

1. **Invoice PDF generation** — Using `@react-pdf/renderer` for a branded PDF attachment on every reminder email
2. **Client-facing payment page** — A simple `/pay/[token]` route where clients can mark an invoice as paid and upload a payment confirmation
3. **Email reply webhook** — Resend supports inbound email webhooks; would use this to auto-pause reminder sequences when a client replies
4. **Stripe integration** — One-click "Pay now" button in reminder emails that links to a Stripe checkout session
5. **Analytics** — Average days-to-payment per client, reminder effectiveness rate, revenue collected this month vs last

---

## Security Considerations

| Concern | How Duely handles it |
|---------|---------------------|
| Cross-org data access | Supabase RLS policies on every table |
| Secret exposure | Service role key only used server-side; never in client bundle |
| Cron abuse | CRON_SECRET bearer token required on cron endpoint |
| Auth session | Supabase handles JWT rotation; middleware refreshes on every request |
| Input validation | Zod schemas on every API route |
| Private keys in git | `.env.local` in `.gitignore`; `.env.example` has no real values |

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
