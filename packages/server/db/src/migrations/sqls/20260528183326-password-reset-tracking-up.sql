-- profiles: lifetime password reset counter
ALTER TABLE public.profiles
  ADD COLUMN password_reset_count INT NOT NULL DEFAULT 0;

-- memberships: swap candidate key from profile_id to (profile_id, term_id)
-- so each term verification gets its own row instead of overwriting the prior term.
-- Drop whichever single-column unique constraint currently guards profile_id
-- (the name varies between Supabase-provisioned DBs and migration-provisioned DBs).
DO $$
DECLARE
  v_constraint_name text;
BEGIN
  SELECT c.conname INTO v_constraint_name
  FROM pg_constraint c
  JOIN pg_class t ON c.conrelid = t.oid
  JOIN pg_namespace n ON t.relnamespace = n.oid
  WHERE n.nspname = 'public'
    AND t.relname = 'memberships'
    AND c.contype = 'u'
    AND c.conkey = ARRAY[
      (SELECT attnum FROM pg_attribute
       WHERE attrelid = t.oid AND attname = 'profile_id')
    ]::smallint[];

  IF v_constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.memberships DROP CONSTRAINT %I', v_constraint_name);
  END IF;
END $$;

ALTER TABLE public.memberships
  ADD CONSTRAINT memberships_profile_id_term_id_key UNIQUE (profile_id, term_id);

-- memberships: per-term password reset counter
ALTER TABLE public.memberships
  ADD COLUMN password_reset_count INT NOT NULL DEFAULT 0;
