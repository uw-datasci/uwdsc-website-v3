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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  constraint profiles_pkey primary key (id),
);

-- Create indexes for common query patterns
CREATE INDEX idx_profiles_user_role ON public.profiles (user_role);
CREATE INDEX idx_profiles_faculty ON public.profiles (faculty);
CREATE INDEX idx_profiles_has_paid ON public.profiles (has_paid);
CREATE INDEX idx_profiles_is_math_soc_member ON public.profiles (is_math_soc_member);
