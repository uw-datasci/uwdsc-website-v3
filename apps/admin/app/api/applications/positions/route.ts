import { RaftResponse } from "@uw-datasci/raft";
import { applicationService } from "@uwdsc/admin";
import { withPresAccess } from "@/guards/withPresAccess";
import { addPositionSchema } from "@/lib/schemas/positions";

/**
 * GET /api/applications/positions
 * List every exec position (excluding Presidents) with its current
 * application-availability. President only.
 */
export const GET = withPresAccess(async () => {
  const positions = await applicationService.getManagablePositions();
  return RaftResponse.ok({ positions });
});

/**
 * POST /api/applications/positions
 * Open an exec position for applications. Idempotent -- re-opening a
 * previously-closed role reuses its existing apa id. President only.
 */
export const POST = withPresAccess(async (request) => {
  const body = await request.json();
  const parsed = addPositionSchema.safeParse(body);
  if (!parsed.success) return RaftResponse.badRequest(parsed.error.issues[0]?.message);

  const created = await applicationService.openAvailablePosition(parsed.data.positionId);
  return RaftResponse.ok({ success: true, availableId: created.id });
});
