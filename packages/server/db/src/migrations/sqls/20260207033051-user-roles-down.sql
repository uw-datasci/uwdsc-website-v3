-- Disable RLS
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop helper functions
DROP FUNCTION IF EXISTS public.is_exec_or_admin(uuid);
DROP FUNCTION IF EXISTS public.is_admin(uuid);
DROP FUNCTION IF EXISTS public.get_user_role(uuid);

-- Drop trigger
DROP TRIGGER IF EXISTS on_role_upsert ON public.user_roles;

-- Drop function
DROP FUNCTION IF EXISTS public.handle_update_user_role();

-- Drop table (this will cascade and drop foreign key constraints)
DROP TABLE IF EXISTS public.user_roles;
