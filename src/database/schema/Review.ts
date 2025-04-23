const Schema = `
  CREATE TABLE IF NOT EXISTS review (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    product_id INTEGER,
    customer_id INTEGER,
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TRIGGER IF NOT EXISTS update_review
  AFTER UPDATE ON review
  FOR EACH ROW
  BEGIN
    UPDATE review
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
  END;

  CREATE INDEX IF NOT EXISTS idx_product_customer ON review(product_id, customer_id);
`;

export default Schema;