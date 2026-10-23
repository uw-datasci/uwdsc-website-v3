import type { LeadershipDraft } from "../../schemas/recruiting";
import type { LeadershipKind, UserRole } from "../shared/enums";

// ==========================================
//  Leadership roster
// ==========================================

export interface RoleState {
  role: UserRole;
  subteamId: number | null;
}

/** A seat that should exist next term, derived from a roster slot. */
export interface RosterEntry {
  slotId: string;
  profileId: string;
  role: Extract<UserRole, "pres" | "admin">;
  positionId: number;
  subteamId: number;
  kind: LeadershipKind;
}

/** Org structure the roster rules need. */
export interface LeadershipStructure {
  presidentPositionId: number;
  presidentsSubteamId: number;
  subteams: { id: number; name: string; vpPositions: { id: number; name: string }[] }[];
}

/** Someone who loses their seat if they're not on the next roster, and what they become. */
export interface RosterBaseline {
  profileId: string;
  restoreTo: RoleState;
}

export type RoleChangeGroup = "president" | "vp" | "alum" | "restored";

export interface RoleChange {
  profileId: string;
  from: RoleState;
  to: RoleState;
  group: RoleChangeGroup;
}

export interface RoleChangeSet {
  changes: RoleChange[];
  unchanged: RosterEntry[];
}

export interface LockReadiness {
  ready: boolean;
  blockers: string[];
  decided: number;
  total: number;
}

// ==========================================
//  Leadership screen payload
// ==========================================

export interface LeadershipPerson {
  id: string;
  name: string;
  email: string | null;
  role: UserRole;
  subteamId: number | null;
  positionName: string | null;
}

export interface ExecPositionInfo {
  id: number;
  name: string;
  isVp: boolean;
  subteamId: number | null;
  subteamName: string | null;
}

/** A position row in the cycle (application_positions_available). */
export interface CyclePositionInfo {
  id: number;
  positionId: number;
  isOpen: boolean;
  openings: number;
}

export interface LeadershipView {
  locked: boolean;
  structure: LeadershipStructure;
  positions: ExecPositionInfo[];
  hiring: CyclePositionInfo[];
  draft: LeadershipDraft;
  people: Record<string, LeadershipPerson>;
  baseline: RosterBaseline[];
  unplaced: string[];
}
