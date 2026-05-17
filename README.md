<img width="2172" height="511" alt="github-banner-final" src="https://github.com/user-attachments/assets/58799abf-1013-439b-b058-445382f9724f" />

# Duely — Smart Payment Reminders for Small Businesses

> **Duely by Dubey** — Built for the Binary-Automates Software Engineering Internship

**Get paid on time, without the awkward follow-ups.**

Duely is a smart invoice and payment reminder platform that thinks ahead so small businesses don't have to. It auto-schedules reminders, adjusts tone based on urgency, and provides deep insights into client payment behavior.

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
- ✅ **Invoice Management** — Create, view, edit, and delete invoices with line items and multi-currency support.
- ✅ **Payment Lifecycle** — Track status from Draft → Pending → Paid / Overdue with real-time updates.
- ✅ **Real Email Reminders** — Automated notifications powered by Resend with dynamic React Email templates.
- ✅ **Reminder Activity Log** — Full transparency with a history of every reminder sent, opened, or failed.
- ✅ **Advanced Search & Filtering** — Filter by status, date ranges, and search by client or invoice number.
- ✅ **Comprehensive Dashboard** — High-level stats, overdue alerts, upcoming reminders, and payment trend charts.
- ✅ **Responsive Design** — Fully optimized for mobile, tablet, and desktop; sidebar collapses to a bottom nav on mobile.
- ✅ **Dark Mode** — Full dark/light/system theme support via `next-themes`.

### What Makes Duely Different
- 🧠 **Smart Reminder Scheduling** — Automatically generates a 5-step sequence of reminders based on the due date.
- ⏸️ **Intelligent Sync** — Automatically cancels reminder sequences when an invoice is marked as Paid or Draft.
- 📊 **Client Reliability Scores** — Categorizes clients (Reliable, Slow, At Risk, New) based on historical payment performance.
- 🎭 **Tone-Escalating Emails** — Seamlessly transitions from *Friendly* to *Firm* to *Final Notice* as deadlines pass.
- 💬 **Human-Centric Communication** — Emails are crafted to sound professional and personal, not robotic.
- 🔒 **Full CRUD for Clients** — Create, edit, and delete clients with dedicated dialogs (shadcn-powered).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2 (App Router + Turbopack) |
| **Language** | TypeScript 5 |
| **UI Library** | shadcn/ui (base-nova style) + Base UI (@base-ui/react) |
| **Animations** | Aceternity UI (WavyBackground, DiaTextReveal) + Motion |
| **Styling** | Tailwind CSS 4 |
| **Font** | Geist (next/font/google) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (@supabase/ssr) |
| **Email** | Resend + React Email |
| **Analytics** | Recharts |
| **Forms** | React Hook Form + Zod |
| **Deployment** | Vercel |
| **Automation** | Vercel Cron |
| **Theme** | next-themes |

---

## Getting Started

### Prerequisites
- Node.js 20+
- A Supabase account
- A Resend account

### 1. Clone the repository
```bash
git clone https://github.com/UtkarshDubeyGIT/Duely-by-Dubey.git
cd Duely/duely
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```

Fill in `.env.local` with your credentials:
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
- `supabase/migrations/001_init.sql` — Core tables (organizations, profiles, clients, invoices)
- `supabase/migrations/002_reminders.sql` — Reminder logs & reminder schedules
- `supabase/migrations/003_seed_demo_data.sql` — Demo org, clients, and invoices for the test account
- `supabase/migrations/004_security_hardening.sql` — RLS tightening
- `supabase/migrations/005_revoke_public_rpc.sql` — Revoke public RPC access
- `supabase/migrations/006_fix_demo_auth_tokens.sql` — Demo account auth token fix

### 4. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Project Structure

