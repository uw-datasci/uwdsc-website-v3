import { ApiResponse } from "@uwdsc/common/utils";
import { applicationService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";
import { createResumeService } from "@/lib/services";

/**
 * GET /api/applications
 * Get all submitted applications with full details
 * Admin/exec only
 */
export const GET = withAuth(async () => {
  try {
    const [applications, resumeService] = await Promise.all([
      applicationService.getAllApplications(),
      createResumeService(),
    ]);

    // Hydrate resume_url with signed URLs from private storage bucket
    const applicationsWithResumes = await Promise.all(
      applications.map(async (app) => ({
        ...app,
        resume_url: await resumeService.getResumeUrl(app.profile_id),
      })),
    );

    return ApiResponse.ok(applicationsWithResumes);
  } catch (error: unknown) {
    console.error("Error fetching applications:", error);
    return ApiResponse.serverError(error, "Failed to fetch applications");
  }
});
