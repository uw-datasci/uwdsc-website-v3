-- =============================================================================
-- Seed exec team: auth.users, profiles, user_roles, exec_team
-- Excludes: Aaryan Patel, Jocelyn Xu
-- Run with service role or as superuser (auth.users + RLS).
-- Requires: pgcrypto (for crypt/gen_salt). Run: CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. Insert into auth.users (dummy emails, temp password: password)
--    Trigger will create profile + user_roles with 'member'; we update those next.
-- -----------------------------------------------------------------------------
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  created_at,
  updated_at,
  raw_user_meta_data
)
VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'monica.trinh@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Monica Trinh", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'ishir.lakhani@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Ishir Lakhani", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'michael.zhang@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Michael Zhang", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'david.he@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "David He", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'ian.leung@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Ian Leung", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'adhya.sharma@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Adhya Sharma", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'parithy.senthamilarasan@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Parithy Senthamilarasan", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'simone.coutinho@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Simone Coutinho", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'daniel.pu@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Daniel Pu", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'parsa.ahmadnezhad@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Parsa Ahmadnezhad", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'aaron.liang@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Aaron Liang", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'aiden.suh@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Aiden Suh", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'aditi.jha@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Aditi Jha", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'shreeya.santha@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Shreeya Santha", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'andy.xu@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Andy Xu", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'jessica.ying@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Jessica Ying", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'sophie.yang@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Sophie Yang", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'brian.an@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Brian An", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'andrew.chu@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Andrew Chu", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'samay.bhagat@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Samay Bhagat", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'michael.liu@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Michael Liu", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'lia.moradpour@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Lia Moradpour", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'rachel.wang@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Rachel Wang", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'kaushik.chatterjee@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Kaushik Chatterjee", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'gurman.deol@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Gurman Deol", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'elrich.chen@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Elrich Chen", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'yanzi.guo@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Yanzi Guo", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'disha.saxena@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Disha Saxena", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'karen.guan@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Karen Guan", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'matthew.li@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Matthew Li", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'tanay.kashyap@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Tanay Kashyap", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'nahal.habibizadeh@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Nahal Habibizadeh", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'aaryan.shroff@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Aaryan Shroff", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'abeer.kashar@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Abeer Kashar", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'sharanya.basu@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Sharanya Basu", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'ethan.fung@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Ethan Fung", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'maher.anand@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Maher Anand", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'luna.nguyen@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Luna Nguyen", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'dishita.chawla@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Dishita Chawla", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'rohan.saha@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Rohan Saha", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'angel.musa@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Angel Musa", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'riza.qin@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Riza Qin", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'jia.naidu@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Jia Naidu", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'athena.nguyen@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Athena Nguyen", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'varsha.prasad@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Varsha Prasad", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'yuyeon.kim@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Yuyeon Kim", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'alyssa.lui@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Alyssa Lui", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'charlene.lee@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Charlene Lee", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'lily.song@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Lily Song", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'danya.cheng@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Danya Cheng", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'winston.zhao@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Winston Zhao", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'methuli.amarasinghe@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Methuli Amarasinghe", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'harry.cheng@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Harry Cheng", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'bethany.liu@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Bethany Liu", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'andrew.shum@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Andrew Shum", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'nimish.patri@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Nimish Patri", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'max.han@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Max Han", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'mathu.thavarajah@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Mathu Thavarajah", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'mincy.yang@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Mincy Yang", "role": "admin"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'harrison.fulford@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Harrison Fulford", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'kapil.iyer@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Kapil Iyer", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'mahek.patel@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Mahek Patel", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'diya.saxena@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Diya Saxena", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'elaine.zhu@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Elaine Zhu", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'jaden.gau@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Jaden Gau", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'anirudh.dabas@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Anirudh Dabas", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'david.yang@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "David Yang", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'jerry.zhu@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Jerry Zhu", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'winston.yu@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Winston Yu", "role": "exec"}'::jsonb),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'karthik.viriyala@uwdsc-exec.local', crypt('password', gen_salt('bf')), now(), now(), '{"full_name": "Karthik Krishna Viriyala", "role": "exec"}'::jsonb);

