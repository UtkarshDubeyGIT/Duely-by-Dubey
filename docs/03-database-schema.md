# Duely — Database Schema & Migrations

## Overview
PostgreSQL via Supabase. Multi-tenant via `org_id` on every table.
Row Level Security (RLS) ensures org-level data isolation.

---

## Entity Relationship

```
auth.users (Supabase managed)
    │
    └── profiles (1:1)
            │
            └── organizations (many users per org, owner is one user)
                    │
                    ├── clients (1:many)
                    │       │
                    │       └── invoices (1:many)
                    │               │
                    │               └── reminder_logs (1:many)
                    │               └── reminder_schedule (1:many)
                    │
                    └── invoices (also directly linked to org)
```

---

## Migration 001 — Core Tables

```sql
-- migrations/001_init.sql

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- ORGANIZATIONS
-- Each business that signs up is one org
-- ─────────────────────────────────────────
create table organizations (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  owner_id    uuid references auth.users(id) on delete cascade,
  logo_url    text,
  created_at  timestamptz default now()
);

alter table organizations enable row level security;

create policy "Users can view their own org"
  on organizations for select
  using (owner_id = auth.uid());

create policy "Users can update their own org"
  on organizations for update
  using (owner_id = auth.uid());


-- ─────────────────────────────────────────
-- PROFILES
-- Extended user data, linked to org
-- ─────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  org_id      uuid references organizations(id) on delete cascade,
  full_name   text,
  email       text,
  role        text default 'owner' check (role in ('owner', 'admin', 'member')),
  avatar_url  text,
  created_at  timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (id = auth.uid());

create policy "Users can update own profile"
  on profiles for update
  using (id = auth.uid());


-- ─────────────────────────────────────────
-- CLIENTS
-- Businesses/people who owe money
-- ─────────────────────────────────────────
create table clients (
  id              uuid primary key default uuid_generate_v4(),
  org_id          uuid references organizations(id) on delete cascade not null,
  name            text not null,
  email           text not null,
  phone           text,
  company         text,
  address         text,
  notes           text,

  -- Reliability scoring (computed, updated by cron)
  total_invoices      int default 0,
  avg_days_late       numeric(5,2) default 0,
  reliability_tag     text default 'new'
    check (reliability_tag in ('reliable', 'slow', 'at_risk', 'new')),

  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table clients enable row level security;

create policy "Org members can CRUD their clients"
  on clients for all
  using (
    org_id in (
      select org_id from profiles where id = auth.uid()
    )
  );

create index on clients(org_id);
create index on clients(email);


-- ─────────────────────────────────────────
-- INVOICES
-- Core entity — money owed
-- ─────────────────────────────────────────
create table invoices (
  id              uuid primary key default uuid_generate_v4(),
  org_id          uuid references organizations(id) on delete cascade not null,
  client_id       uuid references clients(id) on delete cascade not null,

  invoice_number  text not null,          -- e.g. INV-0042
  amount          numeric(12,2) not null,
  currency        text default 'USD',
  tax_rate        numeric(5,2) default 0,
  tax_amount      numeric(12,2) default 0,
  total_amount    numeric(12,2) not null,

  status          text default 'draft'
    check (status in ('draft', 'pending', 'paid', 'overdue')),

  issued_date     date not null default current_date,
  due_date        date not null,
  paid_date       date,

  description     text,
  notes           text,
  line_items      jsonb default '[]',     -- array of {description, qty, price, amount}

  -- File attachment
  attachment_url  text,
  attachment_name text,

  -- Reminder tracking
  reminder_count  int default 0,
  last_reminded_at timestamptz,

  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table invoices enable row level security;

create policy "Org members can CRUD their invoices"
  on invoices for all
  using (
    org_id in (
      select org_id from profiles where id = auth.uid()
    )
  );

create index on invoices(org_id);
create index on invoices(client_id);
create index on invoices(status);
create index on invoices(due_date);
```

---

## Migration 002 — Reminders & Scheduling

