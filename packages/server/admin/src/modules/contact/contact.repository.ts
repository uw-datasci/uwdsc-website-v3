import { BaseRepository } from "@uwdsc/db/base.repository";
import type { ContactSubmissionItem } from "@uwdsc/common/types";

export class ContactSubmissionRepository extends BaseRepository {
  /**
   * Support inbox queue: open messages first (this is a work queue, not an archive),
   * newest first within each group.
   */
  async listSubmissions(): Promise<ContactSubmissionItem[]> {
    return this.sql<ContactSubmissionItem[]>`
      SELECT
        cs.id,
        cs.name,
        cs.email,
        cs.subject,
        cs.message,
        cs.source::text AS source,
        cs.resend_email_id,
        cs.resolved_at,
        cs.resolved_by,
        cs.created_at,
        NULLIF(TRIM(CONCAT_WS(' ', p.first_name, p.last_name)), '') AS resolver_name
      FROM public.contact_submissions cs
      LEFT JOIN public.profiles p ON p.id = cs.resolved_by
      ORDER BY
        CASE WHEN cs.resolved_at IS NULL THEN 0 ELSE 1 END,
        cs.created_at DESC
    `;
  }

  async setResolved(id: string, resolverId: string | null): Promise<void> {
    const resolvedAtSql = resolverId ? this.sql`NOW()` : this.sql`NULL`;

    await this.sql`
      UPDATE public.contact_submissions
      SET resolved_at = ${resolvedAtSql},
          resolved_by = ${resolverId}
      WHERE id = ${id}
    `;
  }
}
