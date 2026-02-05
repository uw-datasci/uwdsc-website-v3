-- Drop indexes
DROP INDEX IF EXISTS public.idx_profiles_is_math_soc_member;
DROP INDEX IF EXISTS public.idx_profiles_term;
DROP INDEX IF EXISTS public.idx_profiles_created_at;
DROP INDEX IF EXISTS public.idx_profiles_faculty;
DROP INDEX IF EXISTS public.idx_profiles_wat_iam;
DROP INDEX IF EXISTS public.idx_profiles_has_paid;
DROP INDEX IF EXISTS public.idx_profiles_user_role;

-- Drop profiles table
DROP TABLE IF EXISTS public.profiles;
