-- Drop trigger
DROP TRIGGER IF EXISTS enforce_position_limit ON application_position_selections;

-- Drop functions
DROP FUNCTION IF EXISTS check_position_limit();
DROP FUNCTION IF EXISTS delete_old_terms();

-- Drop tables in reverse dependency order
-- Drop dependent tables first
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS application_position_selections CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS term_position_questions CASCADE;

-- Drop independent tables
DROP TABLE IF EXISTS application_positions_available CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS terms CASCADE;
