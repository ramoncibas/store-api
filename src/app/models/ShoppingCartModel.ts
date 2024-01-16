import DatabaseManager from "../../database/db";
import { ShoppingCartItem } from "types/Product.type";

class ShoppingCartModel {
  private static dbManager: DatabaseManager;

  private static getDBManager(): DatabaseManager {
    if (!this.dbManager) {
      this.dbManager = new DatabaseManager();
    }
    return this.dbManager;
  }

  /**
   * Save a new shopping cart Product product to the database.
   * @param produt - Object representing the shopping cart Product product data to be saved.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async save(product: ShoppingCartItem): Promise<void> {
    const query: string = `
      INSERT INTO shopping_cart (
        customer_id,
        product_id,
        quantity
      ) VALUES (?, ?, ?)
    `;

    try {
      const dbManager = this.getDBManager();
      await dbManager.run(query, [...Object.values(product)]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get a ShoppingCartItem from the database based on the provided ID.
   * @param shoppingCarID - Numeric ID of the Shopping Cart Product.
   * @returns A Promise that resolves with the customer data or null if not found.
   */
  static async get(customerID: number | string): Promise<Array<number> | null> {
    const query: string = `
      SELECT product_id FROM shopping_cart WHERE customer_id = ?
    `;

    try {
      const dbManager = this.getDBManager();
      const row = await dbManager.get(query, [customerID]);
      return row || null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get a ShoppingCartItem from the database based on the provided ID.
   * @param shoppingCarID - Numeric ID of the Shopping Cart Product.
   * @returns A Promise that resolves with the customer data or null if not found.
   */
    static async getAll(customerID: number | string): Promise<ShoppingCartItem[] | null> {
      const query: string = `
        SELECT * FROM shopping_cart WHERE customer_id = ?
      `;
  
      try {
        const dbManager = this.getDBManager();
        const row = await dbManager.get(query, [customerID]);
        return row || null;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

  /**
   * Update the data of a Shopping Cart Product in the database.
   * @param shoppingCarID - ID of the Shopping Cart Product to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async update(shoppingCarID: number | string, quantity: number): Promise<void> {  
    const query: string = `
      UPDATE shopping_cart
      SET quantity = ?
      WHERE id = ?
    `;

    try {
      const dbManager = this.getDBManager();
      await dbManager.run(query, [quantity, shoppingCarID]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Delete a Shopping Cart Product from the database based on the provided UUID.
   * @param shoppingCarID - ID of the Shopping Cart Product to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async delete(shoppingCarID: number | string): Promise<void> {
    const query: string = `
      DELETE FROM shopping_cart WHERE id = ?
    `;

    try {
      const dbManager = this.getDBManager();
      await dbManager.run(query, [shoppingCarID]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default ShoppingCartModel;
