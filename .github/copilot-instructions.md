# UWDSC Website v3 – Copilot Instructions

This document describes the monorepo layout, design system, and API architecture so AI and developers can work consistently across the codebase.

## Monorepo Overview

- **Package manager**: pnpm (workspace root)
- **Apps**: `apps/web` (main site), `apps/admin` (admin dashboard)
- **Shared packages**:
  - `packages/ui` – shared UI primitives (shadcn/ui)
  - `packages/common` – shared types and utils (e.g. `ApiError`)
  - `packages/server/db` – `@uwdsc/db`: Supabase clients, Postgres connection, `BaseRepository`, migrations
  - `packages/server/core` – `@uwdsc/core`: shared services and repositories (auth, profile, application, file, resume, team)
  - `packages/server/admin` – `@uwdsc/admin`: admin-specific services (e.g. profile/members for admin)
  - `packages/typescript-config`, `packages/eslint-config` – shared config

**Commands**: From repo root use `pnpm dev`, `pnpm dev:web`, `pnpm dev:admin`, `pnpm build`, `pnpm lint`, `pnpm ui:add <component-name>`, `pnpm migrate`, etc.

---

# Design System Architecture

This project follows an **Atomic Design System** pattern using shadcn/ui as the foundation.

## Structure Overview

### Atoms: UI Package (`packages/ui`)

The `packages/ui` directory contains **shared, reusable UI primitives** built with shadcn/ui components.

- **Style**: shadcn/ui "new-york"
- **Exports**: `packages/ui/src/index.ts`
- **Global styles**: `packages/ui/src/styles/globals.css`
- **Components**: `packages/ui/src/components`
- **Config**: `packages/ui/components.json`

### Molecules: App Components

Each app (`apps/web/components`, `apps/admin/components`) contains **composed components** that combine atoms from the UI package with app-specific logic.

**Examples**: `apps/web/components/team/TeamCard.tsx`, `apps/web/components/home_sections/Hero.tsx`

## Adding New Shadcn Components

From the **repository root**:

```bash
pnpm ui:add <component-name>
```

Examples: `pnpm ui:add dialog`, `pnpm ui:add dropdown-menu`, `pnpm ui:add input`

The script is in `scripts/ui-add.js` and runs `shadcn` in `packages/ui`.

## Usage Guidelines

### Do

1. **Import atoms from `@uwdsc/ui`** in app components:
   ```tsx
   import { Card, Button, Avatar } from "@uwdsc/ui";
   ```
2. **Create molecules in app-specific `components/`** when combining atoms or adding app logic.
3. **Add primitives to the UI package** when the component will be reused across apps and is mostly presentational.

### Don't

1. Don’t duplicate shadcn components in app folders; add them to the UI package.
2. Don’t put business logic in UI package atoms.
3. Don’t manually install shadcn components; use `pnpm ui:add`.

## Package Exports (UI)

- `@uwdsc/ui` – component exports
- `@uwdsc/ui/globals.css` – global styles
- `@uwdsc/ui/postcss.config` – PostCSS config

---

# Server Packages & API Architecture

The backend is split into **database/config**, **shared core**, and **app-specific** layers. There is **no Prisma**; data access uses **postgres.js** (via `@uwdsc/db`) and **Supabase** for auth and storage.

## Package Structure

### `@uwdsc/db` – Database & Supabase

- **Location**: `packages/server/db/src/`
- **Exports**: `connection` (postgres.js `sql`), `supabase` (Supabase client factories), `baseRepository`
- **Responsibilities**: Supabase browser/server/middleware clients, Postgres connection for Transaction Pooler, `BaseRepository`, and db-migrate migrations.

```typescript
import { createSupabaseServerClient, createSupabaseMiddlewareClient } from "@uwdsc/db";
import { BaseRepository } from "@uwdsc/db/baseRepository";
```

### `@uwdsc/core` – Shared Backend Logic

