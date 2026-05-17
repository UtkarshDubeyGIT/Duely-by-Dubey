# Duely — Quick Reference Cheatsheet

## Commands

```bash
npm run dev          # start local dev server (Next.js 16 + Turbopack)
npm run build        # production build
npm run lint         # eslint check
```

## Key File Locations

| What | Where |
|------|-------|
| Types | `src/types/index.ts` |
| Server data fetchers | `src/lib/data.ts` |
| Demo fallback data | `src/lib/demo-data.ts` |
| Supabase client (browser) | `src/lib/supabase/client.ts` |
| Supabase client (server) | `src/lib/supabase/server.ts` |
| Auth middleware (Edge proxy) | `src/proxy.ts` |
| Safe env-var accessors | `src/lib/env.ts` |
| Utility functions | `src/lib/utils.ts` |
| Form validation schemas | `src/lib/validations.ts` |
| Reminder scheduler logic | `src/lib/reminder-scheduler.ts` |
| Email sending helper | `src/lib/email.tsx` |
| Resend config | `src/lib/resend.ts` |
| Email template | `src/emails/PaymentReminder.tsx` |
| Database migrations | `supabase/migrations/` |
| Cron job | `src/app/api/cron/check-overdue/route.ts` |
| Landing page | `src/app/page.tsx` |
| Dashboard layout | `src/app/(dashboard)/layout.tsx` |
| Root layout (font/theme) | `src/app/layout.tsx` |
| Global styles | `src/app/globals.css` |
| shadcn config | `components.json` |
| Vercel cron config | `vercel.json` |

## API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/invoices | List invoices (filterable by status, search, page) |
| POST | /api/invoices | Create invoice + auto-schedule reminders |
| GET | /api/invoices/[id] | Get single invoice |
| PATCH | /api/invoices/[id] | Update invoice (status, notes, etc.) |
| DELETE | /api/invoices/[id] | Delete invoice |
| POST | /api/invoices/[id]/remind | Send reminder email |
| GET | /api/clients | List clients |
| POST | /api/clients | Create client |
| GET | /api/clients/[id] | Get single client |
| PATCH | /api/clients/[id] | Update client |
| DELETE | /api/clients/[id] | Delete client |
| GET | /api/dashboard | Dashboard stats + data |
| GET | /api/auth/callback | Supabase OAuth/magic-link callback |
| POST | /api/cron/check-overdue | Daily cron (Bearer token secured) |

## Invoice Status Flow

```
draft ──► pending ──► paid
              │
              ▼ (cron at 9am UTC, when due_date < today)
           overdue
```

## Reminder Tone Guide

| Tone | When | Subject line style |
|------|------|-------------------|
| friendly | Before/on due date | "Payment reminder: INV-0042" |
| firm | 1-7 days overdue | "Invoice INV-0042 — payment overdue" |
| final_notice | 7+ days overdue | "Final notice: Invoice INV-0042" |

## Auto-Reminder Schedule (relative to due_date)

| Offset | Tone | Label |
|--------|------|-------|
| -7 days | friendly | Heads up |
| -1 day | friendly | Gentle nudge |
| 0 days | firm | Due today |
| +3 days | firm | Overdue |
| +7 days | final_notice | Final notice |

## Client Reliability Tags

| Tag | Condition |
|-----|-----------|
| new | No payment history yet |
| reliable | avg_days_late ≤ 3 |
| slow | avg_days_late 4–10 |
| at_risk | avg_days_late > 10 |

## Color Reference

```
Sidebar bg:     #09090B (zinc-950)
Accent/CTA:     #4B39E6 (indigo)
Accent green:   #22C55E (green)
Hero bg:        #F9F9F7 (warm off-white)
Hero text:      #181C22 (near-black)
Border subtle:  #D8D8D8
Paid:           bg-green-100 text-green-700
Pending:        bg-amber-100 text-amber-700
Overdue:        bg-red-100 text-red-700
Draft:          bg-zinc-100 text-zinc-600
```

## Supabase Tables

