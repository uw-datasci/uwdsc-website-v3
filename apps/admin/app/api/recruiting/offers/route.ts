import { RaftResponse } from "@uw-datasci/raft";
import { sendOfferSchema } from "@uwdsc/common/schemas";
import { offersService } from "@uwdsc/admin";
import { requireOffers, withRecruiting } from "@/guards/withRecruiting";

/**
 * GET /api/recruiting/offers
 * Ready to offer, sent, expired and responded, with seats per position.
 */
export const GET = withRecruiting(async (_request, _context, _user, recruiting) => {
  return RaftResponse.ok(await offersService.getOffers(recruiting));
}, requireOffers);

/**
 * POST /api/recruiting/offers
 * Send an offer email and move the card to Offer Sent.
 */
export const POST = withRecruiting(async (request, _context, user, recruiting) => {
  const parsed = sendOfferSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await offersService.sendOffer(recruiting, user.id, parsed.data);
  return RaftResponse.ok({ sent: true });
}, requireOffers);
