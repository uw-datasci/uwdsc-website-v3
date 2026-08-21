/**
 * Runs once per server process, before any request is handled.
 *
 * Raft reads its configuration lazily - every `process.env` access lives inside
 * `RaftClient.getInstance()`, which is only reached the first time an error is
 * reported. That makes this hook early enough to derive the SDK's environment
 * contract instead of duplicating it in the secret store.
 *
 * `RAFT_DATABASE_URL` is the same DSN as `DATABASE_URL` for this app, so it is
 * derived rather than stored twice (one secret to rotate, no drift). `??=` means
 * an explicitly provided value still wins, so Raft can be pointed at a separate
 * database later without a code change.
 */
export function register() {
  // Raft is Node-only (it opens a pg pool); never run this on the edge runtime.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  process.env.RAFT_APP_NAME ??= "web";
  process.env.RAFT_DATABASE_URL ??= process.env.DATABASE_URL;

  // Raft degrades silently to console-only when no DSN is resolved, which in
  // production means errors vanish. Make that loud instead.
  if (process.env.NODE_ENV === "production" && !process.env.RAFT_DATABASE_URL) {
    console.warn("[raft] neither RAFT_DATABASE_URL nor DATABASE_URL is set");
  }
}
