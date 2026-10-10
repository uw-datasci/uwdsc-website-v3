import { RaftResponse } from "@uw-datasci/raft";
import { contactSubmissionService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";

/**
 * GET /api/support/submissions
 * Support inbox: contact-form and support-email submissions. Any exec / admin / pres.
 */
export const GET = withAuth(async () => {
  const submissions = await contactSubmissionService.listSubmissions();
  return RaftResponse.ok({ submissions });
});
