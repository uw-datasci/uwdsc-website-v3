DROP INDEX IF EXISTS events.idx_events_category;

ALTER TABLE events.events
  DROP COLUMN IF EXISTS category;

DROP TYPE IF EXISTS events.event_category_enum;
