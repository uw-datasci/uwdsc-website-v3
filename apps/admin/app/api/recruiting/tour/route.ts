import { RaftResponse } from "@uw-datasci/raft";
import { tourSchema } from "@uwdsc/common/schemas";
import { tourService } from "@uwdsc/admin";
import { withRecruiting } from "@/guards/withRecruiting";

/**
 * GET /api/recruiting/tour
 * Guided tours the viewer has finished or skipped.
 */
export const GET = withRecruiting(async (_request, _context, user) => {
  return RaftResponse.ok({ completed: await tourService.getCompleted(user.id) });
});

/**
 * POST /api/recruiting/tour
 * Mark a tour as finished, so it doesn't start on its own again.
 */
export const POST = withRecruiting(async (request, _context, user) => {
  const parsed = tourSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await tourService.complete(user.id, parsed.data.tour);
  return RaftResponse.ok({ saved: true });
});
