const ShoppingCartSchema = `  
  CREATE TABLE IF NOT EXISTS shopping_cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_product_id ON shopping_cart(product_id);
`;

export default ShoppingCartSchema;