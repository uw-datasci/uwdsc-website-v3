import {
  explainTransition,
  individualRejection,
  offerBlocker,
  rejectionBatch,
  seatState,
  wantedSubteams,
  type DecisionCard,
  type RecruitingActor,
  type RecruitingCapabilities,
  type RecruitingCycleSummary,
  type SelectionStatus,
} from "@uwdsc/common/recruiting";
import { createOfferToken, offerResponseService, offerUrl, type CardMove } from "@uwdsc/core";
import type {
  OfferResponseInput,
  RejectionBatchInput,
  SendOfferInput,
} from "@uwdsc/common/schemas";
import type {
  EmailPreview,
  OfferRow,
  OffersView,
  ReadyGroup,
  ReadyRow,
  RejectionBatchPreview,
} from "@uwdsc/common/types";
import { ApiError } from "@uwdsc/common/types";
import { firstName, formatOfferDeadline, formatTermCode, joinNames } from "@uwdsc/common/utils";
import { EMAIL_BATCH_LIMIT, emailService } from "../email/email.service";
import type { RecruitingEmail } from "../../types/email";
import { OffersRepository, type OfferCardRow } from "./offers.repository";

type Capabilities = Pick<RecruitingCapabilities, "can" | "viewer" | "cycle">;

interface Context {
  cycle: RecruitingCycleSummary;
  rows: OfferCardRow[];
  cards: DecisionCard[];
  byApplication: Map<string, DecisionCard[]>;
  signedBy: string;
  replyTo: string[];
  termLabel: string;
}

const HOUR_MS = 60 * 60 * 1000;
/** Previews link to a placeholder; real tokens are only made on send. */
const PREVIEW_TOKEN = "preview";

function toDecision(row: OfferCardRow): DecisionCard {
  return {
    selectionId: row.selection_id,
    applicationId: row.application_id,
    name: row.full_name,
    positionId: row.position_id,
    positionName: row.position_name,
    status: row.status,
  };
}

function toOfferRow(row: OfferCardRow): OfferRow {
  return {
    selectionId: row.selection_id,
    applicationId: row.application_id,
    name: row.full_name,
    email: row.email,
    program: [row.major, row.year_of_study].filter(Boolean).join(" · ") || null,
    priority: row.priority,
    status: row.status,
    positionId: row.position_id,
    positionName: row.position_name,
    subteamName: row.subteam_name,
    isVp: row.is_vp,
    returning: row.applicant_role === "exec" || row.applicant_role === "alum",
    wantedBy: row.wanted_by,
    wantedAt: row.wanted_at,
    sentAt: row.sent_at,
    expiresAt: row.expires_at,
    respondedAt: row.responded_at,
  };
}

function assertMove(from: SelectionStatus, to: SelectionStatus, actor: RecruitingActor): void {
  const check = explainTransition(from, to, actor);
  if (!check.ok) throw new ApiError(check.reason, 400);
}

class OffersService {
  private readonly repository = new OffersRepository();

  async getOffers(caps: Capabilities): Promise<OffersView> {
    const ctx = await this.load(caps);
    const now = Date.now();
    const openings = new Map<number, number>();
    for (const row of ctx.rows) openings.set(row.position_id, row.openings);
    const seats = seatState(openings, ctx.cards);

    const ready: ReadyRow[] = ctx.rows
      .filter((row) => row.status === "Wanted")
      .map((row) => ({
        ...toOfferRow(row),
        blocker: offerBlocker(
          toDecision(row),
          ctx.byApplication.get(row.application_id) ?? [],
          seats
        ),
      }));

    const conflictIds = new Set(
      [...ctx.byApplication.keys()].filter(
        (id) =>
          wantedSubteams(
            ctx.rows
              .filter((row) => row.application_id === id)
              .map((row) => ({ status: row.status, subteamName: row.subteam_name }))
          ).length >= 2
      )
    );

    const groups = new Map<string, ReadyGroup>();
    for (const row of ready) {
      if (conflictIds.has(row.applicationId)) continue;
      const key = row.subteamName ?? "Presidents";
      const group = groups.get(key) ?? { subteamName: key, seats: [], rows: [] };
      group.rows.push(row);
      if (!group.seats.some((seat) => seat.positionId === row.positionId)) {
        const seat = seats.get(row.positionId);
        group.seats.push({
          positionId: row.positionId,
          positionName: row.positionName,
          openings: seat?.openings ?? 0,
          left: seat?.left ?? 0,
          heldBy: seat?.heldBy ?? [],
        });
      }
      groups.set(key, group);
    }

    const conflicts = [...conflictIds].map((applicationId) => {
      const rows = ready
        .filter((row) => row.applicationId === applicationId)
        .sort((a, b) => a.priority - b.priority);
      return {
        applicationId,
        name: rows[0]?.name ?? "",
        program: rows[0]?.program ?? null,
        rows,
      };
    });

    const offered = ctx.rows.filter((row) => row.status === "Offer Sent").map(toOfferRow);
    const isExpired = (row: OfferRow) =>
      row.expiresAt !== null && new Date(row.expiresAt).getTime() < now;
    const byDeadline = (a: OfferRow, b: OfferRow) =>
      (a.expiresAt ?? "").localeCompare(b.expiresAt ?? "");

    return {
      ready: [...groups.values()].sort((a, b) => a.subteamName.localeCompare(b.subteamName)),
      conflicts,
      sent: offered.filter((row) => !isExpired(row)).sort(byDeadline),
      expired: offered.filter(isExpired).sort(byDeadline),
      responded: ctx.rows
        .filter((row) => row.status === "Accepted Offer" || row.status === "Declined Offer")
        .map(toOfferRow)
        .sort((a, b) => (b.respondedAt ?? "").localeCompare(a.respondedAt ?? "")),
      offerResponseHours: ctx.cycle.offerResponseHours,
    };
  }

