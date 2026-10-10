import { BaseRepository } from "@uwdsc/db/base.repository";
import type { ContactSubmissionData } from "@uwdsc/common/types";

export class ContactRepository extends BaseRepository {
  /**
   * Resend delivers `email.received` at-least-once, so a replay with the same
   * `resend_email_id` is a no-op rather than a duplicate row. Form submissions have no
   * `resend_email_id` and always insert.
   */
  async insert(data: ContactSubmissionData): Promise<void> {
    await this.sql`
      INSERT INTO public.contact_submissions (name, email, subject, message, source, resend_email_id)
      VALUES (${data.name}, ${data.email}, ${data.subject}, ${data.message}, ${data.source}, ${data.resend_email_id ?? null})
      ON CONFLICT (resend_email_id) DO NOTHING
    `;
  }
}
