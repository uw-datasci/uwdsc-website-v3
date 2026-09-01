import { ApiError } from "@uwdsc/common/types";
import type { MembershipSubmissionView, SubmitMembershipProofData } from "@uwdsc/common/types";
import { MembershipSubmissionRepository } from "./submission.repository";

class MembershipSubmissionService {
  private readonly repository: MembershipSubmissionRepository;

  constructor() {
    this.repository = new MembershipSubmissionRepository();
  }

  /**
   * Everything the member's own membership page needs: their submission for the
   * active term (if any) and whether they are already a member by some other
   * route (cash / MathSoc), which supersedes the form entirely.
   */
  async getCurrentView(
    profileId: string,
    resolveProofUrl: (objectKey: string) => Promise<string | null>
  ): Promise<MembershipSubmissionView> {
    const term = await this.repository.getActiveTerm();

    if (!term) {
      return {
        submission: null,
        proof_url: null,
        proof_file_name: null,
        has_membership: false,
        term_code: null,
      };
    }

    const [submission, hasMembership] = await Promise.all([
      this.repository.getSubmission(profileId, term.id),
      this.repository.hasMembershipForActiveTerm(profileId),
    ]);

    if (!submission) {
      return {
        submission: null,
        proof_url: null,
        proof_file_name: null,
        has_membership: hasMembership,
        term_code: term.code,
      };
    }

    const file = await this.repository.getCurrentFile(submission.id);

    return {
      submission,
      proof_url: file ? await resolveProofUrl(file.object_key) : null,
      proof_file_name: file?.file_name ?? null,
      has_membership: hasMembership,
      term_code: term.code,
    };
  }

  /**
   * Whether the member may upload a proof / submit right now. Shared by the
   * upload endpoint and `submit` so a large upload is rejected before it is
   * streamed rather than after.
   */
  async assertCanSubmit(profileId: string): Promise<{ termId: string; termCode: string }> {
    const term = await this.repository.getActiveTerm();
    if (!term) throw new ApiError("There is no active term right now.", 404);

    if (await this.repository.hasMembershipForActiveTerm(profileId)) {
      throw new ApiError("You already have a membership for this term.", 409);
    }

    const existing = await this.repository.getSubmission(profileId, term.id);

    if (existing?.status === "approved") {
      throw new ApiError("Your membership has already been verified.", 409);
    }

    if (existing?.status === "pending") {
      throw new ApiError("You already have a submission awaiting review for this term.", 409);
    }

    return { termId: term.id, termCode: term.code };
  }

  /**
   * Create a submission, or replace the proof on a rejected one. One submission
   * per member per term -- `assertCanSubmit` is what enforces that, backed by
   * the `(profile_id, term_id)` unique constraint.
   */
  async submit(
    profileId: string,
    data: SubmitMembershipProofData
  ): Promise<MembershipSubmissionView> {
    const { termId } = await this.assertCanSubmit(profileId);

    // The upload endpoint namespaces keys by profile id; refuse a key that
    // belongs to somebody else rather than trusting the client's echo of it.
    if (!data.proof_key.startsWith(`${profileId}/`)) {
      throw new ApiError("Proof does not belong to this account.", 400);
    }

    const submission = await this.repository.upsertSubmission(profileId, termId, data);

    return {
      submission,
      proof_url: null,
      proof_file_name: data.proof_file_name,
      has_membership: false,
      term_code: submission.term_code,
    };
  }
}

export const membershipSubmissionService = new MembershipSubmissionService();
