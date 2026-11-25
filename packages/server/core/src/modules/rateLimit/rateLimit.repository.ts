import { BaseRepository } from "@uwdsc/db/base.repository";

export class RateLimitRepository extends BaseRepository {
  /** Count a hit in the current window and return the window's total. Drops day-old rows. */
  async hit(key: string, windowSeconds: number): Promise<number> {
    const [row] = await this.sql<{ hits: number }[]>`
      WITH cleanup AS (
        DELETE FROM public.rate_limits WHERE window_start < now() - interval '1 day'
      )
      INSERT INTO public.rate_limits (key, window_start, hits)
      VALUES (
        ${key},
        to_timestamp(floor(extract(epoch FROM now()) / ${windowSeconds}) * ${windowSeconds}),
        1
      )
      ON CONFLICT (key, window_start) DO UPDATE SET hits = public.rate_limits.hits + 1
      RETURNING hits
    `;
    return row?.hits ?? 1;
  }
}
