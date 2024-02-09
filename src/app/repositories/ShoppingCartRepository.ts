import ShoppingCartModel from "models/ShoppingCartModel";
import ShoppingCartError from "builders/errors/ShoppingCartError";
import { ShoppingCartItem } from "types/Product.type";

class ShoppingCartRepository {
  /**
   * Creates a new Shopping Cart Product in the database.
   * @param Shopping Cart Product - Object representing the Shopping Cart Product data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async create(customerID: number, product: ShoppingCartItem): Promise<void> {
    try {
      await ShoppingCartModel.save(customerID, product);
    } catch (error: any) {
      throw new ShoppingCartError('Error creating Shopping Cart Product', error);
    }
  }

  /**
   * Gets a Shopping Cart Product Ids from the database based on the provided ID.
   * @param customerID - Numeric ID of customer.
   * @returns A Promise that resolves with the Shopping Cart Product data or null if not found.
   */
  static async get(customerID: number): Promise<Array<{ product_id: number }> | null> {
    try {
      return await ShoppingCartModel.get(customerID);
    } catch (error: any) {
      throw new ShoppingCartError('Error retrieving Shopping Cart Product', error);
    }
  }

  /**
   * Gets all Shopping Cart Products from the database based on the provided ID.
   * @param customerID - Numeric ID of customer.
   * @returns A Promise that resolves with the Shopping Cart Product data or null if not found.
   */
  static async getAll(customerID: number): Promise<ShoppingCartItem[] | null> {
    try {
      return await ShoppingCartModel.getAll(customerID);
    } catch (error: any) {
      throw new ShoppingCartError('Error retrieving All Shopping Cart Product', error);
    }
  }

  /**
   * Get a shopping cart from the database based on the provided pattern and value.
   * @param pattern - A string or array of strings representing the fields to filter on.
   * @param value - The corresponding value for the filter pattern.
   * @returns A Promise that resolves with the shopping cart data or null if not found.
   */
  static async search(pattern: string | Array<string>, value: number | string | Array<string | number>): Promise<ShoppingCartItem | null> {
    try {
      return await ShoppingCartModel.search(pattern, value);
    } catch (error: any) {
      throw new ShoppingCartError('Error retrieving Shopping Cart Product', error);
    }
  }

  /**
   * Updates the data of a Shopping Cart Product in the database.
   * @param shoppingCarID - ID of the Shopping Cart Product to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async update(shoppingCarID: number, quantity: number): Promise<void> {
    try {
      await ShoppingCartModel.update(shoppingCarID, quantity);
    } catch (error: any) {
      throw new ShoppingCartError('Error updating Shopping Cart Product', error);
    }
  }

  /**
   * Deletes a Shopping Cart Product from the database based on the provided ID.
   * @param shoppingCarID - ID of the Shopping Cart Product to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async delete(shoppingCarID: number): Promise<void> {
    try {
      await ShoppingCartModel.delete(shoppingCarID);
    } catch (error: any) {
      throw new ShoppingCartError('Error deleting Shopping Cart Product', error);
    }
  }

  /**
   * Deletes all product items in the shopping cart by clearing the database based on the customer ID.
   * @param customerID - ID of the cart owner of the shopping cart to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async clear(customerID: number): Promise<any> {
    try {
      return await ShoppingCartModel.clear(customerID);
    } catch (error: any) {
      throw new ShoppingCartError('Error deleting Shopping Cart Product', error);
    }
  }
}

export default ShoppingCartRepository;
