-- Reverse order of the up migration: drafts table first (it references events.events).

DROP TABLE IF EXISTS events.discord_event_drafts;

DROP TYPE IF EXISTS events.discord_draft_status_enum;

DROP POLICY IF EXISTS events_select_public ON events.events;

CREATE POLICY events_select_public ON events.events
  FOR SELECT
  USING (true);

ALTER TABLE events.events
  DROP COLUMN IF EXISTS is_published;
