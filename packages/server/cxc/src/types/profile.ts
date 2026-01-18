// Role enum matching Prisma schema
export type Role =
  | "hacker"
  | "volunteer"
  | "admin"
  | "superadmin"
  | "default"
  | "declined";

// Profile type matching the database schema
export interface Profile {
  id: string;
  role: Role;
  nfc_id: string | null;
  created_at: Date;
  updated_at: Date;
}
