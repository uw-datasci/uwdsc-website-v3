import type { SlotDecision } from "../constants/recruiting";
import type { LeadershipDraft, LeadershipSlot } from "../schemas/recruiting";
import type {
  LeadershipKind,
  LeadershipStructure,
  LockReadiness,
  RoleChange,
  RoleChangeGroup,
  RoleChangeSet,
  RoleState,
  RosterBaseline,
  RosterEntry,
  UserRole,
} from "../types";

/**
 * Leadership roster rules. The draft is a list of seats ("slots"); each records who holds
 * it now (`outgoingProfileId`, null for a new seat) and what happens next term.
 */

/**
 * Decisions a slot can be set to in the UI. `undecided` is always allowed (it blocks the
 * lock). A new seat (no current holder) must name someone, or for a VP seat, open it.
 */
export function slotDecisionOptions(slot: Pick<LeadershipSlot, "kind" | "outgoingProfileId">) {
  const options: SlotDecision[] =
    slot.kind === "pres"
      ? slot.outgoingProfileId
        ? ["continuing", "leaving"]
        : ["successor"]
      : slot.outgoingProfileId
        ? ["continuing", "successor", "open"]
        : ["successor", "open"];
  return options;
}

/** The person a slot puts in the seat next term, or null if it leaves the seat empty. */
export function slotNextHolder(slot: LeadershipSlot): string | null {
  if (slot.decision === "continuing") return slot.outgoingProfileId;
  if (slot.decision === "successor") return slot.successorProfileId;
  return null;
}

function vpPositionSubteam(structure: LeadershipStructure, positionId: number): number | null {
  for (const subteam of structure.subteams) {
    if (subteam.vpPositions.some((p) => p.id === positionId)) return subteam.id;
  }
  return null;
}

/** Next term's roster: one entry per filled slot. Invalid slots are skipped (see checkLockReadiness). */
export function buildRoster(
  draft: LeadershipDraft,
  structure: LeadershipStructure
): RosterEntry[] {
  const roster: RosterEntry[] = [];
  for (const slot of draft.slots) {
    const profileId = slotNextHolder(slot);
    if (!profileId) continue;
    const kind: LeadershipKind = slot.decision === "continuing" ? "continuing" : "appointed";

    if (slot.kind === "pres") {
      roster.push({
        slotId: slot.id,
        profileId,
        role: "pres",
        positionId: structure.presidentPositionId,
        subteamId: structure.presidentsSubteamId,
        kind,
      });
      continue;
    }

    const subteamId = vpPositionSubteam(structure, slot.positionId);
    if (subteamId === null) continue;
    roster.push({
      slotId: slot.id,
      profileId,
      role: "admin",
      positionId: slot.positionId,
      subteamId,
      kind,
    });
  }
  return roster;
}

/**
 * Whether the roster can be locked (or applied after the lock). `names` maps profile
 * ids to display names for the messages.
 */
export function checkLockReadiness(
  draft: LeadershipDraft,
  structure: LeadershipStructure,
  names: Record<string, string> = {}
): LockReadiness {
  const blockers: string[] = [];
  const nameOf = (id: string | null) => (id ? (names[id] ?? "Someone") : "A new seat");

  for (const slot of draft.slots) {
    if (slot.decision === "undecided") {
      blockers.push(`${nameOf(slot.outgoingProfileId)} is Undecided`);
    } else if (!slotDecisionOptions(slot).includes(slot.decision)) {
      blockers.push(`${nameOf(slot.outgoingProfileId)} has a status that doesn't fit the seat`);
    }
    if (slot.decision === "successor" && !slot.successorProfileId) {
      blockers.push(
        slot.outgoingProfileId
          ? `Pick a successor for ${nameOf(slot.outgoingProfileId)}`
          : "Pick someone for each new seat"
      );
    }
    if (slot.kind === "vp" && vpPositionSubteam(structure, slot.positionId) === null) {
      blockers.push(`${nameOf(slot.outgoingProfileId)} isn't on a VP position`);
    }
  }

  const roster = buildRoster(draft, structure);

  if (!roster.some((entry) => entry.role === "pres")) {
    blockers.push("Next term needs at least one president");
  }

  const seen = new Set<string>();
  for (const entry of roster) {
    if (seen.has(entry.profileId)) {
      blockers.push(`${nameOf(entry.profileId)} is in more than one seat`);
    }
    seen.add(entry.profileId);
  }

  for (const subteam of structure.subteams) {
    const positionIds = new Set(subteam.vpPositions.map((p) => p.id));
    const covered = draft.slots.some(
      (slot) =>
        slot.kind === "vp" &&
        positionIds.has(slot.positionId) &&
        (slotNextHolder(slot) !== null || slot.decision === "open")
    );
    if (!covered) blockers.push(`${subteam.name} needs a VP or an open seat`);
  }

  const decided = draft.slots.filter((slot) => slot.decision !== "undecided").length;
  return {
    ready: blockers.length === 0,
    blockers: [...new Set(blockers)],
    decided,
    total: draft.slots.length,
  };
}

/** VP positions whose seat is open to the public (added to the cycle's hiring positions). */
export function openVpPositionIds(draft: LeadershipDraft): number[] {
  const ids = draft.slots
    .filter((slot) => slot.kind === "vp" && slot.decision === "open")
    .map((slot) => slot.positionId);
  return [...new Set(ids)];
}

function sameRole(a: RoleState, b: RoleState): boolean {
  return a.role === b.role && a.subteamId === b.subteamId;
}

function groupFor(to: RoleState): RoleChangeGroup {
  if (to.role === "pres") return "president";
  if (to.role === "admin") return "vp";
  if (to.role === "alum") return "alum";
  return "restored";
}

/**
 * Role changes that applying `roster` would make. `roles` holds everyone's current
 * role; `baseline` is who currently holds a seat and what they become if they lose it.
 * Pure, so the confirm dialog and the server compute the same list.
 */
export function computeRoleChanges(
  roster: RosterEntry[],
  baseline: RosterBaseline[],
  roles: Record<string, RoleState>
): RoleChangeSet {
  const changes: RoleChange[] = [];
  const unchanged: RosterEntry[] = [];
  const onRoster = new Set(roster.map((entry) => entry.profileId));

  for (const entry of roster) {
    const from = roles[entry.profileId] ?? { role: "member", subteamId: null };
    const to: RoleState = { role: entry.role, subteamId: entry.subteamId };
    if (sameRole(from, to)) unchanged.push(entry);
    else changes.push({ profileId: entry.profileId, from, to, group: groupFor(to) });
  }

  for (const seat of baseline) {
    if (onRoster.has(seat.profileId)) continue;
    const from = roles[seat.profileId] ?? seat.restoreTo;
    if (sameRole(from, seat.restoreTo)) continue;
    changes.push({
      profileId: seat.profileId,
      from,
      to: seat.restoreTo,
      group: groupFor(seat.restoreTo),
    });
  }

  return { changes, unchanged };
}

/** What someone removed from the roster after the lock goes back to. */
export function restoreRoleAfterRemoval(
  priorRole: UserRole | null,
  priorSubteamId: number | null
): RoleState {
  if (priorRole === "exec" && priorSubteamId !== null) {
    return { role: "exec", subteamId: priorSubteamId };
  }
  if (priorRole === "member") return { role: "member", subteamId: null };
  return { role: "alum", subteamId: null };
}
