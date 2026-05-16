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
- ✅ **Invoice Management** — Create, view, edit, and track invoices with line items and multi-currency support.
- ✅ **Payment Lifecycle** — Track status from Draft → Pending → Paid / Overdue with real-time updates.
- ✅ **Real Email Reminders** — Automated notifications powered by Resend with dynamic React Email templates.
- ✅ **Reminder Activity Log** — Full transparency with a history of every reminder sent, opened, or failed.
- ✅ **Advanced Search & Filtering** — Filter by status, date ranges, and search by client or invoice number.
- ✅ **Comprehensive Dashboard** — High-level stats, overdue alerts, upcoming reminders, and payment trend charts.
- ✅ **Responsive Design** — Fully optimized for mobile, tablet, and desktop using a premium Base UI layout.

### What Makes Duely Different
- 🧠 **Smart Reminder Scheduling** — Automatically generates a 5-step sequence of reminders based on the due date.
- ⏸️ **Intelligent Sync** — Automatically cancels reminder sequences when an invoice is marked as Paid or Draft.
- 📊 **Client Reliability Scores** — Categorizes clients (Reliable, Slow, At Risk, New) based on historical payment performance.
- 🎭 **Tone-Escalating Emails** — Seamlessly transitions from *Friendly* to *Firm* to *Final Notice* as deadlines pass.
- 💬 **Human-Centric Communication** — Emails are crafted to sound professional and personal, not robotic.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2 (App Router + Turbopack) |
| **Language** | TypeScript |
| **UI Primitive** | Base UI (@base-ui/react) |
| **Styling** | Tailwind CSS 4 |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (@supabase/ssr) |
| **Email** | Resend + React Email |
| **Analytics** | Recharts |
| **Deployment** | Vercel |
| **Automation** | Vercel Cron |

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
Run the SQL migrations in order in your Supabase SQL editor:
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

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Project Structure

```
duely/src/
├── app/
│   ├── (auth)/          # Authentication flows (Login, Signup)
│   ├── (dashboard)/     # Protected dashboard routes (Invoices, Clients, Reminders)
│   └── api/             # API endpoints and Cron handlers
├── components/
│   ├── clients/         # Client management & Table logic
│   ├── dashboard/       # Stats cards and payment charts
│   ├── invoices/        # Invoice actions, forms, and dialogs
│   ├── shared/          # Navigation, Sidebar, and UserNav
│   └── ui/              # Base UI + Tailwind 4 primitives
├── emails/              # React Email templates
├── hooks/               # Custom React hooks (use-mobile, etc.)
├── lib/                 # Core logic (Supabase client, Resend, data fetching)
└── types/               # TypeScript definitions
```

---

## Architecture Decisions

**Why Supabase?**
It provides a robust backend-as-a-service with Auth, Postgres, and Row Level Security (RLS) out of the box. Multi-tenancy is handled natively by `org_id` filters and RLS policies, ensuring strict data isolation.

**Why Next.js 16 + React 19?**
Leverages the latest React features like Server Actions and optimized rendering, providing a bleeding-edge, high-performance user experience.

**Why Base UI + Tailwind 4?**
Base UI provides unstyled, accessible primitives that allow for full design control, while Tailwind 4 offers significant performance improvements and a simplified configuration model.

**Why Vercel Cron?**
Enables serverless automation of smart reminders without managing extra infrastructure. A daily job checks for overdue invoices and triggers the next step in the reminder sequence.

---

## Security

- **Environment Isolation** — All sensitive keys are managed via environment variables.
- **Database Security** — Row Level Security (RLS) is enabled on all tables; public RPC access is revoked.
- **API Protection** — Critical endpoints (like Cron) are secured with Bearer token authentication.
- **Auth** — Secure JWT-based sessions managed by Supabase SSR.

---

## Roadmap

- [ ] Stripe Connect integration for instant payments
- [ ] SMS reminder support via Twilio
- [ ] Client-facing payment portal
- [ ] PDF generation for invoices
- [ ] Team collaboration (Multiple users per Org)
- [ ] QuickBooks/Xero integration

---

## Author

**Utkarsh Dubey** — Built for BinaryAutomates Software Engineering Internship

---

## License

MIT
