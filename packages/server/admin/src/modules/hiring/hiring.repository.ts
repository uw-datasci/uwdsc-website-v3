import { BaseRepository } from "@uwdsc/db/base.repository";
import type { Sql } from "@uwdsc/db/connection";
import type {
  ApplicationReviewStatus,
  HiringApplicant,
  HiringPositionSelection,
  UserRole,
} from "@uwdsc/common/types";
import type { AcceptedOfferRow } from "../../types/hiring";

export class HiringRepository extends BaseRepository {
  async getHiringApplicants(): Promise<HiringApplicant[]> {
    const HIRING_STATUSES = [
      "Wanted",
      "Not Wanted",
      "Offer Sent",
      "Accepted Offer",
      "Declined Offer",
      "Rejection Sent",
    ] as const;

    const applications = await this.sql<
      {
        id: string;
        profile_id: string;
        full_name: string;
        email: string | null;
        personal_email: string | null;
        submitted_at: string;
      }[]
    >`
      SELECT
        a.id,
        a.profile_id,
        a.full_name,
        u.email,
        a.personal_email,
        a.submitted_at
      FROM hiring.applications a
      LEFT JOIN auth.users u ON u.id = a.profile_id
      WHERE a.status != 'draft'
        AND EXISTS (
          SELECT 1
          FROM hiring.application_position_selections aps
          WHERE aps.application_id = a.id
            AND aps.status IN ${this.sql(HIRING_STATUSES)}
        )
      ORDER BY a.submitted_at DESC
    `;

    const applicationIds = applications.map((a) => a.id);

    const selections =
      applicationIds.length > 0
        ? await this.sql<(HiringPositionSelection & { application_id: string })[]>`
          SELECT
            aps.id,
            aps.application_id,
            aps.position_id,
            aps.priority,
            aps.status,
            ep.name AS position_name,
            ep.is_vp,
            st.name AS subteam_name
          FROM hiring.application_position_selections aps
          JOIN hiring.application_positions_available apa ON aps.position_id = apa.id
          JOIN org.exec_positions ep ON apa.position_id = ep.id
          LEFT JOIN org.subteams st ON st.id = ep.subteam_id
          WHERE aps.application_id IN ${this.sql(applicationIds)}
            AND aps.status IN ${this.sql(HIRING_STATUSES)}
          ORDER BY aps.priority
        `
        : [];

    const selectionsMap = new Map<string, HiringPositionSelection[]>();
    for (const sel of selections) {
      const list = selectionsMap.get(sel.application_id) ?? [];
      list.push({ ...sel, source: "application" as const });
      selectionsMap.set(sel.application_id, list);
    }

    const regularApplicants: HiringApplicant[] = applications.map((app) => ({
      ...app,
      source: "application" as const,
      position_selections: selectionsMap.get(app.id) ?? [],
    }));

    // Fetch returning-exec hiring rows for the active term
    const activeTermRows = await this.sql<{ id: string }[]>`
      SELECT id FROM public.terms WHERE is_active = true ORDER BY created_at DESC LIMIT 1
    `;
    const activeTerm = activeTermRows[0];
    if (!activeTerm) return regularApplicants;

    const returningSubmissions = await this.sql<
      {
        id: string;
        profile_id: string;
        full_name: string;
        email: string;
        submitted_at: string;
      }[]
    >`
      SELECT s.id, s.profile_id, s.full_name, s.email, s.submitted_at
      FROM hiring.returning_exec_submissions s
      WHERE s.term_id = ${activeTerm.id}
        AND EXISTS (
          SELECT 1 FROM hiring.returning_exec_position_selections reps
          WHERE reps.submission_id = s.id
            AND reps.status IN ${this.sql(HIRING_STATUSES)}
        )
      ORDER BY s.submitted_at DESC
    `;

    if (returningSubmissions.length === 0) return regularApplicants;

    const returningIds = returningSubmissions.map((s) => s.id);
    const returningSelections = await this.sql<
      (HiringPositionSelection & { submission_id: string })[]
    >`
      SELECT
        reps.id,
        reps.submission_id AS application_id,
        reps.submission_id,
        reps.position_id,
        reps.priority,
        reps.status,
        ep.name AS position_name,
        ep.is_vp,
        st.name AS subteam_name
      FROM hiring.returning_exec_position_selections reps
      JOIN hiring.application_positions_available apa ON apa.id = reps.position_id
      JOIN org.exec_positions ep ON ep.id = apa.position_id
      LEFT JOIN org.subteams st ON st.id = ep.subteam_id
      WHERE reps.submission_id IN ${this.sql(returningIds)}
        AND reps.status IN ${this.sql(HIRING_STATUSES)}
      ORDER BY reps.priority
    `;

    const returningSelectionsMap = new Map<string, HiringPositionSelection[]>();
    for (const sel of returningSelections) {
      const list = returningSelectionsMap.get(sel.submission_id) ?? [];
      list.push({ ...sel, source: "returning_exec" as const });
      returningSelectionsMap.set(sel.submission_id, list);
    }

    const returningApplicants: HiringApplicant[] = returningSubmissions.map((s) => ({
      id: s.id,
      profile_id: s.profile_id,
      full_name: s.full_name,
      email: s.email,
      personal_email: null,
      submitted_at: s.submitted_at,
      source: "returning_exec" as const,
      position_selections: returningSelectionsMap.get(s.id) ?? [],
    }));

    return [...regularApplicants, ...returningApplicants];
  }

