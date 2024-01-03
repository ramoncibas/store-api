const PurchaseSchema = `
  CREATE TABLE IF NOT EXISTS purchase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id NOT NULL INTEGER,
    total_amount NOT NULL REAL,
    total_value NOT NULL REAL,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES customer(id)
  );
`;

export default PurchaseSchema;
