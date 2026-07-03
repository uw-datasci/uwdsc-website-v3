import { EventRepository } from "./events.repository";
import type { EventTimeFilter, GetEventsByTimeRangeOptions } from "../../types/events";
import { ApiError, Event, EventWithAttendanceCount } from "@uwdsc/common/types";

function toTimeFilter(options: GetEventsByTimeRangeOptions): EventTimeFilter {
  const { range, limit, asOf } = options;
  return range === "active"
    ? { kind: "in_window", asOf }
    : { kind: "after_start", asOf, limit: limit ?? 1 };
}

class EventService {
  private readonly repository: EventRepository;

  constructor() {
    this.repository = new EventRepository();
  }

  /**
   * Total number of events in the database.
   */
  async getEventCount(): Promise<number> {
    try {
      return await this.repository.getEventCount();
    } catch (error) {
      throw new ApiError(`Failed to count events: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get all events
   */
  async getAllEvents(): Promise<Event[]> {
    try {
      return await this.repository.getAllEvents();
    } catch (error) {
      throw new ApiError(`Failed to get all events: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get all events with an attendance count per event.
   */
  async getAllEventsWithAttendanceCount(): Promise<EventWithAttendanceCount[]> {
    try {
      return await this.repository.getAllEventsWithAttendanceCount();
    } catch (error) {
      throw new ApiError(`Failed to get events with attendance: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get a single event by ID
   */
  async getEventById(eventId: string): Promise<Event | null> {
    try {
      return await this.repository.getEventById(eventId);
    } catch (error) {
      throw new ApiError(`Failed to get event: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get events matching a generic time filter.
   */
  async getEvents(filter: EventTimeFilter): Promise<Event[]> {
    try {
      return await this.repository.getEvents(filter);
    } catch (error) {
      throw new ApiError(`Failed to get events: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Get events by time range (active = now in buffered window, upcoming = start after now).
   */
  async getEventsByTimeRange(options: GetEventsByTimeRangeOptions): Promise<Event[]> {
    return this.getEvents(toTimeFilter(options));
  }

  /**
   * Check if a user has checked in to an event.
   * Returns checkedIn boolean and the attendance record ID if present.
   */
  async getAttendanceForUser(
    eventId: string,
    profileId: string,
  ): Promise<{ checkedIn: boolean; attendanceId: string | null }> {
    try {
      const attendanceId = await this.repository.getAttendanceForUser(eventId, profileId);
      return { checkedIn: attendanceId !== null, attendanceId };
    } catch (error) {
      throw new ApiError(`Failed to check attendance: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Check in a user to an event
   */
  async checkInUser(eventId: string, profileId: string): Promise<boolean> {
    try {
      return await this.repository.checkInUser(eventId, profileId);
    } catch (error) {
      throw new ApiError(`Failed to check in user: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Record (or refresh) a calendar feed subscriber identified by a hashed IP + user agent.
   */
  async recordFeedSubscriber(ipHash: string, userAgent: string | null): Promise<void> {
    try {
      await this.repository.recordFeedSubscriber(ipHash, userAgent);
    } catch (error) {
      throw new ApiError(`Failed to record feed subscriber: ${(error as Error).message}`, 500);
    }
  }

  /**
   * Count unique feed subscribers (distinct hashed IPs) seen within the last `days` days.
   * Defaults to 30 days.
   */
  async getFeedSubscriberCount(days = 30): Promise<number> {
    try {
      return await this.repository.getFeedSubscriberCount(days);
    } catch (error) {
      throw new ApiError(`Failed to count feed subscribers: ${(error as Error).message}`, 500);
    }
  }
}

export const eventService = new EventService();
