import { randomUUID } from "crypto";
import Customer from "types/Customer.type";
import BaseModel from "./BaseModel";

class CustomerModel extends BaseModel<CustomerModel> {
  constructor() {
    super("customer");
  }

  /**
   * Save a new customer to the database.
   * @param customer - Object representing the customer data to be saved.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async save(customer: Omit<Customer, "id" | "uuid">): Promise<Customer> {
    try {
      const query: string = `
        INSERT INTO customer (
          uuid,
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
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *;
      `;

      return await this.dbManager.transaction(async (dbManager) => {
        const generatedUuid = randomUUID();
        const values = [generatedUuid, ...Object.values(customer)];

        const [ customerCreated ] = await dbManager.all(query, values);

        return customerCreated;
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get a customer from the database based on the provided ID or UUID.
   * @param customerUUID - Numeric ID of the customer.
   * @returns A Promise that resolves with the customer data or null if not found.
   */
  static async get(customerUUID: string): Promise<Customer | null> {
    const query: string = `
      SELECT * FROM customer WHERE uuid = ?
    `;

    try {
      const row = await this.dbManager.get(query, [customerUUID]);

      return row;
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
  static async update(customerUUID: string, updatedFields: Partial<Customer>): Promise<Customer> {
    try {
      const keys = Object.keys(updatedFields);
      const values = Object.values(updatedFields);

      const setClause = keys.map((key) => `${key} = ?`).join(", ");

      const query: string = `
        UPDATE customer
        SET ${setClause}
        WHERE uuid = ?
        RETURNING *;
      `;

      return await this.dbManager.transaction(async (dbManager) => {
        const [customer] = await dbManager.all(query, [...values, customerUUID]);

        return customer;
      });
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
  static async delete(customerUUID: string): Promise<boolean> {
    try {
      const query: string = `
        DELETE FROM customer WHERE uuid = ?
      `;

      return await this.dbManager.transaction(async (dbManager) => {
        const row: any = await dbManager.run(query, [customerUUID]);

        return row;
      });

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default CustomerModel;
