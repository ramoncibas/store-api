const ProductSchema = `
  CREATE TABLE IF NOT EXISTS product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    color TEXT NOT NULL,
    discount_percentage INTEGER DEFAULT 0 NOT NULL,
    product_picture TEXT NOT NULL,
    number_of_installments INTEGER DEFAULT 0 NOT NULL,
    free_shipping INTEGER DEFAULT 0 NOT NULL,
    description TEXT,
    size_id INTEGER NOT NULL,
    brand_id INTEGER NOT NULL,
    gender_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    quantity_available INTEGER DEFAULT 0 NOT NULL,
    FOREIGN KEY(size_id) REFERENCES size_product(id),
    FOREIGN KEY(brand_id) REFERENCES brand_product(id),
    FOREIGN KEY(gender_id) REFERENCES gender_product(id),
    FOREIGN KEY(category_id) REFERENCES category_product(id)
  );

  CREATE INDEX IF NOT EXISTS idx_size_id ON product(size_id); 
  CREATE INDEX IF NOT EXISTS idx_brand_id ON product(brand_id);
  CREATE INDEX IF NOT EXISTS idx_gender_id ON product(gender_id);
  CREATE INDEX IF NOT EXISTS idx_category_id ON product(category_id);
`;


export default ProductSchema;