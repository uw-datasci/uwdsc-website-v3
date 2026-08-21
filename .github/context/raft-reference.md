# The Raft (`@uw-datasci/raft`) - LLM Blueprint

> **Audience:** AI coding assistants (Cursor, GitHub Copilot, Claude Code, etc.) and the
> engineers using them inside UWDSC Next.js 16 apps. This file is the single
> source of truth for how to consume the Raft SDK. It is synced automatically
> into every consumer repo at `.github/context/raft-reference.md`.

## What this package does

`@uw-datasci/raft` is a **server-only** SDK for Next.js 16 App Router apps. It provides:

1. **`RaftResponse`** - standardized `NextResponse` builders (status codes + body shapes).
2. **`withRaft`** - a one-line route-handler wrapper that catches unhandled errors,
   quarantines them to Postgres, and returns a clean `500`.
3. **`RaftClient`** - the singleton that performs the actual error reporting.

Environment-aware: in `development` errors are printed to the console; in
`production` they are written to the `raft.error_quarantine` Postgres table,
awaited so serverless containers cannot truncate the write.

## Installation (consumer apps)

The package is published to **GitHub Packages** under the `@uw-datasci` scope.
Add to the app's `.npmrc`:

```ini
@uw-datasci:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
pnpm add @uw-datasci/raft
```

## Environment contract (consumer apps)

| Variable            | Required | Purpose                                                          |
| ------------------- | -------- | ---------------------------------------------------------------- |
| `RAFT_APP_NAME`     | yes      | Logical app name stored on each quarantine row.                  |
| `NODE_ENV`          | yes      | `production` enables the Postgres sink.                          |
| `RAFT_DATABASE_URL` | prod     | Postgres DSN. Apply `migrations/0001_init_raft_schema.sql` once. |

## Public API signatures

```ts
// ── Responses ───────────────────────────────────────────────────────────────
class RaftResponse {
  static ok<T>(data?: T, init?: ResponseInit): NextResponse; // 200
  static badRequest(message?: string, error?: string): NextResponse; // 400
  static unauthorized(message?: string, error?: string): NextResponse; // 401
  static forbidden(message?: string, error?: string): NextResponse; // 403
  static notFound(error?: string): NextResponse; // 404
  static json<T>(data: T, status?: number, init?: ResponseInit): NextResponse; // custom
  static text(
    body: string,
    contentType: string,
    status?: number,
    init?: ResponseInit
  ): NextResponse;

  // ASYNC - awaits error quarantine before resolving.
  static serverError(
    message?: unknown,
    error?: string,
    context?: Record<string, any>
  ): Promise<NextResponse>; // 500
}

// ── Route wrapper ───────────────────────────────────────────────────────────
function withRaft<C extends RaftRouteContext = RaftRouteContext>(
  handler: (request: NextRequest, context: C) => Promise<Response> | Response
): (request: NextRequest, context: C) => Promise<Response> | Response;

interface RaftRouteContext {
  params: Promise<Record<string, string | string[]>>;
}

// ── Client (advanced / manual reporting) ────────────────────────────────────
class RaftClient {
  static getInstance(): RaftClient;
  get config(): RaftConfig;
  reportError(error: Error, context?: RaftErrorContext, severity?: RaftSeverity): Promise<void>;
  shutdown(): Promise<void>;
}

// ── Errors & types ──────────────────────────────────────────────────────────
class ApiError extends Error {
  constructor(message: string, statusCode?: number, code?: string);
}
type RaftSeverity = "debug" | "info" | "warning" | "error" | "fatal";
interface RaftErrorContext {
  route?: string;
  method?: string;
  url?: string;
  [k: string]: unknown;
}
```

## Body shapes (exact)

| Helper         | Status | Body                                   |
| -------------- | ------ | -------------------------------------- |
| `ok(data)`     | 200    | `data` (verbatim)                      |
| `badRequest`   | 400    | `{ error }` or `{ error, message }`    |
| `unauthorized` | 401    | `{ error }` or `{ error, message }`    |
| `forbidden`    | 403    | `{ error }` or `{ error, message }`    |
| `notFound`     | 404    | `{ error }`                            |
| `serverError`  | 500    | `{ error }` or `{ error, message }`    |
| `json(data,s)` | s      | `data` (verbatim)                      |
| `text(b,ct)`   | 200    | raw string `b` with `Content-Type: ct` |

---

## Usage rules (READ BEFORE GENERATING CODE)

1. **Always wrap App Router route handlers with `withRaft`.** Export the wrapped
   function: `export const GET = withRaft(async (req, ctx) => { ... })`.
2. **Never construct `NextResponse` by hand.** Use `RaftResponse.*` so status
   codes and body shapes stay consistent across all UWDSC apps.
3. **`serverError` is `async` - always `await` it** (or `return` it from an async
   handler). The other helpers are synchronous.
4. **You rarely need a manual `try/catch`.** `withRaft` already converts thrown
   errors into a quarantined `500`. Throw `ApiError` (or any `Error`) and let the
   wrapper handle it. Use explicit `RaftResponse.badRequest()` etc. for expected
   4xx validation outcomes.
5. **Import only on the server.** This package is `server-only`; never import it
   into a Client Component (`"use client"`).
6. **In Next 16, `params` is a `Promise`** - `await` it inside the handler.

---

## Zero-shot examples

### Basic GET with validation

```ts
// app/api/users/[id]/route.ts
import { withRaft, RaftResponse, ApiError } from "@uw-datasci/raft";
import { db } from "@/lib/db";

export const GET = withRaft(async (_req, { params }) => {
  const { id } = await params;
  if (!id) return RaftResponse.badRequest("id is required");

  const user = await db.users.find(id); // throws on DB failure → auto-500 + quarantine
  if (!user) return RaftResponse.notFound("User not found");

  return RaftResponse.ok(user);
});
```

### POST with auth + typed error

```ts
// app/api/events/route.ts
import { withRaft, RaftResponse, ApiError } from "@uw-datasci/raft";
import { getSession } from "@/lib/auth";

export const POST = withRaft(async (req) => {
  const session = await getSession(req);
  if (!session) return RaftResponse.unauthorized();
  if (session.role !== "exec") return RaftResponse.forbidden("Execs only");

  const body = await req.json();
  if (!body.title) throw new ApiError("title is required", 400, "EVENT_NO_TITLE");

  const event = await db.events.create(body);
  return RaftResponse.json(event, 201);
});
```

### Non-JSON response (calendar feed)

```ts
// app/api/calendar/route.ts
import { withRaft, RaftResponse } from "@uw-datasci/raft";

export const GET = withRaft(async () => {
  const ics = await buildIcsFeed();
  return RaftResponse.text(ics, "text/calendar");
});
```

### Manual error reporting (cron / background job)

```ts
import { RaftClient } from "@uw-datasci/raft";

try {
  await runNightlySync();
} catch (err) {
  await RaftClient.getInstance().reportError(
    err as Error,
    { route: "cron:nightly-sync" },
    "fatal"
  );
}
```

### Anti-patterns (DO NOT generate)

```ts
// ❌ Hand-rolled response - bypasses the shared contract.
return NextResponse.json({ error: "fail" }, { status: 500 });

// ❌ Forgetting to await the async serverError.
return RaftResponse.serverError(err); // missing await → returns a Promise as the body

// ❌ Redundant try/catch around the whole handler - withRaft already does this.
export const GET = withRaft(async () => {
  try {
    /* ... */
  } catch (e) {
    return RaftResponse.serverError(e);
  } // unnecessary
});
```
