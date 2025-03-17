import ShoppingCartModel from "models/ShoppingCartModel";
import ShoppingCartError from "builders/errors/ShoppingCartError";
import { ShoppingCartItem } from "types/Product.type";
import CacheService from "lib/cache";
import ProductModel from "../models/ProductModel";

class ShoppingCartRepository {
  private cache;
  private cacheKey = {
    product: (customerId: number, productId: number) => {
      return `cart_customer_${customerId}_product_${productId}`;
    },
    customer: (customerId: number) => {
      return `cart_customer_${customerId}`;
    },
  };

  constructor() {
    this.cache = new CacheService('shopping_cart');
  }

  /**
   * Creates a new Shopping Cart Product in the database.
   * @param Shopping Cart Product - Object representing the Shopping Cart Product data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async create(customerID: number, product: ShoppingCartItem): Promise<ShoppingCartItem> {
    try {
      const productExist = await ProductModel.findById(product.product_id);

      if (productExist) {
        throw ShoppingCartError.itemAlreadyExists();
      }

      const newCartItem = await ShoppingCartModel.create(customerID, product);

      if (!newCartItem) {
        throw ShoppingCartError.itemCreationFailed();
      }

      const cacheKey = this.cacheKey.customer(customerID);
      this.cache.set(cacheKey, newCartItem);
      
      return newCartItem;
    } catch (error: any) {
      throw new ShoppingCartError('Error creating Shopping Cart Product', error);
    }
  }

  /**
   * Gets a Shopping Cart Product Ids from the database based on the provided ID.
   * @param customerID - Numeric ID of customer.
   * @returns A Promise that resolves with the Shopping Cart Product data or null if not found.
   */
  public async findByCustomerId(customerID: number): Promise<Array<ShoppingCartItem>> {
    try {
      const cacheKey = this.cacheKey.customer(customerID);
      const cachedReviews = await this.cache.get<ShoppingCartItem[]>(cacheKey);

      if (cachedReviews) return cachedReviews;

      const cartItems = await ShoppingCartModel.findByCustomerId(customerID);

      if (cartItems) {
        this.cache.set(cacheKey, cartItems);
      }

      return cartItems!;
    } catch (error: any) {
      throw new ShoppingCartError('Error retrieving Shopping Cart Product', error);
    }
  }

  /**
   * Updates the data of a Shopping Cart Product in the database.
   * @param customerID - ID of the Customer to be updated.
   * @param shoppingCarID - ID of the Shopping Cart Product to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async update(customerID: number, shoppingCarID: number, quantity: Partial<ShoppingCartItem>): Promise<void> {
    try {
      const updatedCart = await ShoppingCartModel.update(shoppingCarID, quantity);

      if (updatedCart) {
        let cacheKey = this.cacheKey.customer(customerID);
        this.cache.remove(cacheKey);
      }

      return updatedCart;
    } catch (error: any) {
      throw new ShoppingCartError('Error updating Shopping Cart Product', error);
    }
  }

  /**
   * Deletes a Shopping Cart Product from the database based on the provided ID.
   * @param shoppingCarID - ID of the Shopping Cart Product to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async delete(customerID: number, shoppingCarID: number): Promise<boolean> {
    try {
      const cart = await ShoppingCartModel.get(shoppingCarID);

      if (!cart) throw ShoppingCartError.itemNotFound();

      const cartItemDeleted = await ShoppingCartModel.deleteItem(customerID, shoppingCarID);

      if (cartItemDeleted) {
        let cacheKey = this.cacheKey.customer(customerID);
        this.cache.remove(cacheKey);
      }

      return cartItemDeleted;
    } catch (error: any) {
      throw new ShoppingCartError('Error deleting Shopping Cart Product', error);
    }
  }

  /**
   * Deletes all product items in the shopping cart by clearing the database based on the customer ID.
   * @param customerID - ID of the cart owner of the shopping cart to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async clear(customerID: number): Promise<any> {
    try {
      const itemsDeleted = await ShoppingCartModel.clear(customerID);

      if (itemsDeleted) {
        let cacheKey = this.cacheKey.customer(customerID);
        this.cache.remove(cacheKey);
      }

      return itemsDeleted;
    } catch (error: any) {
      throw new ShoppingCartError('Error deleting Shopping Cart Product', error);
    }
  }
}

export default new ShoppingCartRepository;
