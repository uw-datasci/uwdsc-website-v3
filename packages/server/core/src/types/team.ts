/** Row shape for exec team listing query. */
export interface ExecTeamRow {
  id: number;
  name: string;
  position_name: string;
  is_vp: boolean;
  subteam_id: number;
  subteam_name: string;
  photo_url: string;
  instagram: string | null;
  updated_at: string | null;
}
