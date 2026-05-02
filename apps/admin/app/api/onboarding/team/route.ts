import { ApiResponse } from "@uwdsc/common/utils";
import { onboardingService } from "@uwdsc/admin";
import { createHeadshotService } from "@/lib/services";
import { withVpAccess } from "@/guards/withVpAccess";

export const GET = withVpAccess(async (request) => {
  try {
    const termId = new URL(request.url).searchParams.get("termId");

    if (!termId) {
      return ApiResponse.badRequest("termId is required");
    }

    const [rows, headshotService] = await Promise.all([
      onboardingService.getTeamSubmissions(termId),
      createHeadshotService(),
    ]);
    const rowsWithHeadshots = await Promise.all(
      rows.map(async (row) => {
        if (!row.submission?.headshot_url) return row;
        const signedUrl = await headshotService.getHeadshotUrl(
          row.submission.headshot_url,
        );

        return {
          ...row,
          submission: {
            ...row.submission,
            headshot_url: signedUrl,
          },
        };
      }),
    );

    return ApiResponse.ok({ rows: rowsWithHeadshots });
  } catch (error: unknown) {
    console.error("Error fetching onboarding submissions:", error);
    return ApiResponse.serverError(error, "Failed to fetch onboarding data");
  }
});
