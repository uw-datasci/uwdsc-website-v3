import type { FinalizePlan } from "../../recruiting/finalize";
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
  offerExpiresAt: string | null;
  offerExpired: boolean;
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
  authorRoleLabel: string;
  kind: NoteKind;
  body: string;
  createdAt: string;
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
      reason: string | null;
      at: string;
    }
  | { type: "note"; id: string; actorName: string | null; kind: NoteKind; at: string }
  | { type: "applied"; id: string; positionNames: string[]; at: string };

// ==========================================
//  Offers
// ==========================================

/** A card on the Offers page, with its live offer (if any). */
export interface OfferRow {
  selectionId: string;
  applicationId: string;
  name: string;
  email: string | null;
  program: string | null;
  priority: number;
  status: ApplicationReviewStatus;
  positionId: number;
  positionName: string;
  subteamName: string | null;
  isVp: boolean;
  returning: boolean;
  wantedBy: string | null;
  wantedAt: string | null;
  sentAt: string | null;
  expiresAt: string | null;
  respondedAt: string | null;
  respondedVia: "link" | "manual" | "expiry" | null;
  responseNote: string | null;
  personalLine: string | null;
  withdrawn: boolean;
}

export interface ReadyRow extends OfferRow {
  blocker: string | null;
}

export interface OfferSeat {
  positionId: number;
  positionName: string;
  openings: number;
  left: number;
  heldBy: string[];
}

export interface ReadyGroup {
  subteamName: string;
  seats: OfferSeat[];
  rows: ReadyRow[];
}

export interface OffersView {
  ready: ReadyGroup[];
  conflicts: {
    applicationId: string;
    name: string;
    program: string | null;
    rows: ReadyRow[];
  }[];
  sent: OfferRow[];
  expired: OfferRow[];
  responded: OfferRow[];
  offerResponseHours: number;
}

export interface EmailPreview {
  to: string;
  replyTo: string[];
  subject: string;
  html: string;
}

export interface RejectionBatchPreview {
  recipients: {
    applicationId: string;
    name: string;
    email: string | null;
    group: "notWanted" | "inReview" | "interviewing";
    positionNames: string[];
  }[];
  counts: Record<"notWanted" | "inReview" | "interviewing", number>;
  skipped: number;
  skippedExample: {
    name: string;
    status: ApplicationReviewStatus;
    positionName: string;
  } | null;
  email: EmailPreview | null;
}

// ==========================================
//  Finalize
// ==========================================

export interface FinalizeView extends FinalizePlan {
  targetTermLabel: string;
  finalizedAt: string | null;
}

export interface FinalizeResult {
  execs: number;
  alumni: number;
  closedOffers: number;
  welcomeSent: boolean;
}

export type PublicOfferState = "open" | "accepted" | "declined" | "expired" | "closed";

/** What the public offer page shows for one token. */
export interface PublicOfferView {
  state: PublicOfferState;
  firstName: string;
  positionName: string;
  subteamName: string | null;
  termLabel: string;
  expiresAt: string;
  respondedAt: string | null;
  personalLine: string | null;
  signedBy: string;
  acceptedElsewhere: string | null;
}

// ==========================================
//  Overview
// ==========================================

export type OverviewStepState = "done" | "current" | "partial" | "next";

export interface OverviewStep {
  key: string;
  label: string;
  sub: string;
  state: OverviewStepState;
}

export interface OverviewCount {
  key: string;
  label: string;
  value: number;
  sub: string;
  status: ApplicationReviewStatus | null;
}

export type AttentionTone = "want" | "warn" | "error" | "offer" | "review" | "info";

export type AttentionIcon =
  "send" | "warn" | "expired" | "clock" | "inbox" | "note" | "question";

export interface AttentionItem {
  id: string;
  tone: AttentionTone;
  icon: AttentionIcon;
  title: string;
  desc: string;
  action: string;
  href: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  href: string;
}

export interface RoleSeat {
  positionId: number;
  name: string;
  openings: number;
  accepted: number;
  offers: number;
}

export interface RoleGroup {
  subteamName: string;
  seats: RoleSeat[];
}

export interface OverviewRoles {
  title: string;
  filled: number;
  total: number;
  groups: RoleGroup[];
  others: string | null;
}

/** Recruiting → Overview, computed from the cycle's current state. */
export interface OverviewView {
  stepNumber: number;
  stepLabel: string;
  summary: string;
  steps: OverviewStep[];
  counts: OverviewCount[];
  attention: AttentionItem[];
  checklist: ChecklistItem[];
  roles: OverviewRoles;
}