-- -----------------------------------------------------------------------------
-- 2. Update profiles: first_name, last_name from auth.users.raw_user_meta_data
-- -----------------------------------------------------------------------------
UPDATE public.profiles p
SET
  first_name = split_part((u.raw_user_meta_data->>'full_name'), ' ', 1),
  last_name = trim(substring((u.raw_user_meta_data->>'full_name') from position(' ' in (u.raw_user_meta_data->>'full_name')) + 1))
FROM auth.users u
WHERE u.id = p.id
  AND u.raw_user_meta_data->>'full_name' IS NOT NULL;

-- -----------------------------------------------------------------------------
-- 3. Update user_roles: set role from auth.users.raw_user_meta_data
-- -----------------------------------------------------------------------------
UPDATE public.user_roles r
SET role = (u.raw_user_meta_data->>'role')::public.user_role_enum
FROM auth.users u
WHERE u.id = r.id
  AND u.raw_user_meta_data->>'role' IS NOT NULL;

-- -----------------------------------------------------------------------------
-- 4. Insert exec_team (profile_id, position_id, subteam_id, photo_url)
--    Position mapping: Co-President 14, VP of CxC 15, CxC Coordinator 16,
--    Developer 4, VP of Events 18, Events Coordinator 1, VP of Projects 19,
--    VP of Workshops 20, Workshop Lead 8, Workshop & Projects Lead 21,
--    Project Lead 7, VP of Social Media 2, Social Media Coordinator 3,
--    VP of Design 22, Graphic Designer 23, VP of Internals 24, Internals Coordinator 25,
--    VP of Finance 26, VP of Outreach 5, Outreach Coordinator 6, CxC Advisor 27.
--    Photo filenames match apps/web/public/teams (e.g. Monica-Trinh.jpg).
-- -----------------------------------------------------------------------------
INSERT INTO public.exec_team (profile_id, position_id, subteam_id, photo_url)
SELECT u.id, e.position_id, e.subteam_id,
  'https://tpkibsgwhostzcovlyjf.supabase.co/storage/v1/object/public/team/' || e.photo_filename
