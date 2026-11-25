import { BaseRepository } from "@uwdsc/db/base.repository";

export class TourRepository extends BaseRepository {
  async getCompleted(profileId: string): Promise<string[]> {
    const rows = await this.sql<{ tour: string }[]>`
      SELECT tour FROM hiring.tour_completions WHERE profile_id = ${profileId}
    `;
    return rows.map((row) => row.tour);
  }

  async complete(profileId: string, tour: string): Promise<void> {
    await this.sql`
      INSERT INTO hiring.tour_completions (profile_id, tour)
      VALUES (${profileId}, ${tour})
      ON CONFLICT (profile_id, tour) DO UPDATE SET completed_at = now()
    `;
  }
}