```sql
-- migrations/002_reminders.sql

-- ─────────────────────────────────────────
-- REMINDER LOGS
-- Record of every reminder sent
-- ─────────────────────────────────────────
create table reminder_logs (
  id            uuid primary key default uuid_generate_v4(),
  invoice_id    uuid references invoices(id) on delete cascade not null,
  org_id        uuid references organizations(id) on delete cascade not null,
  client_id     uuid references clients(id) on delete cascade not null,

  type          text default 'manual'
    check (type in ('manual', 'auto')),
  tone          text default 'friendly'
    check (tone in ('friendly', 'firm', 'final_notice')),
  channel       text default 'email'
    check (channel in ('email', 'sms')),
  status        text default 'sent'
    check (status in ('sent', 'failed', 'paused')),

  -- Resend message ID for tracking
  message_id    text,
  error_message text,

  sent_at       timestamptz default now()
);

alter table reminder_logs enable row level security;

create policy "Org members can view their reminder logs"
  on reminder_logs for select
  using (
    org_id in (
      select org_id from profiles where id = auth.uid()
    )
  );

create policy "Org members can insert reminder logs"
  on reminder_logs for insert
  with check (
    org_id in (
      select org_id from profiles where id = auth.uid()
    )
  );

create index on reminder_logs(invoice_id);
create index on reminder_logs(org_id);
create index on reminder_logs(sent_at desc);


-- ─────────────────────────────────────────
-- REMINDER SCHEDULE
-- Auto-suggested schedule per invoice
-- ─────────────────────────────────────────
create table reminder_schedule (
  id            uuid primary key default uuid_generate_v4(),
  invoice_id    uuid references invoices(id) on delete cascade not null,
  org_id        uuid references organizations(id) on delete cascade not null,

  scheduled_for date not null,          -- when to send
  tone          text default 'friendly'
    check (tone in ('friendly', 'firm', 'final_notice')),
  status        text default 'pending'
    check (status in ('pending', 'sent', 'skipped', 'paused')),

  -- If client replied, pause all future reminders
  paused_reason text,

  created_at    timestamptz default now()
);

alter table reminder_schedule enable row level security;

create policy "Org members can manage reminder schedules"
  on reminder_schedule for all
  using (
    org_id in (
      select org_id from profiles where id = auth.uid()
    )
  );

create index on reminder_schedule(invoice_id);
create index on reminder_schedule(scheduled_for);
create index on reminder_schedule(status);


-- ─────────────────────────────────────────
-- HELPER FUNCTION: Auto-update updated_at
-- ─────────────────────────────────────────
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger invoices_updated_at
  before update on invoices
  for each row execute procedure handle_updated_at();

create trigger clients_updated_at
  before update on clients
  for each row execute procedure handle_updated_at();


-- ─────────────────────────────────────────
-- HELPER FUNCTION: Create org + profile on signup
-- Run this as a Supabase Database Function triggered on auth.users insert
-- ─────────────────────────────────────────
create or replace function handle_new_user()
returns trigger as $$
declare
  new_org_id uuid;
begin
  -- Create organization
  insert into organizations (name, owner_id)
  values (
    coalesce(new.raw_user_meta_data->>'business_name', 'My Business'),
    new.id
  )
  returning id into new_org_id;

  -- Create profile
  insert into profiles (id, org_id, full_name, email)
  values (
    new.id,
    new_org_id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

---

## Data Types Reference

### Invoice Status Flow
```
draft → pending → paid
              ↓
           overdue (set by cron when due_date < today and status = pending)
```

### Line Items (JSONB)
```json
[
  {
    "id": "1",
    "description": "Website Design",
    "qty": 1,
    "price": 2500.00,
    "amount": 2500.00
  },
  {
    "id": "2",
    "description": "SEO Optimization",
    "qty": 3,
    "price": 500.00,
    "amount": 1500.00
  }
]
```

### Reminder Schedule Auto-Generation Logic
When an invoice is created with a due_date, auto-generate:

```
due_date - 7 days  → tone: friendly   (heads up)
due_date - 1 day   → tone: friendly   (gentle nudge)
due_date + 0 days  → tone: firm       (due today)
due_date + 3 days  → tone: firm       (overdue)
due_date + 7 days  → tone: final_notice
```

---

## Useful Supabase Queries

### Dashboard stats
```sql
select
  count(*) filter (where status != 'draft') as total_invoices,
  sum(total_amount) filter (where status = 'pending' or status = 'overdue') as unpaid_amount,
  count(*) filter (where status = 'overdue') as overdue_count,
  sum(total_amount) filter (
    where status = 'paid'
    and date_trunc('month', paid_date) = date_trunc('month', current_date)
  ) as paid_this_month
from invoices
where org_id = $1;
```

### Mark overdue (cron job)
```sql
update invoices
set status = 'overdue', updated_at = now()
where
  status = 'pending'
  and due_date < current_date;
```

### Client reliability update
```sql
update clients c
set
  avg_days_late = (
    select avg(greatest(i.paid_date - i.due_date, 0))
    from invoices i
    where i.client_id = c.id and i.paid_date is not null
  ),
  total_invoices = (
    select count(*) from invoices i where i.client_id = c.id
  ),
  reliability_tag = case
    when avg_days_late <= 3 then 'reliable'
    when avg_days_late <= 10 then 'slow'
    when avg_days_late > 10 then 'at_risk'
    else 'new'
  end
where org_id = $1;
```
