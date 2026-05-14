# Duely — Quick Reference Cheatsheet

## Commands

```bash
npm run dev          # start local dev server
npm run build        # production build
npm run lint         # eslint check
```

## Key File Locations

| What | Where |
|------|-------|
| Types | src/types/index.ts |
| Supabase client (browser) | src/lib/supabase/client.ts |
| Supabase client (server) | src/lib/supabase/server.ts |
| Auth middleware | middleware.ts (root) |
| Utility functions | src/lib/utils.ts |
| Form validation schemas | src/lib/validations.ts |
| Reminder scheduler logic | src/lib/reminder-scheduler.ts |
| Resend config | src/lib/resend.ts |
| Email templates | src/emails/ |
| Database migrations | supabase/migrations/ |
| Cron job | src/app/api/cron/check-overdue/route.ts |

## API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/invoices | List invoices (filterable) |
| POST | /api/invoices | Create invoice + auto-schedule |
| GET | /api/invoices/[id] | Get single invoice |
| PATCH | /api/invoices/[id] | Update invoice (status, etc) |
| DELETE | /api/invoices/[id] | Delete invoice |
| POST | /api/invoices/[id]/remind | Send reminder email |
| GET | /api/clients | List clients |
| POST | /api/clients | Create client |
| GET | /api/clients/[id] | Get single client |
| PATCH | /api/clients/[id] | Update client |
| DELETE | /api/clients/[id] | Delete client |
| GET | /api/dashboard | Dashboard stats + data |
| POST | /api/cron/check-overdue | Daily cron (secured) |

## Invoice Status Flow

```
draft ──► pending ──► paid
              │
              ▼ (cron, when due_date < today)
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
Accent/CTA:     #5B4CF5 (indigo-600)
Page bg:        #FAFAFA (zinc-50)
Card bg:        #FFFFFF
Border:         #E4E4E7 (zinc-200)
Paid:           bg-green-100 text-green-700
Pending:        bg-amber-100 text-amber-700
Overdue:        bg-red-100 text-red-700
Draft:          bg-zinc-100 text-zinc-600
```

## Supabase Tables

```
organizations     → one per business
profiles          → one per user (links to org)
clients           → people who owe money
invoices          → money owed
reminder_logs     → history of sent reminders
reminder_schedule → upcoming auto-reminders
```

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Supabase anon (public) key
SUPABASE_SERVICE_ROLE_KEY         # Supabase service role (SERVER ONLY)
RESEND_API_KEY                    # Resend API key
NEXT_PUBLIC_APP_URL               # App URL (localhost or vercel)
CRON_SECRET                       # Random string for cron security
```

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
