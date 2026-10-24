import { RaftResponse } from "@uw-datasci/raft";
import { rejectionBatchSchema } from "@uwdsc/common/schemas";
import { offersService } from "@uwdsc/admin";
import { requireOffers, withRecruiting } from "@/guards/withRecruiting";

/**
 * POST /api/recruiting/rejections/batch
 * One rejection email per candidate not moving forward, for the chosen groups.
 */
export const POST = withRecruiting(async (request, _context, user, recruiting) => {
  const parsed = rejectionBatchSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  return RaftResponse.ok(
    await offersService.sendRejectionBatch(recruiting, user.id, parsed.data)
  );
}, requireOffers);
