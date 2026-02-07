CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  wat_iam VARCHAR(255) UNIQUE, -- Waterloo ID
  faculty public.faculty_enum,
  term VARCHAR(100), -- e.g., "Winter 2026"
  heard_from_where text null,
  is_math_soc_member BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  constraint profiles_pkey primary key (id)
);

-- Create trigger function to automatically create profile and user_role when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile with user id
  -- Using empty strings for first_name and last_name as placeholders
  -- These should be updated when the user completes their profile
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (NEW.id, '', '');
  
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
