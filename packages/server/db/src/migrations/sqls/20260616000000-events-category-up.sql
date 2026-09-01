CREATE TYPE events.event_category_enum AS ENUM ('workshop', 'social', 'academic');

ALTER TABLE events.events
  ADD COLUMN category events.event_category_enum;

CREATE INDEX idx_events_category ON events.events (category);
