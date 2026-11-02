import type { UserRole } from "../types/shared/enums";

/** A row on the current team (`exec_team` for `org.team_term_id()`). */
export interface CurrentTeamMember {
  profileId: string;
  name: string;
  positionName: string;
  subteamName: string | null;
  isVp: boolean;
  isPresident: boolean;
}

/** Next term's presidents and VPs (`cycle_leadership`). Roles were applied at the lock. */
export interface RosterMember {
  profileId: string;
  name: string;
  email: string | null;
  role: Extract<UserRole, "pres" | "admin">;
  positionId: number;
  subteamId: number;
  subteamName: string | null;
}

/** An Accepted or Offer Sent card on an exec (non-VP) position. */
export interface DecidedCard {
  selectionId: string;
  profileId: string;
  name: string;
  email: string | null;
  positionId: number;
  positionName: string;
  subteamId: number | null;
  subteamName: string | null;
  isVp: boolean;
  expiresAt: string | null;
}

export interface FinalizeInput {
  finalized: boolean;
  currentTeam: readonly CurrentTeamMember[];
  roster: readonly RosterMember[];
  accepted: readonly DecidedCard[];
  pending: readonly DecidedCard[];
  execHolders: readonly { profileId: string; name: string }[];
  seatsTotal: number;
}

export interface PlanPerson {
  profileId: string;
  name: string;
  role: string;
  from: string | null;
}

export interface PreviewMember {
  name: string;
  role: string;
  pending: boolean;
}

export interface FinalizePlan {
  newExecs: PlanPerson[];
  returning: PlanPerson[];
  leaving: PlanPerson[];
  roleUpdates: { profileId: string; role: "exec" | "alum"; subteamId: number | null }[];
  teamRows: { profileId: string; positionId: number; subteamId: number }[];
  preview: { presidents: PreviewMember[]; vps: PreviewMember[]; execs: PreviewMember[] };
  pending: {
    selectionId: string;
    name: string;
    email: string | null;
    positionName: string;
    expiresAt: string | null;
  }[];
  stats: {
    currentCount: number;
    nextCount: number;
    pendingCount: number;
    newCount: number;
    leavingCount: number;
    seatsFilled: number;
    seatsTotal: number;
  };
  blockers: string[];
  warnings: string[];
}

function currentLabel(member: CurrentTeamMember): string {
  if (member.isPresident) return "President";
  if (member.isVp)
    return member.subteamName ? `VP, ${member.subteamName}` : member.positionName;
  return member.subteamName
    ? `${member.subteamName} · ${member.positionName}`
    : member.positionName;
}

function rosterLabels(roster: readonly RosterMember[]): Map<string, string> {
  const labels = new Map<string, string>();
  for (const member of roster) {
    if (member.role === "pres") {
      labels.set(member.profileId, "President");
      continue;
    }
    const shared = roster.filter(
      (other) => other.role === "admin" && other.positionId === member.positionId
    ).length;
    const subteam = member.subteamName ?? "subteam";
    labels.set(member.profileId, shared > 1 ? `Co-VP, ${subteam}` : `VP, ${subteam}`);
  }
  return labels;
}

function execLabel(card: DecidedCard): string {
  return card.subteamName ? `${card.subteamName} · ${card.positionName}` : card.positionName;
}

/**
 * What Finalize will do: who joins, stays and leaves, the role and exec_team writes, the
 * team page preview, and anything that blocks or should give presidents pause.
 */
