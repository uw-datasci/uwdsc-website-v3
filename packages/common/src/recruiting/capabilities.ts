import type { CyclePhase } from "../types/shared/enums";

/**
 * What the current viewer can see and do in the Recruiting section. Computed once on
 * the server from the viewer's role claims and the current cycle, returned to the
 * client, and read by the UI instead of checking roles directly.
 */

/** Recruiting roles: `pres` = president, `vp` = portal `admin` role. Execs have no access. */
export type RecruitingRole = "pres" | "vp";

/** Map a `user_roles.role` value to a recruiting role, or null for no access. */
export function toRecruitingRole(role: string | null | undefined): RecruitingRole | null {
  if (role === "pres") return "pres";
  if (role === "admin") return "vp";
  return null;
}

export interface RecruitingViewer {
  role: RecruitingRole;
  subteamId: number | null;
  subteamName: string | null;
}

export interface RecruitingCycleSummary {
  id: string;
  phase: CyclePhase;
  termId: string;
  termCode: string;
  targetTermId: string;
  targetTermCode: string;
  rosterLockedAt: string | null;
  finalizedAt: string | null;
  offerResponseHours: number;
}

export type RecruitingTab = "overview" | "leadership" | "setup" | "board" | "offers" | "finalize";

export const RECRUITING_TABS: ReadonlyArray<{ key: RecruitingTab; label: string; href: string }> = [
  { key: "overview", label: "Overview", href: "/recruiting" },
  { key: "leadership", label: "Leadership", href: "/recruiting/leadership" },
  { key: "setup", label: "Setup", href: "/recruiting/setup" },
  { key: "board", label: "Board", href: "/recruiting/board" },
  { key: "offers", label: "Offers", href: "/recruiting/offers" },
  { key: "finalize", label: "Finalize", href: "/recruiting/finalize" },
];

export interface TabAccess {
  visible: boolean;
  enabled: boolean;
  /** Why the tab is disabled (shown in a tooltip). */
  reason?: string;
}

/** "all" = every subteam, "own" = the viewer's subteam only, false = none. */
export type RecruitingScope = "all" | "own" | false;

export interface RecruitingCapabilities {
  viewer: RecruitingViewer;
  cycle: RecruitingCycleSummary | null;
  /** True until a cycle exists and its leadership has been locked. */
  locked: boolean;
  tabs: Record<RecruitingTab, TabAccess>;
  can: {
    startCycle: boolean;
    editLeadership: boolean;
    editSchedule: boolean;
    editQuestions: RecruitingScope;
    moveStatuses: RecruitingScope;
    sendOffers: boolean;
    finalize: boolean;
  };
}

export const RECRUITING_REASONS = {
  noCycle: "Start a hiring cycle first.",
  presLocked: "Lock next term's leadership first.",
  vpLocked: "Presidents are confirming next term's leadership.",
  presidentsOnly: "Presidents only.",
} as const;

const enabled: TabAccess = { visible: true, enabled: true };
const disabled = (reason: string): TabAccess => ({ visible: true, enabled: false, reason });

export function computeCapabilities(
  viewer: RecruitingViewer,
  cycle: RecruitingCycleSummary | null
): RecruitingCapabilities {
  const locked = !cycle || cycle.rosterLockedAt === null;
  const finalized = cycle?.phase === "finalized";
  const active = !locked && !finalized;

  if (viewer.role === "pres") {
    const lockedTab = disabled(RECRUITING_REASONS.presLocked);
    const afterLock = locked ? lockedTab : enabled;

    return {
      viewer,
      cycle,
      locked,
      tabs: {
        overview: afterLock,
        leadership: cycle ? enabled : disabled(RECRUITING_REASONS.noCycle),
        setup: afterLock,
        board: afterLock,
        offers: afterLock,
        finalize: afterLock,
      },
      can: {
        startCycle: !cycle,
        editLeadership: !!cycle && !finalized,
        editSchedule: active,
        editQuestions: active ? "all" : false,
        moveStatuses: active ? "all" : false,
        sendOffers: active,
        finalize: active,
      },
    };
  }

  const lockedTab = disabled(RECRUITING_REASONS.vpLocked);
  const presidentsOnly = disabled(RECRUITING_REASONS.presidentsOnly);
  const afterLock = locked ? lockedTab : enabled;
  const ownScope: RecruitingScope = active && viewer.subteamId !== null ? "own" : false;

  return {
    viewer,
    cycle,
    locked,
    tabs: {
      overview: afterLock,
      leadership: locked ? lockedTab : presidentsOnly,
      setup: afterLock,
      board: afterLock,
      offers: locked ? lockedTab : presidentsOnly,
      finalize: locked ? lockedTab : presidentsOnly,
    },
    can: {
      startCycle: false,
      editLeadership: false,
      editSchedule: false,
      editQuestions: ownScope,
      moveStatuses: ownScope,
      sendOffers: false,
      finalize: false,
    },
  };
}
