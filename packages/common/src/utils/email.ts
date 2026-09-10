export interface ParsedFromHeader {
  name: string;
  email: string;
}

/**
 * Parses an RFC 5322 `From` header value like `Jane Doe <jane@example.com>` into its
 * display name and address. Falls back to using the whole string as both when there's
 * no `<...>` portion (e.g. a bare address).
 */
export function parseFromHeader(raw: string): ParsedFromHeader {
  const trimmed = raw.trim();
  const open = trimmed.indexOf("<");
  const close = trimmed.indexOf(">", open + 1);

  if (open === -1 || close === -1) return { name: trimmed, email: trimmed };

  const name = trimmed.slice(0, open).trim().replace(/^"|"$/g, "");
  const email = trimmed.slice(open + 1, close).trim();

  return { name: name || email, email };
}
