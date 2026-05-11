import type { Term } from "../types/shared/common";

function toDateMs(iso: string | null | undefined): number | null {
  if (iso == null || iso === "") return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : t;
}

/** Active-term window for /logistics/onboarding (inclusive of endpoints). */
export function isOnboardingWindowOpen(
  term: Term | null,
  now: Date = new Date(),
): boolean {
  const start = toDateMs(term?.start_date ?? null);
  const due = toDateMs(term?.onboarding_due_date ?? null);
  if (start === null || due === null) return false;
  const n = now.getTime();
  return start <= n && n <= due;
}

/** Active-term window for /logistics/returning (inclusive of endpoints). */
export function isReturningExecWindowOpen(
  term: Term | null,
  now: Date = new Date(),
): boolean {
  const release = toDateMs(term?.returning_exec_release_date ?? null);
  const deadline = toDateMs(term?.returning_exec_deadline ?? null);
  if (release === null || deadline === null) return false;
  const n = now.getTime();
  return release <= n && n <= deadline;
}

/** Public exec apply page: release through soft deadline (inclusive). */
export function isApplicationPageWindowOpen(
  term: Term | null,
  now: Date = new Date(),
): boolean {
  const release = toDateMs(term?.application_release_date ?? null);
  const soft = toDateMs(term?.application_soft_deadline ?? null);
  if (release === null || soft === null) return false;
  const n = now.getTime();
  return release <= n && n <= soft;
}

/** Application read/write APIs: release through hard deadline (inclusive). */
export function isApplicationApiWindowOpen(
  term: Term | null,
  now: Date = new Date(),
): boolean {
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
