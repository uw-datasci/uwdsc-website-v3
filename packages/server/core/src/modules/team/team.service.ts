import {
  EXEC_TEAM_PHOTO_PLACEHOLDER,
  type ExecMember,
  type Subteam,
  type SubteamOption,
} from "@uwdsc/common/types";
import type { ExecTeamRow } from "../../types/team";
import { TeamRepository } from "./team.repository";

class TeamService {
  private readonly repository: TeamRepository;
  private readonly BUCKET_URL = `${process.env.SUPABASE_URL}/storage/v1/object/public/team`;
  private readonly PRESIDENTS_SUBTEAM_NAME = "Presidents";
  private readonly CXC_SUBTEAM_NAME = "CxC";
  private readonly ADVISORS_SUBTEAM_NAME = "Advisors";

  constructor() {
    this.repository = new TeamRepository();
  }

  /**
   * Order subteams: Presidents first, CxC second, rest by name, Advisors last.
   */
  private sortSubteams(a: Subteam, b: Subteam): number {
    if (a.name === this.PRESIDENTS_SUBTEAM_NAME) return -1;
    if (b.name === this.PRESIDENTS_SUBTEAM_NAME) return 1;
    if (a.name === this.ADVISORS_SUBTEAM_NAME) return 1;
    if (b.name === this.ADVISORS_SUBTEAM_NAME) return -1;
    if (a.name === this.CXC_SUBTEAM_NAME) return -1;
    if (b.name === this.CXC_SUBTEAM_NAME) return 1;
    return (a.name ?? "").localeCompare(b.name ?? "");
  }

  /**
   * Get team grouped by subteams, formatted for the team page.
   * Subteams are ordered: Presidents first, CxC second, rest by name, Advisors last.
   * Within each subteam, VPs (`exec_positions.is_vp`) are listed first.
   */
  async getTeam(): Promise<Subteam[]> {
    const rows = await this.repository.getExecTeam();

    const rowsBySubteam = new Map<number, { id: number; name: string; rows: ExecTeamRow[] }>();

    for (const row of rows) {
      let group = rowsBySubteam.get(row.subteam_id);
      if (!group) {
        group = {
          id: row.subteam_id,
          name: row.subteam_name,
          rows: [],
        };
        rowsBySubteam.set(row.subteam_id, group);
      }
      group.rows.push(row);
    }

    const subteams: Subteam[] = [];

    for (const group of rowsBySubteam.values()) {
      group.rows.sort((a, b) => {
        if (a.is_vp !== b.is_vp) return a.is_vp ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

      subteams.push({
        id: group.id,
        name: group.name,
        members: group.rows.map((row) => {
          const storageKey = row.photo_url?.trim();
          return {
            id: row.id,
            name: row.name,
            position: row.position_name,
            photo_url: storageKey
              ? `${this.BUCKET_URL}/${storageKey}`
              : EXEC_TEAM_PHOTO_PLACEHOLDER,
            instagram: row.instagram ?? null,
            updated_at: row.updated_at ?? null,
          } satisfies ExecMember;
        }),
      });
    }

    subteams.sort((a, b) => this.sortSubteams(a, b));
    return subteams;
  }

  /**
   * Flat list of every subteam (`{ id, name }`), for pickers such as the President's
   * member role/subteam editor.
   */
  async getSubteams(): Promise<SubteamOption[]> {
    return this.repository.getSubteams();
  }
}

export const teamService = new TeamService();
