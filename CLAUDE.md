# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run everything from the repo root with pnpm (Node >=24, pnpm 11.x — run `corepack enable` once).

```bash
pnpm dev            # all apps (web + admin)
pnpm dev:web        # web only (port 3000)
pnpm dev:admin      # admin only
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

- `apps/web`, `apps/admin` — Next.js 16 (Turbopack), React 19, Tailwind v4.
- `packages/ui` (`@uwdsc/ui`) — shared shadcn/ui "new-york" primitives. Add via `pnpm ui:add`, never hand-install or duplicate into apps.
- `packages/common` (`@uwdsc/common`) — `@uwdsc/common/types` (entities, DTOs, enums, `ApiError`) and `@uwdsc/common/utils` (helpers such as `filterPartialUpdate`). Used by both apps and server packages.
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
- API routes are thin: parse the request, call a service, and return `RaftResponse.*`. Business logic lives in services, not routes or repositories.
- React components must **not** import server packages directly — call the client functions in `apps/*/lib/api/`.

### Service instantiation gotcha

Stateless services that use the shared Postgres connection are exported as **singletons**: `profileService`, `applicationService`, `teamService` (import directly from `@uwdsc/core` / `@uwdsc/admin`).

Services that need a request-scoped Supabase client — `AuthService`, `ResumeService` — are **not** singletons. Create them per request inside the app via `apps/*/lib/services.ts` (e.g. `createAuthService()`), which wires in `createSupabaseServerClient` from `@uwdsc/db`.

## Error handling & observability (Raft)

Every route handler is wrapped so unhandled errors are quarantined to Postgres (`raft.error_quarantine`) instead of vanishing into a serverless log. There is **no manual try/catch** in route handlers — this is handled once, centrally.

- **`@uw-datasci/raft`** is a private, server-only SDK (GitHub Packages under the `@uw-datasci` scope; requires `NODE_AUTH_TOKEN` to install — see `.npmrc`). Full API reference: `.github/context/raft-reference.md` (auto-synced from the raft repo — don't hand-edit it).
- **`withRaftRoute`** (`@uwdsc/core/http`) wraps a route handler: it catches anything thrown, quarantines it, and returns a clean `RaftResponse.serverError()`-shaped 500. It also translates this repo's `ApiError` (`@uwdsc/common/types`) into its own status code instead of flattening it to a 500 — 4xx `ApiError`s are expected/caller-caused and are **not** quarantined; 5xx `ApiError`s are mapped **and** quarantined.
- In `apps/admin`, don't call `withRaftRoute` directly — use the guards in `apps/admin/guards` (`withAuth`, `withAdmin`, `withPresAccess`), which already fold it in along with role checks. `withAdmin` takes `{ scope: true }` for handlers that need VP/subteam scoping.
- In `apps/web`, which has no route guard, wrap exports directly: `export const GET = withRaftRoute(async (request, context) => { ... });`.
- Build responses with **`RaftResponse.*`** (`ok`, `badRequest`, `unauthorized`, `forbidden`, `notFound`, `json`, `text`, and the async `serverError`) from `@uw-datasci/raft` — never construct `NextResponse` by hand in a route.
- `RAFT_APP_NAME` (`"web"` / `"admin"`) and `RAFT_DATABASE_URL` are set at server boot in each app's `instrumentation.ts`, not stored in Infisical — `RAFT_DATABASE_URL` is derived from the already-present `DATABASE_URL` (`??=`, so an explicit override still wins).
- Admin's Optics dashboard (`apps/admin/components/optics`, `apps/admin/app/api/raft/**`, `packages/server/admin/src/modules/raft`) is the read side of the same `raft.error_quarantine` table — that's where quarantined errors surface.

## Secrets & migrations

- Env vars come from **Infisical** (`.infisical.json`), pulled with `pnpm pull-secrets` — not from committed `.env` files.
- Migration files live in `packages/server/db/src/migrations/`; run them with `pnpm migrate` (db-migrate under the hood). Use `pnpm migrate:create` to scaffold a new one. The `raft` schema and its migrations belong to the raft repo, not this one — never add a migration here for it.

## Further reading

Deeper architecture and design-system detail already exist in `.github/copilot-instructions.md`, `.cursor/rules/server-architecture.mdc`, and `.cursor/rules/design-system.mdc`. Full onboarding docs: https://docs.uwdatascience.ca.
