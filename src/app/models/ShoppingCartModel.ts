import BaseModel from "./BaseModel";
import DatabaseError from "builders/errors/DatabaseError";
import { ShoppingCartItem } from "types/Product.type";

class ShoppingCartModel extends BaseModel<ShoppingCartItem> {
  protected static table: string = "shopping_cart";

  /**
   * Get a ShoppingCartItem from the database based on the provided ID.
   * @param shoppingCarID - Numeric ID of the Cart.
   * @returns A Promise that resolves with the cart data or null if not found.
   */
  public static async findByCustomerId(customerID: number): Promise<Array<any> | null> {
    return await this.search("customer_id", customerID);
  }

  /**
   * Save a new shopping cart Product product to the database.
   * @param produt - Object representing the shopping cart Product product data to be saved.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async create(customer_id: number, product: ShoppingCartItem): Promise<ShoppingCartItem | null> {
    const data = { customer_id, ...Object.values(product) };
    return await this.save(data) ?? null;
  }

  /**
   * Update the data of a Shopping Cart Product in the database.
   * @param shoppingCarID - ID of the Shopping Cart Product to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async update(shoppingCarID: number, quantity: Partial<ShoppingCartItem>): Promise<any> {
    return await this.update(shoppingCarID, quantity);
  }

  /**
   * Delete a Shopping Cart Product from the database based on the provided UUID.
   * @param shoppingCarID - ID of the Shopping Cart Product to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async deleteItem(customerID: number, shoppingCarID: number): Promise<boolean> {
    try {
      const query: string = `
        DELETE FROM shopping_cart 
        WHERE 
          customer_id = ?
          AND id = ?
      `;

      const result = await this.dbManager.transaction(async (dbManager) => {
        const rows = await dbManager.run(query, [customerID, shoppingCarID]);

        return rows;
      });

      if (!result) {
        DatabaseError.queryFailed();
      }

      return true;
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
  public static async clear(customerID: number): Promise<any> {
    return await this.delete(customerID);
  }
}

export default ShoppingCartModel;
