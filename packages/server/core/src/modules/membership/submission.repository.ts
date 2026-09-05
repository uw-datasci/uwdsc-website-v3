import { BaseRepository } from "@uwdsc/db/base.repository";
import type {
  MembershipSubmission,
  SubmissionFile,
  SubmitMembershipProofData,
} from "@uwdsc/common/types";

export interface ActiveTermRef {
  id: string;
  code: string;
}

export class MembershipSubmissionRepository extends BaseRepository {
  /** The active term, or null when no term window is currently open. */
  async getActiveTerm(): Promise<ActiveTermRef | null> {
    const result = await this.sql<ActiveTermRef[]>`
      SELECT id, code
      FROM public.terms
      WHERE is_active = true
      LIMIT 1
    `;
    return result[0] ?? null;
  }

  /** True when a membership row already exists for this profile in the active term (any payment method). */
  async hasMembershipForActiveTerm(profileId: string): Promise<boolean> {
    const result = await this.sql<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM membership.memberships
        WHERE profile_id = ${profileId}
          AND term_id = (SELECT id FROM public.terms WHERE is_active = true LIMIT 1)
      ) AS exists
    `;
    return result[0]?.exists ?? false;
  }

  async getSubmission(profileId: string, termId: string): Promise<MembershipSubmission | null> {
    const result = await this.sql<MembershipSubmission[]>`
      SELECT
        s.id,
        s.profile_id,
        s.term_id,
        t.code AS term_code,
        s.status::text AS status,
        s.source::text AS source,
        s.first_name,
        s.last_name,
        s.wat_iam,
        s.contact_email,
        s.program,
        s.is_coop_term,
        s.rejection_reason,
        s.reviewed_by,
        s.reviewed_at,
        s.submitted_at,
        s.created_at,
        s.updated_at
      FROM membership.payment_submissions s
      JOIN public.terms t ON t.id = s.term_id
      WHERE s.profile_id = ${profileId}
        AND s.term_id = ${termId}
      LIMIT 1
    `;
    return result[0] ?? null;
  }

  async getCurrentFile(submissionId: string): Promise<SubmissionFile | null> {
    const result = await this.sql<SubmissionFile[]>`
      SELECT id, object_key, file_name, mime_type, size_bytes, is_current, uploaded_at
      FROM membership.submission_files
      WHERE submission_id = ${submissionId}
        AND is_current = true
      LIMIT 1
    `;
    return result[0] ?? null;
  }

  /**
   * Create the submission, or reset a rejected one back to `pending`.
   *
   * Runs in a single transaction: the previous proof is demoted before the new
   * one is inserted, so the `submission_files_one_current` partial unique index
   * is never transiently violated.
   */
  async upsertSubmission(
    profileId: string,
    termId: string,
    data: SubmitMembershipProofData
  ): Promise<MembershipSubmission> {
    return this.sql.begin(async (sql) => {
      const [submission] = await sql<{ id: string }[]>`
        INSERT INTO membership.payment_submissions (
          profile_id, term_id, status, source,
          first_name, last_name, wat_iam, contact_email,
          program, is_coop_term,
          submitted_at, updated_at
        )
        VALUES (
          ${profileId}, ${termId}, 'pending', 'web_form',
          ${data.first_name}, ${data.last_name}, ${data.wat_iam}, ${data.contact_email},
          ${data.program}, ${data.is_coop_term},
          NOW(), NOW()
        )
        ON CONFLICT (profile_id, term_id)
        DO UPDATE SET
          status = 'pending',
          source = 'web_form',
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          wat_iam = EXCLUDED.wat_iam,
          contact_email = EXCLUDED.contact_email,
          program = EXCLUDED.program,
          is_coop_term = EXCLUDED.is_coop_term,
          -- A fresh attempt clears the previous verdict; the decision itself
          -- stays on the record in submission_reviews.
          rejection_reason = NULL,
          reviewed_by = NULL,
          reviewed_at = NULL,
          submitted_at = NOW(),
          updated_at = NOW()
        RETURNING id
      `;

      const submissionId = submission!.id;

      await sql`
        UPDATE membership.submission_files
        SET is_current = false
        WHERE submission_id = ${submissionId}
          AND is_current = true
      `;

      await sql`
        INSERT INTO membership.submission_files (
          submission_id, object_key, file_name, mime_type, size_bytes, is_current
        )
        VALUES (
          ${submissionId}, ${data.proof_key}, ${data.proof_file_name},
          ${data.proof_mime_type}, ${data.proof_size_bytes}, true
        )
      `;

      const [row] = await sql<MembershipSubmission[]>`
        SELECT
          s.id, s.profile_id, s.term_id, t.code AS term_code,
          s.status::text AS status, s.source::text AS source,
          s.first_name, s.last_name, s.wat_iam, s.contact_email,
          s.program, s.is_coop_term,
          s.rejection_reason, s.reviewed_by, s.reviewed_at,
          s.submitted_at, s.created_at, s.updated_at
        FROM membership.payment_submissions s
        JOIN public.terms t ON t.id = s.term_id
        WHERE s.id = ${submissionId}
      `;

      return row!;
    });
  }
}
