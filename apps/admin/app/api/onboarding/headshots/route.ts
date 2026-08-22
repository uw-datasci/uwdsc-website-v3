import { RaftResponse } from "@uw-datasci/raft";
import { createHeadshotService } from "@/lib/services";
import { withAuth } from "@/guards/withAuth";

export const POST = withAuth(async (request, _context, user) => {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const fullName = formData.get("fullName") as string | null;

  if (!file || !(file instanceof File)) return RaftResponse.badRequest("No file provided");
  if (!fullName?.trim()) return RaftResponse.badRequest("fullName is required");

  const headshotService = await createHeadshotService();
  const result = await headshotService.uploadHeadshot({ file, userId: user.id, fullName });

  if (!result.success) return RaftResponse.badRequest(result.error, "Upload failed");

  return RaftResponse.ok({ message: "Upload successful", key: result.key, url: result.key });
});
