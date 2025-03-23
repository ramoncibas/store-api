import BaseModel from "./BaseModel";
import DatabaseError from "builders/errors/DatabaseError";
import { ShoppingCartItem } from "types/Product.type";

class ShoppingCartModel extends BaseModel<ShoppingCartItem> {
  protected static table: string = "shopping_cart";

  /**
   * Get a ShoppingCartItem from the database based on the provided ID.
   * @param customerId - Numeric ID of the Cart.
   * @returns A Promise that resolves with the cart data or null if not found.
   */
  public static async findByCustomerId(customerId: number): Promise<Array<ShoppingCartItem> | null> {
    return await this.search("customer_id", customerId);
  }

  /**
   * Retrieve a ShoppingCartItem from the database using the provided product ID.
   * @param productId - Numeric ID of the product in the cart.
   * @returns A Promise that resolves with the cart data or null if not found.
   */
  public static async findByProductId(customerId: number, productId: number): Promise<Array<ShoppingCartItem> | null> {
    return await this.search(["customer_id", "product_id"], [customerId, productId]);
  }

  /**
   * Get a ShoppingCartItem from the database based on the provided ID.
   * @param cardId - Numeric ID of the Cart.
   * @returns A Promise that resolves with the cart data or null if not found.
   */
  public static async findByCartId(cartId: number): Promise<ShoppingCartItem | null> {
    const [ cartItem ]: ShoppingCartItem[] = await this.search("id", cartId) ?? [];
    
    return cartItem || null;
  }

  /**
   * Save a new shopping cart Product product to the database.
   * @param produt - Object representing the shopping cart Product product data to be saved.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async saveProduct(
    customer_id: number,
    product: Omit<ShoppingCartItem, "customer_id">
  ): Promise<ShoppingCartItem[] | null> {
    const data = { customer_id, ...product };

    return await this.save(data) ?? null;
  }

  /**
   * Update the data of a Shopping Cart Product in the database.
   * @param shoppingCarId - ID of the Shopping Cart Product to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async updateCart(shoppingCarId: number, data: Partial<ShoppingCartItem>): Promise<ShoppingCartItem> {
    return await this.update(shoppingCarId, data);
  }

  /**
   * Delete a Shopping Cart Product from the database based on the provided UUID.
   * @param shoppingCarId - ID of the Shopping Cart Product to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async deleteItem(customerId: number, shoppingCarId: number): Promise<boolean> {
    try {
      const query: string = `
        DELETE FROM shopping_cart 
        WHERE 
          customer_id = ?
          AND id = ?
      `;

      const result = await this.dbManager.transaction(async (dbManager) => {
        const rows = await dbManager.run(query, [customerId, shoppingCarId]);

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
   * @param customerId - ID of the cart owner of the shopping cart to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async clear(customerId: number): Promise<any> {
    return await this.delete(customerId);
  }
}

export default ShoppingCartModel;