  /**
   * True if the same application already has a different position selection in
   * "Accepted Offer" (excluding {@link selectionId}).
   */
  async hasAcceptedAnotherOffer(selectionId: string): Promise<boolean> {
    const rows = await this.sql<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM hiring.application_position_selections other
        WHERE other.application_id = (
          SELECT application_id
          FROM hiring.application_position_selections
          WHERE id = ${selectionId}
        )
          AND other.id != ${selectionId}
          AND other.status = 'Accepted Offer'
      ) AS "exists"
    `;
    return rows[0]?.exists === true;
  }

  async getSelectionRecipient(selectionId: string): Promise<{
    email: string;
    full_name: string;
    position_name: string;
    term_code: string | null;
  } | null> {
    const rows = await this.sql<
      {
        email: string;
        full_name: string;
        position_name: string;
        term_code: string | null;
      }[]
    >`
      SELECT
        u.email,
        a.full_name,
        ep.name AS position_name,
        t.code AS term_code
      FROM hiring.application_position_selections aps
      JOIN hiring.applications a ON aps.application_id = a.id
      LEFT JOIN public.terms t ON t.id = a.term_id
      JOIN hiring.application_positions_available apa ON aps.position_id = apa.id
      JOIN org.exec_positions ep ON apa.position_id = ep.id
      JOIN auth.users u ON u.id = a.profile_id
      WHERE aps.id = ${selectionId}
    `;
    return rows[0] ?? null;
  }

  async updatePositionSelectionStatus(
    selectionId: string,
    status: ApplicationReviewStatus,
  ): Promise<boolean> {
    const updated = await this.sql<{ id: string }[]>`
      UPDATE hiring.application_position_selections
      SET status = ${status}
      WHERE id = ${selectionId}
      RETURNING id
    `;
    return updated.length > 0;
  }

  async getAcceptedOfferSelections(): Promise<AcceptedOfferRow[]> {
    return this.sql<AcceptedOfferRow[]>`
      SELECT DISTINCT ON (a.profile_id)
        a.profile_id,
        a.full_name,
        ep.name AS position_name,
        ep.is_vp,
        st.name AS subteam_name,
        u.email
      FROM hiring.application_position_selections aps
      JOIN hiring.applications a ON aps.application_id = a.id
      LEFT JOIN auth.users u ON u.id = a.profile_id
      JOIN hiring.application_positions_available apa ON aps.position_id = apa.id
      JOIN org.exec_positions ep ON apa.position_id = ep.id
      LEFT JOIN org.subteams st ON st.id = ep.subteam_id
      WHERE aps.status = 'Accepted Offer'
      ORDER BY a.profile_id, aps.priority
    `;
  }

  async finalizeRoles(
    newTeamRoles: { profileId: string; role: UserRole }[],
  ): Promise<{ demoted: number }> {
    const profileIds = newTeamRoles.map((m) => m.profileId);

    return this.sql.begin(async (txRaw) => {
      const tx = txRaw as unknown as Sql;

      // Promote new team members (every account already has a user_roles row)
      for (const { profileId, role } of newTeamRoles) {
        await tx`
          UPDATE user_roles
          SET role = ${role}
          WHERE id = ${profileId}
        `;
      }

      // Demote everyone else who is currently exec or admin
      let demoted = 0;
      if (profileIds.length > 0) {
        const result = await tx`
          UPDATE user_roles
          SET role = 'member'
          WHERE role IN ('exec', 'admin')
            AND id NOT IN ${tx(profileIds)}
          RETURNING id
        `;
        demoted = result.length;
      } else {
        // No new team - demote everyone
        const result = await tx`
          UPDATE user_roles
          SET role = 'member'
          WHERE role IN ('exec', 'admin')
          RETURNING id
        `;
        demoted = result.length;
      }

      return { demoted };
    });
  }
}
