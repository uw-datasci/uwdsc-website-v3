import { ApiResponse } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";
import { createAuthService, createResumeService } from "@/lib/services";

/**
 * GET /api/applications
 * Non-draft applications with full details, plus draft/submitted counts (all applications).
 * Admin/exec only
 */
export const GET = withAuth(async (_request, _context, user) => {
  try {
    const [applications, statusCounts, resumeService, authService] =
      await Promise.all([
        applicationService.getAllApplications(),
        applicationService.getApplicationCounts(),
        createResumeService(),
        createAuthService(),
      ]);

    const scope = await authService.getScopeForUser(user.id);
    const portalRole = user.app_metadata?.role as string | undefined;
    const canUsePositionReview =
      portalRole === "admin" &&
      (scope.isPresident ||
        scope.hasVpExecRole ||
        scope.vpPositionIds.length > 0);

    // Hydrate resume_url with signed URLs from private storage bucket
    const applicationsWithResumes = await Promise.all(
      applications.map(async (app) => ({
        ...app,
        resume_url: await resumeService.getResumeUrl(app.profile_id),
      })),
    );

    return ApiResponse.ok({
      applications: applicationsWithResumes,
      statusCounts,
      positionReview: {
        canUse: canUsePositionReview,
        isPresident: scope.isPresident,
        vpPositionIds: scope.vpPositionIds,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching applications:", error);
    return ApiResponse.serverError(error, "Failed to fetch applications");
  }
});
