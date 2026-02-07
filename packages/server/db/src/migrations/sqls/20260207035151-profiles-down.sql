-- Drop trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop indexes
DROP INDEX IF EXISTS public.idx_profiles_is_math_soc_member;
DROP INDEX IF EXISTS public.idx_profiles_faculty;

-- Drop table (this will cascade and drop foreign key constraints)
DROP TABLE IF EXISTS public.profiles;
