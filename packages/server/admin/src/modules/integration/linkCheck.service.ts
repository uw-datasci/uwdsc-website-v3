import dns from "node:dns/promises";
import net from "node:net";

export type LinkCheckStatus = "ok" | "unknown" | "unreachable";

export interface LinkCheckResult {
  status: LinkCheckStatus;
  detail: string;
}

const MAX_REDIRECTS = 3;
const FETCH_TIMEOUT_MS = 5000;
const MAX_BODY_BYTES = 64 * 1024; // enough to find <meta property="og:title"> without buffering a whole page

/**
 * Best-effort check that a resource link (usually a Notion page) an admin is attaching to a
 * workshop is publicly reachable. This is a hint shown next to the input, never a gate on
 * saving -- see the caller in the events service/route.
 *
 * Why it's a hint and not a guarantee: notion.so pages are a client-rendered SPA that returns
 * HTTP 200 even when private (the permission check happens in the browser). Only published
 * *.notion.site pages 404 reliably when unpublished/private.
 */
class LinkCheckService {
  /**
   * Checks reachability of `rawUrl`. Never throws -- any failure to even parse/resolve the URL
   * comes back as a normal `unreachable`/`unknown` result, since this is advisory-only.
   */
  async check(rawUrl: string): Promise<LinkCheckResult> {
    let url: URL;
    try {
      url = new URL(rawUrl);
    } catch {
      return { status: "unreachable", detail: "Not a valid URL." };
    }

    if (url.protocol !== "https:") {
      return { status: "unreachable", detail: "Only https:// links are supported." };
    }

    const ssrfGuardError = await this.assertSafeToFetch(url.hostname);
    if (ssrfGuardError) return { status: "unknown", detail: ssrfGuardError };

    const host = url.hostname.toLowerCase();
    if (host === "notion.so" || host === "www.notion.so") {
      return this.checkNotionSo(url);
    }
    if (host.endsWith(".notion.site")) {
      return this.checkNotionSite(url);
    }
    return this.checkGeneric(url);
  }

  private async checkNotionSite(url: URL): Promise<LinkCheckResult> {
    const res = await this.safeFetch(url);
    if (!res) return { status: "unknown", detail: "Couldn't verify -- the request timed out." };

    if (res.ok) return { status: "ok", detail: "Publicly reachable." };
    if (res.status === 404 || res.status === 410) {
      return {
        status: "unreachable",
        detail: "Published page not found -- it may be unpublished or private.",
      };
    }
    return {
      status: "unknown",
      detail: `Site responded with ${res.status}. Open it yourself to confirm.`,
    };
  }

  private async checkNotionSo(url: URL): Promise<LinkCheckResult> {
    const res = await this.safeFetch(url);
    if (!res) return { status: "unknown", detail: "Couldn't verify -- the request timed out." };

    if (!res.ok) {
      return {
        status: "unknown",
        detail: `Site responded with ${res.status}. Notion checks permissions in the browser, so this isn't conclusive.`,
      };
    }

    const title = await this.readOgTitle(res);
    if (title) return { status: "ok", detail: `Reachable -- "${title}".` };

    return {
      status: "unknown",
      detail:
        "Notion checks permissions in the browser, so a private page still returns 200 -- open it in a private window to confirm.",
    };
  }

  private async checkGeneric(url: URL): Promise<LinkCheckResult> {
    const res = await this.safeFetch(url);
    if (!res) return { status: "unknown", detail: "Couldn't verify -- the request timed out." };

    if (res.ok) return { status: "ok", detail: "Publicly reachable." };
    if (res.status >= 400 && res.status < 600) {
      return { status: "unreachable", detail: `Site responded with ${res.status}.` };
    }
    return { status: "unknown", detail: `Site responded with ${res.status}.` };
  }

  /**
   * Fetch with a manual, re-validated redirect chain (each hop is re-checked against the SSRF
   * guard before being followed -- `redirect: "follow"` would let an open redirect on an
   * otherwise-safe host land on an internal address) and a hard timeout. Returns null on any
   * network-level failure (timeout, DNS failure, refused connection, disallowed redirect
   * target) so callers can treat that uniformly as "unknown".
   */
  private async safeFetch(url: URL, redirectsLeft = MAX_REDIRECTS): Promise<Response | null> {
    try {
      const res = await fetch(url, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { "User-Agent": "uwdsc-website-admin-link-check" },
      });

      if (res.status >= 300 && res.status < 400 && redirectsLeft > 0) {
        const location = res.headers.get("location");
        if (!location) return res;

        const next = new URL(location, url);
        if (next.protocol !== "https:") return null;

        const guardError = await this.assertSafeToFetch(next.hostname);
        if (guardError) return null;

        return this.safeFetch(next, redirectsLeft - 1);
      }

      return res;
    } catch {
      return null;
    }
  }

  /** Reads at most MAX_BODY_BYTES and pulls out `<meta property="og:title" content="...">`. */
  private async readOgTitle(res: Response): Promise<string | null> {
    if (!res.body) return null;
    try {
      const reader = res.body.getReader();
      let received = 0;
      let text = "";
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        text += decoder.decode(value, { stream: true });
        if (received >= MAX_BODY_BYTES) break;
      }
      await reader.cancel().catch(() => {});

      const match = /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i.exec(text);
      const title = match?.[1]?.trim();
      return title && title.length > 0 ? title : null;
    } catch {
      return null;
    }
  }

  /**
   * Rejects hosts that resolve to a private/loopback/link-local address before any request is
   * made, so this admin-authenticated probe can't be used to reach internal infrastructure.
   * Returns a user-facing message when unsafe, or null when the fetch may proceed. DNS
   * rebinding between this check and the actual fetch is a residual, accepted risk for an
   * advisory-only, admin-only endpoint that never echoes response bodies back to the caller.
   */
  private async assertSafeToFetch(hostname: string): Promise<string | null> {
    const host = hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".local")) {
      return "That host isn't publicly reachable.";
    }

    if (net.isIP(host)) {
      if (this.isDisallowedIp(host)) return "That host isn't publicly reachable.";
      return null;
    }

    try {
      const records = await dns.lookup(host, { all: true });
      if (records.length === 0) return "Couldn't resolve that host.";
      if (records.some((r) => this.isDisallowedIp(r.address))) {
        return "That host isn't publicly reachable.";
      }
      return null;
    } catch {
      return "Couldn't resolve that host.";
    }
  }

  private isDisallowedIp(ip: string): boolean {
    const version = net.isIP(ip);
    if (version === 4) return this.isDisallowedIpv4(ip);
    if (version === 6) return this.isDisallowedIpv6(ip);
    return true; // not a parseable IP -- fail closed
  }

  private isDisallowedIpv4(ip: string): boolean {
    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return true;
    const [a, b] = parts as [number, number, number, number];

    if (a === 0) return true; // 0.0.0.0/8
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 127) return true; // 127.0.0.0/8 loopback
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local (incl. cloud metadata)
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 carrier-grade NAT
    if (a >= 224) return true; // multicast/reserved

    return false;
  }

  private isDisallowedIpv6(ip: string): boolean {
    const normalized = ip.toLowerCase();
    if (normalized === "::1") return true; // loopback
    if (normalized.startsWith("fe80:")) return true; // link-local
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true; // unique local (fc00::/7)

    // IPv4-mapped (::ffff:a.b.c.d) -- check the embedded IPv4 address too.
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(normalized);
    const embeddedIpv4 = mapped?.[1];
    if (embeddedIpv4) return this.isDisallowedIpv4(embeddedIpv4);

    return false;
  }
}

export const linkCheckService = new LinkCheckService();
