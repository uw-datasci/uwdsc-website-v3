import { RaftResponse } from "@uw-datasci/raft";
import { resendOfferSchema } from "@uwdsc/common/schemas";
import { offersService } from "@uwdsc/admin";
import { requireOffers, withRecruiting } from "@/guards/withRecruiting";
import type { WithAuthContext } from "@/guards/withAuth";
import { recruitingIdSchema } from "@/lib/schemas/recruiting";

interface Params extends WithAuthContext {
  params: Promise<{ selectionId: string }>;
}

/**
 * POST /api/recruiting/offers/:selectionId/resend
 * Send a new link with a fresh deadline. The old link stops working.
 */
export const POST = withRecruiting<Params>(async (request, { params }, user, recruiting) => {
  const { selectionId } = await params;
  if (!recruitingIdSchema.safeParse(selectionId).success) {
    return RaftResponse.badRequest("Invalid card id");
  }

  const parsed = resendOfferSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await offersService.resendOffer(recruiting, user.id, selectionId, parsed.data);
  return RaftResponse.ok({ sent: true });
}, requireOffers);
