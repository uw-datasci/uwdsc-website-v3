import type { MembershipSubmissionView, SubmitMembershipProofData } from "@uwdsc/common/types";
import { createApiError } from "./errors";

export interface ProofUploadResponse {
  key: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
}

/**
 * Next returns an HTML body on a 413, so `response.json()` would throw an
 * opaque SyntaxError instead of something the form can show. Parse defensively
 * and turn a non-JSON body into a readable message.
 */
async function parseJsonResponse(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    if (response.status === 413 || /request entity too large/i.test(text)) {
      return { message: "File is too large. Please use a file under 10 MB." };
    }
    return { message: "Something went wrong. Please try again." };
  }
}

export async function getMembershipSubmission(): Promise<MembershipSubmissionView> {
  const response = await fetch("/api/membership/submission");
  const data = await parseJsonResponse(response);

  if (!response.ok) throw createApiError(data, response.status);

  return data as unknown as MembershipSubmissionView;
}

export async function uploadMembershipProof(file: File): Promise<ProofUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/membership/submission/proof", {
    method: "POST",
    body: formData,
  });
  const data = await parseJsonResponse(response);

  if (!response.ok) throw createApiError(data, response.status);

  return data as unknown as ProofUploadResponse;
}

export async function submitMembershipProof(
  payload: SubmitMembershipProofData
): Promise<MembershipSubmissionView> {
  const response = await fetch("/api/membership/submission", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonResponse(response);

  if (!response.ok) throw createApiError(data, response.status);

  return data as unknown as MembershipSubmissionView;
}
