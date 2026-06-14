# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run everything from the repo root with pnpm (Node >=24, pnpm 11.x — run `corepack enable` once).

```bash
pnpm dev            # all apps (web + admin)
pnpm dev:web        # web only (port 3000)
pnpm dev:admin      # admin only
pnpm dev:docs       # docs only
pnpm build          # turbo build all packages
pnpm lint           # turbo lint (eslint runs with --max-warnings 0, so warnings fail)
pnpm check-types    # turbo tsc --noEmit across the workspace
pnpm format         # prettier --write
pnpm ui:add <name>  # add a shadcn primitive to @uwdsc/ui (e.g. pnpm ui:add dialog)
pnpm pull-secrets   # fetch env vars from Infisical
pnpm migrate        # run DB migrations up (also :down :reset :check :create)
```

There is **no test framework** in this repo. Verify changes with `pnpm lint`, `pnpm check-types`, and by running the relevant app.

## Monorepo layout

Turborepo + pnpm workspace. Members: `apps/*`, `packages/*`, `packages/server/*`.

- `apps/web`, `apps/admin`, `apps/docs` — Next.js 16 (Turbopack), React 19, Tailwind v4.
- `packages/ui` (`@uwdsc/ui`) — shared shadcn/ui "new-york" primitives. Add via `pnpm ui:add`, never hand-install or duplicate into apps.
- `packages/common` (`@uwdsc/common`) — `@uwdsc/common/types` (entities, DTOs, enums) and `@uwdsc/common/utils` (`ApiResponse` and other helpers). Used by both apps and server packages.
- `packages/server/db` (`@uwdsc/db`) — postgres.js connection (`sql`), Supabase client factories, `BaseRepository`, and db-migrate migrations.
- `packages/server/core` (`@uwdsc/core`) — shared services + repositories.
- `packages/server/admin` (`@uwdsc/admin`) — admin-only services, used by `apps/admin` routes only.
- `packages/eslint-config`, `packages/typescript-config` — shared config.

## API architecture (the key multi-file concept)

Data flows through strict layers — keep each layer in its role:

```
React component → apps/*/lib/api/ (client wrappers) → apps/*/app/api/ (thin routes)
  → Service (@uwdsc/core or @uwdsc/admin) → Repository (extends BaseRepository) → Postgres
```

- **There is no Prisma.** Repositories extend `BaseRepository` from `@uwdsc/db` and query with postgres.js via `this.sql`. Supabase is used only for auth and storage.
- API routes are thin: parse the request, call a service, and return `ApiResponse.*` (`ApiResponse.ok()`, `ApiResponse.badRequest()`, `ApiResponse.serverError()`, …) from `@uwdsc/common/utils`. Business logic lives in services, not routes or repositories.
- React components must **not** import server packages directly — call the client functions in `apps/*/lib/api/`.

### Service instantiation gotcha

Stateless services that use the shared Postgres connection are exported as **singletons**: `profileService`, `applicationService`, `teamService` (import directly from `@uwdsc/core` / `@uwdsc/admin`).

Services that need a request-scoped Supabase client — `AuthService`, `ResumeService` — are **not** singletons. Create them per request inside the app via `apps/*/lib/services.ts` (e.g. `createAuthService()`), which wires in `createSupabaseServerClient` from `@uwdsc/db`.

## Secrets & migrations

- Env vars come from **Infisical** (`.infisical.json`), pulled with `pnpm pull-secrets` — not from committed `.env` files.
- Migration files live in `packages/server/db/src/migrations/`; run them with `pnpm migrate` (db-migrate under the hood). Use `pnpm migrate:create` to scaffold a new one.

## Further reading

Deeper architecture and design-system detail already exist in `.github/copilot-instructions.md`, `.cursor/rules/server-architecture.mdc`, and `.cursor/rules/design-system.mdc`. Full onboarding docs: https://docs.uwdatascience.ca.
