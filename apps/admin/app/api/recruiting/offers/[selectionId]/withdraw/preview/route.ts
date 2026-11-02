import { RaftResponse } from "@uw-datasci/raft";
import { offersService } from "@uwdsc/admin";
import { requireOffers, withRecruiting } from "@/guards/withRecruiting";
import type { WithAuthContext } from "@/guards/withAuth";
import { recruitingIdSchema } from "@/lib/schemas/recruiting";

interface Params extends WithAuthContext {
  params: Promise<{ selectionId: string }>;
}

/**
 * POST /api/recruiting/offers/:selectionId/withdraw/preview
 * The "offer withdrawn" email, without sending it.
 */
export const POST = withRecruiting<Params>(async (_request, { params }, _user, recruiting) => {
  const { selectionId } = await params;
  if (!recruitingIdSchema.safeParse(selectionId).success) {
    return RaftResponse.badRequest("Invalid card id");
  }
  return RaftResponse.ok(await offersService.previewWithdraw(recruiting, selectionId));
}, requireOffers);
