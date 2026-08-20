-- ============================================================================
-- VP scope moves from org.exec_team to public.user_roles.subteam_id.
--
-- Nothing in the application ever INSERTs an org.exec_team row -- the only
-- write is an UPDATE of photo_url/instagram during onboarding. Meanwhile the
-- term rollover (hiring.repository.ts finalizeRoles) writes user_roles.role and
-- nothing else. Because every VP permission was resolved by joining
-- exec_team -> exec_positions -> subteams, a freshly promoted VP got
-- role = 'admin' with an empty scope and could review nothing until someone
-- hand-wrote an exec_team row in SQL.
--
-- After this migration the subteam a person is scoped to lives beside their
-- role, is written by the same code paths, and is mirrored into Supabase
-- app_metadata by the existing on_role_upsert trigger. org.exec_team keeps only
-- its display duties (public /team page, headshot, instagram, position label).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. The column.
--
--    ON DELETE RESTRICT rather than SET NULL: nulling a VP's subteam would
--    silently strip their review scope rather than fail, which is the exact
--    class of bug 20260731191203-returning-exec-positions-decouple fixed. No
--    code path deletes an org.subteams row, so RESTRICT costs nothing.
-- ----------------------------------------------------------------------------
ALTER TABLE public.user_roles
  ADD COLUMN subteam_id INT REFERENCES org.subteams(id) ON DELETE RESTRICT;

CREATE INDEX idx_user_roles_subteam_id ON public.user_roles (subteam_id);

-- ----------------------------------------------------------------------------
-- 2. Backfill from the most recent exec_team row per profile.
--
--    exec_team has no UNIQUE (profile_id), so a person can hold several rows;
--    DISTINCT ON + the updated_at/created_at ordering matches how
--    onboarding.repository.ts already picks "the current one". The subteam is
--    resolved COALESCE(ep.subteam_id, et.subteam_id), matching the resolution
--    auth.repository.ts used for the queries this replaces.
-- ----------------------------------------------------------------------------
UPDATE public.user_roles ur
SET subteam_id = src.subteam_id
FROM (
  SELECT DISTINCT ON (et.profile_id)
         et.profile_id,
         COALESCE(ep.subteam_id, et.subteam_id) AS subteam_id
  FROM org.exec_team et
  JOIN org.exec_positions ep ON ep.id = et.position_id
  ORDER BY et.profile_id, et.updated_at DESC, et.created_at DESC
) src
WHERE ur.id = src.profile_id
  AND ur.role IN ('exec', 'admin', 'pres');

-- ----------------------------------------------------------------------------
-- 3. Presidents fall back to the Presidents subteam.
--
--    President access is role-driven (isPresident() checks role = 'pres', not
--    subteam membership), so this value is never read for authorization -- it
--    exists only to satisfy the constraint below and keep the row honest.
-- ----------------------------------------------------------------------------
UPDATE public.user_roles ur
SET subteam_id = (SELECT id FROM org.subteams WHERE name = 'Presidents')
WHERE ur.role = 'pres'
  AND ur.subteam_id IS NULL;

-- ----------------------------------------------------------------------------
-- 4. Refuse to add the constraint while any elevated account is unresolvable.
--    Naming the accounts turns a constraint violation into an actionable error.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  unresolved text;
BEGIN
  SELECT string_agg(COALESCE(au.email, ur.id::text), ', ')
  INTO unresolved
  FROM public.user_roles ur
  JOIN auth.users au ON au.id = ur.id
  WHERE ur.role IN ('exec', 'admin', 'pres')
    AND ur.subteam_id IS NULL;

  IF unresolved IS NOT NULL THEN
    RAISE EXCEPTION
      'Cannot constrain user_roles.subteam_id: no exec_team row resolves a subteam for %. Assign a subteam or demote to alum, then re-run.',
      unresolved;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 5. The rule: only elevated roles carry a subteam.
-- ----------------------------------------------------------------------------
ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_subteam_matches_role CHECK (
    (role IN ('member', 'alum') AND subteam_id IS NULL)
    OR
    (role IN ('exec', 'admin', 'pres') AND subteam_id IS NOT NULL)
  );

-- ----------------------------------------------------------------------------
-- 6. Mirror subteam alongside role into Supabase app_metadata.
--    The on_role_upsert trigger from 20260207033051-user-roles is unchanged --
--    only the function body it calls is replaced.
--
--    jsonb_build_object writes an explicit JSON null for a NULL subteam, so the
--    keys are always present and the TS side never has to distinguish "absent"
--    from "member".
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_update_user_role()
RETURNS TRIGGER AS $$
DECLARE
  v_subteam_name text;
BEGIN
  IF new.subteam_id IS NOT NULL THEN
    SELECT name INTO v_subteam_name FROM org.subteams WHERE id = new.subteam_id;
  END IF;

  UPDATE auth.users
  SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb) ||
    jsonb_build_object(
      'role', new.role,
      'subteam_id', new.subteam_id,
      'subteam', v_subteam_name
    )
  WHERE id = new.id;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 7. Keep the mirrored name honest when a subteam is renamed.
--    Without this, a rename leaves every affected user's app_metadata pointing
--    at the old name until their role row happens to be written again.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_subteam_name_to_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users au
  SET raw_app_meta_data =
    COALESCE(au.raw_app_meta_data, '{}'::jsonb) ||
    jsonb_build_object('subteam', new.name)
  FROM public.user_roles ur
  WHERE ur.id = au.id
    AND ur.subteam_id = new.id;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_subteam_rename
  AFTER UPDATE OF name ON org.subteams
  FOR EACH ROW
  WHEN (old.name IS DISTINCT FROM new.name)
  EXECUTE FUNCTION public.sync_subteam_name_to_user_metadata();

-- ----------------------------------------------------------------------------
-- 8. Backfill the metadata itself. The trigger only fires on future writes, and
--    members need the explicit nulls so readers can rely on the keys existing.
-- ----------------------------------------------------------------------------
UPDATE auth.users au
SET raw_app_meta_data =
  COALESCE(au.raw_app_meta_data, '{}'::jsonb) ||
  jsonb_build_object(
    'role', ur.role,
    'subteam_id', ur.subteam_id,
    'subteam', st.name
  )
FROM public.user_roles ur
LEFT JOIN org.subteams st ON st.id = ur.subteam_id
WHERE ur.id = au.id;
