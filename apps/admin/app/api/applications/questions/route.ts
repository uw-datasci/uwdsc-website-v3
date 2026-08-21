import { RaftResponse } from "@uw-datasci/raft";
import { applicationService } from "@uwdsc/admin";
import { withAdmin } from "@/guards/withAdmin";
import { questionSchema } from "@/lib/schemas/questions";

/**
 * GET /api/applications/questions
 * List all questions within the VP's allowed scope.
 */
export const GET = withAdmin(
  async (_request, _context, _user, scope) => {
    const [questions, positions] = await Promise.all([
      applicationService.getQuestionsForScope(scope),
      applicationService.getPositionOptionsForScope(scope),
    ]);
    return RaftResponse.ok({
      questions,
      positions,
      scope: {
        isPresident: scope.isPresident,
        vpSubteamNames: scope.vpSubteamNames,
      },
    });
  },
  { scope: true }
);

/**
 * POST /api/applications/questions
 * Create a new question mapped to an allowed position.
 */
export const POST = withAdmin(
  async (request, _context, _user, scope) => {
    const body = await request.json();
    const parsed = questionSchema.safeParse(body);
    if (!parsed.success) return RaftResponse.badRequest(parsed.error.issues[0]?.message);

    const created = await applicationService.createQuestion(scope, parsed.data);
    return RaftResponse.ok({ success: true, question: created });
  },
  { scope: true }
);
