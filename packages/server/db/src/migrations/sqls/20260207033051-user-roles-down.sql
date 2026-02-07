-- Drop trigger
DROP TRIGGER IF EXISTS on_role_upsert ON public.user_roles;

-- Drop function
DROP FUNCTION IF EXISTS public.handle_update_user_role();

-- Drop table (this will cascade and drop foreign key constraints)
DROP TABLE IF EXISTS public.user_roles;
