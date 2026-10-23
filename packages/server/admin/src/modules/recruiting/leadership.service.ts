import { randomUUID } from "node:crypto";
import {
  buildRoster,
  checkLockReadiness,
  computeRoleChanges,
  openVpPositionIds,
  restoreRoleAfterRemoval,
  type RecruitingCycleSummary,
} from "@uwdsc/common/recruiting";
import {
  leadershipDraftSchema,
  type HiringPick,
  type LeadershipDraft,
} from "@uwdsc/common/schemas";
import type {
  ExecPositionInfo,
  LeadershipPerson,
  LeadershipStructure,
  LeadershipView,
  RoleState,
  RosterBaseline,
} from "@uwdsc/common/types";
import { ApiError } from "@uwdsc/common/types";
import {
  LeadershipRepository,
  type AppliedSeatRow,
  type CurrentLeaderRow,
} from "./leadership.repository";

interface Context {
  structure: LeadershipStructure;
  positions: ExecPositionInfo[];
  leaders: CurrentLeaderRow[];
  applied: AppliedSeatRow[];
  draft: LeadershipDraft;
  unplaced: string[];
}

class LeadershipService {
  private readonly repository: LeadershipRepository;

  constructor() {
    this.repository = new LeadershipRepository();
  }

  async getLeadership(cycle: RecruitingCycleSummary): Promise<LeadershipView> {
    const ctx = await this.load(cycle);
    const hiring = await this.repository.getCyclePositions(cycle.id);
    const people = await this.loadPeople(ctx);

    return {
      locked: cycle.rosterLockedAt !== null,
      structure: ctx.structure,
      positions: ctx.positions,
      hiring,
      draft: ctx.draft,
      people,
      baseline: this.baseline(cycle, ctx),
      unplaced: ctx.unplaced,
    };
  }

