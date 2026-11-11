-- The Discord /event-create bot moved to nexus-bot, which keeps its drafts in its own
-- `discord.event_drafts` table and creates events through admin's /api/internal/events/drafts.
-- Drop admin's draft table and its enum. events.events.is_published and its RLS policy stay:
-- nexus-bot's drafts still arrive as unpublished events.

DROP TABLE IF EXISTS events.discord_event_drafts;

DROP TYPE IF EXISTS events.discord_draft_status_enum;
