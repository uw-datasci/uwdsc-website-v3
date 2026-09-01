export const EXEC_TEAM_PHOTO_PLACEHOLDER = "/placeholder/team.png" as const;

export type ExecMember = {
  id: number;
  name: string;
  position: string;
  photo_url: string;
  instagram: string | null;
  updated_at: string | null;
};

export type Subteam = {
  id: number;
  name: string;
  members: ExecMember[];
};

/** `{ id, name }` row from `org.subteams`, for pickers and filters. */
export type SubteamOption = {
  id: number;
  name: string;
};
