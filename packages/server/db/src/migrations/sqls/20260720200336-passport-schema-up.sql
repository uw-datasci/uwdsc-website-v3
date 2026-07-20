CREATE SCHEMA IF NOT EXISTS passport;

CREATE TABLE passport.stamps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE events.events
  ADD COLUMN stamp_id UUID REFERENCES passport.stamps(id) ON DELETE SET NULL;

CREATE TABLE passport.qrcode_scans (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scanner_profile_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scanned_profile_id  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_id            UUID REFERENCES events.events(id) ON DELETE SET NULL,
  scanned_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (scanner_profile_id, scanned_profile_id, event_id)
);
