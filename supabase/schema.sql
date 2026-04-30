create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  username text not null,
  email text not null,
  progress jsonb not null default '{}'::jsonb,
  xp integer not null default 0,
  level integer not null default 1,
  total_progress integer not null default 0,
  streak integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists username text;

update public.profiles
set username = lower(regexp_replace(split_part(email, '@', 1), '[^a-z0-9_-]', '', 'g'))
where username is null or username = '';

alter table public.profiles alter column username set not null;

alter table public.profiles enable row level security;

drop policy if exists "Profiles are visible to authenticated users" on public.profiles;
create policy "Profiles are visible to authenticated users"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create index if not exists profiles_xp_idx on public.profiles (xp desc);
create unique index if not exists profiles_username_unique_idx on public.profiles (lower(username));
