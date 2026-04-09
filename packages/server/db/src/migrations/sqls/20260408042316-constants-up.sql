INSERT INTO public.subteams (id, name) VALUES
  (1, 'Presidents'),
  (2, 'CxC'),
  (3, 'Development'),
  (4, 'Events'),
  (5, 'Education'),
  (6, 'Social Media'),
  (7, 'Design'),
  (8, 'Internals'),
  (9, 'Finance'),
  (10, 'Outreach'),
  (11, 'Advisors');

SELECT setval(
  pg_get_serial_sequence('public.subteams', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM public.subteams)
);

INSERT INTO public.exec_positions (id, name, is_vp, subteam_id) VALUES
  (1, 'President', true, 1),
  (2, 'VP of CxC', true, 2),
  (3, 'CxC Coordinator', false, 2),
  (4, 'VP of Development', true, 3),
  (5, 'Developer', false, 3),
  (6, 'VP of Events', true, 4),
  (7, 'Events Coordinator', false, 4),
  (8, 'VP of Projects', true, 5),
  (9, 'VP of Workshops', true, 5),
  (10, 'Project Lead', false, 5),
  (11, 'Workshop Lead', false, 5),
  (12, 'Workshop & Projects Lead', false, 5),
  (13, 'VP of Social Media', true, 6),
  (14, 'Social Media Coordinator', false, 6),
  (15, 'VP of Design', true, 7),
  (16, 'Graphic Designer', false, 7),
  (17, 'Product Designer', false, 7),
  (18, 'VP of Internals', true, 8),
  (19, 'Internals Coordinator', false, 8),
  (20, 'VP of Finance', true, 9),
  (21, 'VP of Outreach', true, 10),
  (22, 'Outreach Coordinator', false, 10),
  (23, 'CxC Advisor', false, 11);

SELECT setval(
  pg_get_serial_sequence('public.exec_positions', 'id'),
  (SELECT COALESCE(MAX(id), 1) FROM public.exec_positions)
);

