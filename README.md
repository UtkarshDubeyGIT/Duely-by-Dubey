<img width="2172" height="511" alt="github-banner-final" src="https://github.com/user-attachments/assets/58799abf-1013-439b-b058-445382f9724f" />

# Duely — Smart Payment Reminders for Small Businesses

> **Duely by Dubey**

**Get paid on time, without the awkward follow-ups.**

Duely is a smart invoice and payment reminder platform that thinks ahead so small businesses don't have to. It auto-schedules reminders, adjusts tone based on urgency, and provides deep insights into client payment behaviour.

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
- ✅ **Responsive Design** — Fully optimised for mobile, tablet, and desktop; sidebar collapses to a bottom nav on mobile.
- ✅ **Dark Mode** — Full dark/light/system theme support via `next-themes`.

### What Makes Duely Different
- 🧠 **Smart Reminder Scheduling** — Automatically generates a 5-step sequence of reminders based on the due date.
- ⏸️ **Intelligent Sync** — Automatically cancels reminder sequences when an invoice is marked as Paid or Draft.
- 📊 **Client Reliability Scores** — Categorises clients (Reliable, Slow, At Risk, New) based on historical payment performance.
- 🤖 **Google Gemini AI Insights** — Dynamic, real-time financial analysis that aggregates outstanding invoices, payment histories, and client reliability to present 3 actionable dashboard recommendations.
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
| **Animations** | Aceternity UI (WavyBackground, DiaTextReveal) + Magic UI + Motion |
| **Styling** | Tailwind CSS 4 |
| **Font** | Geist (next/font/google) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (@supabase/ssr) |
| **Email** | Resend + React Email |
| **Analytics** | Recharts |
| **Forms** | React Hook Form + Zod |
| **Testing** | Vitest |
| **Deployment** | Vercel |
| **Automation** | Vercel Cron |
| **Theme** | next-themes |
| **AI Engine** | Google Gemini (gemini-2.5-flash) |

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

The repository follows a monorepo-style layout with the Next.js application isolated inside `duely/`, keeping root-level assets, docs, and CI config cleanly separated.

