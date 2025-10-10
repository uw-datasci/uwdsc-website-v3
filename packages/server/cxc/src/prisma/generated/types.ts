import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const role_enum = {
    hacker: "hacker",
    sponsor: "sponsor",
    mentor: "mentor",
    volunteer: "volunteer",
    admin: "admin",
    default: "default"
} as const;
export type role_enum = (typeof role_enum)[keyof typeof role_enum];
export const application_status_enum = {
    draft: "draft",
    submitted: "submitted",
    offered: "offered",
    accepted: "accepted",
    rejected: "rejected",
    waitlisted: "waitlisted"
} as const;
export type application_status_enum = (typeof application_status_enum)[keyof typeof application_status_enum];
export const team_role_enum = {
    leader: "leader",
    member: "member"
} as const;
export type team_role_enum = (typeof team_role_enum)[keyof typeof team_role_enum];
export const sponsor_tier_enum = {
    bronze: "bronze",
    silver: "silver",
    gold: "gold",
    platinum: "platinum"
} as const;
export type sponsor_tier_enum = (typeof sponsor_tier_enum)[keyof typeof sponsor_tier_enum];
export type Application = {
    id: Generated<string>;
    profile_id: string;
    resume_id: string | null;
    status: Generated<application_status_enum>;
    role: role_enum;
    term: string;
    comments: string | null;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    submitted_at: Timestamp | null;
};
export type ApplicationAnswer = {
    id: Generated<string>;
    application_id: string;
    question_id: string;
    answer: string | null;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type Event = {
    id: Generated<string>;
    name: string;
    registration_required: boolean;
    description: string | null;
    location: string | null;
    start_time: Timestamp;
    buffered_start_time: Timestamp;
    end_time: Timestamp;
    buffered_end_time: Timestamp;
    payment_required: Generated<boolean>;
    image_id: string | null;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type EventAttendance = {
    id: Generated<string>;
    event_id: string;
    profile_id: string;
    checked_in: Generated<boolean>;
    created_at: Generated<Timestamp>;
};
export type Profile = {
    id: string;
    first_name: string;
    last_name: string;
    role: Generated<role_enum>;
    nfc_id: string | null;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type Question = {
    id: Generated<string>;
    question_id: string;
    question: string;
    is_required: Generated<boolean>;
    order_num: number;
    max_length: number;
    placeholder: string | null;
    help_text: string | null;
    role: role_enum;
    term: string;
};
export type Resume = {
    id: Generated<string>;
    profile_id: string;
    file_path: string;
    created_at: Generated<Timestamp>;
};
export type Sponsor = {
    id: Generated<string>;
    name: string;
    logo_url: string;
    website_url: string;
    tier: Generated<sponsor_tier_enum>;
    created_at: Generated<Timestamp>;
};
export type Team = {
    id: Generated<string>;
    team_name: string;
    team_size: Generated<number>;
    is_recruiting: Generated<boolean>;
    created_at: Generated<Timestamp>;
};
export type TeamMember = {
    id: Generated<string>;
    team_id: string;
    profile_id: string;
    role: Generated<team_role_enum>;
    created_at: Generated<Timestamp>;
    joined_at: Generated<Timestamp>;
};
export type DB = {
    application_answers: ApplicationAnswer;
    applications: Application;
    event_attendance: EventAttendance;
    events: Event;
    profiles: Profile;
    questions: Question;
    resumes: Resume;
    sponsors: Sponsor;
    team_members: TeamMember;
    teams: Team;
};
