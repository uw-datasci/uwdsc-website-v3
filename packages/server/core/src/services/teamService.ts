import type { ExecMember, Subteam } from "@uwdsc/common/types";
import { TeamRepository } from "../repositories/teamRepository";

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
    return a.name.localeCompare(b.name);
  }

  /** True if the member is a VP (should appear first in the subteam list). */
  private isVp(member: ExecMember): boolean {
    return member.position.startsWith("VP");
  }

  /**
   * Get team grouped by subteams, formatted for the team page.
   * Subteams are ordered: Presidents first, CxC second, rest by name, Advisors last.
   * Within each subteam, VPs are listed first.
   */
  async getTeam(): Promise<Subteam[]> {
    const rows = await this.repository.getExecTeam();

    const subteamMap = new Map<
      number,
      { id: number; name: string; members: ExecMember[] }
    >();

    for (const row of rows) {
      const subteamId = row.subteam_id;
      let subteam = subteamMap.get(subteamId);
      if (!subteam) {
        subteam = {
          id: subteamId,
          name: row.subteam_name,
          members: [],
        };
        subteamMap.set(subteamId, subteam);
      }
      subteam.members.push({
        id: row.id,
        name: row.name,
        position: row.position_name,
        photo_url: `${this.BUCKET_URL}/${row.photo_url}`,
        instagram: row.instagram ?? null,
      });
    }

    for (const subteam of subteamMap.values()) {
      subteam.members.sort((a, b) => {
        const aRank = this.isVp(a) ? 0 : 1;
        const bRank = this.isVp(b) ? 0 : 1;
        const order = aRank - bRank;
        if (order !== 0) return order;
        return a.name.localeCompare(b.name);
      });
    }

    const subteams = Array.from(subteamMap.values());
    subteams.sort((a, b) => this.sortSubteams(a, b));
    return subteams;
  }
}

export const teamService = new TeamService();
