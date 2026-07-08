import { BaseRepository } from "@uwdsc/db/base.repository";
import { Event, EventWithAttendanceCount } from "@uwdsc/common/types";
import type { EventTimeFilter } from "../../types/events";

export class EventRepository extends BaseRepository {
  /**
   * Total number of events (all rows).
   */
  async getEventCount(): Promise<number> {
    try {
      const result = await this.sql<{ count: number }[]>`
        SELECT COUNT(*)::int AS count FROM events.events
      `;
      return result[0]?.count ?? 0;
    } catch (error: unknown) {
      console.error("Error counting events:", error);
      throw error;
    }
  }

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
        FROM events.events
        ORDER BY start_time DESC
      `;

      return result;
    } catch (error: unknown) {
      console.error("Error fetching all events:", error);
      throw error;
    }
  }

  /**
   * Get all events with an attendance count per event, ordered by start_time descending.
   */
  async getAllEventsWithAttendanceCount(): Promise<EventWithAttendanceCount[]> {
    try {
      const result = await this.sql<EventWithAttendanceCount[]>`
        SELECT
          e.id,
          e.name,
          e.description,
          e.location,
          e.image_url,
          e.start_time,
          e.end_time,
          e.buffered_start_time,
          e.buffered_end_time,
          (SELECT COUNT(*)::int FROM events.attendance a WHERE a.event_id = e.id) AS attendance_count
        FROM events.events e
        ORDER BY e.start_time DESC
      `;
      return result;
    } catch (error: unknown) {
      console.error("Error fetching events with attendance count:", error);
      throw error;
    }
  }

  /**
   * Get all events attended by a user, ordered from oldest to newest.
   */
  async getEventsAttendedByUser(profileId: string): Promise<Event[]> {
    try {
      const result = await this.sql<Event[]>`
        SELECT
          e.id,
          e.name,
          e.description,
          e.location,
          e.image_url,
          e.start_time,
          e.end_time,
          e.buffered_start_time,
          e.buffered_end_time
        FROM events.attendance a
        JOIN events.events e ON e.id = a.event_id
        WHERE a.profile_id = ${profileId}
        ORDER BY e.start_time ASC
      `;
      return result;
    } catch (error: unknown) {
      console.error("Error fetching events attended by user:", error);
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
        FROM events.events
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
        FROM events.events
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
          SELECT 1 FROM events.attendance
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
        INSERT INTO events.attendance (event_id, profile_id)
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

  /**
   * Upsert a feed subscriber keyed by (ip_hash, user_agent).
   * On conflict, advances last_seen to now().
   */
  async recordFeedSubscriber(ipHash: string, userAgent: string | null): Promise<void> {
    try {
      await this.sql`
        INSERT INTO events.feed_subscribers (ip_hash, user_agent)
        VALUES (${ipHash}, ${userAgent})
        ON CONFLICT (ip_hash, user_agent)
        DO UPDATE SET last_seen = now()
      `;
    } catch (error: unknown) {
      console.error("Error recording feed subscriber:", error);
      throw error;
    }
  }

  /**
   * Count distinct IP hashes seen within the last `days` days.
   */
  async getFeedSubscriberCount(days: number): Promise<number> {
    try {
      const result = await this.sql<{ count: number }[]>`
        SELECT COUNT(DISTINCT ip_hash)::int AS count
        FROM events.feed_subscribers
        WHERE last_seen > now() - (${days} || ' days')::interval
      `;
      return result[0]?.count ?? 0;
    } catch (error: unknown) {
      console.error("Error counting feed subscribers:", error);
      throw error;
    }
  }
}
