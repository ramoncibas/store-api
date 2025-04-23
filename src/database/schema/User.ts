const Schema = `
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT,
    user_picture_name TEXT,
    type TEXT DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS revoked_tokens (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    token VARCHAR(255) NOT NULL,
    revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id, token)
  );

  CREATE TRIGGER IF NOT EXISTS update_user_timestamp
  AFTER UPDATE ON user
  FOR EACH ROW
  BEGIN
    UPDATE user
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
  END;

  CREATE INDEX IF NOT EXISTS idx_user_id ON user(id);
  CREATE INDEX IF NOT EXISTS idx_user_uuid ON user(uuid);
  CREATE INDEX IF NOT EXISTS idx_user_email ON user(email);
  CREATE INDEX IF NOT EXISTS idx_user_type ON user(type);
`;

export default Schema;