- **Location**: `packages/server/core/src/`
- **Structure**: `services/` (AuthService, ProfileService, ApplicationService, FileService, ResumeService, TeamService), `repositories/` (extend `BaseRepository` from `@uwdsc/db`)
- **Exports**: Service classes and **singleton instances** for stateless services that use the shared Postgres connection: `profileService`, `applicationService`, `teamService`. `AuthService` and `ResumeService` require a Supabase client and are **not** singletons; apps create them via `createAuthService()` / `createResumeService()` in `lib/services.ts`. A separate subpath, `@uwdsc/core/http` (`packages/server/core/src/http/`), exports `withRaftRoute` — see [Error Handling & Observability](#error-handling--observability-raft).

```typescript
import { profileService, applicationService, teamService } from "@uwdsc/core";
import { AuthService, ResumeService } from "@uwdsc/core";
```

**Tech**: Postgres (postgres.js), Supabase (auth + storage), TypeScript. Types live in `@uwdsc/common/types`.

### `@uwdsc/admin` – Admin App Backend

- **Location**: `packages/server/admin/src/`
- **Purpose**: Admin-specific services (e.g. profile/member listing and updates for the admin app).
- **Used by**: `apps/admin` API routes only.

```typescript
import { profileService } from "@uwdsc/admin";
```

## API Architecture & Data Flow

Flow: **React → `lib/api/` → API route → Service (from `@uwdsc/core` or `@uwdsc/admin`) → Repository → Database**.

1. **React components** – Call client API functions from `lib/api/` (e.g. `getProfile()`, `login()`).
2. **Client API** (`apps/{web,admin}/lib/api/`) – Type-safe wrappers that call Next.js API routes; use types from `@uwdsc/common/types`.
3. **API routes** (`apps/{web,admin}/app/api/`) – Thin HTTP layer: parse request, call service, return `RaftResponse.*`. No manual try/catch — see [Error Handling & Observability](#error-handling--observability-raft) below.
4. **Services** (`packages/server/core` or `admin`) – Business logic and validation; use repositories. Use **singletons** from `@uwdsc/core` where applicable; create **AuthService** / **ResumeService** in the app (e.g. `lib/services.ts`) with a server Supabase client.
5. **Repositories** – Extend `BaseRepository` from `@uwdsc/db`; use `this.sql` (postgres.js) for queries. No Prisma.
6. **Database** – Postgres (migrations in `packages/server/db`), Supabase for auth and storage.

### Example: Profile API

```typescript
// 1. Component calls client API
import { getProfile } from "@/lib/api";
const profile = await getProfile();

// 2. Client API (lib/api/profile.ts) calls fetch("/api/profile")

// 3. API route (app/api/profile/route.ts)
import { profileService } from "@uwdsc/core";
import { RaftResponse } from "@uw-datasci/raft";
import { withRaftRoute } from "@uwdsc/core/http";

export const GET = withRaftRoute(async () => {
  const profile = await profileService.getProfileByUserId(user.id);
  return RaftResponse.ok({ profile, isComplete });
});

// 4. Service uses repository; repository extends BaseRepository from @uwdsc/db and uses this.sql
```

## Error Handling & Observability (Raft)

Route handlers don't write their own try/catch. Every export is wrapped so an unhandled
throw is quarantined to Postgres (`raft.error_quarantine`) and turned into a clean 500,
instead of disappearing into a serverless function's logs.

- **`@uw-datasci/raft`** – a private, server-only SDK (GitHub Packages, `@uw-datasci`
  scope; `.npmrc` routes the scope, `NODE_AUTH_TOKEN` is required to install). Full API
  surface, body shapes, and usage rules: `.github/context/raft-reference.md` (synced
  automatically from the raft repo — don't hand-edit it).
- **`withRaftRoute`** (from `@uwdsc/core/http`, source `packages/server/core/src/http/`) is
  `withRaft` (raft's own wrapper) plus this repo's `ApiError` → status-code translation:
  - Anything thrown that **isn't** `ApiError` reaches `withRaft`, which quarantines it and
    returns a generic 500.
  - `ApiError` (from `@uwdsc/common/types` — **not** the identically-named class raft also
    exports) with a 4xx `statusCode` is mapped to that status and **not** quarantined —
    these are expected, caller-caused failures.
  - `ApiError` with a 5xx `statusCode` is mapped **and** quarantined — a bug isn't excused
    from observability just because it was thrown as an `ApiError`.
- **`apps/admin`** doesn't call `withRaftRoute` directly in route files — it's folded into the
  guards in `apps/admin/guards` (`withAuth`, `withAdmin`, `withPresAccess`). Wrap a handler
  with one of those for auth + Raft together; `withAdmin` accepts `{ scope: true }` for
  handlers that need VP/subteam scoping.
- **`apps/web`** has no route guard, so routes wrap directly:
  ```typescript
  export const GET = withRaftRoute(async (request, context) => { ... });
  ```
- Build every response with **`RaftResponse`** from `@uw-datasci/raft` — `ok`, `badRequest`,
  `unauthorized`, `forbidden`, `notFound`, `json`, `text`, and the **async** `serverError`
  (always `await` it, or `return` it from an async handler). Never construct `NextResponse`
  by hand in a route.
- **Environment**: `RAFT_APP_NAME` (`"web"` / `"admin"`) and `RAFT_DATABASE_URL` aren't
  stored in Infisical — each app's `instrumentation.ts` sets them at server boot,
  deriving `RAFT_DATABASE_URL` from the already-present `DATABASE_URL` via `??=` (so an
  explicit override still wins). This only runs in the Node runtime.
- **Reading quarantined errors**: admin's Optics dashboard is the read side of the same
  table — `apps/admin/components/optics`, `apps/admin/app/api/raft/**`,
  `packages/server/admin/src/modules/raft`.
- The `raft` Postgres schema and its migrations are owned by the raft repo — never add a
  migration for it in `packages/server/db/src/migrations/`.

### Example: Auth (needs Supabase in request context)

```typescript
// API route
import { createAuthService } from "@/lib/services";
const authService = await createAuthService();
const result = await authService.login({ email, password });
```

## Usage Guidelines

### Do

1. Import **services** from `@uwdsc/core` or `@uwdsc/admin` in API routes; use **singletons** (`profileService`, `applicationService`, `teamService`) where the service is stateless.
2. Create **AuthService** / **ResumeService** in the app (e.g. `lib/services.ts`) with `createSupabaseServerClient` from `@uwdsc/db`.
3. Extend **BaseRepository** from `@uwdsc/db/baseRepository` when adding new repositories.
4. Wrap every route export with **`withRaftRoute`** (directly in `apps/web`, or via an `apps/admin/guards` guard) and build responses with **`RaftResponse`**.
5. Throw **`ApiError`** (`@uwdsc/common/types`) from services for expected non-200 outcomes; let it propagate — don't catch it in the route.
6. Keep API routes thin; put business logic in services.

### Don't

1. Don’t import server packages in React components; use `lib/api/` client functions.
2. Don’t put business logic in API routes or repositories.
3. Don’t access the database directly from API routes; go through services and repositories.
4. Don’t assume Prisma; the project uses postgres.js and Supabase.
5. Don’t write a manual try/catch in a route handler — `withRaftRoute` (or the guard wrapping it) already does this.
6. Don’t construct `NextResponse` by hand in a route — use `RaftResponse.*`.

---

# Shared Types & Utils (`@uwdsc/common`)

- **Types**: `@uwdsc/common/types` – entities (Profile, Application, etc.), API types, shared enums, and `ApiError` (throw this from services for expected non-200 responses — see [Error Handling & Observability](#error-handling--observability-raft)).
- **Utils**: `@uwdsc/common/utils` – shared helpers (e.g. `filterPartialUpdate`). API responses are built with `RaftResponse` from `@uw-datasci/raft`, not from this package.

Use these in both apps and server packages for consistent DTOs and response shapes.
