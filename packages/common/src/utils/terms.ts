/**
 * Human-readable label from a terms.code value (e.g. W26 → Winter 2026).
 * First character is season; remainder is a two-digit year suffix.
 */
export function formatTermCode(code: string): string {
  const season = code.charAt(0).toUpperCase();
  const year = `20${code.slice(1)}`;
  const seasons: Record<string, string> = {
    W: "Winter",
    S: "Spring",
    F: "Fall",
  };
  return `${seasons[season] ?? code} ${year}`;
}
