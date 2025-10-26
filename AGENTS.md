# Repository Guidelines

## Project Structure & Module Organization
Follow the feature-first layout from `docs/architecture.md`: `src/app` hosts the Next.js App Router, shared primitives live in `src/components/ui`, and each feature keeps its `components`, `hooks`, `lib`, `schema.ts`, and `api.ts` under `src/features/<featureName>`. Keep cross-cutting hooks in `src/hooks`, utilities in `src/lib/utils.ts`, and migrations in `supabase/migrations/0000_name.sql`. Example: add a sentence-history hook at `src/features/history/hooks/use-sentence-history.ts` and export UI through `src/components/app-header.tsx` when it is reused.


## Coding Style & Naming Conventions
Per `docs/guideline.md` and `docs/clean-code.md`, default to client components (`use client`) and promise-based `page.tsx` params. Prefer TypeScript, Tailwind utilities, and shadcn/ui primitives; bring in date-fns, @tanstack/react-query, zod, react-hook-form, lucide-react, and zustand as described. Use intention-revealing PascalCase for components (`FeatureActionButton`), camelCase for hooks (`useSentenceHistory`), and UPPER_SNAKE_CASE for constants. Keep functions small, favor early returns, avoid mutation, and document “why” when behavior is non-obvious.

## Testing Guidelines
`docs/clean-code.md` sets the bar: behavior-first tests, AAA structure, single assertion focus, and coverage >80% across unit and integration suites. Co-locate specs with their features (e.g., `src/features/history/__tests__/use-sentence-history.test.ts`). Until a runner is added, plan for Vitest + Testing Library or Playwright for E2E, and record temporary gaps in your PR description.
