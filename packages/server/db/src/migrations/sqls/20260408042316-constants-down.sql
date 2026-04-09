DELETE FROM public.exec_positions
WHERE id IN (
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
);

SELECT setval(
  pg_get_serial_sequence('public.exec_positions', 'id'),
  COALESCE((SELECT MAX(id) FROM public.exec_positions), 0)
);

DELETE FROM public.subteams
WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);

SELECT setval(
  pg_get_serial_sequence('public.subteams', 'id'),
  COALESCE((SELECT MAX(id) FROM public.subteams), 0)
);
