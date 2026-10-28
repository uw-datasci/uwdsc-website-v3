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
 * POST /api/recruiting/offers/:selectionId/resend/preview
 * The re-sent offer email, without sending it.
 */
export const POST = withRecruiting<Params>(async (request, { params }, _user, recruiting) => {
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

  return RaftResponse.ok(
    await offersService.previewResend(recruiting, selectionId, parsed.data)
  );
}, requireOffers);
