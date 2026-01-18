/**
 * Enums and Union Types
 */
export type AppStatus =
  | "draft"
  | "submitted"
  | "accepted"
  | "rejected"
  | "waitlisted";

export type SizeOption = "S" | "M" | "L" | "XL";

export type GenderOption =
  | "Male"
  | "Female"
  | "Non-Binary"
  | "Other"
  | "Prefer not to say";

export type YearOption =
  | "1st Year"
  | "2nd Year"
  | "3rd Year"
  | "4th Year"
  | "5th Year+"
  | "Masters"
  | "PhD";

export type HackathonCountOption = "0" | "1" | "2" | "3" | "4+";

/**
 * Main Application Interface
 */
export interface HackerApplication {
  // Application Data
  id?: string; // don't add if it's not needed (I suspect it might be for app context)
  profile_id: string;
  status: AppStatus;
  submitted_at: Date | null;

  // Contact & Personal
  phone_number: string; // varchar(12)
  discord: string; // varchar(32), 2 <= length <= 32
  t_shirt: SizeOption;
  dietary_restrictions: string;
  age: number;
  country_of_residence: string;
  gender: GenderOption;
  ethnicity: string[];

  // Education
  uni_name: string;
  uni_program: string;
  year_of_study: YearOption;

  // Experience
  prior_hack_exp: string[]; // Multi-select question
  num_hackathons: HackathonCountOption;

  // Links (Optional)
  github_url?: string;
  linkedin_url?: string;
  website_url?: string;
  other_url?: string;

  // Questions
  cxc_q1: string;
  cxc_q2: string;

  // Team
  team_members: string[]; // Mapped from Postgres array/jsonb
}
