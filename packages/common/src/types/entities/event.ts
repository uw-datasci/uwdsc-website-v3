// ==========================================
//  Event Types
//  Used for web and admin packages
// ==========================================

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
}

export type UpdateEventData = Partial<CreateEventData>;
