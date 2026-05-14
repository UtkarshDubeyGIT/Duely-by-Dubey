# Duely — Smart Payment Reminders for Small Businesses

> **Duely by Dubey** — Built for the BinaryAutomates Software Engineering Internship

**Get paid on time, without the awkward follow-ups.**

Duely is a smart invoice and payment reminder platform that thinks ahead so small businesses don't have to. It auto-schedules reminders, pauses when clients respond, and tells you exactly when to follow up — in the right tone.

---

## Live Demo

🔗 [duely.vercel.app](https://duely.vercel.app)

**Test credentials:**
- Email: `demo@duely.co`
- Password: `demo1234`

---

## Features

### Core (Assignment Requirements)
- ✅ **Invoice management** — Create, view, edit, and track invoices with line items
- ✅ **Payment status** — Draft → Pending → Paid / Overdue lifecycle
- ✅ **Real email reminders** — Powered by Resend with React Email templates
- ✅ **Reminder activity log** — Full history of every reminder sent
- ✅ **Search & filtering** — Filter by status, date range, search by client or invoice number
- ✅ **Dashboard** — Stats cards, overdue list, upcoming reminders, paid vs unpaid chart
- ✅ **Responsive UI** — Works on mobile, tablet, and desktop

### What Makes Duely Different
- 🧠 **Smart reminder scheduling** — Auto-suggests a sending schedule when an invoice is created
- ⏸️ **Pause on response** — Auto-sequence pauses if a client replies
- 📊 **Client reliability scores** — Reliable / Slow / At Risk tags based on payment history
- 🎭 **Tone-escalating emails** — Friendly → Firm → Final Notice, automatically
- 💬 **Human-sounding emails** — No robot billing language

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Email | Resend + React Email |
| Deployment | Vercel |
| Cron Jobs | Vercel Cron |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase account (free)
- A Resend account (free)

### 1. Clone the repo
```bash
git clone https://github.com/aryandubey/duely.git
cd duely
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
Run the SQL migrations in order in your Supabase SQL editor:
- `supabase/migrations/001_init.sql`
- `supabase/migrations/002_reminders.sql`

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
│   ├── (dashboard)/     # App pages (auth-guarded)
│   └── api/             # API routes + cron job
├── components/
│   ├── invoices/        # Invoice table, form, dialogs
│   ├── clients/         # Client table, reliability badge
│   ├── dashboard/       # Stats cards, charts
│   └── shared/          # Sidebar, topbar, mobile nav
├── emails/              # React Email templates
├── lib/                 # Supabase, Resend, utils, validation
└── types/               # TypeScript types
```

---

## Architecture Decisions

**Why Supabase?**
Auth, database, and Row Level Security in one service. Multi-tenancy is handled by `org_id` on every table + RLS policies — one business can never see another's data.

**Why Resend + React Email?**
React Email means email templates are type-safe, component-based, and easy to maintain. Resend's free tier covers 3,000 emails/month — more than enough for a small business.

**Why Vercel Cron?**
Zero additional infrastructure. The daily overdue check runs at 9am UTC, marks overdue invoices, and sends scheduled auto-reminders. Secured by `CRON_SECRET` header.

**Multi-tenancy model:**
Every business is an `Organization`. Every table has `org_id`. RLS ensures complete data isolation between businesses at the database level — not just the application layer.

---

## Email Flow

1. Invoice created → reminder schedule auto-generated (7 days before, 1 day before, due date, +3 days, +7 days)
2. Business owner can manually send a reminder anytime with tone toggle: Friendly / Firm / Final Notice
3. Auto-reminders run daily via cron — skipped if invoice is already paid
4. All reminders logged in `reminder_logs` with Resend message ID for tracking
5. (Coming soon) If client replies to email, auto-sequence pauses

---

## Security

- All secrets stored in environment variables — never committed
- Supabase service role key only used server-side (cron job)
- Cron endpoint secured by `CRON_SECRET` bearer token
- Row Level Security enforced at database level
- Auth handled by Supabase (JWT sessions, secure cookie storage)

---

## Roadmap

- [ ] Client-facing payment portal
- [ ] SMS reminders via Twilio
- [ ] Stripe payment integration
- [ ] Per-org email domain (send from your own domain)
- [ ] Invoice PDF generation
- [ ] Multi-user orgs (invite team members)
- [ ] Webhook notifications

---

## Author

**Aryan Dubey** — Built for BinaryAutomates Software Engineering Internship

---

## License

MIT
