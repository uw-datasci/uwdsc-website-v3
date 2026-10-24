import type { LeadershipDraft } from "../../schemas/recruiting";
import type {
  ApplicationInputType,
  ApplicationReviewStatus,
  LeadershipKind,
  NoteKind,
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
  /** Subteams that have VP seats, with their `is_vp` positions. */
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
  /** People on the next roster whose role doesn't change. */
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
  /** Latest exec position name, for "Now: …" labels. */
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
  /** Who holds a seat now and what they become if they lose it. */
  baseline: RosterBaseline[];
  /** Current leaders the roster can't place (no VP position on their subteam). */
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
  /** application_positions_available id */
  id: number;
  positionId: number;
  name: string;
  isVp: boolean;
  subteamId: number | null;
  subteamName: string | null;
  isOpen: boolean;
  openings: number;
  applicants: number;
  /** "VP, Events" style owner label for the question bank. */
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
  /** Exec positions that aren't in the cycle yet (can be added). */
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
  /** application_position_selections id */
  id: string;
  applicationId: string;
  profileId: string;
  name: string;
  email: string | null;
  program: string | null;
  year: string | null;
  /** 1 = first choice. */
  priority: number;
  status: ApplicationReviewStatus;
  /** org.exec_positions id */
  positionId: number;
  positionName: string;
  subteamId: number | null;
  subteamName: string | null;
  isVp: boolean;
  noteCount: number;
  /** Applied as an exec or alum. */
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

// ==========================================
//  Candidate drawer
// ==========================================

export interface CandidateAnswer {
  questionId: number;
  /** The question as the candidate saw it. */
  question: string;
  answer: string;
}

/** General, one per position the candidate applied for (by priority), then "Other". */
export interface CandidateSection {
  key: string;
  title: string;
  subtitle: string | null;
  answers: CandidateAnswer[];
}

/** A row from org.exec_team. */
export interface CandidatePastRole {
  termCode: string;
  positionName: string;
  subteamName: string | null;
}

/** The full application, loaded when a card is opened. Statuses come from the board. */
export interface CandidateView {
  applicationId: string;
  profileId: string;
  name: string;
  email: string | null;
  personalEmail: string | null;
  program: string | null;
  year: string | null;
  location: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  returning: boolean;
  submittedAt: string;
  pastRoles: CandidatePastRole[];
  sections: CandidateSection[];
}

// ==========================================
//  Notes + activity
// ==========================================

export interface NoteView {
  id: string;
  authorName: string;
  /** "President", "VP, Events": the author's role when they wrote it. */
  authorRoleLabel: string;
  kind: NoteKind;
  body: string;
  createdAt: string;
  /** Set when the note was edited after posting. */
  editedAt: string | null;
  canEdit: boolean;
  canDelete: boolean;
}

export type ActivityItem =
  | {
      type: "move";
      id: string;
      actorName: string | null;
      positionName: string;
      from: ApplicationReviewStatus | null;
      to: ApplicationReviewStatus;
      undo: boolean;
      at: string;
    }
  | { type: "note"; id: string; actorName: string | null; kind: NoteKind; at: string }
  | { type: "applied"; id: string; positionNames: string[]; at: string };
