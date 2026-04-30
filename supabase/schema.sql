create extension if not exists pgcrypto;

create table if not exists public.profiles (
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

-- If an earlier setup created profiles as a Supabase Auth companion table,
-- remove the auth.users foreign key so demo username profiles can be created.
do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and contype = 'f'
  loop
    execute format('alter table public.profiles drop constraint if exists %I', constraint_name);
  end loop;
end $$;

alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists password_hash text;
alter table public.profiles add column if not exists progress jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists xp integer not null default 0;
alter table public.profiles add column if not exists level integer not null default 1;
alter table public.profiles add column if not exists total_progress integer not null default 0;
alter table public.profiles add column if not exists streak integer not null default 1;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

alter table public.profiles alter column id set default gen_random_uuid();

update public.profiles
set username = lower(regexp_replace(coalesce(username, split_part(email, '@', 1), 'user_' || left(id::text, 8)), '[^a-z0-9_-]', '', 'g'))
where username is null or username = '';

update public.profiles
set name = coalesce(nullif(name, ''), username, 'Developer')
where name is null or name = '';

update public.profiles
set email = coalesce(nullif(email, ''), username || '@jadev.local')
where email is null or email = '';

update public.profiles
set password_hash = coalesce(nullif(password_hash, ''), 'legacy-profile-needs-new-password')
where password_hash is null or password_hash = '';

alter table public.profiles alter column name set not null;
alter table public.profiles alter column username set not null;
alter table public.profiles alter column email set not null;
alter table public.profiles alter column password_hash set not null;

alter table public.profiles enable row level security;

drop policy if exists "Profiles are visible to authenticated users" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Demo profiles can be read" on public.profiles;
drop policy if exists "Demo profiles can be created" on public.profiles;
drop policy if exists "Demo profiles can be updated" on public.profiles;

create policy "Demo profiles can be read"
on public.profiles
for select
to anon, authenticated
using (true);

create policy "Demo profiles can be created"
on public.profiles
for insert
to anon, authenticated
with check (true);

create policy "Demo profiles can be updated"
on public.profiles
for update
to anon, authenticated
using (true)
with check (true);

drop index if exists profiles_username_unique_idx;
create unique index profiles_username_unique_idx on public.profiles (lower(username));
create index if not exists profiles_xp_idx on public.profiles (xp desc);
