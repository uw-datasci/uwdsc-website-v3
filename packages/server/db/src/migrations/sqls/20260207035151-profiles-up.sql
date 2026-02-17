CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  wat_iam VARCHAR(8) UNIQUE,
  faculty public.faculty_enum,
  term VARCHAR(4),
  heard_from_where text,
  is_math_soc_member BOOLEAN NOT NULL DEFAULT false,
  membership_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.exec_positions(
  id SERIAL PRIMARY KEY,
  name text UNIQUE NOT NULL
);

CREATE TABLE public.subteams (
  id SERIAL PRIMARY KEY,
  name text UNIQUE NOT NULL
);

CREATE TABLE public.exec_team (
  id SERIAL PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  position_id INT NOT NULL REFERENCES public.exec_positions(id) ON DELETE CASCADE,
  subteam_id INT NOT NULL REFERENCES public.subteams(id) ON DELETE CASCADE,
  instagram VARCHAR(30) UNIQUE,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create trigger function to automatically create profile and user_role when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile with user id
  -- Profile fields will be NULL until user completes their profile
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  
  -- Add user to user_roles table with default 'member' role
  INSERT INTO public.user_roles (id, role)
  VALUES (NEW.id, 'member');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Create indexes for common query patterns
CREATE INDEX idx_profiles_faculty ON public.profiles (faculty);
CREATE INDEX idx_profiles_is_math_soc_member ON public.profiles (is_math_soc_member);

-- Create indexes for exec_team foreign keys
CREATE INDEX idx_exec_team_profile_id ON public.exec_team (profile_id);
CREATE INDEX idx_exec_team_position_id ON public.exec_team (position_id);
CREATE INDEX idx_exec_team_subteam_id ON public.exec_team (subteam_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exec_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subteams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exec_team ENABLE ROW LEVEL SECURITY;

-- profiles: SELECT - Own profile OR exec/admin can see all
CREATE POLICY profiles_select_own_or_elevated ON public.profiles
  FOR SELECT
  USING (
    id = auth.uid() OR 
    public.is_exec_or_admin(auth.uid())
  );

-- profiles: UPDATE - Own profile OR exec/admin can update any
CREATE POLICY profiles_update_own_or_elevated ON public.profiles
  FOR UPDATE
  USING (
    id = auth.uid() OR 
    public.is_exec_or_admin(auth.uid())
  )
  WITH CHECK (
    id = auth.uid() OR 
    public.is_exec_or_admin(auth.uid())
  );

-- profiles: DELETE - Admin only
CREATE POLICY profiles_delete_admin_only ON public.profiles
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Allow Supabase API (authenticated role) to access profiles; RLS restricts rows
GRANT SELECT, UPDATE ON public.profiles TO authenticated;

-- exec_positions: SELECT - Public (anyone can read)
CREATE POLICY exec_positions_select_public ON public.exec_positions
  FOR SELECT
  USING (true);

-- exec_positions: INSERT/UPDATE/DELETE - Admin only
CREATE POLICY exec_positions_insert_admin_only ON public.exec_positions
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY exec_positions_update_admin_only ON public.exec_positions
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY exec_positions_delete_admin_only ON public.exec_positions
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- subteams: SELECT - Public (anyone can read)
CREATE POLICY subteams_select_public ON public.subteams
  FOR SELECT
  USING (true);

-- subteams: INSERT/UPDATE/DELETE - Admin only
CREATE POLICY subteams_insert_admin_only ON public.subteams
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY subteams_update_admin_only ON public.subteams
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY subteams_delete_admin_only ON public.subteams
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- exec_team: SELECT - Public (anyone can read)
CREATE POLICY exec_team_select_public ON public.exec_team
  FOR SELECT
  USING (true);

-- exec_team: INSERT/UPDATE/DELETE - Admin only
CREATE POLICY exec_team_insert_admin_only ON public.exec_team
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY exec_team_update_admin_only ON public.exec_team
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY exec_team_delete_admin_only ON public.exec_team
  FOR DELETE
  USING (public.is_admin(auth.uid()));