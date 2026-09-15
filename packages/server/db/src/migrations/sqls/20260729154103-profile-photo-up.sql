-- profiles: storage object key for the member's uploaded profile photo
ALTER TABLE public.profiles
  ADD COLUMN profile_photo_key TEXT;