export function buildFinalizePlan(input: FinalizeInput): FinalizePlan {
  const blockers: string[] = [];
  const warnings: string[] = [];
  if (input.finalized) blockers.push("This cycle is already finalized.");
  if (!input.roster.some((member) => member.role === "pres")) {
    blockers.push("Next term needs at least one president. Add one in Leadership.");
  }

  const seen = new Map<string, string>();
  const next: { profileId: string; name: string; label: string }[] = [];
  const add = (profileId: string, name: string, label: string) => {
    if (seen.has(profileId)) {
      blockers.push(`${name} is on next term's team twice. Fix it in Leadership or Offers.`);
      return;
    }
    seen.set(profileId, label);
    next.push({ profileId, name, label });
  };

  const labels = rosterLabels(input.roster);
  for (const member of input.roster) {
    add(member.profileId, member.name, labels.get(member.profileId) ?? "VP");
  }
  for (const card of input.accepted) {
    if (card.subteamId === null) {
      blockers.push(`${card.positionName} has no subteam. Set one before finalizing.`);
    }
    add(card.profileId, card.name, execLabel(card));
  }

  const current = new Map(input.currentTeam.map((member) => [member.profileId, member]));
  const newExecs: PlanPerson[] = [];
  const returning: PlanPerson[] = [];
  for (const person of next) {
    const before = current.get(person.profileId);
    if (!before) {
      newExecs.push({
        profileId: person.profileId,
        name: person.name,
        role: person.label,
        from: null,
      });
      continue;
    }
    const was = currentLabel(before);
    returning.push({
      profileId: person.profileId,
      name: person.name,
      role: person.label,
      from: was === person.label ? null : was,
    });
  }

  const leaving: PlanPerson[] = input.currentTeam
    .filter((member) => !seen.has(member.profileId))
    .map((member) => ({
      profileId: member.profileId,
      name: member.name,
      role: currentLabel(member),
      from: null,
    }));
  for (const holder of input.execHolders) {
    if (
      !seen.has(holder.profileId) &&
      !leaving.some((person) => person.profileId === holder.profileId)
    ) {
      leaving.push({
        profileId: holder.profileId,
        name: holder.name,
        role: "Exec",
        from: null,
      });
    }
  }

  const roleUpdates: FinalizePlan["roleUpdates"] = [
    ...input.accepted.map((card) => ({
      profileId: card.profileId,
      role: "exec" as const,
      subteamId: card.subteamId,
    })),
    ...input.execHolders
      .filter((holder) => !seen.has(holder.profileId))
      .map((holder) => ({
        profileId: holder.profileId,
        role: "alum" as const,
        subteamId: null,
      })),
  ];

  const teamRows = [
    ...input.roster.map((member) => ({
      profileId: member.profileId,
      positionId: member.positionId,
      subteamId: member.subteamId,
    })),
    ...input.accepted
      .filter((card) => card.subteamId !== null)
      .map((card) => ({
        profileId: card.profileId,
        positionId: card.positionId,
        subteamId: card.subteamId as number,
      })),
  ];

  const preview = {
    presidents: input.roster
      .filter((member) => member.role === "pres")
      .map((member) => ({ name: member.name, role: "President", pending: false })),
    vps: [
      ...input.roster
        .filter((member) => member.role === "admin")
        .map((member) => ({
          name: member.name,
          role: labels.get(member.profileId) ?? "VP",
          pending: false,
        })),
      ...input.pending
        .filter((card) => card.isVp)
        .map((card) => ({
          name: card.name,
          role: `VP, ${card.subteamName ?? card.positionName}`,
          pending: true,
        })),
    ],
    execs: [
      ...input.accepted.map((card) => ({
        name: card.name,
        role: card.positionName,
        pending: false,
      })),
      ...input.pending
        .filter((card) => !card.isVp)
        .map((card) => ({ name: card.name, role: card.positionName, pending: true })),
    ],
  };

  if (input.pending.length > 0) {
    warnings.push(
      `${input.pending.length} offer${input.pending.length === 1 ? " is" : "s are"} still unanswered.`
    );
  }
  const seatsFilled = input.accepted.length;
  if (seatsFilled < input.seatsTotal) {
    warnings.push(`${input.seatsTotal - seatsFilled} exec seats are still open.`);
  }

  return {
    newExecs,
    returning,
    leaving,
    roleUpdates,
    teamRows,
    preview,
    pending: input.pending.map((card) => ({
      selectionId: card.selectionId,
      name: card.name,
      email: card.email,
      positionName: card.positionName,
      expiresAt: card.expiresAt,
    })),
    stats: {
      currentCount: input.currentTeam.length,
      nextCount: next.length,
      pendingCount: input.pending.length,
      newCount: newExecs.length,
      leavingCount: leaving.length,
      seatsFilled,
      seatsTotal: input.seatsTotal,
    },
    blockers: [...new Set(blockers)],
    warnings,
  };
}
