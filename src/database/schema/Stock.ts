const Schema = `
  CREATE TABLE IF NOT EXISTS stock (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    product_id INTEGER UNIQUE,
    quantity INTEGER DEFAULT 1,
    created_at_by_id INTERGER,
    updated_at_by_id INTERGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE SET NULL ON UPDATE CASCADE
  );

  CREATE TRIGGER IF NOT EXISTS update_stock_timestamp
  AFTER UPDATE ON stock
  FOR EACH ROW
  BEGIN
    UPDATE stock
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
  END;

  CREATE INDEX IF NOT EXISTS idx_stock_id ON stock(id);
  CREATE INDEX IF NOT EXISTS idx_stock_uuid ON stock(uuid);
  CREATE INDEX IF NOT EXISTS idx_stock_product_id ON stock(product_id);
  CREATE INDEX IF NOT EXISTS idx_stock_product_quantity ON stock(quantity);
`;

export default Schema;

