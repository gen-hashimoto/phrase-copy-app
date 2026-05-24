-- Add user_id as nullable first because existing rows do not have an owner yet.
-- After backfilling user_id for existing rows, make it NOT NULL and add the FK.
ALTER TABLE phrases
  ADD COLUMN user_id CHAR(36) NULL,
  ADD COLUMN position INT NOT NULL DEFAULT 0;

-- Development example: attach existing rows to a seed user.
-- Replace the email with your local test account.
UPDATE phrases
SET user_id = (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1)
WHERE user_id IS NULL;

-- Assign an initial display order to existing rows.
-- MySQL user variables let us increment a counter for each updated row.
SET @row_number = 0;
UPDATE phrases
SET position = (@row_number := @row_number + 1)
ORDER BY created_at ASC;

-- Now that every row has user_id, enforce ownership at the database level.
ALTER TABLE phrases
  MODIFY user_id CHAR(36) NOT NULL,
  ADD CONSTRAINT fk_phrases_user_id FOREIGN KEY (user_id) REFERENCES users(id);

-- Speed up "list my phrases ordered by position" queries.
CREATE INDEX ix_phrases_user_position ON phrases (user_id, position);
