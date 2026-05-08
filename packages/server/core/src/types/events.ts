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
