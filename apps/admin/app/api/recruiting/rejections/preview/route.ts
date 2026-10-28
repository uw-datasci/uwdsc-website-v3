import { RaftResponse } from "@uw-datasci/raft";
import { rejectionSchema } from "@uwdsc/common/schemas";
import { offersService } from "@uwdsc/admin";
import { requireOffers, withRecruiting } from "@/guards/withRecruiting";

/**
 * POST /api/recruiting/rejections/preview
 * The rendered rejection email for one candidate, without sending it.
 */
export const POST = withRecruiting(async (request, _context, _user, recruiting) => {
  const parsed = rejectionSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  return RaftResponse.ok(
    await offersService.previewRejection(recruiting, parsed.data.applicationId)
  );
}, requireOffers);
