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
