import {
  EventRepository,
  type EventTimeFilter,
  type GetEventsByTimeRangeOptions,
} from "../repositories/eventRepository";
import { ApiError, Event } from "@uwdsc/common/types";

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
      throw new ApiError(
        `Failed to get events: ${(error as Error).message}`,
        500,
      );
    }
  }

  /**
   * Get events by time range (active = now in buffered window, upcoming = start after now).
   */
  async getEventsByTimeRange(
    options: GetEventsByTimeRangeOptions
  ): Promise<Event[]> {
    return this.getEvents(toTimeFilter(options));
  }

  /**
   * Check if a user has checked in to an event
   */
  async getAttendanceForUser(eventId: string, profileId: string): Promise<boolean> {
    try {
      return await this.repository.getAttendanceForUser(eventId, profileId);
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
}

export const eventService = new EventService();