  async previewOffer(caps: Capabilities, input: SendOfferInput): Promise<EmailPreview> {
    const ctx = await this.load(caps);
    const row = this.offerable(ctx, input.selectionId, caps);
    const expiresAt = new Date(Date.now() + ctx.cycle.offerResponseHours * HOUR_MS);
    const email = await this.offerEmail(
      ctx,
      row,
      input.personalLine,
      expiresAt,
      offerUrl(PREVIEW_TOKEN)
    );
    return this.toPreview(email);
  }

  async sendOffer(caps: Capabilities, actorId: string, input: SendOfferInput): Promise<void> {
    const ctx = await this.load(caps);
    const row = this.offerable(ctx, input.selectionId, caps);
    const sentAt = new Date();
    const expiresAt = new Date(sentAt.getTime() + ctx.cycle.offerResponseHours * HOUR_MS);
    const personalLine = input.personalLine?.trim() || null;
    const { token, hash } = createOfferToken();
    const email = await this.offerEmail(ctx, row, personalLine, expiresAt, offerUrl(token));

    await this.repository.sendOffer({
      selectionId: row.selection_id,
      actorId,
      sentAt,
      expiresAt,
      tokenHash: hash,
      personalLine,
      send: () => emailService.sendRecruitingEmail(email),
    });
  }

  /** Mark accepted / declined by hand, or correct a recorded reply. */
  async respond(
    caps: Capabilities,
    actorId: string,
    selectionId: string,
    input: OfferResponseInput
  ): Promise<void> {
    const cycle = caps.cycle;
    if (!cycle) throw new ApiError("There's no hiring cycle yet", 404);
    await offerResponseService.apply({
      selectionId,
      response: input.response,
      via: "manual",
      actorId,
      actorRole: caps.viewer.role,
      cycleId: cycle.id,
    });
  }

  async previewRejection(caps: Capabilities, applicationId: string): Promise<EmailPreview> {
    const ctx = await this.load(caps);
    const { row } = this.rejectable(ctx, applicationId);
    return this.toPreview(await this.rejectionEmail(ctx, row));
  }

  async sendRejection(
    caps: Capabilities,
    actorId: string,
    applicationId: string
  ): Promise<void> {
    const ctx = await this.load(caps);
    const { row, selectionIds } = this.rejectable(ctx, applicationId);
    const moves = this.rejectionMoves(ctx, selectionIds, actorId, "send_rejection", caps);
    const email = await this.rejectionEmail(ctx, row);
    await this.repository.sendRejections(moves, async () => {
      await emailService.sendRecruitingEmail(email);
    });
  }

  async previewRejectionBatch(
    caps: Capabilities,
    input: RejectionBatchInput
  ): Promise<RejectionBatchPreview> {
    const ctx = await this.load(caps);
    const batch = rejectionBatch(ctx.cards, input.include);
    const emails = new Map(ctx.rows.map((row) => [row.application_id, row.email]));
    const first = batch.recipients[0];
    const firstRow = first ? this.rowFor(ctx, first.applicationId) : null;

    return {
      recipients: batch.recipients.map((recipient) => ({
        applicationId: recipient.applicationId,
        name: recipient.name,
        email: emails.get(recipient.applicationId) ?? null,
        group: recipient.group,
        positionNames: recipient.positionNames,
      })),
      counts: batch.counts,
      skipped: batch.skipped,
      skippedExample: batch.skippedExample,
      email: firstRow ? this.toPreview(await this.rejectionEmail(ctx, firstRow)) : null,
    };
  }

