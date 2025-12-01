create extension if not exists "pgcrypto";

create table if not exists public.saved_pairs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  original_text text not null,
  refined_text text not null,
  explanation text,
  source_prompt text,
  model text,
  saved_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_pairs_user_id_saved_at_idx on public.saved_pairs (user_id, saved_at desc);

alter table public.saved_pairs enable row level security;

create policy if not exists "Users can insert their saves" on public.saved_pairs
  for insert with check (auth.uid() = user_id);

create policy if not exists "Users can manage their saves" on public.saved_pairs
  for select using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
