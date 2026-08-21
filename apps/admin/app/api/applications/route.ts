import { RaftResponse } from "@uw-datasci/raft";
import { isAdmin, readRoleClaims } from "@uwdsc/common/constants";
import { applicationService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";
import { createAuthService, createResumeService } from "@/lib/services";

/**
 * GET /api/applications
 * All applications (draft and submitted) with full details, plus draft/submitted counts.
 * Admin/exec only
 */
export const GET = withAuth(async (_request, _context, user) => {
  const [applications, statusCounts, resumeService, authService] = await Promise.all([
    applicationService.getAllApplications(),
    applicationService.getApplicationCounts(),
    createResumeService(),
    createAuthService()
  ]);

  const claims = readRoleClaims(user.app_metadata);
  const scope = await authService.getScopeForUser(claims);
  const canUsePositionReview = isAdmin(claims.role);

  // Hydrate resume_url with signed URLs from private storage bucket
  const applicationsWithResumes = await Promise.all(
    applications.map(async (app) => ({
      ...app,
      resume_url: await resumeService.getResumeUrl(app.profile_id)
    }))
  );

  return RaftResponse.ok({
    applications: applicationsWithResumes,
    statusCounts,
    positionReview: {
      canUse: canUsePositionReview,
      isPresident: scope.isPresident,
      vpPositionIds: scope.vpPositionIds,
      vpExecPositionIds: scope.vpExecPositionIds
    }
  });
});
