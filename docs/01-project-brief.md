# Duely — Project Brief

## Overview
**Duely** is a smart payment reminder and invoice management platform for small businesses.
Built as a take-home assignment for BinaryAutomates Software Engineering Internship.

> "Get paid on time, without the awkward follow-ups."

---

## Assignment Requirements (BinaryAutomates)

| Requirement | Implementation |
|-------------|---------------|
| Create, store, view invoices | Full CRUD via Supabase + UI |
| Send payment reminders | Resend email API with tone-aware templates |
| Update invoice/payment status | Status machine: draft → pending → paid/overdue |
| Track reminder activity | reminder_logs table + activity feed UI |
| Real email flow | Resend with React Email templates |
| Search & filtering | Client-side + server-side filtering on invoices & clients |
| Summary dashboard | Stats cards, overdue list, paid vs unpaid |
| Responsive UI | Mobile-first with Tailwind, sidebar collapses to bottom nav |

---

## What Makes Duely Different

### 1. Smart Reminder Scheduling
When an invoice is created, Duely auto-suggests a sending schedule:
- 7 days before due → gentle heads up
- 1 day before due → friendly nudge
- Day of due → firm reminder
- 3 days after → serious tone
- Business owner approves or adjusts — one click

### 2. Pause-on-Response Logic
If a client replies to any reminder email, the auto-sequence pauses automatically
and flags it for the business owner. No more robots emailing someone who already responded.

### 3. Client Reliability Score
Tracks each client's payment history:
- Average days late
- How many reminders it typically takes
- Tags: Reliable / Slow / At Risk / New

### 4. Tone-Escalating Emails
Reminder emails automatically shift tone based on how overdue the invoice is.
Toggle: Friendly → Firm → Final Notice
Pre-written smart templates, no awkward manual wording.

### 5. Human-Sounding Emails
No "INVOICE #4421 IS OVERDUE."
More like: "Hey Sarah, just a quick note on the outstanding invoice for the branding project…"

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
- App runs without errors
- UI is clear and navigable
- Code is well-organized
- Email actually sends
- No private keys or passwords committed to repo
- Shows product thinking, engineering decisions, prioritization, usability
