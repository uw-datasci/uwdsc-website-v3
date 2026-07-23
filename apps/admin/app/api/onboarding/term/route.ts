import { ApiResponse } from "@uwdsc/common/utils";
import { withAuth } from "@/guards/withAuth";
import { onboardingService } from "@uwdsc/admin";

// allowAlum: the returning-exec form (/logistics/returning) checks the active term's
// submission window before rendering, and alum users must be able to reach that check.
export const GET = withAuth(
  async () => {
    try {
      const data = await onboardingService.getActiveTerm();
      return ApiResponse.ok(data);
    } catch (error: unknown) {
      console.error("Error fetching active term:", error);
      return ApiResponse.serverError(error, "Failed to fetch active term");
    }
  },
  { allowAlum: true },
);
