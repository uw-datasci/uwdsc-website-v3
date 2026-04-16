import type { ApplicationReviewStatus, HiringApplicant } from "@uwdsc/common/types";

// --- Review status badge (applications / hiring tables) ---

/**
 * Tailwind classes for `Badge variant="outline"` by application review status.
 * Matches hiring applicant status styling (admin applications flow).
 */
export function reviewStatusBadgeClassName(status: ApplicationReviewStatus): string {
  switch (status) {
    case "In Review":
      return "border-border bg-muted/60 text-muted-foreground";
    case "Interviewing":
      return "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/50 dark:text-amber-100";
    case "Wanted":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-100";
    case "Not Wanted":
      return "border-red-500/40 bg-red-500/10 text-red-900 dark:border-red-500/30 dark:bg-red-950/60 dark:text-red-100";
    case "Offer Sent":
      return "border-sky-500/40 bg-sky-500/10 text-sky-900 dark:border-sky-500/30 dark:bg-sky-950/60 dark:text-sky-100";
    case "Accepted Offer":
      return "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-600";
    case "Declined Offer":
      return "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-600";
    case "Rejection Sent":
      return "border-red-600 bg-red-600 text-white dark:border-red-500 dark:bg-red-600";
  }
}

// --- Hiring subteam filter ---

/** Select value: show all position selections */
export const HIRING_SUBTEAM_ALL = "all";

/** Select value: selections with no subteam name */
export const HIRING_SUBTEAM_NONE = "__none__";

export interface HiringSubteamOption {
  readonly value: string;
  readonly label: string;
}

function collectSubteamNames(applicants: readonly HiringApplicant[]): {
  readonly names: string[];
  readonly hasNone: boolean;
} {
  const names = new Set<string>();
  let hasNone = false;
  for (const app of applicants) {
    for (const s of app.position_selections) {
      if (s.subteam_name == null || s.subteam_name === "") {
        hasNone = true;
      } else {
        names.add(s.subteam_name);
      }
    }
  }
  return {
    names: [...names].sort((a, b) => a.localeCompare(b)),
    hasNone,
  };
}

/** Options for the subteam filter select (includes "All subteams"). */
export function buildHiringSubteamOptions(
  applicants: readonly HiringApplicant[],
): HiringSubteamOption[] {
  const { names, hasNone } = collectSubteamNames(applicants);
  const options: HiringSubteamOption[] = [{ value: HIRING_SUBTEAM_ALL, label: "All subteams" }];
  if (hasNone) {
    options.push({ value: HIRING_SUBTEAM_NONE, label: "No subteam" });
  }
  for (const name of names) {
    options.push({ value: name, label: name });
  }
  return options;
}

/** Keep applicants that have at least one selection in the subteam filter, preserving all their selections. */
export function filterApplicantsBySubteam(
  applicants: readonly HiringApplicant[],
  filter: string,
): HiringApplicant[] {
  if (filter === HIRING_SUBTEAM_ALL) {
    return [...applicants];
  }
  const matchesFilter = (s: HiringApplicant["position_selections"][number]) => {
    if (filter === HIRING_SUBTEAM_NONE) {
      return s.subteam_name == null || s.subteam_name === "";
    }
    return s.subteam_name === filter;
  };
  return applicants.filter((app) => app.position_selections.some(matchesFilter));
}
