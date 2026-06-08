ALTER TABLE public.memberships
  DROP COLUMN password_reset_count;

-- Re-adding UNIQUE(profile_id) will fail if any profile has multiple membership rows.
-- That is intentional: the inversion is a real data invariant change.
ALTER TABLE public.memberships
  DROP CONSTRAINT memberships_profile_id_term_id_key;

ALTER TABLE public.memberships
  ADD CONSTRAINT memberships_profile_id_key UNIQUE (profile_id);

ALTER TABLE public.profiles
  DROP COLUMN password_reset_count;
