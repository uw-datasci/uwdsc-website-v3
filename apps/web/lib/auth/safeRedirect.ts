/**
 * Validates a post-login `redirect` query param. We accept:
 *   - same-origin paths beginning with `/` (but not `//` — that's a host-relative URL)
 *   - localhost on any port (dev)
 *   - any subdomain of uwdatascience.ca (estimathon, admin, etc.)
 *
 * Everything else falls back to `/` so we never bounce users to an external site.
 */
const ALLOWED_SUFFIX = ".uwdatascience.ca";

export function safeRedirect(raw: string | null | undefined, fallback = "/"): string {
  if (!raw) return fallback;

  // Same-origin path. Reject `//foo` and `/\foo` which are protocol-relative.
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")) {
    return raw;
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return fallback;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return fallback;

  const host = url.hostname;
  if (host === "localhost" || host === "127.0.0.1") return url.toString();
  if (host === "uwdatascience.ca" || host.endsWith(ALLOWED_SUFFIX)) {
    return url.toString();
  }

  return fallback;
}
