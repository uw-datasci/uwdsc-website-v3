import { RaftResponse } from "@uw-datasci/raft";
import { rejectionSchema } from "@uwdsc/common/schemas";
import { offersService } from "@uwdsc/admin";
import { requireOffers, withRecruiting } from "@/guards/withRecruiting";

/**
 * POST /api/recruiting/rejections
 * Send one candidate a rejection email and move their cards to Rejection Sent.
 */
export const POST = withRecruiting(async (request, _context, user, recruiting) => {
  const parsed = rejectionSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await offersService.sendRejection(recruiting, user.id, parsed.data.applicationId);
  return RaftResponse.ok({ sent: true });
}, requireOffers);
