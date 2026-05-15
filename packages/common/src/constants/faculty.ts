import type { Faculty } from "../types/shared/enums";

/** Canonical faculty enum values (DB `faculty_enum`, API, forms). */
export const FACULTY_VALUES = [
  "math",
  "engineering",
  "science",
  "arts",
  "health",
  "environment",
] as const satisfies readonly Faculty[];

/** Human-readable labels for each faculty value. */
export const FACULTY_LABELS: Record<Faculty, string> = {
  math: "Math",
  engineering: "Engineering",
  science: "Science",
  arts: "Arts",
  health: "Health",
  environment: "Environment",
};

/** Display strings for profile / passport faculty `<Select>` (human labels). */
export const FACULTY_PROFILE_FORM_OPTIONS = Object.values(FACULTY_LABELS);

/** Map faculty select label (e.g. `"Math"`) → API `Faculty` enum. */
export const FACULTY_PROFILE_LABEL_TO_VALUE = Object.fromEntries(
  (Object.keys(FACULTY_LABELS) as Faculty[]).map((k) => [FACULTY_LABELS[k], k]),
) as Record<string, Faculty>;

/** Membership table faculty column filter: "all" plus one row per faculty. */
export const FACULTY_FILTER_OPTIONS = [
  { value: "all" as const, label: "All Faculties" },
  ...FACULTY_VALUES.map((value) => ({
    value,
    label: FACULTY_LABELS[value],
  })),
] as const;
