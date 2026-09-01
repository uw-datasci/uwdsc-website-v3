import { RaftResponse } from "@uw-datasci/raft";
import { withAdmin } from "@/guards/withAdmin";
import { githubService } from "@uwdsc/admin";

function shortenLabel(input: string, maxLen = 60): string {
  const normalized = input.trim().replaceAll(/\s+/g, " ");
  if (normalized.length <= maxLen) return normalized;
  return `${normalized.slice(0, maxLen - 3)}...`;
}

/**
 * GET /api/github/templates
 * Returns template repositories in the GitHub organization.
 *
 * Admin only.
 */
export const GET = withAdmin(async () => {
  const templates = await githubService.getTemplates();
  return RaftResponse.ok(
    templates
      .filter((t) => t.name.trim().length > 0)
      .map((t) => {
        const value = t.name.trim();
        const desc = t.description.trim();
        const label = desc.length > 0 ? shortenLabel(desc) : value;

        // Keep full template metadata in the API response for debugging/usage.
        return { value, label, name: t.name, description: t.description, language: t.language };
      })
  );
});
