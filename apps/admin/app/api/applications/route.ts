import { ApiResponse } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";
import { createResumeService } from "@/lib/services";

/**
 * GET /api/applications
 * Non-draft applications with full details, plus draft/submitted counts (all applications).
 * Admin/exec only
 */
export const GET = withAuth(async () => {
  try {
    const [applications, statusCounts, resumeService] = await Promise.all([
      applicationService.getAllApplications(),
      applicationService.getDraftAndSubmittedCounts(),
      createResumeService(),
    ]);

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
    });
  } catch (error: unknown) {
    console.error("Error fetching applications:", error);
    return ApiResponse.serverError(error, "Failed to fetch applications");
  }
});
