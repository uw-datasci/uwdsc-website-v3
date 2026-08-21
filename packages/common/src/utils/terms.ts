type TermSeason = "S" | "F" | "W";

type TermShift = (yearSuffix: number) => { season: TermSeason; yearSuffix: number };

const SEASON_LABELS: Record<TermSeason, string> = {
  W: "Winter",
  S: "Spring",
  F: "Fall",
};

/** Immediate next academic term: Sxx → Fxx, Fxx → W(xx+1), Wxx → S(xx+1). */
export const NEXT_TERM_SHIFT: Record<TermSeason, TermShift> = {
  S: (y) => ({ season: "F", yearSuffix: y }),
  F: (y) => ({ season: "W", yearSuffix: y + 1 }),
  W: (y) => ({ season: "S", yearSuffix: y + 1 }),
};

/** Two seasons ahead (skip next term): Sxx → W(xx+1), Wxx → Fxx, Fxx → S(xx+1). */
export const DEFERRED_RETURN_TERM_SHIFT: Record<TermSeason, TermShift> = {
  S: (y) => ({ season: "W", yearSuffix: y + 1 }),
  W: (y) => ({ season: "F", yearSuffix: y }),
  F: (y) => ({ season: "S", yearSuffix: y + 1 }),
};

/** Inclusive date window check (start through end). */
export function isDateWindowOpen(
  startIso: string | null | undefined,
  endIso: string | null | undefined,
  now: Date = new Date()
): boolean {
  if (!startIso || !endIso) return false;

  const start = Date.parse(startIso);
  const end = Date.parse(endIso);
  if (Number.isNaN(start) || Number.isNaN(end)) return false;

  const n = now.getTime();
  return start <= n && n <= end;
}

export function shiftTermCode(code: string, shift: Record<TermSeason, TermShift>): string {
  const season = code.charAt(0).toUpperCase();
  if (season !== "S" && season !== "F" && season !== "W") return code;
  const yearSuffix = Number.parseInt(code.slice(1), 10);
  if (Number.isNaN(yearSuffix)) return code;

  const next = shift[season](yearSuffix);
  return `${next.season}${String(next.yearSuffix).padStart(2, "0")}`;
}

/**
 * Human-readable label from a terms.code value (e.g. W26 → Winter 2026).
 * First character is season; remainder is a two-digit year suffix.
 */
export function formatTermCode(code: string): string {
  const season = code.charAt(0).toUpperCase();
  const year = `20${code.slice(1)}`;
  const label = SEASON_LABELS[season as TermSeason] ?? code;
  return `${label} ${year}`;
}
