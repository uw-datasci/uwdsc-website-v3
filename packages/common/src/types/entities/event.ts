// ==========================================
//  Event Types
//  Used for web and admin packages
// ==========================================

export type EventCategory = "workshop" | "social" | "academic";

export interface EventResource {
  id: string; // client-generated uuid: React key + stable identity across edits
  source: string; // display name, e.g. "Intro to Pandas — Slides"
  url: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  image_url: string | null;
  start_time: string;
  end_time: string;
  buffered_start_time: string;
  buffered_end_time: string;
  category: EventCategory;
  resources: EventResource[];
}

export interface EventWithAttendanceCount extends Event {
  attendance_count: number;
}

/** Event row enriched for DSC Wrapped: club-wide count + whether this user attended. */
export interface WrappedEvent extends EventWithAttendanceCount {
  attended_by_user: boolean;
}

export interface CreateEventData {
  name: string;
  description: string;
  location: string;
  image_url?: string | null;
  start_time: string;
  end_time: string;
  category: EventCategory;
  resources?: EventResource[];
}

export type UpdateEventData = Partial<CreateEventData>;
