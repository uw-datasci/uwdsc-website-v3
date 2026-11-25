import { RaftResponse } from "@uw-datasci/raft";
import { createSubteamSchema } from "@uwdsc/common/schemas";
import { structureService } from "@uwdsc/admin";
import { requireStructure, withRecruiting } from "@/guards/withRecruiting";

/**
 * POST /api/recruiting/structure/subteams
 * Create a subteam with its VP position (presidents). Restores a retired one by name.
 */
export const POST = withRecruiting(async (request, _context, _user, recruiting) => {
  const parsed = createSubteamSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  return RaftResponse.ok(await structureService.createSubteam(recruiting, parsed.data));
}, requireStructure);
