ALTER TABLE events.events
  DROP CONSTRAINT IF EXISTS events_resources_is_array;

ALTER TABLE events.events
  DROP COLUMN IF EXISTS resources;

-- Lossy: the pre-backfill NULLs are unrecoverable, so every row stays 'social'.
ALTER TABLE events.events
  ALTER COLUMN category DROP NOT NULL;
