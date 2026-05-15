insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  email_change_token_current,
  reauthentication_token,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) values (
  '00000000-0000-4000-8000-000000000010',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo@duely.tech',
  crypt('Duely@2025', gen_salt('bf')),
  now(),
  '',
  '',
  '',
  '',
  '',
  '',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Siddhant Dubey","business_name":"Dubey Studio"}'::jsonb,
  now(),
  now()
) on conflict (id) do nothing;

insert into auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  '00000000-0000-4000-8000-000000000011',
  'demo@duely.tech',
  '00000000-0000-4000-8000-000000000010',
  '{"sub":"00000000-0000-4000-8000-000000000010","email":"demo@duely.tech","email_verified":true,"phone_verified":false}'::jsonb,
  'email',
  now(),
  now(),
  now()
) on conflict (provider, provider_id) do nothing;

with demo_org as (
  select org_id from public.profiles where id = '00000000-0000-4000-8000-000000000010'
)
insert into public.clients (id, org_id, name, email, phone, company, address, notes, total_invoices, avg_days_late, reliability_tag)
select '10000000-0000-4000-8000-000000000001'::uuid, org_id, 'Sarah Chen', 'sarah@northstar.studio', '+1 415 555 0198', 'Northstar Studio', '580 Market St, San Francisco, CA', 'Pays quickly once reminded.', 4, 1.5, 'reliable' from demo_org
union all
select '10000000-0000-4000-8000-000000000002', org_id, 'Marcus Lee', 'marcus@pixelcraft.io', '+1 646 555 0104', 'Pixelcraft Labs', '41 W 25th St, New York, NY', 'Usually needs two reminders.', 6, 7.2, 'slow' from demo_org
union all
select '10000000-0000-4000-8000-000000000003', org_id, 'Avery Brooks', 'avery@fieldstone.co', '+1 312 555 0182', 'Fieldstone Co.', '190 N State St, Chicago, IL', 'High-touch follow-up recommended.', 3, 13.4, 'at_risk' from demo_org
union all
select '10000000-0000-4000-8000-000000000004', org_id, 'Utkarsh Dubey', 'utkarshd9990@gmail.com', null, 'Personal', null, 'Verification seed client.', 0, 0, 'new' from demo_org
union all
select '10000000-0000-4000-8000-000000000005', org_id, 'Utkarsh Dubey', 'utkarsh.dubey.ug23@nsut.ac.in', null, 'NSUT', null, 'Verification seed client.', 0, 0, 'new' from demo_org
union all
select '10000000-0000-4000-8000-000000000006', org_id, 'Utkarsh Dubey', 'dubeysbox@gmail.com', null, 'Personal', null, 'Verification seed client.', 0, 0, 'new' from demo_org
on conflict (id) do nothing;

with demo_org as (
  select org_id from public.profiles where id = '00000000-0000-4000-8000-000000000010'
)
insert into public.invoices (id, org_id, client_id, invoice_number, amount, total_amount, status, issued_date, due_date, paid_date, description, notes, line_items, reminder_count, last_reminded_at)
select '20000000-0000-4000-8000-000000000001'::uuid, org_id, '10000000-0000-4000-8000-000000000001'::uuid, 'INV-0042', 4200, 4200, 'pending', '2026-05-10'::date, '2026-05-22'::date, null::date, 'Brand identity sprint', 'Friendly reminder scheduled one day before due.', '[{"id":"li-1","description":"Brand identity sprint","qty":1,"price":4200,"amount":4200}]'::jsonb, 1, '2026-05-14T09:00:00Z'::timestamptz from demo_org
union all
select '20000000-0000-4000-8000-000000000002', org_id, '10000000-0000-4000-8000-000000000002', 'INV-0041', 7850, 7850, 'overdue', '2026-04-18', '2026-05-08', null, 'Product landing page', 'Escalate to firm tone.', '[{"id":"li-2","description":"Product landing page","qty":1,"price":7850,"amount":7850}]'::jsonb, 2, '2026-05-12T09:00:00Z' from demo_org
union all
select '20000000-0000-4000-8000-000000000003', org_id, '10000000-0000-4000-8000-000000000003', 'INV-0040', 3100, 3100, 'overdue', '2026-04-05', '2026-04-28', null, 'Retainer balance', 'Final notice candidate.', '[{"id":"li-3","description":"Retainer balance","qty":1,"price":3100,"amount":3100}]'::jsonb, 3, '2026-05-09T09:00:00Z' from demo_org
union all
select '20000000-0000-4000-8000-000000000004', org_id, '10000000-0000-4000-8000-000000000001', 'INV-0039', 2600, 2600, 'paid', '2026-04-22', '2026-05-06', '2026-05-05', 'Workshop facilitation', null, '[{"id":"li-4","description":"Workshop facilitation","qty":1,"price":2600,"amount":2600}]'::jsonb, 0, null from demo_org
union all
select '20000000-0000-4000-8000-000000000005', org_id, '10000000-0000-4000-8000-000000000002', 'INV-0038', 1900, 1900, 'draft', '2026-05-15', '2026-05-29', null, 'Conversion audit', 'Draft awaiting approval.', '[{"id":"li-5","description":"Conversion audit","qty":1,"price":1900,"amount":1900}]'::jsonb, 0, null from demo_org
on conflict (id) do nothing;

with demo_org as (
  select org_id from public.profiles where id = '00000000-0000-4000-8000-000000000010'
)
insert into public.reminder_logs (id, invoice_id, org_id, client_id, type, tone, channel, status, message_id, sent_at)
select '30000000-0000-4000-8000-000000000001'::uuid, '20000000-0000-4000-8000-000000000001'::uuid, org_id, '10000000-0000-4000-8000-000000000001'::uuid, 'manual', 'friendly', 'email', 'sent', 'demo-msg-1', '2026-05-14T09:00:00Z'::timestamptz from demo_org
union all
select '30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', org_id, '10000000-0000-4000-8000-000000000002', 'auto', 'firm', 'email', 'sent', 'demo-msg-2', '2026-05-12T09:00:00Z' from demo_org
union all
select '30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000003', org_id, '10000000-0000-4000-8000-000000000003', 'manual', 'final_notice', 'email', 'sent', 'demo-msg-3', '2026-05-09T09:00:00Z' from demo_org
on conflict (id) do nothing;

with demo_org as (
  select org_id from public.profiles where id = '00000000-0000-4000-8000-000000000010'
)
insert into public.reminder_schedule (id, invoice_id, org_id, scheduled_for, tone, status)
select '40000000-0000-4000-8000-000000000001'::uuid, '20000000-0000-4000-8000-000000000001'::uuid, org_id, '2026-05-21'::date, 'friendly', 'pending' from demo_org
union all
select '40000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', org_id, '2026-05-15', 'final_notice', 'pending' from demo_org
on conflict (id) do nothing;
