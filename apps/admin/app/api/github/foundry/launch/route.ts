import { RaftResponse } from "@uw-datasci/raft";
import { withAdmin } from "@/guards/withAdmin";
import { foundryFormSchema, type FoundryFormValues } from "@/lib/schemas/foundry";
import { githubService } from "@uwdsc/admin";

/**
 * POST /api/github/foundry/launch
 * Triggers the project provisioning workflow in nexus-foundry.
 *
 * Admin only.
 */
export const POST = withAdmin(async (request) => {
  const body = (await request.json()) as FoundryFormValues;
  const parsed = foundryFormSchema.safeParse(body);
  if (!parsed.success) return RaftResponse.badRequest(parsed.error.issues[0]?.message);

  await githubService.launchFoundryProject(parsed.data);
  return RaftResponse.ok({ success: true, message: "Workflow dispatched successfully" });
});
