create extension if not exists pgcrypto;

drop table if exists public.profiles;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  username text not null,
  email text not null,
  password_hash text not null,
  progress jsonb not null default '{}'::jsonb,
  xp integer not null default 0,
  level integer not null default 1,
  total_progress integer not null default 0,
  streak integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Demo profiles can be read" on public.profiles;
create policy "Demo profiles can be read"
on public.profiles
for select
to anon, authenticated
using (true);

drop policy if exists "Demo profiles can be created" on public.profiles;
create policy "Demo profiles can be created"
on public.profiles
for insert
to anon, authenticated
with check (true);

drop policy if exists "Demo profiles can be updated" on public.profiles;
create policy "Demo profiles can be updated"
on public.profiles
for update
to anon, authenticated
using (true)
with check (true);

create unique index profiles_username_unique_idx on public.profiles (lower(username));
create index profiles_xp_idx on public.profiles (xp desc);
