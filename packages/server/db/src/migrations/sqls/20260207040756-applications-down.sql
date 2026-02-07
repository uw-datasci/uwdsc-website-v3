-- Drop trigger
DROP TRIGGER IF EXISTS enforce_role_limit ON application_role_selections;

-- Drop functions
DROP FUNCTION IF EXISTS check_role_limit();
DROP FUNCTION IF EXISTS delete_old_terms();

-- Drop tables in reverse dependency order
-- Drop dependent tables first
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS application_role_selections;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS term_role_questions;

-- Drop independent tables
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS application_roles;
DROP TABLE IF EXISTS terms;
