import { createHash, randomBytes } from "node:crypto";

const DEFAULT_SITE_URL = "https://uwdatascience.ca";

/** Only the hash is stored; the raw token goes in the email link. */
export function hashOfferToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createOfferToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashOfferToken(token) };
}

/** Link to the public offer page on the website. */
export function offerUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.trim() || DEFAULT_SITE_URL;
  return new URL(`/offer/${encodeURIComponent(token)}`, base).toString();
}
