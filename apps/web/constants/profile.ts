import type { Faculty } from "@uwdsc/common/types";

/** Required base profile field names for API request validation */
export const BASE_PROFILE_FIELDS = [
  "first_name",
  "last_name",
  "wat_iam",
  "faculty",
  "term",
] as const;

/** Display labels for faculty select (form uses these; API uses enum values) */
export const FACULTY_LABELS: Record<Faculty, string> = {
  math: "Math",
  engineering: "Engineering",
  science: "Science",
  arts: "Arts",
  health: "Health",
  environment: "Environment",
};

/** Form options for faculty select (label as displayed) */
export const FACULTY_OPTIONS = Object.values(FACULTY_LABELS);

/** Map form label -> API enum value */
export const facultyLabelToValue: Record<string, Faculty> = {
  Math: "math",
  Engineering: "engineering",
  Science: "science",
  Arts: "arts",
  Health: "health",
  Environment: "environment",
};

/** Map API enum value -> form label */
export const facultyValueToLabel: Record<Faculty, string> = FACULTY_LABELS;

export const TERM_OPTIONS = [
  "1A",
  "1B",
  "2A",
  "2B",
  "3A",
  "3B",
  "4A",
  "4B",
  "5A",
  "5B",
];
