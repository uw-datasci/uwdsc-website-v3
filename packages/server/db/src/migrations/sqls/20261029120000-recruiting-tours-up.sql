-- Guided tours each user has finished (or skipped).
CREATE TABLE hiring.tour_completions (
  profile_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tour          TEXT NOT NULL,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, tour)
);

ALTER TABLE hiring.tour_completions ENABLE ROW LEVEL SECURITY;
