-- Rollback notes for development only.
-- Review data loss before using these statements.

ALTER TABLE phrases DROP FOREIGN KEY fk_phrases_user_id;
DROP INDEX ix_phrases_user_position ON phrases;

ALTER TABLE phrases
  DROP COLUMN user_id,
  DROP COLUMN position;

DROP TABLE users;

-- Reverting phrases.id from UUID back to integer is intentionally omitted.
-- Use a backup table or recreate the development database if you need that rollback.
