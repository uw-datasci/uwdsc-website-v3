import { RaftResponse } from "@uw-datasci/raft";
import { overviewService } from "@uwdsc/admin";
import { requireOverview, withRecruiting } from "@/guards/withRecruiting";

/**
 * GET /api/recruiting/overview
 * Phase stepper, counts, attention list, checklist and seats for the viewer's role.
 */
export const GET = withRecruiting(async (_request, _context, _user, recruiting) => {
  return RaftResponse.ok(await overviewService.getOverview(recruiting));
}, requireOverview);
