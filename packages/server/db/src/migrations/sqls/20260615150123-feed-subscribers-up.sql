CREATE TABLE events.feed_subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash     TEXT NOT NULL,
  user_agent  TEXT,
  first_seen  TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (ip_hash, user_agent)
);

CREATE INDEX idx_feed_subscribers_last_seen ON events.feed_subscribers (last_seen);
