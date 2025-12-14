# Database Guide

This project uses Supabase. The only application table today is `refinement_history` (user-linked history of refinements). Authentication relies on Supabase `auth.users`.

## Tables

### refinement_history
- Purpose: stores each refinement with input/output/explanation per user.
- Columns:
  - `id uuid` (PK, default `gen_random_uuid()`)
  - `user_id uuid` (FK → `auth.users.id`, not null)
  - `input_text text` (not null) — original text submitted
  - `output_text text` (not null) — refined text returned
  - `explanation text` (nullable) — brief explanation of changes
  - `created_at timestamptz` (default `timezone('utc', now())`)
- Indexes:
  - `refinement_history_user_id_created_at_idx` on `(user_id, created_at desc)` for fast user history queries.
- RLS (enabled):
  - Select: `auth.uid() = user_id`
  - Insert: `auth.uid() = user_id`
  - Delete: `auth.uid() = user_id`

Schema source: `docs/database.sql`.

## Access patterns
- API `/api/refine` saves a row when the user is authenticated; anonymous users skip persistence.
- History page (`/history`) fetches rows ordered by `created_at desc`, allows per-row delete and bulk clear for the current user.

## Environment variables (Supabase)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

All three must be set for API-side writes; the client history page uses the public URL/anon key. Ensure the project has the `pgcrypto` extension enabled (for `gen_random_uuid()`, included by Supabase by default).***
