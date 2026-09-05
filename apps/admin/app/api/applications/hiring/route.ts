import { RaftResponse } from "@uw-datasci/raft";
import { hiringService } from "@uwdsc/admin";
import { withPresAccess } from "@/guards/withPresAccess";

/**
 * GET /api/applications/hiring
 * Get all applicants with position selections for the hiring dashboard.
 */
export const GET = withPresAccess(async () => {
  const applicants = await hiringService.getHiringApplicants();
  return RaftResponse.ok({ applicants });
});
