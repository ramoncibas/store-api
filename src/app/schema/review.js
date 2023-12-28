const ReviewSchema = `
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

  CREATE INDEX IF NOT EXISTS idx_product_customer ON review(product_id, customer_id);
`;


export default ReviewSchema;