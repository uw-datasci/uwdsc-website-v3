-- Drop RLS policies
DROP POLICY IF EXISTS exec_team_delete_admin_only ON public.exec_team;
DROP POLICY IF EXISTS exec_team_update_admin_only ON public.exec_team;
DROP POLICY IF EXISTS exec_team_insert_admin_only ON public.exec_team;
DROP POLICY IF EXISTS exec_team_select_public ON public.exec_team;

DROP POLICY IF EXISTS subteams_delete_admin_only ON public.subteams;
DROP POLICY IF EXISTS subteams_update_admin_only ON public.subteams;
DROP POLICY IF EXISTS subteams_insert_admin_only ON public.subteams;
DROP POLICY IF EXISTS subteams_select_public ON public.subteams;

DROP POLICY IF EXISTS exec_positions_delete_admin_only ON public.exec_positions;
DROP POLICY IF EXISTS exec_positions_update_admin_only ON public.exec_positions;
DROP POLICY IF EXISTS exec_positions_insert_admin_only ON public.exec_positions;
DROP POLICY IF EXISTS exec_positions_select_public ON public.exec_positions;

DROP POLICY IF EXISTS profiles_delete_admin_only ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own_or_elevated ON public.profiles;
DROP POLICY IF EXISTS profiles_select_own_or_elevated ON public.profiles;

REVOKE SELECT ON public.profiles FROM authenticated;

-- Disable RLS
ALTER TABLE public.exec_team DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subteams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exec_positions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop indexes
DROP INDEX IF EXISTS public.idx_exec_team_subteam_id;
DROP INDEX IF EXISTS public.idx_exec_team_position_id;
DROP INDEX IF EXISTS public.idx_exec_team_profile_id;
DROP INDEX IF EXISTS public.idx_profiles_is_math_soc_member;
DROP INDEX IF EXISTS public.idx_profiles_faculty;

-- Drop tables (in reverse order of creation due to foreign key dependencies)
DROP TABLE IF EXISTS public.exec_team CASCADE;
DROP TABLE IF EXISTS public.subteams CASCADE;
DROP TABLE IF EXISTS public.exec_positions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
