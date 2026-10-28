import { Crown, GraduationCap, RotateCcw, UserCheck, type LucideIcon } from "lucide-react";
import { SLOT_DECISION_LABELS, type SlotDecision } from "@uwdsc/common/constants";
import type { SelectionStatus } from "@uwdsc/common/recruiting";
import type { RoleChangeGroup } from "@uwdsc/common/types";
import type { BoardSource } from "@/types/recruiting";

// ---------------------------------------------------------------------------
// Leadership
// ---------------------------------------------------------------------------

/** Status options for a current president's seat. */
export const PRESIDENT_DECISION_OPTIONS: { value: SlotDecision; label: string }[] = [
  { value: "continuing", label: SLOT_DECISION_LABELS.continuing },
  { value: "leaving", label: SLOT_DECISION_LABELS.leaving },
];

/** Sections of the lock confirm dialog, in display order. */
export const ROLE_CHANGE_GROUPS: { key: RoleChangeGroup; title: string; icon: LucideIcon }[] = [
  { key: "president", title: "Becomes President", icon: Crown },
  { key: "vp", title: "Becomes VP", icon: UserCheck },
  { key: "alum", title: "Becomes alum", icon: GraduationCap },
  { key: "restored", title: "Back to their previous role", icon: RotateCcw },
];

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

export type ScheduleDateField = "releaseDate" | "softDeadline" | "hardDeadline";

export const SCHEDULE_DATE_FIELDS: { key: ScheduleDateField; label: string; help: string }[] = [
  { key: "releaseDate", label: "Applications open", help: "When /apply opens." },
  { key: "softDeadline", label: "Deadline", help: "The deadline applicants see." },
  {
    key: "hardDeadline",
    label: "Final cutoff",
    help: "Submissions close. At least 15 minutes after the deadline.",
  },
];

// ---------------------------------------------------------------------------
// Board
// ---------------------------------------------------------------------------

/** Chip (`badge`) and dot colors per status. */
export const STATUS_TONES: Record<SelectionStatus, { badge: string; dot: string }> = {
  "In Review": {
    badge: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
    dot: "bg-zinc-400",
  },
  Interviewing: {
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
    dot: "bg-blue-500",
  },
  Wanted: {
    badge: "bg-primary/10 text-primary dark:bg-primary/25 dark:text-violet-200",
    dot: "bg-primary",
  },
  "Not Wanted": {
    badge: "bg-zinc-200/70 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
    dot: "bg-zinc-600 dark:bg-zinc-500",
  },
  "Offer Sent": {
    badge: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    dot: "bg-amber-500",
  },
  "Accepted Offer": {
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
    dot: "bg-emerald-500",
  },
  "Declined Offer": {
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
    dot: "bg-rose-500",
  },
  "Rejection Sent": {
    badge: "bg-zinc-200/70 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
    dot: "bg-zinc-800 dark:bg-zinc-200",
  },
};

/** Why an offer-stage column can't be dragged into, by viewer. */
export const OFFER_COLUMN_LOCKS: Record<"pres" | "vp", string> = {
  pres: "Moved by sending offers and rejections, or by the candidate's response",
  vp: "Only presidents move candidates in offer stages",
};

export const COLUMN_EMPTY: Record<SelectionStatus, string> = {
  "In Review": "New applications land here.",
  Interviewing: "Drag candidates here once you've set up an interview.",
  Wanted: "Drag candidates here once you've decided you want them.",
  "Not Wanted":
    "Candidates you pass on land here. No one is emailed until presidents send rejections.",
  "Offer Sent": "Presidents send offers from the Offers tab.",
  "Accepted Offer": "Accepted offers land here.",
  "Declined Offer": "Declined and withdrawn offers land here.",
  "Rejection Sent": "Candidates who were sent a rejection land here.",
};

export const SOURCE_FILTERS: { value: BoardSource; label: string }[] = [
  { value: "all", label: "All sources" },
  { value: "new", label: "New" },
  { value: "returning", label: "Returning" },
];
