-- Run this in the Supabase SQL editor for your project.

create extension if not exists "pgcrypto";

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  platform text not null default '',
  release_date date,
  started_at date,
  status text not null default 'want_to_play'
    check (status in ('want_to_play', 'playing', 'finished', 'dropped')),
  progress_percent integer
    check (progress_percent is null or (progress_percent >= 0 and progress_percent <= 100)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists games_user_id_idx on public.games (user_id);
create index if not exists games_status_idx on public.games (user_id, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists games_set_updated_at on public.games;
create trigger games_set_updated_at
  before update on public.games
  for each row
  execute function public.set_updated_at();

alter table public.games enable row level security;

drop policy if exists "Users can select own games" on public.games;
create policy "Users can select own games"
  on public.games
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own games" on public.games;
create policy "Users can insert own games"
  on public.games
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own games" on public.games;
create policy "Users can update own games"
  on public.games
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own games" on public.games;
create policy "Users can delete own games"
  on public.games
  for delete
  using (auth.uid() = user_id);
