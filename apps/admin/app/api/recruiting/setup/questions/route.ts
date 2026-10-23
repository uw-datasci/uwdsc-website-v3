import { RaftResponse } from "@uw-datasci/raft";
import { createQuestionSchema } from "@uwdsc/common/schemas";
import { setupService } from "@uwdsc/admin";
import { requireSetup, withRecruiting } from "@/guards/withRecruiting";

/**
 * POST /api/recruiting/setup/questions
 * Add a question to General or a position the viewer owns.
 */
export const POST = withRecruiting(async (request, _context, _user, recruiting) => {
  const parsed = createQuestionSchema.safeParse(await request.json());
  if (!parsed.success)
    return RaftResponse.badRequest(
      parsed.error.issues[0]?.message || "Invalid data",
      "Validation error"
    );

  await setupService.createQuestion(recruiting, parsed.data);
  return RaftResponse.ok({ saved: true });
}, requireSetup);
