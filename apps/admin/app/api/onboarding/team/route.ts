import { RaftResponse } from "@uw-datasci/raft";
import { onboardingService } from "@uwdsc/admin";
import { createHeadshotService } from "@/lib/services";
import { withPresAccess } from "@/guards/withPresAccess";

export const GET = withPresAccess(async (request) => {
  const termId = new URL(request.url).searchParams.get("termId");

  if (!termId) return RaftResponse.badRequest("termId is required");

  const [rows, headshotService] = await Promise.all([
    onboardingService.getTeamSubmissions(termId),
    createHeadshotService(),
  ]);

  const rowsWithHeadshots = await Promise.all(
    rows.map(async (row) => {
      if (!row.submission?.headshot_url) return row;
      const signedUrl = await headshotService.getHeadshotUrl(row.submission.headshot_url);

      return { ...row, submission: { ...row.submission, headshot_url: signedUrl } };
    })
  );

  return RaftResponse.ok({ rows: rowsWithHeadshots });
});
