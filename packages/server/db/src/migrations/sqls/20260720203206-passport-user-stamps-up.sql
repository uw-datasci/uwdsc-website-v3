CREATE TABLE passport.user_stamps (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stamp_id     UUID NOT NULL REFERENCES passport.stamps(id) ON DELETE CASCADE,
  acquired_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_id, stamp_id)
);
