import { BaseRepository } from "@uwdsc/db/base.repository";

export interface RecordEmailReceiptData {
  resendEmailId: string;
  fromAddress: string;
  toAddress: string | null;
  subject: string | null;
  receivedAt: string | null;
  textBody: string | null;
  htmlBody: string | null;
  rawPayload: unknown;
}

export interface UpsertEmailSubmissionData {
  profileId: string;
  termId: string;
  firstName: string;
  lastName: string;
  watIam: string;
  contactEmail: string;
  /** `approved` for a clean receipt, `pending` when it needs a human. */
  status: "approved" | "pending";
}

export class EmailReceiptRepository extends BaseRepository {
  /**
   * Archive the forwarded email. Called before any parsing so nothing is lost,
   * including receipts we cannot attribute to an account.
   *
   * Resend delivers at-least-once, so a replay is a no-op rather than a
   * duplicate row. Returns null when the receipt was already recorded.
   */
  async recordReceipt(data: RecordEmailReceiptData): Promise<{ id: string } | null> {
    const result = await this.sql<{ id: string }[]>`
      INSERT INTO membership.email_receipts (
        resend_email_id, from_address, to_address, subject, received_at,
        text_body, html_body, raw_payload, parse_status, parse_error
      )
      VALUES (
        ${data.resendEmailId}, ${data.fromAddress}, ${data.toAddress}, ${data.subject},
        ${data.receivedAt}, ${data.textBody}, ${data.htmlBody},
        ${this.sql.json(data.rawPayload as never)}, 'pending', NULL
      )
      ON CONFLICT (resend_email_id) DO NOTHING
      RETURNING id
    `;
    return result[0] ?? null;
  }

  /** Update the verdict once parsing has run, and attach the resolved profile. */
  async finalizeReceipt(
    resendEmailId: string,
    parseStatus: "parsed" | "failed",
    parseError: string | null,
    profileId: string | null,
    submissionId: string | null
  ): Promise<void> {
    await this.sql`
      UPDATE membership.email_receipts
      SET parse_status = ${parseStatus},
          parse_error = ${parseError},
          profile_id = ${profileId},
          submission_id = ${submissionId}
      WHERE resend_email_id = ${resendEmailId}
    `;
  }

  /**
   * Land the email in the same review queue the web form writes to.
   *
   * When a pending web-form submission already exists for the term, an
   * approving receipt settles that same row -- the member paid and forwarded
   * proof, so there is nothing left for an exec to do. `source` records what
   * actually settled it.
   */
  async upsertEmailSubmission(data: UpsertEmailSubmissionData): Promise<string> {
    return this.sql.begin(async (sql) => {
      const reviewedSql = data.status === "approved" ? sql`NOW()` : sql`NULL`;

      const [submission] = await sql<{ id: string }[]>`
        INSERT INTO membership.payment_submissions (
          profile_id, term_id, status, source,
          first_name, last_name, wat_iam, contact_email,
          reviewed_at, submitted_at, updated_at
        )
        VALUES (
          ${data.profileId}, ${data.termId},
          ${data.status}::membership.submission_status_enum, 'email',
          ${data.firstName}, ${data.lastName}, ${data.watIam}, ${data.contactEmail},
          ${reviewedSql}, NOW(), NOW()
        )
        ON CONFLICT (profile_id, term_id)
        DO UPDATE SET
          status = EXCLUDED.status,
          source = 'email',
          rejection_reason = NULL,
          -- reviewed_by stays NULL: an automated decision has no reviewer.
          reviewed_by = NULL,
          reviewed_at = EXCLUDED.reviewed_at,
          updated_at = NOW()
        RETURNING id
      `;

      const submissionId = submission!.id;

      if (data.status === "approved") {
        await sql`
          INSERT INTO membership.submission_reviews (submission_id, decision, reviewer_id)
          VALUES (${submissionId}, 'approved', NULL)
        `;
      }

      return submissionId;
    });
  }
}
