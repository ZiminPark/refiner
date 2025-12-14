-- Create table to store per-user refinement history
create table if not exists public.refinement_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  input_text text not null,
  output_text text not null,
  explanation text,
  created_at timestamptz not null default timezone('utc', now())
);

-- Useful index for user lookups
create index if not exists refinement_history_user_id_created_at_idx
  on public.refinement_history (user_id, created_at desc);

alter table public.refinement_history enable row level security;

create policy "Users can view their refinement history"
  on public.refinement_history
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their refinement history"
  on public.refinement_history
  for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their refinement history"
  on public.refinement_history
  for delete
  using (auth.uid() = user_id);