```
Duely/                              # Repository root
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI pipeline (Vitest)
├── assets/                         # Brand & design assets (not served by Next.js)
│   ├── Screenshots/                # App screenshots for docs/README
│   ├── design/                     # Raw design files
│   ├── frontend/                   # Frontend reference images
│   └── logos/                      # Brand logos & favicons
├── docs/                           # Project documentation (design decisions, schema, guides)
│   ├── 01-project-brief.md
│   ├── 02-tech-stack-architecture.md
│   ├── 03-database-schema.md
│   ├── 04-typescript-types.md
│   ├── 05-implementation-guide.md
│   ├── 06-design-system.md
│   ├── 07-deployment-guide.md
│   ├── 08-README.md
│   ├── 09-product-engineering-decisions.md
│   └── 10-quick-reference.md
├── duely/                          # Next.js application root
│   ├── public/                     # Statically served files (favicon, OG images)
│   ├── supabase/
│   │   └── migrations/             # Ordered SQL migration files (001–006)
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages & layouts
│   │   │   ├── (auth)/             # Route group — unauthenticated flows
│   │   │   │   ├── login/          # Login page
│   │   │   │   ├── signup/         # Signup page
│   │   │   │   ├── actions.ts      # Server Actions (signIn, signUp, signOut)
│   │   │   │   └── layout.tsx      # Auth shell layout (AuthLeftPanel + form panel)
│   │   │   ├── (dashboard)/        # Route group — auth-guarded application
│   │   │   │   ├── dashboard/      # Main dashboard page
│   │   │   │   ├── invoices/       # Invoice list page
│   │   │   │   ├── clients/        # Client management page
│   │   │   │   ├── reminders/      # Reminder activity log page
│   │   │   │   └── layout.tsx      # Dashboard shell (Sidebar + TopBar + MobileNav)
│   │   │   ├── api/                # API route handlers
│   │   │   │   ├── auth/signout/   # POST /api/auth/signout
│   │   │   │   ├── clients/        # GET/POST /api/clients, PATCH/DELETE /api/clients/[id]
│   │   │   │   ├── invoices/       # GET/POST /api/invoices, PATCH/DELETE /api/invoices/[id]
│   │   │   │   ├── dashboard/      # GET /api/dashboard (aggregated stats)
│   │   │   │   └── cron/
│   │   │   │       └── check-overdue/ # POST /api/cron/check-overdue (Vercel Cron job)
│   │   │   ├── features/           # Public marketing page — Features
│   │   │   ├── how-to-use/         # Public marketing page — How To Use
│   │   │   ├── future-upgrades/    # Public marketing page — Future Upgrades
│   │   │   ├── globals.css         # Global Tailwind + CSS variable definitions
│   │   │   ├── layout.tsx          # Root layout (ThemeProvider, Geist font)
│   │   │   ├── loading.tsx         # Root-level loading UI
│   │   │   └── page.tsx            # Landing page (Hero, Features, Pricing, CTA)
│   │   │
│   │   ├── components/             # All React UI components
│   │   │   ├── clients/            # Client feature components
│   │   │   │   ├── ClientTable.tsx
│   │   │   │   ├── ClientPaymentHistory.tsx
│   │   │   │   ├── CreateClientDialog.tsx
│   │   │   │   ├── EditClientDialog.tsx
│   │   │   │   └── DeleteClientDialog.tsx
│   │   │   ├── dashboard/          # Dashboard feature components
│   │   │   │   ├── DashboardOverview.tsx
│   │   │   │   ├── InvoiceDetailDialog.tsx
│   │   │   │   ├── MasterSearch.tsx
│   │   │   │   └── StatsCard.tsx
│   │   │   ├── invoices/           # Invoice feature components
│   │   │   │   ├── InvoiceTable.tsx
│   │   │   │   ├── InvoiceActions.tsx
│   │   │   │   ├── CreateInvoiceDialog.tsx
│   │   │   │   ├── DeleteInvoiceDialog.tsx
│   │   │   │   └── SendReminderDialog.tsx
│   │   │   ├── reminders/          # Reminder feature components
│   │   │   │   └── ReminderTimeline.tsx
│   │   │   ├── shared/             # App-wide layout & utility components
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── TopBar.tsx
│   │   │   │   ├── MobileNav.tsx
│   │   │   │   ├── UserNav.tsx
│   │   │   │   ├── SiteHeader.tsx  # Public marketing header
│   │   │   │   ├── SiteFooter.tsx  # Public marketing footer
│   │   │   │   ├── AuthLeftPanel.tsx
│   │   │   │   ├── BrandLogoLink.tsx
│   │   │   │   ├── ModeToggle.tsx
│   │   │   │   ├── AppLoader.tsx
│   │   │   │   ├── LoadingStates.tsx
│   │   │   │   └── ThemeProvider.tsx
│   │   │   └── ui/                 # Primitive UI components
│   │   │       ├── (shadcn)        # shadcn/ui primitives (button, dialog, table, etc.)
│   │   │       └── (magic/aceternity) # Animation components (WavyBackground, BentoGrid, etc.)
│   │   │
│   │   ├── emails/
│   │   │   └── PaymentReminder.tsx # React Email template (tone-aware payment reminder)
│   │   │
│   │   ├── hooks/
│   │   │   └── use-mobile.ts       # Responsive breakpoint hook
│   │   │
│   │   ├── lib/                    # Core business logic & utilities
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts       # Browser-side Supabase client
│   │   │   │   ├── server.ts       # Server-side Supabase client (SSR cookies)
│   │   │   │   └── admin.ts        # Service-role Supabase admin client (cron only)
│   │   │   ├── data.ts             # React cache() server data fetchers (with demo fallback)
│   │   │   ├── demo-data.ts        # Static demo dataset for unauthenticated preview
│   │   │   ├── email.tsx           # Email send helper (wraps Resend)
│   │   │   ├── env.ts              # Type-safe environment variable accessors
│   │   │   ├── recalculate-client.ts # Recalculates & persists client reliability score
│   │   │   ├── reliability.ts      # Client reliability scoring logic (Reliable/Slow/At Risk/New)
│   │   │   ├── reminder-scheduler.ts # 5-step reminder schedule generator
│   │   │   ├── resend.ts           # Resend client singleton
│   │   │   ├── utils.ts            # cn(), formatCurrency(), formatDate(), etc.
│   │   │   └── validations.ts      # Zod schemas (invoice, client, reminder, auth)
│   │   │
│   │   ├── types/
│   │   │   └── index.ts            # All shared TypeScript types & interfaces
│   │   │
│   │   └── proxy.ts                # Edge-compatible auth middleware (Next.js 16)
│   │
│   ├── __tests__/                  # Vitest test suite (mirrors src/ structure)
│   │   ├── lib/
│   │   │   ├── env.test.ts
│   │   │   ├── reminder-scheduler.test.ts
│   │   │   ├── utils.test.ts
│   │   │   └── validations.test.ts
│   │   ├── proxy.test.ts
│   │   └── setup.ts                # Vitest global setup
│   │
│   ├── .env.example                # Environment variable template
│   ├── components.json             # shadcn/ui configuration
│   ├── next.config.ts              # Next.js configuration
│   ├── tailwind.config.ts          # Tailwind CSS 4 configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── vercel.json                 # Vercel Cron job schedule
│   └── vitest.config.ts            # Vitest configuration
│
└── README.md                       # ← You are here
```

