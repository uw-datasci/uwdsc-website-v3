CREATE TABLE public.user_roles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role public.user_role_enum NOT NULL DEFAULT 'member'
);


create or replace function public.handle_update_user_role()
returns trigger as $$
begin
  update auth.users
  set raw_app_meta_data = 
    coalesce(raw_app_meta_data, '{}'::jsonb) ||
    jsonb_build_object('role', new.role)
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_role_upsert
  after insert or update on public.user_roles
  for each row execute procedure public.handle_update_user_role();

-- ============================================================================
-- RLS Helper Functions
-- ============================================================================
-- These functions are used across all tables for role-based access control

-- Get current user's role from user_roles table
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role_enum AS $$
  SELECT role FROM public.user_roles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT COALESCE(public.get_user_role(user_id) = 'admin', false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is exec or admin
CREATE OR REPLACE FUNCTION public.is_exec_or_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT COALESCE(public.get_user_role(user_id) IN ('exec', 'admin'), false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- RLS Policies for user_roles table
-- ============================================================================

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- No direct user access to user_roles (backend service only)
-- Service role bypasses RLS automatically
