# UWDSC Website v3 – Antigravity Instructions

This document describes the monorepo layout, design system, and API architecture so Antigravity can work consistently across the codebase.

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

**Commands**: From repo root use:

- `pnpm dev`, `pnpm dev:web`, `pnpm dev:admin`
- `pnpm build`, `pnpm lint`
- `pnpm ui:add <component-name>`
- `pnpm migrate`

## Design System & Architecture Rules

Please strictly follow the detailed rules located in:

- `.agent/rules/design-system.md`
- `.agent/rules/server-architecture.md`

You can also use the **add-ui-component** workflow in `.agent/workflows/add-ui-component.md` to quickly add new shadcn components to the shared workspace.
