# Save Input/Output Pair Design

## Context
- Users often want to keep refined outputs alongside their original inputs for reuse and learning.
- This design focuses on the logged-in experience: anonymous users see the UI affordance but are redirected to log in before persisting data.
- Styling follows the analog-inspired system in `docs/design-spec.md` (beige background, soft navy primary, subtle borders/texture).

## UI/UX Design (home refinement experience)
- **Save button placement:**
  - Add a primary "Save" button beside the existing "Copy" control in the Refined Version card toolbar.
  - Use the soft navy primary treatment for the default state; keep uppercase tracking to match existing CTA styling.
- **Availability & states:**
  - **Disabled** until a conversion result exists or while a save is in progress.
  - **Loading** shows a spinner to the left of the label and disables further clicks.
  - **Saved** state swaps the icon to a checkmark and updates the label to "Saved" for 4–6 seconds; button reverts to default afterward so users can resave after editing.
- **Interaction flow:**
  1) User runs a conversion and sees the Refined Version card.
  2) Clicking **Save** attempts to persist the latest `original`, `refined`, and `explanation` values tied to the signed-in user.
  3) On success, show a success toast (e.g., "Saved to your library") and the temporary saved state on the button.
  4) On failure, show a muted danger toast ("Could not save. Try again.") and return the button to default.
- **Auth handling:**
  - If the Supabase session is missing, clicking **Save** opens a modal prompting sign-in and explaining that saves require an account; include the same nav links as the header for continuity.
- **History surfacing:**
  - In the App Sidebar and header, keep the existing **History** entry; after a successful save, the toast includes a secondary link to “View history” that navigates to `/home/history`.
- **Keyboard & accessibility:**
  - Provide `aria-pressed` on the Save button during the saved state and `aria-disabled` while loading/disabled.
  - Keep focus outlines at primary color; ensure spinner SVGs have `aria-hidden`.
  - Toasts should be focus-trappable via the existing shadcn primitives so screen reader users hear status updates.
- **Empty & error views:**
  - If `/home/history` loads with no saves, show an empty-state card: “No saved refinements yet” with a CTA back to the home page.
  - If fetch fails, display a retry inline alert with a "Try again" button using outline styling.

## PostgreSQL Schema (Supabase)
- **Table:** `saved_pairs`
- **Columns:**
  - `id` `uuid` primary key default `gen_random_uuid()`.
  - `user_id` `uuid` not null, references `auth.users(id)` on delete cascade.
  - `original_text` `text` not null.
  - `refined_text` `text` not null.
  - `explanation` `text` nullable.
  - `source_prompt` `text` nullable for auditing the prompt used during refinement.
  - `model` `text` nullable to capture which model generated the output.
  - `saved_at` `timestamptz` not null default `now()`.
  - `updated_at` `timestamptz` not null default `now()`.
- **Indexes & constraints:**
  - Index on `(user_id, saved_at desc)` to power the history list; partial descending index if supported for pagination.
  - Check constraint to enforce trimmed lengths (e.g., `char_length(original_text) > 0 AND char_length(refined_text) > 0`).
  - Optional uniqueness on `(user_id, original_text, refined_text)` if deduplication is desired; keep it deferrable to avoid conflicts during quick successive saves.
- **RLS policy starter set:**
  - Enable Row Level Security on `saved_pairs`.
  - Policy: authenticated users can `insert` with `user_id = auth.uid()`.
  - Policy: authenticated users can `select`, `update`, and `delete` rows where `user_id = auth.uid()`.
- **Migration scaffold (Supabase style):**
  ```sql
  create table public.saved_pairs (
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

  create index saved_pairs_user_id_saved_at_idx on public.saved_pairs (user_id, saved_at desc);

  alter table public.saved_pairs enable row level security;

  create policy "Users can insert their saves" on public.saved_pairs
    for insert with check (auth.uid() = user_id);

  create policy "Users can manage their saves" on public.saved_pairs
    for select using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
  ```
- **API shape to expose later:**
  - `/api/saves` POST accepts `{ originalText, refinedText, explanation?, sourcePrompt?, model? }`, returns the saved row.
  - `/api/saves` GET lists the authenticated user’s saves ordered by `saved_at desc`, with pagination (`cursor` or `offset`).
  - `/api/saves/[id]` DELETE deletes a single saved pair owned by the user.
