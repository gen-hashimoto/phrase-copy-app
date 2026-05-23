ALTER TABLE phrases
  ADD COLUMN user_id CHAR(36) NULL,
  ADD COLUMN position INT NOT NULL DEFAULT 0;

-- Development example: attach existing rows to a seed user.
-- Replace the email with your local test account.
UPDATE phrases
SET user_id = (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1)
WHERE user_id IS NULL;

SET @row_number = 0;
UPDATE phrases
SET position = (@row_number := @row_number + 1)
ORDER BY created_at ASC;

ALTER TABLE phrases
  MODIFY user_id CHAR(36) NOT NULL,
  ADD CONSTRAINT fk_phrases_user_id FOREIGN KEY (user_id) REFERENCES users(id);

CREATE INDEX ix_phrases_user_position ON phrases (user_id, position);
