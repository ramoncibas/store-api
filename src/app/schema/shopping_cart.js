const ShoppingCartSchema = `
  CREATE TABLE IF NOT EXISTS shopping_cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY(customer_id) REFERENCES customer(id) ON DELETE SET NULL,
    FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_customer_id ON shopping_cart(customer_id);
  CREATE INDEX IF NOT EXISTS idx_product_id ON shopping_cart(product_id);
`;

export default ShoppingCartSchema;