```
duely/src/
├── app/
│   ├── (auth)/          # Authentication flows (Login, Signup)
│   ├── (dashboard)/     # Protected dashboard routes (Dashboard, Invoices, Clients, Reminders)
│   ├── api/             # API endpoints and Cron handlers
│   ├── features/        # Landing page sections (Features)
│   ├── how-to-use/      # Landing page sections (How To Use)
│   ├── future-upgrades/ # Landing page sections (Future Upgrades)
│   └── page.tsx         # Landing page
├── components/
│   ├── clients/         # Client CRUD dialogs (Create, Edit, Delete) & ClientTable
│   ├── dashboard/       # Stats cards, DashboardOverview, InvoiceDetailDialog, MasterSearch
│   ├── invoices/        # Invoice table, actions, create/delete dialogs, SendReminderDialog
│   ├── reminders/       # Reminder timeline components
│   ├── shared/          # Sidebar, TopBar, MobileNav, UserNav, SiteHeader, SiteFooter
│   └── ui/              # shadcn primitives + Aceternity components (WavyBackground, etc.)
├── emails/              # React Email template (PaymentReminder)
├── hooks/               # Custom React hooks (use-mobile)
├── lib/                 # Core logic — Supabase, Resend, data fetching, reminder scheduler
│   ├── data.ts          # React-cache-wrapped server data fetchers (with demo-data fallback)
│   ├── demo-data.ts     # Static demo data for the unauthenticated demo flow
│   ├── email.tsx        # Email sending helper
│   ├── env.ts           # Safe env-var accessors
│   ├── reminder-scheduler.ts # 5-step reminder schedule generator
│   ├── resend.ts        # Resend client
│   ├── supabase/        # Browser & server Supabase clients
│   ├── utils.ts         # cn, formatCurrency, formatDate, etc.
│   └── validations.ts   # Zod schemas (invoice, client, reminder, auth)
├── proxy.ts             # Next.js 16 Edge-compatible auth middleware (replaces middleware.ts)
└── types/               # TypeScript type definitions (index.ts)
```

---

## Architecture Decisions

**Why Supabase?**
It provides a robust backend-as-a-service with Auth, Postgres, and Row Level Security (RLS) out of the box. Multi-tenancy is handled natively by `org_id` filters and RLS policies, ensuring strict data isolation per business.

**Why Next.js 16 + React 19?**
Leverages the latest React features including Server Components, Server Actions, and optimized rendering. The App Router's route groups cleanly separate public landing pages from auth-guarded dashboard pages.

**Why shadcn/ui (base-nova) + Tailwind 4?**
shadcn copies components directly into the codebase giving full ownership and zero bundle bloat. The `base-nova` style provides a modern aesthetic. Tailwind 4 offers significant performance improvements and a simplified config.

**Why `proxy.ts` instead of `middleware.ts`?**
Next.js 16 Edge runtime requires middleware to use only Edge-compatible APIs. `proxy.ts` exports a `proxy()` function that handles auth-based redirects in a way that is fully compatible with the Vercel Edge runtime and avoids the `MIDDLEWARE_INVOCATION_FAILED` error.

**Why Vercel Cron?**
Enables serverless automation of smart reminders without managing extra infrastructure. A daily job at 9am UTC checks for overdue invoices and triggers the next step in the reminder sequence.

**Why demo-data fallback in `lib/data.ts`?**
All server-side data fetchers use a React `cache()` wrapper and fall back to a rich set of static demo data (`demo-data.ts`) when Supabase is unavailable or the user is not authenticated. This makes the demo flow seamless without any real data.

---

## Security

- **Environment Isolation** — All sensitive keys are managed via environment variables; none are committed.
- **Database Security** — Row Level Security (RLS) is enabled on all tables; public RPC access is revoked.
- **API Protection** — The Cron endpoint is secured with `CRON_SECRET` Bearer token authentication.
- **Auth** — Secure JWT-based sessions managed by Supabase SSR; middleware refreshes sessions on every request.
- **Service Role Key** — Only used server-side (cron job); never shipped in the client bundle.

---

## Roadmap

- [ ] Stripe Connect integration for instant payments
- [ ] SMS reminder support via Twilio
- [ ] Client-facing payment portal
- [ ] PDF generation for invoices (via `@react-pdf/renderer`)
- [ ] Team collaboration (Multiple users per Org)
- [ ] QuickBooks / Xero integration
- [ ] Email reply webhook (pause reminders when client replies)

---

## Author

**Utkarsh Dubey** — Built for BinaryAutomates Software Engineering Internship

---

## License

MIT
