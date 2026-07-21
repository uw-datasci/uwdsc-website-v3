/**
 * Extracts the display name portion of a `"Name <addr@example.com>"` sender string.
 * Falls back to the raw string if no `<...>` segment is present.
 */
export function parseSenderName(fromRaw: string): string {
  const ltIndex = fromRaw.indexOf("<");
  if (ltIndex <= 0) return fromRaw;
  const gtIndex = fromRaw.indexOf(">", ltIndex);
  if (gtIndex === -1) return fromRaw;
  return fromRaw.slice(0, ltIndex).trim();
}

/**
 * Extracts the bare email address from a `"Name <addr@example.com>"` string.
 * Falls back to the trimmed raw string if no `<...>` segment is present.
 */
export function extractEmailAddress(raw: string): string {
  const trimmed = raw.trim();
  const start = trimmed.indexOf("<");
  const end = trimmed.lastIndexOf(">");
  if (start !== -1 && end > start) return trimmed.slice(start + 1, end).trim();
  return trimmed;
}
