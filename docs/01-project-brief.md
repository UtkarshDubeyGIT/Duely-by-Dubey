# Duely — Project Brief

## Overview
**Duely** is a smart payment reminder and invoice management platform for small businesses.
Built as a take-home assignment for BinaryAutomates Software Engineering Internship.

> "Get paid on time, without the awkward follow-ups."

---

## Assignment Requirements (BinaryAutomates)

| Requirement | Implementation |
|-------------|---------------|
| Create, store, view invoices | Full CRUD via Supabase + UI (Create/Delete dialogs, InvoiceTable) |
| Send payment reminders | Resend email API with tone-aware React Email templates |
| Update invoice/payment status | Status machine: draft → pending → paid/overdue |
| Track reminder activity | reminder_logs table + Reminders page with activity timeline |
| Real email flow | Resend with React Email template (PaymentReminder.tsx) |
| Search & filtering | Client-side + server-side filtering on invoices & clients |
| Summary dashboard | Stats cards, overdue list, upcoming reminders, paid vs unpaid |
| Responsive UI | Mobile-first with Tailwind 4; sidebar collapses to a bottom nav on mobile |

---

## What Makes Duely Different

### 1. Smart Reminder Scheduling
When an invoice is created, Duely auto-generates a 5-step sending schedule:
- 7 days before due → gentle heads up
- 1 day before due → friendly nudge
- Day of due → firm reminder
- 3 days after → serious tone
- 7 days after → final notice

### 2. Pause-on-Response Logic *(planned)*
If a client replies to any reminder email, the auto-sequence pauses automatically
and flags it for the business owner. Implemented via Resend inbound email webhooks.

### 3. Client Reliability Score
Tracks each client's payment history:
- Average days late
- How many reminders it typically takes
- Tags: Reliable / Slow / At Risk / New
- Full CRUD — clients can be created, edited, and deleted from the dashboard

### 4. Tone-Escalating Emails
Reminder emails automatically shift tone based on how overdue the invoice is.
Toggle: Friendly → Firm → Final Notice
Pre-written smart templates, no awkward manual wording.

### 5. Human-Sounding Emails
No "INVOICE #4421 IS OVERDUE."
More like: "Hey Sarah, just a quick note on the outstanding invoice for the branding project…"

### 6. Dark Mode & Theme Support
Full light/dark/system theme support using `next-themes` — the UI looks polished in any environment.

### 7. Demo Data Layer
All server data fetchers fall back to rich static demo data (`lib/demo-data.ts`) when
Supabase is unavailable or the user is not authenticated. The demo flow works end-to-end
without needing a real database connection.

---

## Target Users
Small businesses of all types:
- Freelancers & consultants
- Small agencies & studios
- Brick-and-mortar service businesses
- Any business that invoices clients

---

## Brand
- **Name:** Duely (play on "due date" + "duly noted")
- **Submission name:** Duely by Dubey
- **Tagline:** Get paid on time, without the awkward follow-ups.
- **Vibe:** Bold & confident (like Stripe), clean (like Linear), approachable (like Mailchimp)

---

## Success Metrics (for review)
- App runs without errors on Vercel + locally
- UI is clear and navigable on mobile and desktop
- Code is well-organized with a clear separation of concerns
- Email actually sends via Resend
- No private keys or passwords committed to repo
- Shows product thinking, engineering decisions, prioritization, and usability
