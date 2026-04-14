# GitHub Copilot Instructions — Contador Coletivo

## Project Overview
Full-stack group counter app. **Astro 5 SSR** + **React 19 islands** + **Supabase** + **Tailwind/shadcn**.

## Key Architecture Decisions
- All pages are SSR (`output: 'server'`). Interactive parts use React islands (`client:load`).
- `QueryProvider` island must wrap any page that uses TanStack Query hooks.
- `supabase.ts` = browser client only. `supabaseServer.ts` = SSR only (never import in islands).
- Middleware in `src/middleware.ts` protects `/dashboard` and `/groups/**` routes.
- All DB operations rely on RLS. Never bypass RLS except in `createAdminClient()` for privileged ops.

## Coding Standards
- TypeScript strict mode. No `any` unless unavoidable.
- All async functions must handle errors and show toast feedback.
- Use `cn()` for class merging. Use `formatNumber()` for number display.
- Islands should be small and focused. Prefer passing SSR-fetched data as props.
- Realtime subscriptions must be cleaned up in `useEffect` return.

## File Locations
- New UI primitives → `src/components/ui/`
- New React islands → `src/components/islands/`
- New TanStack Query hooks → `src/lib/queries.ts`
- New Zod schemas → `src/lib/schemas.ts`
- New Astro pages → `src/pages/`

## Database
- Schema: `supabase/schema.sql`
- Types: `src/types/supabase.ts` (update when schema changes)
- Triggers auto-update `current_value` and `updated_at`
- Realtime enabled for `counters` and `counter_logs`
