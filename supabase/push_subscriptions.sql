-- Web Push subscriptions for the HR app.
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
--
-- One row per device/browser. `endpoint` is the push endpoint URL and is the
-- primary key so re-subscribing the same device just updates the row. `phone`
-- and `role` identify who is logged in on that device so the send-push edge
-- function can target the right people.

create table if not exists public.hr_push_subscriptions (
  endpoint     text primary key,
  subscription jsonb       not null,
  phone        text,
  role         text,
  updated_at   timestamptz default now()
);

create index if not exists hr_push_subscriptions_role_idx  on public.hr_push_subscriptions (role);
create index if not exists hr_push_subscriptions_phone_idx on public.hr_push_subscriptions (phone);

alter table public.hr_push_subscriptions enable row level security;

-- The app uses the anon key from the browser, so allow anon to register /
-- update / read subscriptions. The edge function reads them with the service
-- role key (which bypasses RLS). This matches the app's existing anon-key model.
drop policy if exists "anon manage push subscriptions" on public.hr_push_subscriptions;
create policy "anon manage push subscriptions"
  on public.hr_push_subscriptions
  for all
  to anon
  using (true)
  with check (true);
