import { BaseRepository } from "@uwdsc/db/baseRepository";
import { Event } from "@uwdsc/common/types";

/** Reference time for time-based filters. Defaults to now when omitted. */
export type TimeRef = { asOf?: Date };

/**
 * Generic event time filter: describes how to filter events by time.
 * - in_window: reference time falls inside [buffered_start_time, buffered_end_time]
 * - after_start: start_time is after reference time (optionally limited)
 */
export type EventTimeFilter =
  | (TimeRef & { kind: "in_window" })
  | (TimeRef & { kind: "after_start"; limit?: number });

/** Options for getEventsByTimeRange (service layer); maps to EventTimeFilter. */
export type GetEventsByTimeRangeOptions = {
  range: "active" | "upcoming";
  limit?: number;
  asOf?: Date;
};

export class EventRepository extends BaseRepository {
  /**
   * Get all events ordered by start_time descending
   */
  async getAllEvents(): Promise<Event[]> {
    try {
      const result = await this.sql<Event[]>`
        SELECT
          id,
          name,
          description,
          location,
          image_url,
          start_time,
          end_time,
          buffered_start_time,
          buffered_end_time
        FROM events
        ORDER BY start_time DESC
      `;

      return result;
    } catch (error: unknown) {
      console.error("Error fetching all events:", error);
      throw error;
    }
  }

  /**
   * Get a single event by ID
   * @param eventId - The event UUID
   */
  async getEventById(eventId: string): Promise<Event | null> {
    try {
      const result = await this.sql<Event[]>`
        SELECT
          id,
          name,
          description,
          location,
          image_url,
          start_time,
          end_time,
          buffered_start_time,
          buffered_end_time
        FROM events
        WHERE id = ${eventId}
        LIMIT 1
      `;

      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching event by ID:", error);
      throw error;
    }
  }

  /**
   * Get events matching a generic time filter (in_window, after_start, etc.).
   */
  async getEvents(filter: EventTimeFilter): Promise<Event[]> {
    const ref = filter.asOf ?? new Date();

    const condition =
      filter.kind === "in_window"
        ? this
            .sql`WHERE ${ref} BETWEEN buffered_start_time AND buffered_end_time`
        : this.sql`WHERE start_time > ${ref}`;

    const orderAndLimit =
      filter.kind === "after_start"
        ? this.sql`ORDER BY start_time ASC LIMIT ${filter.limit ?? 1}`
        : this.sql`ORDER BY start_time ASC`;

    try {
      const result = await this.sql<Event[]>`
        SELECT
          id,
          name,
          description,
          location,
          image_url,
          start_time,
          end_time,
          buffered_start_time,
          buffered_end_time
        FROM events
        ${condition}
        ${orderAndLimit}
      `;
      return result;
    } catch (error: unknown) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  /**
   * Check if a user has an attendance record for a given event
   */
  async getAttendanceForUser(
    eventId: string,
    profileId: string,
  ): Promise<boolean> {
    try {
      const result = await this.sql<{ exists: boolean }[]>`
        SELECT EXISTS(
          SELECT 1 FROM attendance
          WHERE event_id = ${eventId} AND profile_id = ${profileId}
        ) AS exists
      `;

      return result[0]?.exists ?? false;
    } catch (error: unknown) {
      console.error("Error checking attendance:", error);
      throw error;
    }
  }

  /**
   * Check in a user to an event (insert attendance record)
   */
  async checkInUser(eventId: string, profileId: string): Promise<boolean> {
    try {
      const result = await this.sql`
        INSERT INTO attendance (event_id, profile_id)
        VALUES (${eventId}, ${profileId})
        ON CONFLICT (event_id, profile_id) DO NOTHING
        RETURNING *
      `;

      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error checking in user:", error);
      throw error;
    }
  }
}
