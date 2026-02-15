export type ExecMember = {
  id: number;
  name: string;
  position: string;
  photo_url: string;
  instagram: string | null;
};

export type Subteam = {
  id: number;
  name: string;
  members: ExecMember[];
};