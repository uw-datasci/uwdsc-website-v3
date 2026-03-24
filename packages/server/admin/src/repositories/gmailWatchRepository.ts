import { BaseRepository } from "@uwdsc/db/baseRepository";

/**
 * Persists the last processed Gmail history cursor for Pub/Sub webhook handling.
 */
export class GmailWatchRepository extends BaseRepository {
  async getHistoryId(): Promise<string | null> {
    const rows = await this.sql<{ history_id: string }[]>`
      SELECT history_id
      FROM public.gmail_watch_state
      WHERE id = 1
    `;
    return rows[0]?.history_id ?? null;
  }

  async updateHistoryId(historyId: string): Promise<void> {
    await this.sql`
      UPDATE public.gmail_watch_state
      SET
        history_id = ${historyId},
        updated_at = now()
      WHERE id = 1
    `;
  }
}

export const gmailWatchRepository = new GmailWatchRepository();
