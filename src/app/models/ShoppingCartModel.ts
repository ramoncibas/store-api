import { randomUUID } from "crypto";
import { ShoppingCartItem } from "types/Product.type";
import { RunResult } from "sqlite3";
import BaseModel from "./BaseModel";

class ShoppingCartModel extends BaseModel<ShoppingCartModel> {
  constructor() {
    super("shopping_cart");
  }

  /**
   * Save a new shopping cart Product product to the database.
   * @param produt - Object representing the shopping cart Product product data to be saved.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async save(customerID: number, product: ShoppingCartItem): Promise<any> {
    try {
      const query: string = `
        INSERT INTO shopping_cart (
          uuid,
          customer_id,
          product_id,
          quantity
        ) VALUES (?, ?, ?, ?)
        RETURNING *;
      `;

      return await this.dbManager.transaction(async (dbManager) => {
        const generatedUuid = randomUUID();
        const values = [generatedUuid, customerID, ...Object.values(product)];
        const result = await dbManager.all(query, values);

        return result;
      });
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
  static async get(customerID: number): Promise<Array<{ product_id: number }> | null> {
    try {
      const query: string = `
        SELECT product_id FROM shopping_cart WHERE customer_id = ?
      `;

      const rows = await this.dbManager.all(query, [customerID]);
      
      return rows;
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
  static async getAll(customerID: number): Promise<ShoppingCartItem[] | null> {
    try {
      const query: string = `
        SELECT * FROM shopping_cart WHERE customer_id = ?
      `;

      const rows = await this.dbManager.all(query, [customerID]);
      
      return rows;
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
  static async update(shoppingCarID: number, quantity: number): Promise<RunResult> {
    try {
      const query: string = `
        UPDATE shopping_cart
        SET quantity = ?
        WHERE id = ?
      `;

      return await this.dbManager.transaction(async (dbManager) => {
        const rows = await dbManager.run(query, [quantity, shoppingCarID]);

        return rows;
      });

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
  static async delete(customerID: number, shoppingCarID: number): Promise<RunResult> {
    try {
      const query: string = `
        DELETE FROM shopping_cart 
        WHERE 
          customer_id = ?
          AND id = ?
      `;

      return await this.dbManager.transaction(async (dbManager) => {
        const rows = await dbManager.run(query, [customerID, shoppingCarID]);

        return rows;
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Deletes all product items in the shopping cart by clearing the database based on the customer ID.
   * @param customerID - ID of the cart owner of the shopping cart to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async clear(customerID: number): Promise<any> {
    try {
      const query: string = `
        DELETE FROM shopping_cart WHERE customer_id = ?
      `;

      return await this.dbManager.transaction(async (dbManager) => {
        const result = await dbManager.run(query, [customerID]);

        return result.changes;
      });

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default ShoppingCartModel;
