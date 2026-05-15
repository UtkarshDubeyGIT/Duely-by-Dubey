create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  owner_id uuid references auth.users(id) on delete cascade,
  logo_url text,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references public.organizations(id) on delete cascade not null,
  full_name text not null,
  email text not null,
  role text not null default 'owner' check (role in ('owner', 'admin', 'member')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references public.organizations(id) on delete cascade not null,
  name text not null,
  email text not null,
  phone text,
  company text,
  address text,
  notes text,
  total_invoices int not null default 0,
  avg_days_late numeric(5,2) not null default 0,
  reliability_tag text not null default 'new' check (reliability_tag in ('reliable', 'slow', 'at_risk', 'new')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references public.organizations(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  invoice_number text not null,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  tax_rate numeric(5,2) not null default 0,
  tax_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null,
  status text not null default 'draft' check (status in ('draft', 'pending', 'paid', 'overdue')),
  issued_date date not null default current_date,
  due_date date not null,
  paid_date date,
  description text,
  notes text,
  line_items jsonb not null default '[]'::jsonb,
  attachment_url text,
  attachment_name text,
  reminder_count int not null default 0,
  last_reminded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, invoice_number)
);

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.invoices enable row level security;

create policy "Users can view their organization"
  on public.organizations for select
  using (owner_id = (select auth.uid()) or id in (select org_id from public.profiles where id = (select auth.uid())));

create policy "Owners can update their organization"
  on public.organizations for update
  using (owner_id = (select auth.uid()));

create policy "Users can view their profile"
  on public.profiles for select
  using (id = (select auth.uid()));

create policy "Users can update their profile"
  on public.profiles for update
  using (id = (select auth.uid()));

create policy "Org members can manage clients"
  on public.clients for all
  using (org_id in (select org_id from public.profiles where id = (select auth.uid())))
  with check (org_id in (select org_id from public.profiles where id = (select auth.uid())));

create policy "Org members can manage invoices"
  on public.invoices for all
  using (org_id in (select org_id from public.profiles where id = (select auth.uid())))
  with check (org_id in (select org_id from public.profiles where id = (select auth.uid())));

create index clients_org_id_idx on public.clients(org_id);
create index clients_email_idx on public.clients(email);
create index invoices_org_id_idx on public.invoices(org_id);
create index invoices_client_id_idx on public.invoices(client_id);
create index invoices_status_idx on public.invoices(status);
create index invoices_due_date_idx on public.invoices(due_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

create schema if not exists private;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  new_org_id uuid;
begin
  insert into public.organizations (name, owner_id)
  values (coalesce(new.raw_user_meta_data->>'business_name', 'Dubey Studio'), new.id)
  returning id into new_org_id;

  insert into public.profiles (id, org_id, full_name, email, role)
  values (
    new.id,
    new_org_id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'owner'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.organizations to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.clients to authenticated;
grant select, insert, update, delete on public.invoices to authenticated;
