# Duely — Smart Payment Reminders for Small Businesses

> **Duely by Dubey** — Built for the Binary-Automates Software Engineering Internship

**Get paid on time, without the awkward follow-ups.**

Duely is a smart invoice and payment reminder platform that thinks ahead so small businesses don't have to. It auto-schedules reminders, pauses when clients respond, and tells you exactly when to follow up — in the right tone.

---

## Live Demo

🔗 [duely.tech](https://duely.tech)

**Test credentials:**
- Click **"See how it works"** on the landing page to auto-fill demo credentials.
- Email: `demo@duely.tech`
- Password: `Duely@2025`

---

## Features

### Core (Assignment Requirements)
- ✅ **Invoice management** — Create, view, edit, and delete invoices with line items
- ✅ **Payment status** — Draft → Pending → Paid / Overdue lifecycle
- ✅ **Real email reminders** — Powered by Resend with React Email templates
- ✅ **Reminder activity log** — Full history of every reminder sent
- ✅ **Search & filtering** — Filter by status, date range, search by client or invoice number
- ✅ **Dashboard** — Stats cards, overdue list, upcoming reminders, paid vs unpaid chart
- ✅ **Responsive UI** — Works on mobile (bottom nav), tablet, and desktop
- ✅ **Dark Mode** — Full dark/light/system theme support

### What Makes Duely Different
- 🧠 **Smart reminder scheduling** — Auto-generates a 5-step schedule when an invoice is created
- ⏸️ **Intelligent sync** — Reminder sequences auto-cancel when invoice is marked Paid/Draft
- 📊 **Client reliability scores** — Reliable / Slow / At Risk tags based on payment history
- 🎭 **Tone-escalating emails** — Friendly → Firm → Final Notice, automatically
- 💬 **Human-sounding emails** — No robot billing language
- 👤 **Full client CRUD** — Create, edit, and delete clients with dedicated dialogs

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (App Router + Turbopack) |
| Language | TypeScript 5 |
| UI Library | shadcn/ui (base-nova) + Base UI |
| Animations | Aceternity UI + Motion |
| Styling | Tailwind CSS 4 |
| Font | Geist |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (@supabase/ssr) |
| Email | Resend + React Email |
| Theme | next-themes |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |
| Cron Jobs | Vercel Cron |

---

## Getting Started

### Prerequisites
- Node.js 20+
- A Supabase account (free)
- A Resend account (free)

### 1. Clone the repo
```bash
git clone https://github.com/UtkarshDubeyGIT/Duely-by-Dubey.git
cd Duely/duely
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=any_random_string
```

### 3. Set up the database
Run the SQL migrations **in order** in your Supabase SQL editor:
- `supabase/migrations/001_init.sql`
- `supabase/migrations/002_reminders.sql`
- `supabase/migrations/003_seed_demo_data.sql`
- `supabase/migrations/004_security_hardening.sql`
- `supabase/migrations/005_revoke_public_rpc.sql`
- `supabase/migrations/006_fix_demo_auth_tokens.sql`

### 4. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, signup pages
│   ├── (dashboard)/     # App pages (auth-guarded): dashboard, invoices, clients, reminders
│   ├── api/             # API routes + cron job
│   ├── features/        # Landing page section
│   ├── how-to-use/      # Landing page section
│   ├── future-upgrades/ # Landing page section
│   └── page.tsx         # Landing page
├── components/
│   ├── invoices/        # Invoice table, CRUD dialogs, send reminder dialog
│   ├── clients/         # Client table, create/edit/delete dialogs
│   ├── dashboard/       # Stats cards, overview, invoice detail dialog, master search
│   └── shared/          # Sidebar, topbar, mobile nav, user nav, site header/footer
├── emails/              # React Email template (PaymentReminder)
├── lib/                 # Supabase, Resend, data fetchers, reminder scheduler, utils
└── types/               # TypeScript types
```

---

## Architecture Decisions

**Why Supabase?**
Auth, database, and Row Level Security in one service. Multi-tenancy is handled by `org_id` on every table + RLS policies — one business can never see another's data.

**Why shadcn/ui (base-nova)?**
Components are copied into the codebase — full ownership, no bundle bloat from unused components. The `base-nova` style provides a modern aesthetic with full Tailwind 4 support.

**Why Resend + React Email?**
React Email means email templates are type-safe, component-based, and easy to maintain. Resend's free tier covers 3,000 emails/month.

**Why `proxy.ts` instead of `middleware.ts`?**
Next.js 16's Edge runtime requires Edge-compatible APIs only. `proxy.ts` exports a `proxy()` function that works with Vercel's Edge runtime without causing `MIDDLEWARE_INVOCATION_FAILED` errors.

**Why Vercel Cron?**
Zero additional infrastructure. The daily overdue check runs at 9am UTC, marks overdue invoices, and sends scheduled auto-reminders. Secured by `CRON_SECRET` header.

**Multi-tenancy model:**
Every business is an `Organization`. Every table has `org_id`. RLS ensures complete data isolation between businesses at the database level — not just the application layer.

**Demo data fallback:**
All server data fetchers (`lib/data.ts`) fall back to static demo data (`lib/demo-data.ts`) when Supabase is unavailable. The demo account works seamlessly without any live DB dependency.

---

## Email Flow

1. Invoice created → reminder schedule auto-generated (7 days before, 1 day before, due date, +3 days, +7 days)
2. Business owner can manually send a reminder anytime with tone toggle: Friendly / Firm / Final Notice
3. Auto-reminders run daily via cron — skipped if invoice is already paid
4. All reminders logged in `reminder_logs` with Resend message ID for tracking
5. *(Coming soon)* If client replies to email, auto-sequence pauses

---

## Security

- All secrets stored in environment variables — never committed
- Supabase service role key only used server-side (cron job)
- Cron endpoint secured by `CRON_SECRET` bearer token
- Row Level Security enforced at database level on every table
- Auth handled by Supabase (JWT sessions, secure cookie storage)
- Public RPC access revoked (migration 005)

---

## Roadmap

- [ ] Client-facing payment portal
- [ ] SMS reminders via Twilio
- [ ] Stripe payment integration
- [ ] Invoice PDF generation (`@react-pdf/renderer`)
- [ ] Email reply webhook (pause on client reply via Resend inbound)
- [ ] Multi-user orgs (invite team members — schema already supports it)
- [ ] QuickBooks / Xero integration

---

## Author

**Utkarsh Dubey** — Built for BinaryAutomates Software Engineering Internship

---

## License

MIT
