<img width="2172" height="511" alt="github-banner-final" src="https://github.com/user-attachments/assets/58799abf-1013-439b-b058-445382f9724f" />

# Duely — Smart Payment Reminders for Small Businesses

> **Duely by Dubey** — Built for the Binary-Automates Software Engineering Internship

**Get paid on time, without the awkward follow-ups.**

Duely is a smart invoice and payment reminder platform that thinks ahead so small businesses don't have to. It auto-schedules reminders, adjusts tone based on urgency, and provides deep insights into client payment behavior.

---

## Live Demo

🔗 [duely.tech](https://duely.tech)

**Test credentials:**
- Email: `demo@duely.co`
- Password: `demo1234`

---

## Features

### Core (Assignment Requirements)
- ✅ **Invoice Management** — Create, view, edit, and track invoices with line items and multi-currency support.
- ✅ **Payment Lifecycle** — Track status from Draft → Pending → Paid / Overdue with real-time updates.
- ✅ **Real Email Reminders** — Automated notifications powered by Resend with dynamic React Email templates.
- ✅ **Reminder Activity Log** — Full transparency with a history of every reminder sent, opened, or failed.
- ✅ **Advanced Search & Filtering** — Filter by status, date ranges, and search by client or invoice number.
- ✅ **Comprehensive Dashboard** — High-level stats, overdue alerts, upcoming reminders, and payment trend charts.
- ✅ **Responsive Design** — Fully optimized for mobile, tablet, and desktop using a premium Shadcn/UI layout.

### What Makes Duely Different
- 🧠 **Smart Reminder Scheduling** — Automatically generates a sequence of reminders based on the due date.
- ⏸️ **Intelligent Pause** — Automatically pauses reminder sequences when a client responds or payment is detected.
- 📊 **Client Reliability Scores** — Categorizes clients (Reliable, Slow, At Risk) based on historical payment performance.
- 🎭 **Tone-Escalating Emails** — Seamlessly transitions from *Friendly* to *Firm* to *Final Notice* as deadlines pass.
- 💬 **Human-Centric Communication** — Emails are crafted to sound professional and personal, not robotic.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 + Shadcn/UI |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Email** | Resend + React Email |
| **Analytics** | Recharts |
| **Deployment** | Vercel |
| **Automation** | Vercel Cron |

---

## Getting Started

### Prerequisites
- Node.js 18+
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
│   ├── clients/         # Client management components & Reliability badges
│   ├── dashboard/       # Stats cards and payment charts
│   ├── invoices/        # Invoice tables, forms, and dialogs
│   ├── shared/          # Navigation, Sidebar, and Layout elements
│   └── ui/              # Base Shadcn/UI components
├── emails/              # React Email templates
├── hooks/               # Custom React hooks
├── lib/                 # Shared utilities (Supabase client, Resend, etc.)
└── types/               # TypeScript definitions
```

---

## Architecture Decisions

**Why Supabase?**
It provides a robust backend-as-a-service with Auth, Postgres, and Row Level Security (RLS) out of the box. Multi-tenancy is handled natively by `organization_id` filters and RLS policies, ensuring data isolation.

**Why Resend + React Email?**
React Email allows us to build templates with the same component-based logic as our UI, making them easy to test and maintain. Resend provides a developer-friendly API for reliable delivery.

**Why Vercel Cron?**
It enables serverless automation feature of Automatic reminders without managing extra infrastructure. A daily job checks for overdue invoices and triggers the next step in the reminder sequence. 

**Data Isolation:**
Every record is scoped to an `organization_id`. Database-level RLS policies ensure that users can only access data belonging to their specific organization.

---

## Security

- **Environment Isolation** — All sensitive keys are managed via environment variables.
- **Database Security** — Row Level Security (RLS) is enabled on all tables.
- **API Protection** — Critical endpoints (like Cron) are secured with Bearer token authentication.
- **Auth** — Secure JWT-based sessions managed by Supabase.

---

## Roadmap

- [ ] Stripe Connect integration for instant payments
- [ ] SMS reminder support via Twilio
- [ ] Client-facing payment portal
- [ ] PDF generation for invoices
- [ ] Team collaboration (Multiple users per Org)
- [ ] QuickBooks/Xero integration
