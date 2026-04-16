import { BaseRepository } from "@uwdsc/db/baseRepository";
import type { Sql } from "@uwdsc/db/connection";
import type {
  ApplicationReviewStatus,
  HiringApplicant,
  HiringPositionSelection,
  UserRole,
} from "@uwdsc/common/types";

interface AcceptedOfferRow {
  profile_id: string;
  full_name: string;
  position_name: string;
  is_vp: boolean;
  subteam_name: string | null;
}

export class HiringRepository extends BaseRepository {
  async getHiringApplicants(): Promise<HiringApplicant[]> {
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
      FROM applications a
      LEFT JOIN auth.users u ON u.id = a.profile_id
      WHERE a.status != 'draft'
        AND EXISTS (
          SELECT 1
          FROM application_position_selections aps
          WHERE aps.application_id = a.id
            AND aps.status in ('Wanted', 'Not Wanted', 'Offer Sent', 'Accepted Offer', 'Declined Offer', 'Rejection Sent')
        )
      ORDER BY a.submitted_at DESC
    `;

    if (applications.length === 0) return [];

    const applicationIds = applications.map((a) => a.id);

    const selections = await this.sql<(HiringPositionSelection & { application_id: string })[]>`
      SELECT
        aps.id,
        aps.application_id,
        aps.position_id,
        aps.priority,
        aps.status,
        ep.name AS position_name,
        ep.is_vp,
        st.name AS subteam_name
      FROM application_position_selections aps
      JOIN application_positions_available apa ON aps.position_id = apa.id
      JOIN exec_positions ep ON apa.position_id = ep.id
      LEFT JOIN subteams st ON st.id = ep.subteam_id
      WHERE aps.application_id IN ${this.sql(applicationIds)}
        AND aps.status in ('Wanted', 'Not Wanted', 'Offer Sent', 'Accepted Offer', 'Declined Offer', 'Rejection Sent')
      ORDER BY aps.priority
    `;

    const selectionsMap = new Map<string, HiringPositionSelection[]>();
    for (const sel of selections) {
      const list = selectionsMap.get(sel.application_id) ?? [];
      list.push(sel);
      selectionsMap.set(sel.application_id, list);
    }

    return applications.map((app) => ({
      ...app,
      position_selections: selectionsMap.get(app.id) ?? [],
    }));
  }

  /**
   * True if the same application already has a different position selection in
   * "Accepted Offer" (excluding {@link selectionId}).
   */
  async hasAcceptedAnotherOffer(selectionId: string): Promise<boolean> {
    const rows = await this.sql<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM application_position_selections other
        WHERE other.application_id = (
          SELECT application_id
          FROM application_position_selections
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
      FROM application_position_selections aps
      JOIN applications a ON aps.application_id = a.id
      LEFT JOIN terms t ON t.id = a.term_id
      JOIN application_positions_available apa ON aps.position_id = apa.id
      JOIN exec_positions ep ON apa.position_id = ep.id
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
      UPDATE application_position_selections
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
        st.name AS subteam_name
      FROM application_position_selections aps
      JOIN applications a ON aps.application_id = a.id
      JOIN application_positions_available apa ON aps.position_id = apa.id
      JOIN exec_positions ep ON apa.position_id = ep.id
      LEFT JOIN subteams st ON st.id = ep.subteam_id
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

      // Upsert new team members' roles
      for (const { profileId, role } of newTeamRoles) {
        await tx`
          INSERT INTO user_roles (id, role)
          VALUES (${profileId}, ${role})
          ON CONFLICT (id)
          DO UPDATE SET role = ${role}
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
        // No new team — demote everyone
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
