import DatabaseManager from "../../config/db";
import Customer from "types/Customer.type";

class CustomerModel {
  private static dbManager: DatabaseManager;

  private static getDBManager(): DatabaseManager {
    if (!this.dbManager) {
      this.dbManager = new DatabaseManager();
    }
    return this.dbManager;
  }

  /**
   * Save a new customer to the database.
   * @param customer - Object representing the customer data to be saved.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async save(customer: Customer): Promise<void> {
    const query: string = `
      INSERT INTO customer (
        user_id,
        shipping_address,
        card_number,
        card_expiry_date,
        card_security_code,
        last_purchase_date,
        total_purchases,
        favorite_categories,
        favorite_brands,
        customer_reviews
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const dbManager = this.getDBManager();
      await dbManager.run(query, [...Object.values(customer)]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get a customer from the database based on the provided ID or UUID.
   * @param customerIdentifier - Numeric ID or UUID of the customer.
   * @returns A Promise that resolves with the customer data or null if not found.
   */
  static async get(customerIdentifier: number | string): Promise<Customer | null> {
    const isNumericId = typeof customerIdentifier === "number";
    const column = isNumericId ? "id" : "uuid";

    const query: string = `
      SELECT * FROM customer WHERE ${column} = ?
    `;

    try {
      const dbManager = this.getDBManager();
      const row = await dbManager.get(query, [customerIdentifier]);
      return row || null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update the data of a customer in the database.
   * @param customerUUID - UUID of the customer to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async update(customerUUID: string, updatedFields: Partial<Customer>): Promise<void> {
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);

    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    const query: string = `
      UPDATE customer
      SET ${setClause}
      WHERE uuid = ?
    `;

    try {
      const dbManager = this.getDBManager();
      await dbManager.run(query, [...values, customerUUID]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Delete a customer from the database based on the provided UUID.
   * @param customerUUID - UUID of the customer to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async delete(customerUUID: string): Promise<void> {
    const query: string = `
      DELETE FROM customer WHERE uuid = ?
    `;

    try {
      const dbManager = this.getDBManager();
      await dbManager.run(query, [customerUUID]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default CustomerModel;
