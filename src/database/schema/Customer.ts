const Schema = `
  CREATE TABLE IF NOT EXISTS customer (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL UNIQUE,
    shipping_address TEXT NOT NULL,
    card_number TEXT,
    card_expiry_date TEXT,
    card_security_code TEXT,
    last_purchase_date TEXT,
    total_purchases INTEGER,
    favorite_categories TEXT,
    favorite_brands TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TRIGGER IF NOT EXISTS update_customer_timestamp
  AFTER UPDATE ON customer
  FOR EACH ROW
  BEGIN
    UPDATE customer
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
  END;

  CREATE INDEX IF NOT EXISTS idx_customer_id ON customer(id);
  CREATE INDEX IF NOT EXISTS idx_customer_uuid ON customer(uuid);
  CREATE INDEX IF NOT EXISTS idx_customer_user_id ON customer(user_id);
  CREATE INDEX IF NOT EXISTS idx_customer_total_purchases ON customer(total_purchases);
  CREATE INDEX IF NOT EXISTS idx_customer_favorite_categories ON customer(favorite_categories);
  CREATE INDEX IF NOT EXISTS idx_customer_favorite_brands ON customer(favorite_brands);
`;

export default Schema;