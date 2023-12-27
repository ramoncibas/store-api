const CustomerSchema = `
  CREATE TABLE IF NOT EXISTS customer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
`;

export default CustomerSchema;