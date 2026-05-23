-- Development-oriented UUID migration for MySQL.
-- Back up data before running this.

CREATE TABLE phrases_uuid_backup AS
SELECT id AS old_id, content, created_at
FROM phrases;

DROP TABLE phrases;

CREATE TABLE phrases (
  id CHAR(36) NOT NULL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO phrases (id, content, created_at)
SELECT UUID(), content, created_at
FROM phrases_uuid_backup
ORDER BY old_id ASC;