  async searchPeople(query: string): Promise<LeadershipPerson[]> {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];
    return this.repository.searchPeople(trimmed);
  }

  /** Save the roster and hiring picks without locking (before the lock only). */
  async saveDraft(
    cycle: RecruitingCycleSummary,
    draft: LeadershipDraft,
    hiring: HiringPick[]
  ): Promise<LeadershipView> {
    if (cycle.rosterLockedAt) {
      throw new ApiError("Leadership is already locked; apply changes instead", 409);
    }
    const ctx = await this.load(cycle);
    this.assertSlotsMatchLeaders(draft, ctx);
    this.assertPositions(draft, hiring, ctx);

    const saved = await this.repository.saveDraft(
      cycle.id,
      draft,
      this.positionSync(draft, hiring, ctx, "all")
    );
    if (!saved) throw new ApiError("Leadership was locked while you were editing", 409);
    return this.getLeadership({ ...cycle });
  }

  /** Lock next term's leadership: applies every role change in one transaction. */
  async lock(
    cycle: RecruitingCycleSummary,
    actorId: string,
    draft: LeadershipDraft,
    hiring: HiringPick[]
  ): Promise<void> {
    if (cycle.rosterLockedAt) throw new ApiError("Leadership is already locked", 409);
    const ctx = await this.load(cycle);
    this.assertSlotsMatchLeaders(draft, ctx);
    this.assertPositions(draft, hiring, ctx);
    await this.assertReady(draft, ctx);

    const roster = buildRoster(draft, ctx.structure);
    const changes = await this.changesFor(cycle, ctx, draft);
    const applied = await this.repository.applyRoster({
      cycleId: cycle.id,
      actorId,
      draft,
      roster,
      changes,
      lock: true,
      positions: this.positionSync(draft, hiring, ctx, "all"),
    });
    if (!applied) throw new ApiError("Leadership is already locked", 409);
  }

  /** Edit the roster after the lock. Role changes apply immediately. */
  async update(
    cycle: RecruitingCycleSummary,
    actorId: string,
    draft: LeadershipDraft
  ): Promise<void> {
    if (!cycle.rosterLockedAt) throw new ApiError("Lock leadership first", 409);
    const ctx = await this.load(cycle);

    // Seats held at the lock can't be added or removed, only re-decided.
    const lockedHolders = new Set(
      ctx.draft.slots.map((s) => s.outgoingProfileId).filter(Boolean)
    );
    const nextHolders = new Set(draft.slots.map((s) => s.outgoingProfileId).filter(Boolean));
    if (
      lockedHolders.size !== nextHolders.size ||
      [...lockedHolders].some((id) => !nextHolders.has(id))
    ) {
      throw new ApiError(
        "Seats held at the lock can't be added or removed. Reload the page.",
        400
      );
    }
    this.assertPositions(draft, [], ctx);
    await this.assertReady(draft, ctx);

    const roster = buildRoster(draft, ctx.structure);
    const changes = await this.changesFor(cycle, ctx, draft);
    const applied = await this.repository.applyRoster({
      cycleId: cycle.id,
      actorId,
      draft,
      roster,
      changes,
      lock: false,
      positions: this.positionSync(draft, [], ctx, "vp"),
    });
    if (!applied) throw new ApiError("Leadership isn't locked", 409);
  }

  // ---------------------------------------------------------------------------

  private async load(cycle: RecruitingCycleSummary): Promise<Context> {
    try {
      const [positions, presidentsSubteamId, leaders, applied, rawDraft] = await Promise.all([
        this.repository.getExecPositions(),
        this.repository.getPresidentsSubteamId(),
        this.repository.getCurrentLeaders(cycle.termId),
        this.repository.getAppliedRoster(cycle.id),
        this.repository.getDraft(cycle.id),
      ]);

      const presidentPosition = positions.find(
        (p) => p.isVp && p.subteamId === presidentsSubteamId
      );
      if (!presidentsSubteamId || !presidentPosition) {
        throw new ApiError("The Presidents subteam or President position is missing", 500);
      }

      const subteams = new Map<number, LeadershipStructure["subteams"][number]>();
      for (const position of positions) {
        if (!position.isVp || position.subteamId === null) continue;
        if (position.subteamId === presidentsSubteamId) continue;
        const subteam = subteams.get(position.subteamId) ?? {
          id: position.subteamId,
          name: position.subteamName ?? "Subteam",
          vpPositions: [],
        };
        subteam.vpPositions.push({ id: position.id, name: position.name });
        subteams.set(position.subteamId, subteam);
      }

      const structure: LeadershipStructure = {
        presidentPositionId: presidentPosition.id,
        presidentsSubteamId,
        subteams: [...subteams.values()],
      };

      const parsed = leadershipDraftSchema.safeParse(rawDraft);
      const stored: LeadershipDraft = parsed.success ? parsed.data : { slots: [] };
      const locked = cycle.rosterLockedAt !== null;
      const { draft, unplaced } = locked
        ? { draft: stored, unplaced: [] }
        : this.reconcile(stored, leaders, structure);

      return { structure, positions, leaders, applied, draft, unplaced };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Failed to load leadership: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Before the lock, keep the draft in step with who holds a seat now: drop seats for
   * people who no longer do, and add an Undecided seat for anyone missing.
   */
  private reconcile(
    stored: LeadershipDraft,
    leaders: CurrentLeaderRow[],
    structure: LeadershipStructure
  ): { draft: LeadershipDraft; unplaced: string[] } {
    const leaderIds = new Set(leaders.map((l) => l.profile_id));
    const slots = stored.slots.filter(
      (slot) => !slot.outgoingProfileId || leaderIds.has(slot.outgoingProfileId)
    );
    const referenced = new Set(slots.map((s) => s.outgoingProfileId));
    const unplaced: string[] = [];

    for (const leader of leaders) {
      if (referenced.has(leader.profile_id)) continue;

      if (leader.role === "pres") {
        slots.push({
          id: randomUUID(),
          kind: "pres",
          positionId: structure.presidentPositionId,
          outgoingProfileId: leader.profile_id,
          decision: "undecided",
          successorProfileId: null,
        });
        continue;
      }

      const subteam = structure.subteams.find((s) => s.id === leader.subteam_id);
      const positionId =
        subteam?.vpPositions.find((p) => p.id === leader.position_id)?.id ??
        subteam?.vpPositions[0]?.id;
      if (!positionId) {
        unplaced.push(leader.profile_id);
        continue;
      }
      slots.push({
        id: randomUUID(),
        kind: "vp",
        positionId,
        outgoingProfileId: leader.profile_id,
        decision: "undecided",
        successorProfileId: null,
      });
    }

    return { draft: { slots }, unplaced };
  }

  private baseline(cycle: RecruitingCycleSummary, ctx: Context): RosterBaseline[] {
    if (cycle.rosterLockedAt) {
      return ctx.applied.map((seat) => ({
        profileId: seat.profile_id,
        restoreTo: restoreRoleAfterRemoval(seat.prior_role, seat.prior_subteam_id),
      }));
    }
    return ctx.leaders.map((leader) => ({
      profileId: leader.profile_id,
      restoreTo: { role: "alum", subteamId: null },
    }));
  }

  private async loadPeople(ctx: Context): Promise<Record<string, LeadershipPerson>> {
    const ids = new Set<string>();
    for (const leader of ctx.leaders) ids.add(leader.profile_id);
    for (const seat of ctx.applied) ids.add(seat.profile_id);
    for (const slot of ctx.draft.slots) {
      if (slot.outgoingProfileId) ids.add(slot.outgoingProfileId);
      if (slot.successorProfileId) ids.add(slot.successorProfileId);
    }
    const people = await this.repository.getPeople([...ids]);
    return Object.fromEntries(people.map((person) => [person.id, person]));
  }

  private async changesFor(
    cycle: RecruitingCycleSummary,
    ctx: Context,
    draft: LeadershipDraft
  ) {
    const roster = buildRoster(draft, ctx.structure);
    const baseline = this.baseline(cycle, ctx);
    const ids = new Set([
      ...roster.map((r) => r.profileId),
      ...baseline.map((b) => b.profileId),
    ]);
    const people = await this.repository.getPeople([...ids]);
    const roles: Record<string, RoleState> = Object.fromEntries(
      people.map((person) => [person.id, { role: person.role, subteamId: person.subteamId }])
    );
    const missing = [...ids].filter((id) => !roles[id]);
    if (missing.length > 0) throw new ApiError("Someone on the roster no longer exists", 400);
    return computeRoleChanges(roster, baseline, roles).changes;
  }

  private async assertReady(draft: LeadershipDraft, ctx: Context): Promise<void> {
    if (ctx.unplaced.length > 0) {
      throw new ApiError(
        "Some current VPs aren't on a subteam with a VP position. Fix their subteam in Members.",
        400
      );
    }
    const people = await this.loadPeople({ ...ctx, draft });
    const names = Object.fromEntries(Object.values(people).map((p) => [p.id, p.name]));
    const readiness = checkLockReadiness(draft, ctx.structure, names);
    if (!readiness.ready)
      throw new ApiError(readiness.blockers[0] ?? "Roster isn't ready", 400);
  }

  /** Before the lock, the draft must cover exactly the people who hold a seat now. */
  private assertSlotsMatchLeaders(draft: LeadershipDraft, ctx: Context): void {
    const expected = new Set(ctx.draft.slots.map((s) => s.outgoingProfileId).filter(Boolean));
    const actual = draft.slots.map((s) => s.outgoingProfileId).filter(Boolean);
    const unique = new Set(actual);
    if (
      unique.size !== actual.length ||
      unique.size !== expected.size ||
      [...unique].some((id) => !expected.has(id))
    ) {
      throw new ApiError("Current leadership changed since this page loaded. Reload it.", 409);
    }
  }

  private assertPositions(draft: LeadershipDraft, hiring: HiringPick[], ctx: Context): void {
    const vpIds = new Set(
      ctx.structure.subteams.flatMap((s) => s.vpPositions.map((p) => p.id))
    );
    const execIds = new Set(
      ctx.positions.filter((p) => !p.isVp && p.subteamId !== null).map((p) => p.id)
    );

    for (const slot of draft.slots) {
      const valid =
        slot.kind === "pres"
          ? slot.positionId === ctx.structure.presidentPositionId
          : vpIds.has(slot.positionId);
      if (!valid) throw new ApiError("A seat is on the wrong position", 400);
    }
    const seen = new Set<number>();
    for (const pick of hiring) {
      if (!execIds.has(pick.positionId)) {
        throw new ApiError("Only exec positions can be picked for hiring", 400);
      }
      if (seen.has(pick.positionId)) throw new ApiError("A position is picked twice", 400);
      seen.add(pick.positionId);
    }
  }

  /**
   * Which cycle positions a save manages. Before the lock it manages every exec and VP
   * position (the hiring picks plus open VP seats); after the lock only VP seats, since
   * Setup owns the exec positions.
   */
  private positionSync(
    draft: LeadershipDraft,
    hiring: HiringPick[],
    ctx: Context,
    scope: "all" | "vp"
  ) {
    const vpIds = ctx.structure.subteams.flatMap((s) => s.vpPositions.map((p) => p.id));
    const execIds = ctx.positions.filter((p) => !p.isVp).map((p) => p.id);

    const openSeats = new Map<number, number>();
    for (const slot of draft.slots) {
      if (slot.kind === "vp" && slot.decision === "open") {
        openSeats.set(slot.positionId, (openSeats.get(slot.positionId) ?? 0) + 1);
      }
    }
    const vpPicks: HiringPick[] = openVpPositionIds(draft).map((positionId) => ({
      positionId,
      openings: openSeats.get(positionId) ?? 1,
    }));

    return scope === "all"
      ? { managedIds: [...vpIds, ...execIds], desired: [...hiring, ...vpPicks] }
      : { managedIds: vpIds, desired: vpPicks };
  }
}

export const leadershipService = new LeadershipService();