### Key Conventions

| Convention | Details |
|------------|---------|
| **Route Groups** | `(auth)` and `(dashboard)` are Next.js route groups — they segment the URL namespace without affecting the URL path |
| **Feature-Sliced Components** | Each product domain (`clients/`, `invoices/`, `dashboard/`, `reminders/`) owns its own components to keep context local |
| **`shared/`** | Cross-cutting layout components (navigation, theme, auth UI) that don't belong to a single feature |
| **`ui/`** | Pure, headless primitives — both shadcn/ui copies and MagicUI/Aceternity animation components |
| **`lib/`** | All business logic, data-fetching, and integrations live here — no UI imports |
| **`__tests__/`** | Co-located with `src/` at the same nesting level, mirrors `lib/` structure for easy discoverability |
| **`proxy.ts`** | Edge-runtime-safe auth middleware (replaces `middleware.ts` for Next.js 16 Vercel compatibility) |

---

## Architecture Decisions

**Why Supabase?**
It provides a robust backend-as-a-service with Auth, Postgres, and Row Level Security (RLS) out of the box. Multi-tenancy is handled natively by `org_id` filters and RLS policies, ensuring strict data isolation per business.

**Why Next.js 16 + React 19?**
Leverages the latest React features including Server Components, Server Actions, and optimised rendering. The App Router's route groups cleanly separate public landing pages from auth-guarded dashboard pages.

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

## Testing

```bash
cd duely
npm run test          # Run all tests (Vitest)
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

Tests live in `src/__tests__/` and cover:
- `lib/utils.ts` — Formatting utilities
- `lib/validations.ts` — Zod schema validation
- `lib/reminder-scheduler.ts` — Scheduling logic
- `lib/env.ts` — Environment variable safety
- `proxy.ts` — Auth middleware routing

CI runs automatically on every push via `.github/workflows/ci.yml`.

---

## Roadmap

- [ ] Stripe Connect integration for instant payments
- [ ] SMS reminder support via Twilio
- [ ] Client-facing payment portal
- [ ] PDF generation for invoices (via `@react-pdf/renderer`)
- [ ] Team collaboration (Multiple users per Org)
- [ ] QuickBooks / Xero integration
- [ ] Email reply webhook (pause reminders when client replies)
- [ ] AI Predictive Cash Flow v2 (predicting cash flow constraints & suggesting optimal invoicing dates)

---

## Author

**Utkarsh Dubey** — Built for Empowering Small Businesses

---

## License

MIT
