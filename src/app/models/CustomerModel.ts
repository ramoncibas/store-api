import db from "../../config/db";
import Customer from "types/Customer.type";

class CustomerModel {
  /**
   * Saves a new customer to the database.
   * @param customer - Object representing the customer data to be saved.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async save(customer: Customer): Promise<void> {
    return new Promise(function (resolve, reject) {
      db.run(
        `
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
        `,
        [
          customer.user_id,
          customer.shipping_address,
          customer.card_number,
          customer.card_expiry_date,
          customer.card_security_code,
          customer.last_purchase_date,
          customer.total_purchases,
          customer.favorite_categories,
          customer.favorite_brands,
          customer.customer_reviews,
        ],
        (error: Error | null) => {
          if (error) {
            console.error(error);
            reject();
          }
          resolve();
        }
      );
    });
  }

  /**
   * Gets a customer from the database based on the provided ID or UUID.
   * @param customerIdentifier - Numeric ID or UUID of the customer.
   * @returns A Promise that resolves with the customer data or null if not found.
   */
  static async get(customerIdentifier: number | string): Promise<Customer | null> {
    return new Promise(function (resolve, reject) {
      const isNumericId = typeof customerIdentifier === 'number';

      db.get(
        `
          SELECT * FROM customer WHERE ${isNumericId ? 'id' : 'uuid'} = ?
        `,
        [customerIdentifier],
        (error: Error | null, row: Customer) => {
          if (error) {
            console.error(error);
            reject();
          }
          resolve(row);
        }
      );
    });
  }

  /**
   * Updates the data of a customer in the database.
   * @param customerUUID - UUID of the customer to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async update(customerUUID: string, updatedFields: Partial<Customer>): Promise<void> {
    return new Promise(function (resolve, reject) {
      const keys = Object.keys(updatedFields);
      const values = Object.values(updatedFields);

      const setClause = keys.map((key) => `${key} = ?`).join(", ");

      db.run(
        `
          UPDATE customer
          SET ${setClause}
          WHERE uuid = ?
        `,
        [...values, customerUUID],
        (error: Error | null) => {
          if (error) {
            console.error(error);
            reject();
          }
          resolve();
        }
      );
    });
  }

  /**
   * Deletes a customer from the database based on the provided ID.
   * @param customerUUID - UUID of the customer to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async delete(customerUUID: string): Promise<void> {
    return new Promise(function (resolve, reject) {
      db.run(
        `
          DELETE FROM customer WHERE uuid = ?
        `,
        [customerUUID],
        (error: Error | null) => {
          if (error) {
            console.error(error);
            reject();
          }
          resolve();
        }
      );
    });
  }
}

export default CustomerModel;
