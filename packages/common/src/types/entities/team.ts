export type ExecMember = {
  id: string;
  name: string;
  position: string;
  photo_url: string;
  instagram: string;
};

export type Subteam = {
  id: string;
  name: string;
  members: ExecMember[];
};