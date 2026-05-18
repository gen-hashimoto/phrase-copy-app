-- Example migration for local MySQL (adjust database name).
-- Backup first. For dev-only reset, dropping the whole table is also fine.

USE phrase_copy_app;

ALTER TABLE phrases DROP COLUMN title;
