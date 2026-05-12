import type { HiringApplicant, HiringPositionSelection } from "../types/entities/hiring";

/** Stable sort: lower `priority` first (1 = top choice). Returns a new array. */
export function sortPositionsByPriority<T extends { priority: number }>(
  selections: readonly T[],
): T[] {
  return selections.slice().sort((a, b) => a.priority - b.priority);
}

interface ApplicantRow {
  applicant: HiringApplicant;
  selection: HiringPositionSelection;
}

/** One table row per applicant × position selection, selections ordered by priority within each applicant. */
export function flattenRoleSelections(applicants: HiringApplicant[]): ApplicantRow[] {
  const rows: ApplicantRow[] = [];
  for (const applicant of applicants) {
    const sorted = sortPositionsByPriority(applicant.position_selections);
    for (const selection of sorted) rows.push({ applicant, selection });
  }
  return rows;
}
