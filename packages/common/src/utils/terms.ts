import type { Term } from "../types/shared/common";

function toDateMs(iso: string | null | undefined): number | null {
  if (iso == null || iso === "") return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : t;
}

/** Active-term window for /logistics/onboarding (inclusive of endpoints). */
export function isOnboardingWindowOpen(term: Term | null, now: Date = new Date()): boolean {
  const start = toDateMs(term?.start_date ?? null);
  const due = toDateMs(term?.onboarding_due_date ?? null);
  if (start === null || due === null) return false;
  const n = now.getTime();
  return start <= n && n <= due;
}

/** Active-term window for /logistics/returning (inclusive of endpoints). */
export function isReturningExecWindowOpen(term: Term | null, now: Date = new Date()): boolean {
  const release = toDateMs(term?.returning_exec_release_date ?? null);
  const deadline = toDateMs(term?.returning_exec_deadline ?? null);
  if (release === null || deadline === null) return false;
  const n = now.getTime();
  return release <= n && n <= deadline;
}

/**
 * The application window for everything -- the /apply page, the public
 * apply-open probe, and every application read/write API. The soft deadline
 * is display-only (countdown, due-date label); the hard deadline is the
 * actual cutoff, and gates access here.
 */
export function isApplicationWindowOpen(term: Term | null, now: Date = new Date()): boolean {
  const release = toDateMs(term?.application_release_date ?? null);
  const hard = toDateMs(term?.application_hard_deadline ?? null);
  if (release === null || hard === null) return false;
  const n = now.getTime();
  return release <= n && n <= hard;
}

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

/**
 * Term code for the immediate next academic term.
 * Sxx → Fxx, Fxx → W(xx+1), Wxx → S(xx+1)
 */
export function getNextTermCode(code: string): string {
  const season = code.charAt(0).toUpperCase();
  const yearSuffix = Number.parseInt(code.slice(1), 10);
  if (Number.isNaN(yearSuffix)) return code;

  const pad = (y: number) => String(y).padStart(2, "0");

  if (season === "S") return `F${pad(yearSuffix)}`;
  if (season === "F") return `W${pad(yearSuffix + 1)}`;
  if (season === "W") return `S${pad(yearSuffix + 1)}`;
  return code;
}

/**
 * Term code two seasons ahead of `code` (skip the immediate next term).
 * Used for "not next term, but interested later" on the returning-exec form.
 *
 * Sxx → W(xx+1), Wxx → Fxx, Fxx → S(xx+1)
 */
export function getDeferredReturnTermCode(code: string): string {
  const season = code.charAt(0).toUpperCase();
  const yearSuffix = Number.parseInt(code.slice(1), 10);
  if (Number.isNaN(yearSuffix)) return code;

  const pad = (y: number) => String(y).padStart(2, "0");

  if (season === "S") return `W${pad(yearSuffix + 1)}`;
  if (season === "W") return `F${pad(yearSuffix)}`;
  if (season === "F") return `S${pad(yearSuffix + 1)}`;
  return code;
}
