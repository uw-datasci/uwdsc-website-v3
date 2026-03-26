import { ApiResponse } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/admin";
import { withVpAccess } from "@/guards/withVpAccess";
import { createResumeService } from "@/lib/services";

/**
 * GET /api/applications/review
 * Scoped application list for Presidents and VPs.
 */
export const GET = withVpAccess(async (_request, _context, _user, scope) => {
  try {
    const [applications, resumeService] = await Promise.all([
      applicationService.getApplicationsForScope(scope),
      createResumeService(),
    ]);

    const applicationsWithResumes = await Promise.all(
      applications.map(async (app) => ({
        ...app,
        resume_url: await resumeService.getResumeUrl(app.profile_id),
      })),
    );

    return ApiResponse.ok({
      applications: applicationsWithResumes,
      scope: {
        isPresident: scope.isPresident,
        vpSubteamNames: scope.vpSubteamNames,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching review applications:", error);
    return ApiResponse.serverError(error, "Failed to fetch applications");
  }
});
