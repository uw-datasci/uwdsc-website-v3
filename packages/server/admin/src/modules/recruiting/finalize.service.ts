import {
  buildFinalizePlan,
  type FinalizePlan,
  type RecruitingCapabilities,
  type RecruitingCycleSummary,
} from "@uwdsc/common/recruiting";
import type { FinalizeRequest } from "@uwdsc/common/schemas";
import type { FinalizeResult, FinalizeView } from "@uwdsc/common/types";
import { ApiError } from "@uwdsc/common/types";
import { firstName, formatTermCode, joinNames } from "@uwdsc/common/utils";
import { EMAIL_BATCH_LIMIT, emailService } from "../email/email.service";
import type { RecruitingEmail } from "../../types/email";
import { FinalizeRepository, type DecidedRow } from "./finalize.repository";
import { OffersRepository } from "./offers.repository";

type Capabilities = Pick<RecruitingCapabilities, "can" | "viewer" | "cycle">;

function toDecided(row: DecidedRow) {
  return {
    selectionId: row.selection_id,
    profileId: row.profile_id,
    name: row.name,
    email: row.email,
    positionId: row.position_id,
    positionName: row.position_name,
    subteamId: row.subteam_id,
    subteamName: row.subteam_name,
    isVp: row.is_vp,
    expiresAt: row.expires_at,
  };
}

class FinalizeService {
  private readonly repository = new FinalizeRepository();
  private readonly offers = new OffersRepository();

  async getFinalize(caps: Capabilities): Promise<FinalizeView> {
    const cycle = this.requireCycle(caps);
    const { plan } = await this.plan(cycle);
    return {
      ...plan,
      targetTermLabel: formatTermCode(cycle.targetTermCode),
      finalizedAt: cycle.finalizedAt,
    };
  }

  /**
   * Finalize the cycle in one transaction, then (best effort) email anyone whose offer
   * closed and send the new team the welcome broadcast.
   */
  async finalize(
    caps: Capabilities,
    actorId: string,
    request: FinalizeRequest
  ): Promise<{ result: FinalizeResult; broadcastRecipients: string[] }> {
    const cycle = this.requireCycle(caps);
    if (!caps.can.finalize) throw new ApiError("Only presidents can finalize", 403);

    const { plan, emails } = await this.plan(cycle);
    if (plan.blockers.length > 0) throw new ApiError(plan.blockers.join(" "), 400);

    await this.repository.finalize({
      cycleId: cycle.id,
      targetTermId: cycle.targetTermId,
      actorId,
      plan,
    });

    const termLabel = formatTermCode(cycle.targetTermCode);
    await this.emailClosedOffers(cycle, plan, termLabel);

    let broadcastRecipients: string[] = [];
    try {
      const broadcast = await emailService.sendNewExecWelcomeBroadcast(emails, {
        when2MeetLink: request.when2MeetLink,
        termLabel,
        discordLink: process.env.DISCORD_INVITE_URL?.trim() ?? "",
      });
      broadcastRecipients = broadcast?.recipientEmails ?? [];
    } catch (error) {
      console.error("[FinalizeService] Welcome broadcast failed:", error);
    }

    return {
      result: {
        execs: plan.roleUpdates.filter((update) => update.role === "exec").length,
        alumni: plan.roleUpdates.filter((update) => update.role === "alum").length,
        closedOffers: plan.pending.length,
        welcomeSent: broadcastRecipients.length > 0,
      },
      broadcastRecipients,
    };
  }

  private async plan(
    cycle: RecruitingCycleSummary
  ): Promise<{ plan: FinalizePlan; emails: string[] }> {
    try {
      const [currentTeam, roster, decided, execHolders, seatsTotal] = await Promise.all([
        this.repository.getCurrentTeam(),
        this.repository.getRoster(cycle.id),
        this.repository.getDecided(cycle.id, cycle.termId),
        this.repository.getExecHolders(),
        this.repository.getSeatsTotal(cycle.id),
      ]);

      // Accepted public VP seats are already on the roster (granted when accepted).
      const accepted = decided.filter((row) => row.status === "Accepted Offer" && !row.is_vp);
      const plan = buildFinalizePlan({
        finalized: cycle.finalizedAt !== null,
        currentTeam: currentTeam.map((row) => ({
          profileId: row.profile_id,
          name: row.name,
          positionName: row.position_name,
          subteamName: row.subteam_name,
          isVp: row.is_vp,
          isPresident: row.is_president,
        })),
        roster: roster.map((row) => ({
          profileId: row.profile_id,
          name: row.name,
          email: row.email,
          role: row.role,
          positionId: row.position_id,
          subteamId: row.subteam_id,
          subteamName: row.subteam_name,
        })),
        accepted: accepted.map(toDecided),
        pending: decided.filter((row) => row.status === "Offer Sent").map(toDecided),
        execHolders: execHolders.map((row) => ({ profileId: row.profile_id, name: row.name })),
        seatsTotal,
      });

      const emails = [
        ...roster.map((row) => row.email),
        ...accepted.map((row) => row.email),
      ].filter((email): email is string => !!email);
      return { plan, emails };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        `Failed to build the Finalize preview: ${(error as Error).message}`,
        500
      );
    }
  }

  private async emailClosedOffers(
    cycle: RecruitingCycleSummary,
    plan: FinalizePlan,
    termLabel: string
  ): Promise<void> {
    const recipients = plan.pending.filter((offer) => offer.email);
    if (recipients.length === 0) return;

    try {
      const presidents = await this.offers.getPresidents(cycle.id);
      const signedBy =
        joinNames(presidents.map((p) => p.name).filter((n): n is string => !!n)) || "DSC";
      const replyTo = presidents.map((p) => p.email).filter((e): e is string => !!e);

      const emails: RecruitingEmail[] = await Promise.all(
        recipients.map(async (offer) => {
          const { subject, html } = await emailService.renderOfferClosedEmail({
            firstName: firstName(offer.name),
            positionName: offer.positionName,
            termLabel,
            signedBy,
            reason: "finalized",
          });
          return { to: offer.email ?? "", replyTo, subject, html };
        })
      );
      for (let i = 0; i < emails.length; i += EMAIL_BATCH_LIMIT) {
        await emailService.sendRecruitingBatch(emails.slice(i, i + EMAIL_BATCH_LIMIT));
      }
    } catch (error) {
      console.error("[FinalizeService] Offer-closed emails failed:", error);
    }
  }

  private requireCycle(caps: Capabilities): RecruitingCycleSummary {
    if (!caps.cycle) throw new ApiError("There's no hiring cycle yet", 404);
    return caps.cycle;
  }
}

export const finalizeService = new FinalizeService();
