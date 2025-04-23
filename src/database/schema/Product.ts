const Schema = `
  CREATE TABLE IF NOT EXISTS product (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    color TEXT NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0 NOT NULL,
    product_picture TEXT NOT NULL,
    number_of_installments INTEGER DEFAULT 0 NOT NULL,
    free_shipping BOOLEAN DEFAULT FALSE NOT NULL,
    description TEXT,
    size INTEGER NOT NULL,
    brand_id INTEGER NOT NULL,
    gender_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    quantity_available INTEGER DEFAULT 0 NOT NULL CHECK(quantity_available >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(brand_id) REFERENCES brand_product(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(gender_id) REFERENCES gender_product(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(category_id) REFERENCES category_product(id) ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS product_category (
    product_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(category_id) REFERENCES category_product(id) ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS brand_product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gender_product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS category_product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TRIGGER IF NOT EXISTS update_product_timestamp
  AFTER UPDATE ON product
  FOR EACH ROW
  BEGIN
    UPDATE product
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
  END;

  CREATE INDEX IF NOT EXISTS idx_brand_id ON product(brand_id);
  CREATE INDEX IF NOT EXISTS idx_gender_id ON product(gender_id);
  CREATE INDEX IF NOT EXISTS idx_category_id ON product(category_id);
`;

export default Schema;