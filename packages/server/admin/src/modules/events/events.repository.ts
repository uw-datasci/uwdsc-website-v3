import { BaseRepository } from "@uwdsc/db/base.repository";
import type { Sql } from "@uwdsc/db/connection";
import { CreateEventData, Event, EventResource } from "@uwdsc/common/types";

/**
 * `EventResource` is a plain named interface with no index signature, so TS won't structurally
 * match it against postgres.js's `JSONValue` (what `sql.json()` expects, which requires one)
 * without an explicit assertion. This is a type-only cast -- `sql.json()` serializes with
 * `JSON.stringify` regardless of the declared parameter type, so nothing about the actual jsonb
 * payload changes. Derived from `Sql["json"]`'s own parameter type (rather than importing
 * `postgres`'s types directly) since `postgres` isn't a direct dependency of this package.
 */
function toJsonValue(resources: EventResource[]): Parameters<Sql["json"]>[0] {
  return resources as unknown as Parameters<Sql["json"]>[0];
}

export class EventRepository extends BaseRepository {
  /**
   * Create a new event
   * @param data - Event data to insert
   */
  async createEvent(data: CreateEventData): Promise<Event | null> {
    try {
      const result = await this.sql<Event[]>`
        INSERT INTO events.events (
          name, description, location, image_url, start_time, end_time, category, resources
        )
        VALUES (
          ${data.name},
          ${data.description},
          ${data.location},
          ${data.image_url ?? null},
          ${data.start_time},
          ${data.end_time},
          ${data.category},
          ${this.sql.json(toJsonValue(data.resources ?? []))}
        )
        RETURNING *
      `;

      return result[0] ?? null;
    } catch (error: unknown) {
      console.error("Error creating event:", error);
      throw error;
    }
  }

  /**
   * Update an event by ID (partial update - only provided fields are changed)
   * @param eventId - The event UUID
   * @param data - Fields to update
   * @param columns - Column names to update (must match keys in data)
   * @param resources - New resources array, if the caller wants to replace it. `jsonb` can't
   *   round-trip through the dynamic `sql(data, ...columns)` helper below (postgres.js infers a
   *   plain JS array as a Postgres array, not json), so it's applied as its own SET clause.
   */
  async updateEventById(
    eventId: string,
    data: Record<string, string | null>,
    columns: string[],
    resources?: EventResource[]
  ): Promise<boolean> {
    try {
      const result =
        resources !== undefined
          ? await this.sql`
              UPDATE events.events
              SET ${columns.length > 0 ? this.sql`${this.sql(data, ...columns)},` : this.sql``}
                  resources = ${this.sql.json(toJsonValue(resources))},
                  updated_at = NOW()
              WHERE id = ${eventId}
              RETURNING id
            `
          : await this.sql`
              UPDATE events.events
              SET ${this.sql(data, ...columns)}, updated_at = NOW()
              WHERE id = ${eventId}
              RETURNING id
            `;

      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error updating event:", error);
      throw error;
    }
  }

  /**
   * Delete an event by ID
   * @param eventId - The event UUID
   */
  async deleteEventById(eventId: string): Promise<boolean> {
    try {
      const result = await this.sql`
        DELETE FROM events.events
        WHERE id = ${eventId}
        RETURNING id
      `;

      return result.length > 0;
    } catch (error: unknown) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }
}
