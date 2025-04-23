const Schema = `
  CREATE TABLE IF NOT EXISTS revoked_tokens (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL UNIQUE,
    revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TRIGGER IF NOT EXISTS update_revoked_tokens_timestamp
  AFTER UPDATE ON revoked_tokens
  FOR EACH ROW
  BEGIN
    UPDATE revoked_tokens
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
  END;

  CREATE INDEX IF NOT EXISTS idx_revoked_tokens_id ON revoked_tokens(id);
  CREATE INDEX IF NOT EXISTS idx_revoked_tokens_token ON revoked_tokens(token);
  CREATE INDEX IF NOT EXISTS idx_revoked_tokens_revoked_at ON revoked_tokens(revoked_at);
`;

export default Schema;