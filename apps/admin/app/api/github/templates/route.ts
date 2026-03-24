import { ApiResponse } from "@uwdsc/common/utils";
import { withAuth } from "@/guards/withAuth";
import { githubService } from "@/lib/services/githubService";

function shortenLabel(input: string, maxLen = 60): string {
  const normalized = input.trim().split(/\s+/).join(" ");
  if (normalized.length <= maxLen) return normalized;
  return `${normalized.slice(0, maxLen - 3)}...`;
}

/**
 * GET /api/github/templates
 * Returns template repositories in the GitHub organization.
 *
 * Admin/exec only.
 */
export const GET = withAuth(async () => {
  try {
    const templates = await githubService.getTemplates();
    return ApiResponse.ok(
      templates
        .filter((t) => t.name.trim().length > 0)
        .map((t) => {
          const value = t.name.trim();
          const desc = t.description.trim();
          const label = desc.length > 0 ? shortenLabel(desc) : value;

          // Keep full template metadata in the API response for debugging/usage.
          return {
            value,
            label,
            name: t.name,
            description: t.description,
            language: t.language,
          };
        }),
    );
  } catch (error: unknown) {
    console.error("Error fetching GitHub template repos:", error);
    return ApiResponse.serverError(
      error,
      "Failed to fetch GitHub template repos",
    );
  }
});
