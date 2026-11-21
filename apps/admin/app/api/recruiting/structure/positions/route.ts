import { RaftResponse } from "@uw-datasci/raft";
import { createPositionSchema } from "@uwdsc/common/schemas";
import { structureService } from "@uwdsc/admin";
import { requireStructure, withRecruiting } from "@/guards/withRecruiting";

/**
 * POST /api/recruiting/structure/positions
 * Create an exec or VP position on a subteam (presidents), optionally opening it in the cycle.
 */
export const POST = withRecruiting(async (request, _context, _user, recruiting) => {
  const parsed = createPositionSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  return RaftResponse.ok(await structureService.createPosition(recruiting, parsed.data));
}, requireStructure);
