import { BaseRepository } from "@uwdsc/db/base.repository";
import {
  Event,
  EventCategory,
  EventWithAttendanceCount,
  WrappedEvent,
} from "@uwdsc/common/types";
import type { EventTimeFilter, EventVisibilityOptions } from "../../types/events";

export class EventRepository extends BaseRepository {
  /**
   * Total number of published events.
   */
  async getEventCount(): Promise<number> {
    try {
      const result = await this.sql<{ count: number }[]>`
        SELECT COUNT(*)::int AS count FROM events.events WHERE is_published
      `;
      return result[0]?.count ?? 0;
    } catch (error: unknown) {
      console.error("Error counting events:", error);
      throw error;
    }
  }

  /**
   * Get all events ordered by start_time descending.
   * Published only unless `includeUnpublished` (admin callers).
   */
  async getAllEvents({ includeUnpublished = false }: EventVisibilityOptions = {}): Promise<
    Event[]
  > {
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
          buffered_end_time,
          category,
          resources,
          is_published
        FROM events.events
        WHERE (${includeUnpublished} OR is_published)
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
   * Published only unless `includeUnpublished` (admin callers).
   */
  async getAllEventsWithAttendanceCount({
    includeUnpublished = false,
  }: EventVisibilityOptions = {}): Promise<EventWithAttendanceCount[]> {
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
          e.category,
          e.resources,
          e.is_published,
          (SELECT COUNT(*)::int FROM events.attendance a WHERE a.event_id = e.id) AS attendance_count
        FROM events.events e
        WHERE (${includeUnpublished} OR e.is_published)
        ORDER BY e.start_time DESC
      `;
      return result;
    } catch (error: unknown) {
      console.error("Error fetching events with attendance count:", error);
      throw error;
    }
  }

  /**
   * Get all events with their attendance count and whether the given user
   * attended each one, ordered from oldest to newest. Single scan for DSC Wrapped.
   * Published events only.
   */
  async getWrappedEventStats(profileId: string): Promise<WrappedEvent[]> {
    try {
      const result = await this.sql<WrappedEvent[]>`
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
          e.category,
          e.resources,
          e.is_published,
          COUNT(a.profile_id)::int AS attendance_count,
          COALESCE(BOOL_OR(a.profile_id = ${profileId}), false) AS attended_by_user
        FROM events.events e
        LEFT JOIN events.attendance a ON a.event_id = e.id
        WHERE e.is_published
        GROUP BY e.id
        ORDER BY e.start_time ASC
      `;
      return result;
    } catch (error: unknown) {
      console.error("Error fetching wrapped event stats:", error);
      throw error;
    }
  }

  /**
   * Get a single event by ID
   * @param eventId - The event UUID
   * @param options - Unpublished events are treated as not found unless `includeUnpublished`
   */
  async getEventById(
    eventId: string,
    { includeUnpublished = false }: EventVisibilityOptions = {}
  ): Promise<Event | null> {
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
          buffered_end_time,
          category,
          resources,
          is_published
        FROM events.events
        WHERE id = ${eventId} AND (${includeUnpublished} OR is_published)
        LIMIT 1
      `;

      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error fetching event by ID:", error);
      throw error;
    }
  }

  /**
   * Get published events matching a generic time filter (in_window, after_start, etc.).
   */
  async getEvents(filter: EventTimeFilter): Promise<Event[]> {
    const ref = filter.asOf ?? new Date();

    const condition =
      filter.kind === "in_window"
        ? this
            .sql`WHERE is_published AND ${ref} BETWEEN buffered_start_time AND buffered_end_time`
        : this.sql`WHERE is_published AND start_time > ${ref}`;

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
          buffered_end_time,
          category,
          resources,
          is_published
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
   * Get all published events of a given category, newest start_time first. Used by the
   * public /workshops page (and any future per-category listing) — backed by
   * idx_events_category.
   */
  async getEventsByCategory(category: EventCategory): Promise<Event[]> {
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
          buffered_end_time,
          category,
          resources,
          is_published
        FROM events.events
        WHERE category = ${category} AND is_published
        ORDER BY start_time DESC
      `;
      return result;
    } catch (error: unknown) {
      console.error("Error fetching events by category:", error);
      throw error;
    }
  }

  /**
   * Check if a user has an attendance record for a given event
   */
  async getAttendanceForUser(eventId: string, profileId: string): Promise<boolean> {
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
