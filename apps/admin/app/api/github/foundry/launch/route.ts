import { ApiResponse } from "@uwdsc/common/utils";
import { withAuth } from "@/guards/withAuth";
import {
  foundryFormSchema,
  type FoundryFormValues,
} from "@/lib/schemas/foundry";
import { githubService } from "@uwdsc/admin";

/**
 * POST /api/github/foundry/launch
 * Triggers the project provisioning workflow in nexus-foundry.
 *
 * Admin/exec only.
 */
export const POST = withAuth(async (request) => {
  try {
    const body = (await request.json()) as FoundryFormValues;
    const parsed = foundryFormSchema.safeParse(body);

    if (!parsed.success) {
      return ApiResponse.badRequest(
        parsed.error.issues[0]?.message ?? "Invalid Foundry payload",
      );
    }

    await githubService.launchFoundryProject(parsed.data);
    return ApiResponse.ok({
      success: true,
      message: "Foundry workflow dispatched successfully",
    });
  } catch (error: unknown) {
    console.error("Error launching Foundry workflow:", error);
    return ApiResponse.serverError(error, "Failed to launch Foundry workflow");
  }
});
