-- memberships: accumulated active website time in seconds (per term).
-- Tracking begins in the app once the membership is active.
ALTER TABLE public.memberships
  ADD COLUMN active_time_seconds INTEGER NOT NULL DEFAULT 0
  CONSTRAINT memberships_active_time_seconds_non_negative CHECK (active_time_seconds >= 0);
