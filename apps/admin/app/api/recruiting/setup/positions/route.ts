import { RaftResponse } from "@uw-datasci/raft";
import { addPositionSchema } from "@uwdsc/common/schemas";
import { setupService } from "@uwdsc/admin";
import { requireSetup, withRecruiting } from "@/guards/withRecruiting";

/**
 * POST /api/recruiting/setup/positions
 * Open an exec position in this cycle (presidents).
 */
export const POST = withRecruiting(async (request, _context, _user, recruiting) => {
  const parsed = addPositionSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await setupService.addPosition(recruiting, parsed.data.positionId);
  return RaftResponse.ok({ saved: true });
}, requireSetup);
