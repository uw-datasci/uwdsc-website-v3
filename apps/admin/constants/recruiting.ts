import { Crown, GraduationCap, RotateCcw, UserCheck, type LucideIcon } from "lucide-react";
import { SLOT_DECISION_LABELS, type SlotDecision } from "@uwdsc/common/constants";
import type { RoleChangeGroup } from "@uwdsc/common/types";

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
