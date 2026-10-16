-- Discord /event-create bot: draft (unpublished) events + the bot's pending-draft table.

-- ── 1. events.events.is_published ─────────────────────────────────────────────

-- Unpublished events are drafts (e.g. created by the Discord /event-create bot) that only
-- execs/admins see until someone publishes them from the admin Events page.
-- DEFAULT true keeps every existing row, and the admin create form, publishing immediately.
ALTER TABLE events.events
  ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT true;

-- events.events is readable by anon/authenticated (split-schemas grants), so the server-side
-- repository filter alone isn't enough: hide drafts at the RLS layer too.
DROP POLICY IF EXISTS events_select_public ON events.events;

CREATE POLICY events_select_public ON events.events
  FOR SELECT
  USING (is_published OR public.is_exec_or_admin(auth.uid()));

-- ── 2. events.discord_event_drafts ────────────────────────────────────────────

-- Pending event drafts created by the Discord /event-create bot (HTTP interactions).
-- One row per /event-create run; the public preview card's custom_ids carry the draft id.
CREATE TYPE events.discord_draft_status_enum AS ENUM ('pending', 'created', 'cancelled');

CREATE TABLE events.discord_event_drafts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_discord_id  TEXT NOT NULL,
  guild_id              TEXT NOT NULL,
  channel_id            TEXT NOT NULL,
  -- Set once the deferred response has been edited into the preview card. Stored so the card
  -- can be edited with the bot token after the 15-minute interaction token has expired.
  message_id            TEXT,
  status                events.discord_draft_status_enum NOT NULL DEFAULT 'pending',

  -- Values extracted by the LLM (NULL = not clearly stated in the thread).
  name                  TEXT,
  location              TEXT,
  description           TEXT,
  start_time            TIMESTAMPTZ,
  end_time              TIMESTAMPTZ,
  category              events.event_category_enum,

  -- Raw values from the last modal submit, so [Fix] can reopen the modal prefilled with them.
  submitted_name        TEXT,
  submitted_location    TEXT,
  submitted_start       TEXT,
  submitted_end         TEXT,
  submitted_description TEXT,

  created_event_id      UUID REFERENCES events.events(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at            TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '1 hour'
);

-- Server-only: RLS on with no policies and no grants, so anon/authenticated can't reach it.
-- The app connects as the table owner via postgres.js, which bypasses RLS.
ALTER TABLE events.discord_event_drafts ENABLE ROW LEVEL SECURITY;
