-- Drop trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop indexes
DROP INDEX IF EXISTS public.idx_exec_team_subteam_id;
DROP INDEX IF EXISTS public.idx_exec_team_role_id;
DROP INDEX IF EXISTS public.idx_exec_team_profile_id;
DROP INDEX IF EXISTS public.idx_profiles_is_math_soc_member;
DROP INDEX IF EXISTS public.idx_profiles_faculty;

-- Drop tables (in reverse order of creation due to foreign key dependencies)
DROP TABLE IF EXISTS public.exec_team;
DROP TABLE IF EXISTS public.subteams;
DROP TABLE IF EXISTS public.exec_roles;
DROP TABLE IF EXISTS public.profiles;