  async sendRejectionBatch(
    caps: Capabilities,
    actorId: string,
    input: RejectionBatchInput
  ): Promise<{ sent: number }> {
    const ctx = await this.load(caps);
    const recipients = rejectionBatch(ctx.cards, input.include).recipients.filter(
      (recipient) => this.rowFor(ctx, recipient.applicationId).email
    );
    if (recipients.length === 0) throw new ApiError("No one to send a rejection to", 400);

    for (let i = 0; i < recipients.length; i += EMAIL_BATCH_LIMIT) {
      const chunk = recipients.slice(i, i + EMAIL_BATCH_LIMIT);
      const moves = chunk.flatMap((recipient) =>
        this.rejectionMoves(ctx, recipient.selectionIds, actorId, "batch_rejection", caps)
      );
      const emails = await Promise.all(
        chunk.map((recipient) =>
          this.rejectionEmail(ctx, this.rowFor(ctx, recipient.applicationId))
        )
      );
      await this.repository.sendRejections(moves, () =>
        emailService.sendRecruitingBatch(emails)
      );
    }
    return { sent: recipients.length };
  }

  private async load(caps: Capabilities): Promise<Context> {
    const cycle = caps.cycle;
    if (!cycle) throw new ApiError("There's no hiring cycle yet", 404);

    const [rows, presidents] = await Promise.all([
      this.repository.getCards(cycle.id, cycle.termId),
      this.repository.getPresidents(cycle.id),
    ]);
    const cards = rows.map(toDecision);
    const byApplication = new Map<string, DecisionCard[]>();
    for (const card of cards) {
      byApplication.set(card.applicationId, [
        ...(byApplication.get(card.applicationId) ?? []),
        card,
      ]);
    }

    return {
      cycle,
      rows,
      cards,
      byApplication,
      signedBy:
        joinNames(presidents.map((p) => p.name).filter((n): n is string => !!n)) || "DSC",
      replyTo: presidents.map((p) => p.email).filter((e): e is string => !!e),
      termLabel: formatTermCode(cycle.targetTermCode),
    };
  }

  private findRow(ctx: Context, selectionId: string): OfferCardRow {
    const row = ctx.rows.find((candidate) => candidate.selection_id === selectionId);
    if (!row) throw new ApiError("Card not found in this cycle", 404);
    return row;
  }

  private rowFor(ctx: Context, applicationId: string): OfferCardRow {
    const row = ctx.rows.find((candidate) => candidate.application_id === applicationId);
    if (!row) throw new ApiError("Candidate not found in this cycle", 404);
    return row;
  }

  private offerable(ctx: Context, selectionId: string, caps: Capabilities): OfferCardRow {
    const row = this.findRow(ctx, selectionId);
    assertMove(row.status, "Offer Sent", { role: caps.viewer.role, action: "send_offer" });

    const openings = new Map<number, number>();
    for (const other of ctx.rows) openings.set(other.position_id, other.openings);
    const blocker = offerBlocker(
      toDecision(row),
      ctx.byApplication.get(row.application_id) ?? [],
      seatState(openings, ctx.cards)
    );
    if (blocker) throw new ApiError(blocker, 409);
    if (!row.email) throw new ApiError("This candidate has no email on file", 400);
    return row;
  }

  private rejectable(
    ctx: Context,
    applicationId: string
  ): { row: OfferCardRow; selectionIds: string[] } {
    const row = this.rowFor(ctx, applicationId);
    const check = individualRejection(ctx.byApplication.get(applicationId) ?? []);
    if (!check.ok) throw new ApiError(check.reason, 409);
    if (!row.email) throw new ApiError("This candidate has no email on file", 400);
    return { row, selectionIds: check.selectionIds };
  }

  private rejectionMoves(
    ctx: Context,
    selectionIds: readonly string[],
    actorId: string,
    action: "send_rejection" | "batch_rejection",
    caps: Capabilities
  ): CardMove[] {
    return selectionIds.map((selectionId) => {
      const row = this.findRow(ctx, selectionId);
      assertMove(row.status, "Rejection Sent", { role: caps.viewer.role, action });
      return { selectionId, from: row.status, to: "Rejection Sent", actorId, reason: null };
    });
  }

  private async offerEmail(
    ctx: Context,
    row: OfferCardRow,
    personalLine: string | null | undefined,
    expiresAt: Date,
    respondUrl: string
  ): Promise<RecruitingEmail> {
    const { subject, html } = await emailService.renderOfferEmail({
      firstName: firstName(row.full_name),
      positionName: row.position_name,
      subteamName: row.subteam_name,
      termLabel: ctx.termLabel,
      deadline: formatOfferDeadline(expiresAt),
      personalLine: personalLine?.trim() || undefined,
      signedBy: ctx.signedBy,
      respondUrl,
    });
    return { to: row.email ?? "", replyTo: ctx.replyTo, subject, html };
  }

  private async rejectionEmail(ctx: Context, row: OfferCardRow): Promise<RecruitingEmail> {
    const { subject, html } = await emailService.renderRejectionEmail({
      firstName: firstName(row.full_name),
      termLabel: ctx.termLabel,
      signedBy: ctx.signedBy,
    });
    return { to: row.email ?? "", replyTo: ctx.replyTo, subject, html };
  }

  private toPreview(email: RecruitingEmail): EmailPreview {
    return { to: email.to, replyTo: email.replyTo, subject: email.subject, html: email.html };
  }
}

export const offersService = new OffersService();
