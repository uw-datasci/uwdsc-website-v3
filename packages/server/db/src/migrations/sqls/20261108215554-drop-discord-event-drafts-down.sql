-- Recreate admin's draft table and enum exactly as 20261004012808-discord-event-bot made them.
-- The rows aren't restored: drafts expire after an hour, so there's nothing worth keeping.

CREATE TYPE events.discord_draft_status_enum AS ENUM ('pending', 'created', 'cancelled');

CREATE TABLE events.discord_event_drafts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_discord_id  TEXT NOT NULL,
  guild_id              TEXT NOT NULL,
  channel_id            TEXT NOT NULL,
  message_id            TEXT,
  status                events.discord_draft_status_enum NOT NULL DEFAULT 'pending',

  name                  TEXT,
  location              TEXT,
  description           TEXT,
  start_time            TIMESTAMPTZ,
  end_time              TIMESTAMPTZ,
  category              events.event_category_enum,

  submitted_name        TEXT,
  submitted_location    TEXT,
  submitted_start       TEXT,
  submitted_end         TEXT,
  submitted_description TEXT,

  created_event_id      UUID REFERENCES events.events(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at            TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '1 hour'
);

ALTER TABLE events.discord_event_drafts ENABLE ROW LEVEL SECURITY;
