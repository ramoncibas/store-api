const Schema = `
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    user_picture_name TEXT,
    type TEXT DEFAULT 'user' NOT NULL,
    UNIQUE (email)
  );

  CREATE TABLE IF NOT EXISTS customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    user_id INTEGER UNIQUE,
    shipping_address TEXT NOT NULL,
    card_number TEXT,
    card_expiry_date TEXT,
    card_security_code TEXT,
    last_purchase_date TEXT,
    total_purchases INTEGER,
    favorite_categories TEXT,
    favorite_brands TEXT,
    customer_reviews TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
  );

  CREATE TABLE IF NOT EXISTS product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
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

  CREATE TABLE IF NOT EXISTS size_product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    size TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS brand_product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS gender_product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS category_product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS review (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    product_id INTEGER,
    customer_id INTEGER,
    rating INTEGER,
    comment TEXT,
    review_date TEXT,
    UNIQUE (product_id, customer_id),
    FOREIGN KEY (product_id) REFERENCES product(id),
    FOREIGN KEY (customer_id) REFERENCES customer(id)
  );

  CREATE TABLE IF NOT EXISTS shopping_cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY(customer_id) REFERENCES customer(id) ON DELETE SET NULL,
    FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS purchase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id NOT NULL INTEGER,
    total_amount NOT NULL REAL,
    total_value NOT NULL REAL,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES customer(id)
  );

  CREATE TABLE RevokedTokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_size_id ON product(size_id); 
  CREATE INDEX IF NOT EXISTS idx_brand_id ON product(brand_id);
  CREATE INDEX IF NOT EXISTS idx_gender_id ON product(gender_id);
  CREATE INDEX IF NOT EXISTS idx_category_id ON product(category_id);
  CREATE INDEX IF NOT EXISTS idx_product_customer ON review(product_id, customer_id);
  CREATE INDEX IF NOT EXISTS idx_customer_id ON shopping_cart(customer_id);
  CREATE INDEX IF NOT EXISTS idx_product_id ON shopping_cart(product_id);
`;

export default Schema;