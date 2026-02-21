# Server Packages & API Architecture

This project follows a **clean architecture pattern** with clear separation between frontend apps and backend services. There is **no Prisma**; data access uses **postgres.js** (via `@uwdsc/db`) and **Supabase** for auth and storage.

## Server Package Structure

### 📦 `@uwdsc/db` - Database & Supabase

**Location**: `packages/server/db/src/`
**Exports**: Postgres `sql` connection, Supabase clients (`createSupabaseBrowserClient`, etc.), `BaseRepository` (abstract class with protected `sql`).

### 📦 `@uwdsc/core` - Shared Backend Logic

**Location**: `packages/server/core/src/`
**Exports**: Service classes and **singleton instances** `profileService`, `applicationService`, `teamService`. `AuthService` and `ResumeService` are created per-request in the app via `createAuthService()`.

### 📦 `@uwdsc/admin` - Admin App Backend

**Location**: `packages/server/admin/src/`
**Exports**: Admin-specific `profileService` for member management.

## API Architecture & Data Flow

**React Page → `lib/api/` (Client SDK) → API Route → Service → Repository → Database**

1. **React Components** call client API functions.
2. **Client API Functions** wrapper functions that call Next.js API routes securely.
3. **API Routes** (`app/api/`) use services from `@uwdsc/core` or `@uwdsc/admin` and return `ApiResponse` from `@uwdsc/common/utils`. Keep routes thin.
4. **Services** contain core business logic.
5. **Repositories** extend `BaseRepository` from `@uwdsc/db`; use `this.sql` (postgres.js).

## Usage Guidelines

### ✅ Do

1. **Import services from `@uwdsc/core` or `@uwdsc/admin`** in API routes. Use singletons where applicable.
2. **Create AuthService/ResumeService** in the app via `lib/services.ts` using `createSupabaseServerClient`.
3. **Extend BaseRepository** from `@uwdsc/db/baseRepository` when creating new repositories.
4. **Use ApiResponse** from `@uwdsc/common/utils` in API routes for consistent responses.
5. **Keep API routes thin** - delegate to services.

### ❌ Don't

1. **Don't import server packages in React components**. Use client API functions.
2. **Don't put business logic in API routes or repositories**.
3. **Don't access the database directly from API routes**. Delegate to services and repositories.
4. **Don't assume Prisma**. The project uses postgres.js and Supabase.