```
organizations     → one per business (created on signup via handle_new_user trigger)
profiles          → one per user (links user to org, stores role)
clients           → people who owe money
invoices          → money owed (with line_items as JSONB)
reminder_logs     → history of every sent reminder
reminder_schedule → upcoming auto-reminders (5 per invoice)
```

## Database Migrations (run in order)

| File | Purpose |
|------|---------|
| 001_init.sql | Core tables: organizations, profiles, clients, invoices |
| 002_reminders.sql | reminder_logs, reminder_schedule, handle_new_user trigger |
| 003_seed_demo_data.sql | Demo org, clients, invoices for demo@duely.tech |
| 004_security_hardening.sql | Tightened RLS policies |
| 005_revoke_public_rpc.sql | Revoke public RPC access |
| 006_fix_demo_auth_tokens.sql | Fix demo account auth token handling |

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Supabase anon (public) key
SUPABASE_SERVICE_ROLE_KEY         # Supabase service role (SERVER ONLY)
RESEND_API_KEY                    # Resend API key
NEXT_PUBLIC_APP_URL               # App URL (localhost or vercel)
CRON_SECRET                       # Random string for cron security
```

## Component Index

| Component | Path | Purpose |
|-----------|------|---------|
| InvoiceTable | components/invoices/InvoiceTable.tsx | Invoice list with filters + actions |
| InvoiceActions | components/invoices/InvoiceActions.tsx | Row action menu (view, send, delete) |
| CreateInvoiceDialog | components/invoices/CreateInvoiceDialog.tsx | Create new invoice with line items |
| SendReminderDialog | components/invoices/SendReminderDialog.tsx | Send reminder with tone selector |
| DeleteInvoiceDialog | components/invoices/DeleteInvoiceDialog.tsx | Confirm invoice deletion |
| ClientTable | components/clients/ClientTable.tsx | Client list with reliability badges + actions |
| CreateClientDialog | components/clients/CreateClientDialog.tsx | Create new client |
| EditClientDialog | components/clients/EditClientDialog.tsx | Edit existing client |
| DeleteClientDialog | components/clients/DeleteClientDialog.tsx | Confirm client deletion |
| DashboardOverview | components/dashboard/DashboardOverview.tsx | Stats cards + overdue list + reminders |
| InvoiceDetailDialog | components/dashboard/InvoiceDetailDialog.tsx | Full invoice detail sheet |
| MasterSearch | components/dashboard/MasterSearch.tsx | Global cmd-K search |
| StatsCard | components/dashboard/StatsCard.tsx | Individual stat card with trend |
| Sidebar | components/shared/Sidebar.tsx | Dashboard sidebar (shadcn Sidebar primitive) |
| TopBar | components/shared/TopBar.tsx | Dashboard top bar |
| MobileNav | components/shared/MobileNav.tsx | Mobile bottom navigation |
| UserNav | components/shared/UserNav.tsx | User dropdown (sign out, profile) |
| SiteHeader | components/shared/SiteHeader.tsx | Landing page header/nav |
| SiteFooter | components/shared/SiteFooter.tsx | Landing page footer |
| ModeToggle | components/shared/ModeToggle.tsx | Light/dark/system theme switcher |
| WavyBackground | components/ui/wavy-background.tsx | Aceternity wavy canvas bg |
| DiaTextReveal | components/ui/dia-text-reveal.tsx | Animated text reveal on landing |

## Useful Supabase Queries (SQL Editor)

Check all orgs:
```sql
select * from organizations;
```

Check invoices for an org:
```sql
select * from invoices where org_id = 'your-org-id' order by created_at desc;
```

Check reminder schedule:
```sql
select rs.*, i.invoice_number, c.name
from reminder_schedule rs
join invoices i on i.id = rs.invoice_id
join clients c on c.id = i.client_id
where rs.status = 'pending'
order by rs.scheduled_for;
```

Manually trigger overdue marking:
```sql
update invoices
set status = 'overdue'
where status = 'pending' and due_date < current_date;
```

Check demo user profile:
```sql
select p.*, o.name as org_name
from profiles p
join organizations o on o.id = p.org_id
where p.email = 'demo@duely.tech';
```
