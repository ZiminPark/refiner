# Repository Guidelines

## Project Structure & Module Organization
Follow the feature-first layout from `docs/architecture.md`: `src/app` hosts the Next.js App Router, shared primitives live in `src/components/ui`, and each feature keeps its `components`, `hooks`, `lib`, `schema.ts`, and `api.ts` under `src/features/<featureName>`. Keep cross-cutting hooks in `src/hooks`, utilities in `src/lib/utils.ts`, and migrations in `supabase/migrations/0000_name.sql`.

### App Router Structure
- `src/app/page.tsx`: Landing page (public route)
- `src/app/home/`: Main application routes (protected area)
  - `src/app/home/page.tsx`: Main refinement interface
  - `src/app/home/history/page.tsx`: Conversion history page
  - `src/app/home/settings/page.tsx`: User settings and prompt configuration
  - `src/app/home/layout.tsx`: Shared layout for home routes
- `src/app/api/`: API route handlers
  - `src/app/api/refine/route.ts`: POST endpoint for sentence refinement using OpenAI API
- `src/app/providers.tsx`: Global providers (QueryClientProvider, ThemeProvider)
- `src/app/layout.tsx`: Root layout with providers

### Feature Organization
Each feature under `src/features/<featureName>` should include:
- `components/`: Feature-specific UI components
- `hooks/`: Feature-specific hooks (e.g., `useConvertSentence.ts`)
- `api.ts`: API fetch functions for the feature
- `types.ts`: TypeScript type definitions
- `__tests__/`: Test files co-located with feature code

**Current features:**
- `src/features/sentence/`: Sentence refinement feature with `InputForm` component and `useConvertSentence` hook

**Shared components:**
- `src/components/app-header.tsx`: Reusable header component used across app routes
- `src/components/app-sidebar.tsx`: Sidebar navigation component

**Example:** When adding a history feature, create `src/features/history/hooks/use-sentence-history.ts` and export reusable UI through `src/components/app-header.tsx` when needed across multiple routes.

**Navigation requirement:** Every page must render `AppHeader` so the navigation stays visible, even on `/login` (wrap public routes in a layout that renders `AppHeader` with `showSessionControls={false}` when session controls should not appear).

### Prompt configuration guardrails
The AI refinement prompt is editable from `src/app/home/settings/page.tsx` and persisted via the `usePromptSetting` hook in `src/hooks/usePromptSetting.ts`, which currently wraps `useLocalStorage`. When updating either location, keep the prompt default text in `src/lib/prompt.ts` (exported as `DEFAULT_REFINER_PROMPT`) as the single source of truth and preserve the TODO comment about migrating persistence from localStorage to the database.


## Coding Style & Naming Conventions
Per `docs/guideline.md` and `docs/clean-code.md`, default to client components (`use client`) and promise-based `page.tsx` params. Prefer TypeScript, Tailwind utilities, and shadcn/ui primitives; bring in date-fns, @tanstack/react-query, zod, react-hook-form, lucide-react, and zustand as described. Use intention-revealing PascalCase for components (`FeatureActionButton`), camelCase for hooks (`useSentenceHistory`), and UPPER_SNAKE_CASE for constants. Keep functions small, favor early returns, avoid mutation, and document “why” when behavior is non-obvious.

## Testing Guidelines
`docs/clean-code.md` sets the bar: behavior-first tests, AAA structure, single assertion focus, and coverage >80% across unit and integration suites. Co-locate specs with their features (e.g., `src/features/history/__tests__/use-sentence-history.test.ts`). Until a runner is added, plan for Vitest + Testing Library or Playwright for E2E, and record temporary gaps in your PR description.

# Design Specification
For the visual system applied across the app, see [docs/design-spec.md](docs/design-spec.md).
