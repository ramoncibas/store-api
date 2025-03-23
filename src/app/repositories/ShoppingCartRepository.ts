import ShoppingCartModel from "models/ShoppingCartModel";
import ShoppingCartError from "builders/errors/ShoppingCartError";
import { ShoppingCartItem } from "types/Product.type";
import CacheService from "lib/cache";
import ProductModel from "../models/ProductModel";
import ProductError from "../builders/errors/ProductError";

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
   * Gets a Shopping Cart Product Ids from the database based on the provided ID.
   * @param customerId - Numeric ID of customer.
   * @returns A Promise that resolves with the Shopping Cart Product data or null if not found.
   */
  public async findByCustomerId(customerId: number): Promise<Array<ShoppingCartItem>> {
    try {
      const cacheKey = this.cacheKey.customer(customerId);
      const cachedReviews = await this.cache.get<ShoppingCartItem[]>(cacheKey);

      if (cachedReviews) return cachedReviews;

      const cartItems = await ShoppingCartModel.findByCustomerId(customerId);

      if (cartItems) {
        this.cache.set(cacheKey, cartItems);
      }

      return cartItems!;
    } catch (error: any) {
      throw new ShoppingCartError('Error retrieving Shopping Cart Product', error);
    }
  }

  /**
   * Gets a Shopping Cart Product Ids from the database based on the provided ID.
   * @param customerId - Numeric ID of customer.
   * @param productId - Numeric ID of product.
   * @returns A Promise that resolves with the Shopping Cart Product data or null if not found.
   */
  public async findByProductId(customerId: number, productId: number): Promise<Array<ShoppingCartItem>> {
    try {
      const cacheKey = this.cacheKey.customer(customerId);
      const cachedReviews = await this.cache.get<ShoppingCartItem[]>(cacheKey);

      if (cachedReviews) return cachedReviews;

      const cartItems = await ShoppingCartModel.findByProductId(customerId, productId);

      if (cartItems) {
        this.cache.set(cacheKey, cartItems);
      }

      return cartItems!;
    } catch (error: any) {
      throw new ShoppingCartError('Error retrieving Shopping Cart Product', error);
    }
  }

  /**
   * Gets a Shopping Cart Product Ids from the database based on the provided ID.
   * @param cartId - Numeric ID of customer.
   * @returns A Promise that resolves with the Shopping Cart Product data or null if not found.
   */
  public async findByCartId(cartId: number): Promise<ShoppingCartItem | null> {
    try {
      // const cacheKey = this.cacheKey.customer(cartId);
      // const cachedReviews = await this.cache.get<ShoppingCartItem[]>(cacheKey);

      // if (cachedReviews) return cachedReviews;

      const cartItems = await ShoppingCartModel.findByCartId(cartId);

      // if (cartItems) {
      //   this.cache.set(cacheKey, cartItems);
      // }

      return cartItems;
    } catch (error: any) {
      throw new ShoppingCartError('Error retrieving Shopping Cart Product', error);
    }
  }

  /**
 * Creates a new Shopping Cart Product in the database.
 * @param Shopping Cart Product - Object representing the Shopping Cart Product data to be created.
 * @returns A Promise that resolves when the operation is completed.
 */
  public async save(customerId: number, product: ShoppingCartItem): Promise<ShoppingCartItem> {
    try {
      const productId = Number(product.product_id);
      const productExist = await ProductModel.findById(productId);

      if (!productExist) {
        throw ProductError.productNotFound();
      }

      const cartItemExist = await ShoppingCartModel.findByProductId(customerId, productId);

      if (cartItemExist && cartItemExist.length > 0) {

        const updatedItems = await Promise.all(cartItemExist.map(async (item) => {
          const cartProductId = Number(item.product_id);

          if (cartProductId === productId) {
            const updatedQuantity = Number(item.quantity) + Number(product.quantity);

            await this.update(customerId, item.id, { quantity: updatedQuantity });
            return { ...item, quantity: updatedQuantity };
          }
          return item;
        }));

        // Todo: fazer com que o update seja feito verificando tbm a qualtidade do produto disponivel para a compram, não podendo ultrapassar o limite

        const updatedItem = updatedItems.find(item => Number(item.product_id) === productId);

        if (updatedItem) {
          return updatedItem;
        }
      }

      const createdItems = await ShoppingCartModel.saveProduct(customerId, product);

      if (!createdItems || createdItems.length === 0) {
        throw ShoppingCartError.itemCreationFailed();
      }

      const newCartItem = createdItems[0];

      if (!newCartItem) {
        throw ShoppingCartError.itemCreationFailed();
      }

      const cacheKey = this.cacheKey.customer(customerId);
      const existingItems = await this.cache.get<ShoppingCartItem[]>(cacheKey) || [];
      existingItems.push(newCartItem);
      this.cache.set(cacheKey, existingItems);

      return newCartItem;
    } catch (error: any) {
      throw new ShoppingCartError('Error creating Shopping Cart Product', error);
    }
  }

  /**
   * Updates the data of a Shopping Cart Product in the database.
   * @param customerId - ID of the Customer to be updated.
   * @param shoppingCartID - ID of the Shopping Cart Product to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async update(customerId: number, shoppingCartID: number, data: Partial<ShoppingCartItem>): Promise<ShoppingCartItem> {
    try {
      const updatedCart = await ShoppingCartModel.updateCart(shoppingCartID, data);

      console.log(updatedCart)
      if (updatedCart) {
        let cacheKey = this.cacheKey.customer(customerId);
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
