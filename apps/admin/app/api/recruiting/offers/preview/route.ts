import { RaftResponse } from "@uw-datasci/raft";
import { sendOfferSchema } from "@uwdsc/common/schemas";
import { offersService } from "@uwdsc/admin";
import { requireOffers, withRecruiting } from "@/guards/withRecruiting";

/**
 * POST /api/recruiting/offers/preview
 * The rendered offer email, without sending it.
 */
export const POST = withRecruiting(async (request, _context, _user, recruiting) => {
  const parsed = sendOfferSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  return RaftResponse.ok(await offersService.previewOffer(recruiting, parsed.data));
}, requireOffers);
