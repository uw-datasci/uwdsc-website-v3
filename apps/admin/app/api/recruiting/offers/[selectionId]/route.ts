import { RaftResponse } from "@uw-datasci/raft";
import { offerResponseSchema } from "@uwdsc/common/schemas";
import { offersService } from "@uwdsc/admin";
import { requireOffers, withRecruiting } from "@/guards/withRecruiting";
import type { WithAuthContext } from "@/guards/withAuth";
import { recruitingIdSchema } from "@/lib/schemas/recruiting";

interface Params extends WithAuthContext {
  params: Promise<{ selectionId: string }>;
}

/**
 * PATCH /api/recruiting/offers/:selectionId
 * Mark an offer accepted or declined, or correct a recorded reply.
 */
export const PATCH = withRecruiting<Params>(async (request, { params }, user, recruiting) => {
  const { selectionId } = await params;
  if (!recruitingIdSchema.safeParse(selectionId).success) {
    return RaftResponse.badRequest("Invalid card id");
  }

  const parsed = offerResponseSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await offersService.respond(recruiting, user.id, selectionId, parsed.data);
  return RaftResponse.ok({ saved: true });
}, requireOffers);
