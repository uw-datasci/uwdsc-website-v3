# The Raft (`@uw-datasci/raft`) - LLM Blueprint

> **Audience:** AI coding assistants (Cursor, GitHub Copilot, Claude Code, etc.) and the
> engineers using them inside UWDSC Next.js 16 apps. This file is the single
> source of truth for how to consume the Raft SDK. It is synced automatically
> into every consumer repo at `.github/context/raft-reference.md` - edit it in the
> raft repo, never in a consumer repo.

## What this package does

`@uw-datasci/raft` is a **server-only** SDK for Next.js 16 App Router apps. It provides:

1. **`RaftResponse`** - standardized `NextResponse` builders (status codes + body shapes).
2. **`withRaft`** - a one-line route-handler wrapper that catches unhandled errors,
   quarantines them to Postgres, and returns a clean `500`.
3. **`RaftClient`** - the singleton that performs the actual error reporting. Use it
   directly for work that happens outside a wrapped route handler.

Environment-aware: in `development` errors are printed to the console; in
`production` they are written to the `raft.error_quarantine` Postgres table,
awaited so serverless containers cannot truncate the write. In production,
repeats of the same error are collapsed (see [Deduplication](#deduplication)).

## Installation (consumer apps)

The package is published to **GitHub Packages** under the `@uw-datasci` scope.
Add the scope routing to the app's committed `.npmrc`:

```ini
@uw-datasci:registry=https://npm.pkg.github.com
```

Auth goes in each developer's **user-level** `~/.npmrc`, never the repo's (pnpm 12+
ignores `${...}` expansion in project-level credentials):

```ini
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

`NODE_AUTH_TOKEN` is a classic GitHub PAT with `read:packages`, exported from the shell
profile. In CI, `actions/setup-node` with `registry-url` supplies credentials.

```bash
pnpm add @uw-datasci/raft
```

## Database

All UWDSC apps report into **one shared Raft database** - the Postgres database of the
UWDSC website's Supabase project (`uwdsc-website-v3`) - which already has the
`raft.error_quarantine` table. A consumer app runs **no migrations**: it only sets
`RAFT_DATABASE_URL` to that database's connection string.

- `RAFT_DATABASE_URL` is **not** the app's own database. Don't point it at, or derive it
  from, the app's `DATABASE_URL` - unless the app's own database _is_ that Supabase
  database (only true for the website itself).
- Never create, migrate or alter the `raft` schema from a consumer app. The SQL files
  under the package's `migrations/` folder only record the shared schema's history.

## Environment contract (consumer apps)

| Variable               | Required | Default       | Purpose                                                     |
| ---------------------- | -------- | ------------- | ----------------------------------------------------------- |
| `RAFT_APP_NAME`        | yes      | `unknown-app` | Logical app name stored on each quarantine row.             |
| `NODE_ENV`             | yes      | `development` | Exactly `production` enables the Postgres sink.             |
| `RAFT_DATABASE_URL`    | prod     | -             | DSN of the shared Raft database (not the app's database).   |
| `RAFT_DEDUP_WINDOW_MS` | no       | `60000`       | Window for collapsing identical errors. `0` disables dedup. |

Configuration is read **once**, lazily, the first time an error is reported - so it
can be set at server boot. Pick a unique, stable `RAFT_APP_NAME` per app: it is how
errors from different apps are told apart in the shared table.

> **Silent failure:** in production with no `RAFT_DATABASE_URL`, reported errors are
> dropped without a log line. Guard against this at boot:

```ts
// instrumentation.ts (app root, or src/ if the app uses a src dir)
export function register() {
  // Raft opens a pg pool - Node runtime only.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  process.env.RAFT_APP_NAME ??= "my-app";

  if (process.env.NODE_ENV === "production" && !process.env.RAFT_DATABASE_URL) {
    console.warn("[raft] RAFT_DATABASE_URL is not set - errors will not be quarantined");
  }
}
```

## Public API signatures

```ts
// ── Responses ───────────────────────────────────────────────────────────────
class RaftResponse {
  static ok<T>(data?: T, init?: ResponseInit): NextResponse; // 200
  static badRequest(message?: string, error?: string): NextResponse; // 400
  static unauthorized(message?: string, error?: string): NextResponse; // 401
  static forbidden(message?: string, error?: string): NextResponse; // 403
  static notFound(error?: string): NextResponse; // 404
  static json<T>(data: T, status?: number, init?: ResponseInit): NextResponse; // any status
  static text(
    body: string,
    contentType: string,
    status?: number,
    init?: ResponseInit,
  ): NextResponse;

  // ASYNC - awaits error quarantine before resolving.
  static serverError(
    message?: unknown,
    error?: string,
    context?: Record<string, any>,
  ): Promise<NextResponse>; // 500
}

// ── Route wrapper ───────────────────────────────────────────────────────────
function withRaft<C extends RaftRouteContext = RaftRouteContext>(
  handler: RaftRouteHandler<C>,
): RaftRouteHandler<C>;

type RaftRouteHandler<C extends RaftRouteContext = RaftRouteContext> = (
  request: NextRequest,
  context: C,
) => Promise<Response> | Response;

interface RaftRouteContext {
  params: Promise<Record<string, string | string[]>>;
}

// ── Client (manual reporting) ───────────────────────────────────────────────
class RaftClient {
  static getInstance(): RaftClient;
  get config(): RaftConfig;
  // Never throws. Resolves once the row is written (or skipped by dedup).
  reportError(error: Error, context?: RaftErrorContext, severity?: RaftSeverity): Promise<void>;
  shutdown(): Promise<void>; // closes the pg pool - long-running servers only
}

// ── Errors & types ──────────────────────────────────────────────────────────
class ApiError extends Error {
  constructor(message: string, statusCode?: number, code?: string); // see rule 4
  statusCode: number; // default 500
  code?: string;
}
type RaftSeverity = "debug" | "info" | "warning" | "error" | "fatal";
type RaftEnvironment = "development" | "production" | (string & {});
interface RaftErrorContext {
  route?: string;
  method?: string;
  url?: string;
  [k: string]: unknown;
}
interface RaftConfig {
  readonly appName: string;
  readonly environment: RaftEnvironment;
  readonly databaseUrl: string | undefined;
  readonly isProduction: boolean;
  readonly dedupWindowMs: number;
}
interface ErrorQuarantineRecord {
  // one row of raft.error_quarantine
  id: string;
  app_name: string;
  environment: string;
  error_message: string;
  stack_trace: string | null;
  severity: RaftSeverity;
  metadata: Record<string, unknown>;
  resolved: boolean;
  created_at: string;
}
```

## Body shapes (exact)

| Helper                          | Status | Body                                                    |
| ------------------------------- | ------ | ------------------------------------------------------- |
| `ok(data)`                      | 200    | `data` verbatim (`{}` when omitted)                     |
| `badRequest(message?, error?)`  | 400    | `{ error }` or `{ error, message }`                     |
| `unauthorized(message?, error?)` | 401    | `{ error }` or `{ error, message }`                     |
| `forbidden(message?, error?)`   | 403    | `{ error }` or `{ error, message }`                     |
| `notFound(error?)`              | 404    | `{ error }`                                             |
| `serverError(message?, error?)` | 500    | `{ error }` or `{ error, message }`                     |
| `json(data, s)`                 | `s`    | `data` verbatim                                         |
| `text(b, ct, s)`                | `s`    | raw string `b` with `Content-Type: ct`                  |
| _thrown inside `withRaft`_      | 500    | `{ error: "Internal server error", message: e.message }` |

Default `error` titles: `"Bad Request"`, `"Unauthorized"`, `"Forbidden"`, `"Not found"`,
`"Internal server error"`.

- **Argument order:** for the 4xx helpers the **first** argument is the detail
  (`message`) and the **second** is the short title (`error`). To change only the
  title, pass `undefined` first: `RaftResponse.unauthorized(undefined, "Unauthenticated")`.
- **Null-body statuses:** `ok`, `json` and `text` return an empty body (`null`) when the
  status is `204`, `205` or `304`, as the fetch spec requires. Headers from `init` are kept.
- **`serverError` message:** an `Error` contributes its `.message`; any other value is
  `JSON.stringify`-ed, so a plain string gains literal quotes (`"\"oops\""`) and an object
  is serialized whole. Pass an `Error` instance.
- **Error messages reach the client.** Unhandled errors and `serverError` put the error
  message in the response body. Never put secrets, tokens or raw SQL in an error message.

---

## Usage rules (READ BEFORE GENERATING CODE)

1. **Every App Router route handler is wrapped in `withRaft`** - either directly
   (`export const GET = withRaft(async (req, ctx) => { ... })`) or through an app
   auth guard that applies `withRaft` internally (see [Auth guards](#auth-guards-composing-withraft)).
   Never export an unwrapped handler.
2. **Respond through `RaftResponse.*`.** Don't construct `NextResponse`/`Response` by hand
   for JSON or text. For statuses without a named helper (`201`, `409`, `502`, …) use
   `RaftResponse.json(body, status)` and keep the `{ error, message }` shape for errors.
   The only exceptions are listed in [What Raft does not cover](#what-raft-does-not-cover).
3. **`serverError` is `async`.** `await` it, or `return` it directly from an `async`
   handler (both are correct). The other helpers are synchronous.
4. **Return expected failures, don't throw them.** `withRaft` turns **anything** thrown
   into a quarantined `500`, including `ApiError` - its `statusCode` and `code` are
   **ignored** by the wrapper. Validation errors, missing records, auth failures and
   conflicts must be `return`ed as `RaftResponse.badRequest()` / `.notFound()` /
   `.forbidden()` / `.json(…, 409)`. Have services return `null` or a result union
   (`{ ok: true, … } | { ok: false, reason }`) and let the route map it to a status.
   Throw only for real faults you want quarantined.
5. **No manual `try/catch` around the handler body.** `withRaft` already does that. A
   narrow `try/catch` around one call is fine when you need to recover from it
   (best-effort side effects, webhooks that must always return 200 - see below).
6. **Type route params.** In Next 16 `params` is a `Promise` - `await` it. Untyped, its
   values are `string | string[]`. Declare the shape with an inline object type or a
   `type` alias. A named `interface` for the params payload does **not** compile against
   `withRaft`'s constraint (an interface that _extends `RaftRouteContext`_ does).
7. **Server-only.** Import only in route handlers, `proxy.ts`, server utilities, Server
   Components and Server Actions - never in a `"use client"` file.
8. **Keep error messages stable.** Put ids and variable data in the report `context`, not
   in `error.message`, so deduplication can group repeats and messages stay safe to show.

---

## Patterns

### Route with typed params

```ts
// app/api/events/[id]/route.ts
import { withRaft, RaftResponse } from "@uw-datasci/raft";
import { eventService } from "@/server/events";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withRaft<Ctx>(async (_req, { params }) => {
  const { id } = await params;

  const event = await eventService.findById(id); // throws on DB failure → auto-500 + quarantine
  if (!event) return RaftResponse.notFound("Event not found");

  return RaftResponse.ok(event);
});
```

Inline annotation is equivalent:
`withRaft(async (req, { params }: { params: Promise<{ id: string; code: string }> }) => …)`.

### POST with validation and expected failures

```ts
// app/api/teams/route.ts
import { withRaft, RaftResponse } from "@uw-datasci/raft";
import { createTeamSchema } from "@/lib/schemas";
import { teamService } from "@/server/teams";

export const POST = withRaft(async (req) => {
  const parsed = createTeamSchema.safeParse(await req.json());
  if (!parsed.success) {
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message ?? "Invalid data",
      "Validation error",
    );
  }

  const result = await teamService.create(parsed.data); // returns a result union, never throws for expected cases
  if (!result.ok) {
    return RaftResponse.json({ error: "Conflict", message: result.reason }, 409);
  }

  return RaftResponse.json(result.team, 201);
});
```

### Auth guards (composing `withRaft`)

Most apps wrap routes in an auth guard. Build the guard **on top of** `withRaft` so every
guarded route gets quarantine for free, and pass the resolved caller to the handler so it
never looks the user up twice.

```ts
// lib/auth/guard.ts
import "server-only";
import { withRaft, RaftResponse, type RaftRouteContext, type RaftRouteHandler } from "@uw-datasci/raft";
import { getSession } from "@/lib/auth/session";
import type { Role } from "@/lib/auth/roles";

type Caller = { userId: string; role: Role };

type GuardedHandler<C extends RaftRouteContext> = (
  request: Request,
  context: C,
  caller: Caller,
) => Response | Promise<Response>;

export function withAuth<C extends RaftRouteContext = RaftRouteContext>(
  handler: GuardedHandler<C>,
  options?: { roles?: readonly Role[] },
): RaftRouteHandler<C> {
  return withRaft<C>(async (request, context) => {
    const caller = await getSession();
    if (!caller) return RaftResponse.unauthorized();
    if (options?.roles && !options.roles.includes(caller.role)) {
      return RaftResponse.forbidden("Insufficient role");
    }
    return handler(request, context, caller);
  });
}
```

```ts
// app/api/admin/events/[id]/start/route.ts
import { RaftResponse } from "@uw-datasci/raft";
import { withAuth } from "@/lib/auth/guard";
import { eventService } from "@/server/events";

export const POST = withAuth<{ params: Promise<{ id: string }> }>(
  async (_req, { params }, caller) => {
    const { id } = await params;
    const result = await eventService.start(id, caller.userId);
    if (!result.ok) return RaftResponse.badRequest(result.reason);
    return RaftResponse.ok(result.event);
  },
  { roles: ["organizer"] },
);
```

Routes that are public stay wrapped in plain `withRaft`. Never leave a route with
neither.

### Gateway / forwarding to an upstream API

When a Next.js route proxies a separate backend, pass the upstream status and body
through with `text()`. Upstream `204`s are handled (empty body), so no special casing
is needed.

```ts
// lib/api/forward.ts
import "server-only";
import { RaftResponse } from "@uw-datasci/raft";

export async function forward(request: Request, path: string) {
  const url = new URL(request.url);
  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  const upstream = await fetch(`${process.env.API_URL}${path}${url.search}`, {
    method: request.method,
    body: hasBody ? await request.text() : undefined,
    headers: { "Content-Type": request.headers.get("content-type") ?? "application/json" },
  });

  return RaftResponse.text(await upstream.text(), "application/json", upstream.status);
}
```

```ts
// app/api/teams/[id]/score/route.ts
export const GET = withRaft<{ params: Promise<{ id: string }> }>(async (req, { params }) => {
  const { id } = await params;
  return forward(req, `/teams/${encodeURIComponent(id)}/score`);
});
```

An upstream `5xx` passed through this way is **not** quarantined by the Next app - it
is a returned response, not a thrown error. The upstream service owns its own reporting.

### Non-JSON text response

```ts
// app/api/calendar/route.ts
export const GET = withRaft(async () => {
  const ics = await buildIcsFeed();
  return RaftResponse.text(ics, "text/calendar");
});
```

### Manual reporting with `RaftClient`

`withRaft` only sees errors thrown during the request. Report manually for anything
else. Always convert the caught value to an `Error`, and give `route` a stable label.

```ts
import { RaftClient } from "@uw-datasci/raft";

const toError = (e: unknown) => (e instanceof Error ? e : new Error(String(e)));
```

**Background work after the response** (`after()` from `next/server`, e.g. replying to a
bot within its timeout and finishing slow work later):

```ts
after(async () => {
  try {
    await processInteraction(payload);
  } catch (e) {
    await RaftClient.getInstance().reportError(
      toError(e),
      { route: "discord:interaction", interactionId: payload.id },
      "error",
    );
  }
});
```

**Webhooks that must always acknowledge with 200** (so the sender doesn't retry forever):

```ts
export const POST = withRaft(async (req) => {
  try {
    await handleWebhook(await req.json());
    return RaftResponse.ok({ success: true });
  } catch (e) {
    await RaftClient.getInstance().reportError(toError(e), { route: "webhooks:email" });
    return RaftResponse.ok({ success: false });
  }
});
```

**Cron jobs / scripts:**

```ts
try {
  await runNightlySync();
} catch (e) {
  await RaftClient.getInstance().reportError(toError(e), { route: "cron:nightly-sync" }, "fatal");
}
```

**Returning a 500 for a non-thrown failure** (e.g. a client library that returns
`{ error }` instead of throwing):

```ts
const { error } = await storage.upload(file);
if (error) return RaftResponse.serverError(new Error(error.message), "Upload failed", { route: "/api/upload" });
```

`withRaft` and `serverError` always report with severity `"error"`. Use `RaftClient`
directly when you need a different severity.

### Deduplication

In production, identical errors (same severity + `route` + first 200 chars of the
message) inside `RAFT_DEDUP_WINDOW_MS` are written **once**. Later repeats are counted,
and the count is stored on the next row for that error as `metadata.raftSuppressed`.
A new error is never delayed. Dedup is per warm server instance, so several instances
may each write one row per window. Development prints every error.

### Next.js `redirect()` / `notFound()`

These throw internally. `withRaft` recognizes them and re-throws them untouched, so
they work normally inside wrapped handlers and are never quarantined.

---

## What Raft does not cover

Use plain Next.js APIs for these - it is not a rule violation:

| Case                                                  | Use                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| Redirects (auth callbacks, `proxy.ts`)                | `NextResponse.redirect(...)`, `NextResponse.next()`                |
| Binary or streamed bodies (zip, PDF, images, SSE)     | `new Response(body, { headers })` - `text()` takes strings only    |
| Third-party route handlers (auth libraries' handlers) | Export them as provided; they do their own error handling          |
| Server Components / Server Actions                    | Not wrapped by `withRaft`; use `RaftClient` if failures must be kept |
| `proxy.ts` (middleware)                               | `RaftResponse.*` works here; `withRaft` is for route handlers only |

Still wrap the route itself in `withRaft` when it returns a binary body, so a thrown
error is quarantined.

### If a service layer throws status-coded errors

Rule 4 is the default for new code. If you inherit a service layer that already throws
errors carrying a `statusCode`, translate them in the app's guard instead of adding
`try/catch` to every route. Check against the app's **own** error class - not raft's
`ApiError` - or `instanceof` silently fails:

```ts
return withRaft<C>(async (request, context) => {
  try {
    return await handler(request, context);
  } catch (e) {
    if (!(e instanceof AppError)) throw e; // let withRaft quarantine it
    if (e.statusCode >= 500) {
      await RaftClient.getInstance().reportError(e, { route: request.nextUrl.pathname });
    }
    return RaftResponse.json({ error: e.code ?? e.message, message: e.message }, e.statusCode);
  }
});
```

---

### Anti-patterns (DO NOT generate)

```ts
// ❌ Hand-rolled JSON response - bypasses the shared contract.
return NextResponse.json({ error: "fail" }, { status: 500 });

// ❌ Throwing for an expected outcome - becomes a quarantined 500, NOT a 400.
throw new ApiError("title is required", 400);
// ✅ return RaftResponse.badRequest("title is required");

// ❌ Untyped params used as a string - id is `string | string[]`.
export const GET = withRaft(async (_req, { params }) => db.find((await params).id));

// ❌ Named interface for the params payload - does not compile.
interface Params { id: string }
export const GET = withRaft(async (_req, { params }: { params: Promise<Params> }) => …);

// ❌ Redundant try/catch around the whole handler - withRaft already does this.
export const GET = withRaft(async () => {
  try {
    /* ... */
  } catch (e) {
    return RaftResponse.serverError(e);
  }
});

// ❌ Passing a string or raw object to serverError - quoted/serialized into the body.
return RaftResponse.serverError("upload failed");

// ❌ Unsafe cast in manual reporting - a non-Error value loses message and stack.
await RaftClient.getInstance().reportError(err as Error);

// ❌ Variable data in the message - defeats dedup and may leak to the client.
throw new Error(`Team ${teamId} not found for user ${email}`);

// ❌ Exporting a route handler without withRaft or a guard that applies it.
export async function GET() { … }
```
