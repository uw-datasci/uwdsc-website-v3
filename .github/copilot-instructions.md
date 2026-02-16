# UWDSC Website v3 – Copilot Instructions

This document describes the monorepo layout, design system, and API architecture so AI and developers can work consistently across the codebase.

## Monorepo Overview

- **Package manager**: pnpm (workspace root)
- **Apps**: `apps/web` (main site), `apps/admin` (admin dashboard), `apps/docs` (documentation)
- **Shared packages**:
  - `packages/ui` – shared UI primitives (shadcn/ui)
  - `packages/common` – shared types and utils (e.g. `ApiResponse`)
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
- **Exports**: Service classes and **singleton instances** for stateless services that use the shared Postgres connection: `profileService`, `applicationService`, `teamService`. `AuthService` and `ResumeService` require a Supabase client and are **not** singletons; apps create them via `createAuthService()` / `createResumeService()` in `lib/services.ts`.

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
3. **API routes** (`apps/{web,admin}/app/api/`) – Thin HTTP layer: parse request, call service, return `ApiResponse.*` from `@uwdsc/common/utils`.
4. **Services** (`packages/server/core` or `admin`) – Business logic and validation; use repositories. Use **singletons** from `@uwdsc/core` where applicable; create **AuthService** / **ResumeService** in the app (e.g. `lib/services.ts`) with a server Supabase client.
5. **Repositories** – Extend `BaseRepository` from `@uwdsc/db`; use `this.sql` (postgres.js) for queries. No Prisma.
6. **Database** – Postgres (migrations in `packages/server/db`), Supabase for auth and storage.

**Standard API responses**: Use `ApiResponse` from `@uwdsc/common/utils` in API routes (e.g. `ApiResponse.ok()`, `ApiResponse.badRequest()`, `ApiResponse.serverError()`).

### Example: Profile API

```typescript
// 1. Component calls client API
import { getProfile } from "@/lib/api";
const profile = await getProfile();

// 2. Client API (lib/api/profile.ts) calls fetch("/api/profile")

// 3. API route (app/api/profile/route.ts)
import { profileService } from "@uwdsc/core";
import { ApiResponse } from "@uwdsc/common/utils";
const profile = await profileService.getProfileByUserId(user.id);
return ApiResponse.ok({ profile, isComplete });

// 4. Service uses repository; repository extends BaseRepository from @uwdsc/db and uses this.sql
```

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
4. Use **ApiResponse** from `@uwdsc/common/utils` in API routes.
5. Keep API routes thin; put business logic in services.

### Don't

1. Don’t import server packages in React components; use `lib/api/` client functions.
2. Don’t put business logic in API routes or repositories.
3. Don’t access the database directly from API routes; go through services and repositories.
4. Don’t assume Prisma; the project uses postgres.js and Supabase.

---

# Shared Types & Utils (`@uwdsc/common`)

- **Types**: `@uwdsc/common/types` – entities (Profile, Application, etc.), API types, shared enums, errors.
- **Utils**: `@uwdsc/common/utils` – `ApiResponse` for API routes, and other shared helpers (e.g. `filterPartialUpdate`).

Use these in both apps and server packages for consistent DTOs and response shapes.
