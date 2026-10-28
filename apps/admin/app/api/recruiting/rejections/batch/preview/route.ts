import { RaftResponse } from "@uw-datasci/raft";
import { rejectionBatchSchema } from "@uwdsc/common/schemas";
import { offersService } from "@uwdsc/admin";
import { requireOffers, withRecruiting } from "@/guards/withRecruiting";

/**
 * POST /api/recruiting/rejections/batch/preview
 * Recipients, counts and a sample email for the batch rejection.
 */
export const POST = withRecruiting(async (request, _context, _user, recruiting) => {
  const parsed = rejectionBatchSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  return RaftResponse.ok(await offersService.previewRejectionBatch(recruiting, parsed.data));
}, requireOffers);
