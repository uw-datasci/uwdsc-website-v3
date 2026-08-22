-- The enum, the `category` column, and idx_events_category already exist (20260616000000).
-- Backfill first: no row has ever been tagged, and SET NOT NULL would fail on them.
-- 'social' is a blunt default, NOT a classification -- real past workshops get re-tagged by hand.
UPDATE events.events
  SET category = 'social'
  WHERE category IS NULL;

ALTER TABLE events.events
  ALTER COLUMN category SET NOT NULL;

ALTER TABLE events.events
  ADD COLUMN resources JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE events.events
  ADD CONSTRAINT events_resources_is_array
  CHECK (jsonb_typeof(resources) = 'array');
