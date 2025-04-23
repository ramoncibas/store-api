const Schema = `
  CREATE TABLE IF NOT EXISTS shopping_cart (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    customer_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    UNIQUE(uuid, product_id),
    FOREIGN KEY(customer_id) REFERENCES customer(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE SET NULL ON UPDATE CASCADE
  );

  CREATE TRIGGER IF NOT EXISTS update_shopping_cart_timestamp
  AFTER UPDATE ON shopping_cart
  FOR EACH ROW
  BEGIN
    UPDATE shopping_cart
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
  END;

  CREATE INDEX IF NOT EXISTS idx_shopping_cart_id ON shopping_cart(id);
  CREATE INDEX IF NOT EXISTS idx_shopping_cart_uuid ON shopping_cart(uuid);
  CREATE INDEX IF NOT EXISTS idx_shopping_cart_customer_id ON shopping_cart(customer_id);
  CREATE INDEX IF NOT EXISTS idx_shopping_cart_product_id ON shopping_cart(product_id);
`;

export default Schema;