import type {
  HiringApplicant,
  HiringPositionSelection,
} from "../types/entities/hiring";

/** Stable sort: lower `priority` first (1 = top choice). Returns a new array. */
export function sortPositionSelectionsByPriority<
  T extends { priority: number },
>(selections: readonly T[]): T[] {
  return selections.slice().sort((a, b) => a.priority - b.priority);
}

export interface HiringApplicantSelectionRow {
  readonly applicant: HiringApplicant;
  readonly selection: HiringPositionSelection;
}

/** One table row per applicant × position selection, selections ordered by priority within each applicant. */
export function flattenApplicantsToSelectionRows(
  applicants: readonly HiringApplicant[],
): HiringApplicantSelectionRow[] {
  const rows: HiringApplicantSelectionRow[] = [];
  for (const applicant of applicants) {
    const sorted = sortPositionSelectionsByPriority(
      applicant.position_selections,
    );
    for (const selection of sorted) {
      rows.push({ applicant, selection });
    }
  }
  return rows;
}
