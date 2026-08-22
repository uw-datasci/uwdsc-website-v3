import { RaftResponse } from "@uw-datasci/raft";
import { onboardingService } from "@uwdsc/admin";
import { withAuth } from "@/guards/withAuth";

export const GET = withAuth(async (request, _context, user) => {
  const termId = new URL(request.url).searchParams.get("termId");
  if (!termId) return RaftResponse.badRequest("termId is required");
  const submission = await onboardingService.getSubmission(user.id, termId);
  return RaftResponse.ok(submission);
});

export const POST = withAuth(async (request, _context, user) => {
  const body = await request.json();
  const submission = await onboardingService.saveSubmission(body, user.id);
  return RaftResponse.ok(submission);
});
