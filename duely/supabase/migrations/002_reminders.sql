create table public.reminder_logs (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid references public.invoices(id) on delete cascade not null,
  org_id uuid references public.organizations(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  type text not null default 'manual' check (type in ('manual', 'auto')),
  tone text not null default 'friendly' check (tone in ('friendly', 'firm', 'final_notice')),
  channel text not null default 'email' check (channel in ('email', 'sms')),
  status text not null default 'sent' check (status in ('sent', 'failed', 'paused')),
  message_id text,
  error_message text,
  sent_at timestamptz not null default now()
);

create table public.reminder_schedule (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid references public.invoices(id) on delete cascade not null,
  org_id uuid references public.organizations(id) on delete cascade not null,
  scheduled_for date not null,
  tone text not null default 'friendly' check (tone in ('friendly', 'firm', 'final_notice')),
  status text not null default 'pending' check (status in ('pending', 'sent', 'skipped', 'paused')),
  paused_reason text,
  created_at timestamptz not null default now()
);

alter table public.reminder_logs enable row level security;
alter table public.reminder_schedule enable row level security;

create policy "Org members can view reminder logs"
  on public.reminder_logs for select
  using (org_id in (select org_id from public.profiles where id = (select auth.uid())));

create policy "Org members can insert reminder logs"
  on public.reminder_logs for insert
  with check (org_id in (select org_id from public.profiles where id = (select auth.uid())));

create policy "Org members can manage reminder schedules"
  on public.reminder_schedule for all
  using (org_id in (select org_id from public.profiles where id = (select auth.uid())))
  with check (org_id in (select org_id from public.profiles where id = (select auth.uid())));

create index reminder_logs_invoice_id_idx on public.reminder_logs(invoice_id);
create index reminder_logs_org_id_idx on public.reminder_logs(org_id);
create index reminder_logs_sent_at_idx on public.reminder_logs(sent_at desc);
create index reminder_schedule_invoice_id_idx on public.reminder_schedule(invoice_id);
create index reminder_schedule_org_id_idx on public.reminder_schedule(org_id);
create index reminder_schedule_pending_idx on public.reminder_schedule(status, scheduled_for);

grant select, insert, update, delete on public.reminder_logs to authenticated;
grant select, insert, update, delete on public.reminder_schedule to authenticated;
