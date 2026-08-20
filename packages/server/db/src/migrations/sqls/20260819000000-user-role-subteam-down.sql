-- Reverse 20260819000000-user-role-subteam: VP scope returns to org.exec_team.

-- 1. Stop syncing subteam renames.
DROP TRIGGER IF EXISTS on_subteam_rename ON org.subteams;
DROP FUNCTION IF EXISTS public.sync_subteam_name_to_user_metadata();

-- 2. Restore the original single-key metadata mirror
--    (verbatim from 20260207033051-user-roles-up.sql).
CREATE OR REPLACE FUNCTION public.handle_update_user_role()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb) ||
    jsonb_build_object('role', new.role)
  WHERE id = new.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Strip the subteam claims from every user's app_metadata.
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data - 'subteam_id' - 'subteam'
WHERE raw_app_meta_data IS NOT NULL;

-- 4. Drop the column and everything hanging off it.
ALTER TABLE public.user_roles
  DROP CONSTRAINT IF EXISTS user_roles_subteam_matches_role;

DROP INDEX IF EXISTS public.idx_user_roles_subteam_id;

ALTER TABLE public.user_roles
  DROP COLUMN IF EXISTS subteam_id;
