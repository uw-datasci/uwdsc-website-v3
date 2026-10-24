import type { LeadershipDraft } from "../../schemas/recruiting";
import type {
  ApplicationInputType,
  ApplicationReviewStatus,
  LeadershipKind,
  UserRole,
} from "../shared/enums";

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

// ==========================================
//  Setup screen payload
// ==========================================

export interface SetupSchedule {
  termId: string;
  termCode: string;
  releaseDate: string | null;
  softDeadline: string | null;
  hardDeadline: string | null;
  targetTermId: string;
  targetTermCode: string;
  offerResponseHours: number;
}

export interface SetupPosition {
  id: number;
  positionId: number;
  name: string;
  isVp: boolean;
  subteamId: number | null;
  subteamName: string | null;
  isOpen: boolean;
  openings: number;
  applicants: number;
  owner: string;
  canEditQuestions: boolean;
}

export interface SetupQuestion {
  id: number;
  positionId: number | null;
  questionText: string;
  type: ApplicationInputType;
  maxLength: number | null;
  placeholder: string | null;
  helpText: string | null;
  sortOrder: number;
  archivedAt: string | null;
  answers: number;
}

export interface SetupView {
  schedule: SetupSchedule;
  targetTerms: { id: string; code: string }[];
  positions: SetupPosition[];
  addablePositions: { id: number; name: string; subteamName: string | null }[];
  questions: SetupQuestion[];
  canEditSchedule: boolean;
  canEditGeneralQuestions: boolean;
}

// ==========================================
//  Board
// ==========================================

/** One card: a candidate × one of the positions they applied for. */
export interface BoardCard {
  id: string;
  applicationId: string;
  profileId: string;
  name: string;
  email: string | null;
  program: string | null;
  year: string | null;
  priority: number;
  status: ApplicationReviewStatus;
  positionId: number;
  positionName: string;
  subteamId: number | null;
  subteamName: string | null;
  isVp: boolean;
  noteCount: number;
  returning: boolean;
  canMove: boolean;
}

export interface BoardPosition {
  id: number;
  name: string;
  subteamId: number | null;
  subteamName: string | null;
  isVp: boolean;
}

export interface BoardView {
  cards: BoardCard[];
  positions: BoardPosition[];
  subteams: { id: number; name: string }[];
}
