import { RaftResponse } from "@uw-datasci/raft";
import { applicationService } from "@uwdsc/core";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/terms
 * Get all retained terms (ordered newest first).
 * Admin/exec only.
 */
export const GET = withAuth(async () => {
  const terms = await applicationService.getAllTerms();
  return RaftResponse.ok(terms);
});
