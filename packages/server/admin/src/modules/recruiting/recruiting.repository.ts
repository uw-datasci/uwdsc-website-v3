import { BaseRepository } from "@uwdsc/db/base.repository";
import type { RecruitingCycleSummary } from "@uwdsc/common/recruiting";
import type { CyclePhase } from "@uwdsc/common/types";

export interface ActiveTermRow {
  id: string;
  code: string;
  start_date: string;
}

export interface StartableTermRow {
  id: string;
  code: string;
  start_date: string;
}

interface CycleRow {
  id: string;
  phase: CyclePhase;
  term_id: string;
  term_code: string;
  target_term_id: string;
  target_term_code: string;
  roster_locked_at: string | null;
  finalized_at: string | null;
  offer_response_hours: number;
}

function toSummary(row: CycleRow): RecruitingCycleSummary {
  return {
    id: row.id,
    phase: row.phase,
    termId: row.term_id,
    termCode: row.term_code,
    targetTermId: row.target_term_id,
    targetTermCode: row.target_term_code,
    rosterLockedAt: row.roster_locked_at,
    finalizedAt: row.finalized_at,
    offerResponseHours: row.offer_response_hours,
  };
}

export class RecruitingRepository extends BaseRepository {
  async getActiveTerm(): Promise<ActiveTermRow | null> {
    const rows = await this.sql<ActiveTermRow[]>`
      SELECT id, code, start_date
      FROM public.terms
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return rows[0] ?? null;
  }

  /** The cycle collecting applications in the active term, if one has been started. */
  async getCurrentCycle(): Promise<RecruitingCycleSummary | null> {
    const rows = await this.sql<CycleRow[]>`
      SELECT
        c.id,
        c.phase,
        c.term_id,
        t.code AS term_code,
        c.target_term_id,
        tt.code AS target_term_code,
        c.roster_locked_at,
        c.finalized_at,
        c.offer_response_hours
      FROM hiring.cycles c
      JOIN public.terms t ON t.id = c.term_id
      JOIN public.terms tt ON tt.id = c.target_term_id
      WHERE t.is_active = true
      LIMIT 1
    `;
    const row = rows[0];
    return row ? toSummary(row) : null;
  }

  /** Terms that start after the given term, soonest first: the possible target terms. */
  async getTermsStartingAfter(startDate: string): Promise<StartableTermRow[]> {
    return this.sql<StartableTermRow[]>`
      SELECT id, code, start_date
      FROM public.terms
      WHERE start_date > ${startDate}
      ORDER BY start_date ASC
    `;
  }

  /**
   * Create the cycle for `termId` in the `leadership` phase and log a
   * `cycle_started` event, in one transaction. Returns null if a cycle already
   * exists for the term (unique on term_id).
   */
  async createCycle(
    termId: string,
    targetTermId: string,
    actorId: string
  ): Promise<{ id: string } | null> {
    return this.sql.begin(async (sql) => {
      const [cycle] = await sql<{ id: string }[]>`
        INSERT INTO hiring.cycles (term_id, target_term_id, created_by)
        VALUES (${termId}, ${targetTermId}, ${actorId})
        ON CONFLICT (term_id) DO NOTHING
        RETURNING id
      `;
      if (!cycle) return null;

      await sql`
        INSERT INTO hiring.cycle_events (cycle_id, actor_id, type, payload)
        VALUES (
          ${cycle.id},
          ${actorId},
          'cycle_started',
          ${sql.json({ term_id: termId, target_term_id: targetTermId })}
        )
      `;
      return cycle;
    });
  }
}
