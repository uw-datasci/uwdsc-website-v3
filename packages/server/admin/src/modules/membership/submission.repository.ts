import { BaseRepository } from "@uwdsc/db/base.repository";
import type {
  SubmissionReview,
  SubmissionReviewItem,
  SubmissionStatus,
} from "@uwdsc/common/types";

export interface ListSubmissionsOptions {
  status?: SubmissionStatus;
  termId?: string;
}

/** Row as it comes back from Postgres, before signed URLs are minted. */
export type SubmissionRow = Omit<SubmissionReviewItem, "proof_url" | "review_history"> & {
  proof_object_key: string | null;
};

export class SubmissionReviewRepository extends BaseRepository {
  /**
   * Review queue for a term (defaults to the active term).
   *
   * The proof is joined as the single `is_current` file; superseded uploads are
   * left out of the list and only surface in the detail view.
   */
  async listSubmissions(options: ListSubmissionsOptions = {}): Promise<SubmissionRow[]> {
    const termCondition = options.termId
      ? this.sql`s.term_id = ${options.termId}`
      : this.sql`s.term_id = (SELECT id FROM public.terms WHERE is_active = true LIMIT 1)`;

    const statusCondition = options.status
      ? this.sql`AND s.status = ${options.status}::membership.submission_status_enum`
      : this.sql``;

    return this.sql<SubmissionRow[]>`
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
        s.updated_at,
        p.first_name AS profile_first_name,
        p.last_name  AS profile_last_name,
        p.wat_iam    AS profile_wat_iam,
        au.email     AS profile_email,
        f.object_key AS proof_object_key,
        f.file_name  AS proof_file_name,
        f.mime_type  AS proof_mime_type,
        NULLIF(TRIM(CONCAT_WS(' ', rv.first_name, rv.last_name)), '') AS reviewer_name,
        er.subject   AS email_subject,
        er.from_address AS email_from,
        er.text_body AS email_body
      FROM membership.payment_submissions s
      JOIN public.terms t ON t.id = s.term_id
      JOIN public.profiles p ON p.id = s.profile_id
      JOIN auth.users au ON au.id = s.profile_id
      LEFT JOIN membership.submission_files f
        ON f.submission_id = s.id AND f.is_current = true
      LEFT JOIN public.profiles rv ON rv.id = s.reviewed_by
      LEFT JOIN membership.email_receipts er ON er.submission_id = s.id
      WHERE ${termCondition}
      ${statusCondition}
      ORDER BY
        -- Pending first: this is a work queue, not an archive.
        CASE s.status WHEN 'pending' THEN 0 ELSE 1 END,
        s.submitted_at DESC
    `;
  }

  async getReviewHistory(submissionIds: string[]): Promise<Map<string, SubmissionReview[]>> {
    const byId = new Map<string, SubmissionReview[]>();
    if (submissionIds.length === 0) return byId;

    const rows = await this.sql<(SubmissionReview & { submission_id: string })[]>`
      SELECT
        r.id,
        r.submission_id,
        r.decision::text AS decision,
        r.reason,
        r.reviewer_id,
        NULLIF(TRIM(CONCAT_WS(' ', rv.first_name, rv.last_name)), '') AS reviewer,
        r.created_at
      FROM membership.submission_reviews r
      LEFT JOIN public.profiles rv ON rv.id = r.reviewer_id
      WHERE r.submission_id IN ${this.sql(submissionIds)}
      ORDER BY r.created_at DESC
    `;

    for (const { submission_id, ...review } of rows) {
      const list = byId.get(submission_id) ?? [];
      list.push(review);
      byId.set(submission_id, list);
    }

    return byId;
  }

  async getSubmissionForReview(submissionId: string): Promise<{
    id: string;
    profile_id: string;
    term_id: string;
    status: SubmissionStatus;
  } | null> {
    const result = await this.sql<
      { id: string; profile_id: string; term_id: string; status: SubmissionStatus }[]
    >`
      SELECT id, profile_id, term_id, status::text AS status
      FROM membership.payment_submissions
      WHERE id = ${submissionId}
      LIMIT 1
    `;
    return result[0] ?? null;
  }

  /**
   * Approve: flip the submission, log the decision, and write the membership
   * row -- all in one transaction so a member is never left "approved" without
   * a membership.
   *
   * The membership is bound to `submission.term_id` rather than reusing
   * `markAsPaid`'s `profiles.term`-first resolution, which can write a row
   * against a term no read query looks at.
   */
  async approve(submissionId: string, reviewerId: string): Promise<void> {
    await this.sql.begin(async (sql) => {
      const [submission] = await sql<{ profile_id: string; term_id: string }[]>`
        UPDATE membership.payment_submissions
        SET status = 'approved',
            rejection_reason = NULL,
            reviewed_by = ${reviewerId},
            reviewed_at = NOW(),
            updated_at = NOW()
        WHERE id = ${submissionId}
        RETURNING profile_id, term_id
      `;

      if (!submission) throw new Error("Submission not found");

      await sql`
        INSERT INTO membership.submission_reviews (submission_id, decision, reviewer_id)
        VALUES (${submissionId}, 'approved', ${reviewerId})
      `;

      await sql`
        INSERT INTO membership.memberships (
          profile_id, payment_method, payment_location, term_id,
          verifier_id, verified_at, updated_at
        )
        VALUES (
          ${submission.profile_id},
          'online'::payment_method_enum,
          'WUSA Online Shop',
          ${submission.term_id},
          ${reviewerId},
          NOW(),
          NOW()
        )
        ON CONFLICT (profile_id, term_id)
        DO UPDATE SET
          payment_method = EXCLUDED.payment_method,
          payment_location = EXCLUDED.payment_location,
          verifier_id = EXCLUDED.verifier_id,
          verified_at = EXCLUDED.verified_at,
          updated_at = NOW()
      `;
    });
  }

  async reject(submissionId: string, reviewerId: string, reason: string): Promise<void> {
    await this.sql.begin(async (sql) => {
      const [submission] = await sql<{ id: string }[]>`
        UPDATE membership.payment_submissions
        SET status = 'rejected',
            rejection_reason = ${reason},
            reviewed_by = ${reviewerId},
            reviewed_at = NOW(),
            updated_at = NOW()
        WHERE id = ${submissionId}
        RETURNING id
      `;

      if (!submission) throw new Error("Submission not found");

      await sql`
        INSERT INTO membership.submission_reviews (submission_id, decision, reason, reviewer_id)
        VALUES (${submissionId}, 'rejected', ${reason}, ${reviewerId})
      `;
    });
  }
}
