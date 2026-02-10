-- Drop RLS policies
DROP POLICY IF EXISTS memberships_delete_admin_only ON public.memberships;
DROP POLICY IF EXISTS memberships_update_exec_admin ON public.memberships;
DROP POLICY IF EXISTS memberships_insert_own ON public.memberships;
DROP POLICY IF EXISTS memberships_select_own_or_elevated ON public.memberships;

-- Disable RLS
ALTER TABLE public.memberships DISABLE ROW LEVEL SECURITY;

-- Drop table (this will cascade and drop foreign key constraints)
DROP TABLE IF EXISTS public.memberships;