FROM (VALUES
  ('Monica Trinh', 14, 1, 'Monica-Trinh.jpg'),
  ('Ishir Lakhani', 14, 1, 'Ishir-Lakhani.png'),
  ('Michael Zhang', 15, 2, 'Michael-Zhang.jpg'),
  ('David He', 15, 2, 'David-He.jpg'),
  ('Ian Leung', 16, 2, 'Ian-Leung.jpg'),
  ('Adhya Sharma', 16, 2, 'Adhya-Sharma.jpg'),
  ('Parithy Senthamilarasan', 16, 2, 'Parithy-Senthamilarasan.jpg'),
  ('Simone Coutinho', 16, 2, 'Simone-Coutinho.jpg'),
  ('Parsa Ahmadnezhad', 16, 2, 'Parsa-Ahmadnezhad.jpg'),
  ('Aaron Liang', 16, 2, 'Aaron-Liang.jpg'),
  ('Aiden Suh', 4, 3, 'Aiden-Suh.jpg'),
  ('Aditi Jha', 4, 3, 'Aditi-Jha.jpg'),
  ('Shreeya Santha', 4, 3, 'Shreeya-Santha.jpg'),
  ('Andy Xu', 4, 3, 'Andy-Xu.jpg'),
  ('Jessica Ying', 4, 3, 'Jessica-Ying.jpg'),
  ('Sophie Yang', 4, 3, 'Sophie-Yang.jpg'),
  ('Brian An', 4, 3, 'Brian-An.jpg'),
  ('Andrew Chu', 4, 3, 'Andrew-Chu.jpg'),
  ('Daniel Pu', 4, 3, 'Daniel-Pu.jpg'),
  ('Samay Bhagat', 4, 3, 'Samay-Bhagat.jpg'),
  ('Michael Liu', 18, 4, 'Michael-Liu.jpg'),
  ('Lia Moradpour', 18, 4, 'Lia-Moradpour.jpg'),
  ('Rachel Wang', 1, 4, 'Rachel-Wang.jpg'),
  ('Kaushik Chatterjee', 1, 4, 'Kaushik-Chatterjee.jpg'),
  ('Gurman Deol', 1, 4, 'Gurman-Deol.jpg'),
  ('Elrich Chen', 1, 4, 'Elrich-Chen.jpg'),
  ('Yanzi Guo', 1, 4, 'Yanzi-Guo.jpg'),
  ('Disha Saxena', 1, 4, 'Disha-Saxena.jpg'),
  ('Karen Guan', 1, 4, 'Karen-Guan.jpg'),
  ('Matthew Li', 1, 4, 'Matthew-Li.jpg'),
  ('Tanay Kashyap', 19, 5, 'Tanay-Kashyap.jpg'),
  ('Nahal Habibizadeh', 20, 5, 'Nahal-Habibizadeh.jpg'),
  ('Aaryan Shroff', 8, 5, 'Aaryan-Shroff.jpg'),
  ('Abeer Kashar', 21, 5, 'Abeer-Kashar.jpg'),
  ('Sharanya Basu', 8, 5, 'Sharanya-Basu.jpg'),
  ('Ethan Fung', 7, 5, 'Ethan-Fung.jpg'),
  ('Maher Anand', 7, 5, 'Maher-Anand.jpg'),
  ('Luna Nguyen', 7, 5, 'Luna-Nguyen.jpg'),
  ('Dishita Chawla', 7, 5, 'Dishita-Chawla.jpg'),
  ('Rohan Saha', 7, 5, 'Rohan-Saha.jpg'),
  ('Angel Musa', 2, 6, 'Angel-Musa.jpg'),
  ('Riza Qin', 3, 6, 'Riza-Qin.jpg'),
  ('Jia Naidu', 3, 6, 'Jia-Naidu.jpg'),
  ('Athena Nguyen', 3, 6, 'Athena-Nguyen.jpg'),
  ('Varsha Prasad', 3, 6, 'Varsha-Prasad.jpg'),
  ('Yuyeon Kim', 3, 6, 'Yuyeon-Kim.jpg'),
  ('Alyssa Lui', 3, 6, 'Alyssa-Lui.jpg'),
  ('Charlene Lee', 22, 7, 'Charlene-Lee.jpg'),
  ('Lily Song', 23, 7, 'Lily-Song.jpg'),
  ('Danya Cheng', 23, 7, 'Danya-Cheng.jpg'),
  ('Winston Zhao', 24, 8, 'Winston-Zhao.jpg'),
  ('Methuli Amarasinghe', 24, 8, 'Methuli-Amarasinghe.jpg'),
  ('Harry Cheng', 25, 8, 'Harry-Cheng.jpg'),
  ('Bethany Liu', 25, 8, 'Bethany-Liu.jpg'),
  ('Andrew Shum', 25, 8, 'Andrew-Shum.jpg'),
  ('Nimish Patri', 26, 9, 'Nimish-Patri.jpg'),
  ('Max Han', 26, 9, 'Max-Han.jpg'),
  ('Mathu Thavarajah', 5, 10, 'Mathumaran-Thavarajah.jpg'),
  ('Mincy Yang', 5, 10, 'Mincy-Yang.png'),
  ('Harrison Fulford', 6, 10, 'Harrison-Fulford.jpg'),
  ('Kapil Iyer', 6, 10, 'Kapil-Iyer.jpg'),
  ('Mahek Patel', 6, 10, 'Mahek-Patel.jpg'),
  ('Diya Saxena', 6, 10, 'Diya-Saxena.jpg'),
  ('Elaine Zhu', 6, 10, 'Elaine-Zhu.jpg'),
  ('Jaden Gau', 6, 10, 'Jaden-Gau.jpg'),
  ('Anirudh Dabas', 6, 10, 'Anirudh-Dabas.jpg'),
  ('David Yang', 6, 10, 'David-Yang.jpg'),
  ('Jerry Zhu', 27, 11, 'Jerry-Zhu.jpg'),
  ('Winston Yu', 27, 11, 'Winston-Yu.jpg'),
  ('Karthik Krishna Viriyala', 27, 11, 'Karthik-Viriyala.jpg')
) AS e(full_name, position_id, subteam_id, photo_filename)
JOIN auth.users u ON u.raw_user_meta_data->>'full_name' = e.full_name;

-- -----------------------------------------------------------------------------
-- 5. Update photo_url to relative path (filename only)
-- -----------------------------------------------------------------------------
UPDATE public.exec_team
SET photo_url = substring(photo_url from '[^/]+$')
WHERE photo_url LIKE 'https://tpkibsgwhostzcovlyjf.supabase.co/storage/%';
