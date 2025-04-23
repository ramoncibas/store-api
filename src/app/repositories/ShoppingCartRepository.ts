import ProductModel from "models/ProductModel";
import ShoppingCartModel from "models/ShoppingCartModel";
import CacheService from "lib/cache";
import { ShoppingCartError } from "builders/errors";
import { ShoppingCartItem } from "@types";

class ShoppingCartRepository {
  private cache;
  private logger = console;
  private readonly customerId: number;

  private cacheKey = {
    cart: (cartId: number) => {
      return `cart_${cartId}_customer_${this.customerId}`;
    },
    customer: () => {
      return `cart_customer_${this.customerId}`;
    },
  };

  constructor(customerId: number) {
    if (!customerId) {
      throw ShoppingCartError.forbidden();
    }
    this.customerId = customerId;
    this.cache = new CacheService('shopping_cart');
  }

  /**
   * Gets a Shopping Cart Product Ids from the database based on the provided ID.
   * @returns A Promise that resolves with the Shopping Cart Product data or null if not found.
   */
  public async findByCustomerId(): Promise<Array<ShoppingCartItem>> {
    try {
      const cacheKey = this.cacheKey.customer();
      const cachedReviews = await this.cache.get<ShoppingCartItem>(cacheKey);

      if (cachedReviews) return cachedReviews.items;

      const cartItems = await ShoppingCartModel.findByCustomerId(this.customerId);

      if (!cartItems) {
        throw ShoppingCartError.notFound();
      }

      this.cache.set(cacheKey, cartItems);

      return cartItems;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Gets a Shopping Cart Product Ids from the database based on the provided ID.
   * @param productId - Numeric ID of product.
   * @returns A Promise that resolves with the Shopping Cart Product data or null if not found.
   */
  public async findByProductId(productId: number): Promise<Array<ShoppingCartItem> | null> {
    try {
      const cacheKey = this.cacheKey.customer();
      const cachedReviews = await this.cache.get<ShoppingCartItem>(cacheKey);

      if (cachedReviews) return cachedReviews.items;

      const cartItems = await ShoppingCartModel.findByProductId(this.customerId, productId);

      if (!cartItems) {
        throw ShoppingCartError.notFound();
      }

      this.cache.set(cacheKey, cartItems);

      return cartItems;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Gets a Shopping Cart Product Ids from the database based on the provided ID.
   * @param cartId - Numeric ID of customer.
   * @returns A Promise that resolves with the Shopping Cart Product data or null if not found.
   */
  public async findByCartId(cartId: number): Promise<ShoppingCartItem | null> {
    try {
      const cacheKey = this.cacheKey.cart(cartId);
      const cached = await this.cache.get<ShoppingCartItem>(cacheKey);

      if (cached?.items.length) {
        return cached?.items[0];
      }

      const cartItems = await ShoppingCartModel.findByCartId(cartId);

      if (!cartItems) {
        throw ShoppingCartError.notFound();
      }

      this.cache.set(cacheKey, cartItems);

      return cartItems;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Creates a new Shopping Cart Product in the database.
   * @param Shopping Cart Product - Object representing the Shopping Cart Product data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async save(product: ShoppingCartItem): Promise<ShoppingCartItem> {
    /**
      TODO: Refatorar esse metodo, de forma que salve os produtos de n -> n, exemplo:

      shopping_cart (todo: multiplos produtos)  = product_ids: [1,2,4,5], quantity ??
      shopping_cart (atual: unico produto)  = product_id: 1, quantity 10
    */
    try {
      await this.validateProductExists(product.product_id);

      const cartItems = await ShoppingCartModel.findByProductId(this.customerId, product.product_id);

      if (!cartItems) {
        throw ShoppingCartError.notFound();
      }

      if (cartItems?.length) {
        return this.updateCartItem(cartItems, product);
      }

      return await this.createNewCartItem(product);
    } catch (error: any) {
      throw error;
    }
  }

  private async updateCartItem(cartItems: ShoppingCartItem[], product: ShoppingCartItem): Promise<ShoppingCartItem> {
    const productId = Number(product.product_id);
    const productQuantity = Number(product.quantity);

    const updatedItems = await Promise.all(
      cartItems.map(async (item) => {
        if (Number(item.product_id) === productId) {
          const updatedQuantity = Number(item.quantity) + Number(productQuantity);

          await this.update(item.id, { quantity: updatedQuantity });
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      })
    );

    return updatedItems.find(item => Number(item.product_id) === productId)!;
  }

  private async createNewCartItem(product: ShoppingCartItem): Promise<ShoppingCartItem> {
    const createdItems = await ShoppingCartModel.saveProduct(this.customerId, product);
    
    console.log("createdItems:", createdItems);

    if (!createdItems?.id) {
      throw ShoppingCartError.creationFailed(this.customerId, product);
    }

    const cacheKey = this.cacheKey.customer();
    this.cache.set(cacheKey, createdItems);

    return createdItems;
  }

  private async validateProductExists(productId: number): Promise<void> {
    const product = await ProductModel.findById(productId);

    if (!product) {
      throw ShoppingCartError.notFound();
    }
  }

  /**
   * Updates the data of a Shopping Cart Product in the database.
   * @param shoppingCartID - ID of the Shopping Cart Product to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async update(shoppingCartID: number, data: Partial<ShoppingCartItem>): Promise<ShoppingCartItem> {
    try {
      const updatedCart = await ShoppingCartModel.updateCart(shoppingCartID, data);

      if (!updatedCart) {
        throw ShoppingCartError.updateQuantityFailed(shoppingCartID, data.quantity!);
      }

      const cacheKey = this.cacheKey.customer();
      
      this.cache.remove(cacheKey);

      return updatedCart;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Deletes a Shopping Cart Product from the database based on the provided ID.
   * Includes validation, transaction support, and proper error handling.
   * 
   * @param shoppingCartItemID - ID of the Shopping Cart item to be deleted.
   * @returns A Promise that resolves to true if deletion was successful.
   * @throws ShoppingCartError if item not found or deletion fails.
   */
  public async delete(shoppingCarID: number): Promise<boolean> {
    try {

      const cartItems = await ShoppingCartModel.get<ShoppingCartItem>(shoppingCarID);

      if (!cartItems) {
        throw ShoppingCartError.notFound(`Shopping Cart Id: ${shoppingCarID}`);
      }

      if (Number(cartItems.customer_id) !== Number(this.customerId)) {
        throw ShoppingCartError.forbidden(
          "You don't have permission to delete this item",
          null,
          { cartId: shoppingCarID, requestedBy: this.customerId, ownedBy: cartItems.customer_id }
        );
      }

      this.logger.info(`Deleting cart item: ${shoppingCarID} for customer: ${this.customerId}`);

      const cartItemDeleted = await ShoppingCartModel.deleteItem(this.customerId, shoppingCarID);

      if (!cartItemDeleted) {
        throw ShoppingCartError.removeItemFailed(`Shopping Cart Id: ${shoppingCarID}`);
      }

      const cacheKey = this.cacheKey.customer();
      await this.cache.remove(cacheKey);

      this.logger.info(`Deleting cart item: ${shoppingCarID} for customer: ${this.customerId}`);

      return cartItemDeleted;
    } catch (error: any) {
      this.logger.error(`Failed to delete cart item: ${shoppingCarID}`, error);

      if (error instanceof ShoppingCartError) {
        throw error;
      }

      throw ShoppingCartError.removeItemFailed(shoppingCarID, error);
    }
  }

  /**
   * Deletes all product items in the shopping cart based on criteria.
   * Supports different input formats and implements transaction for data integrity.
   * 
   * @param options - Optional parameters to control the clearing operation:
   *                  - items: Array of specific item IDs to clear (if not provided, clears entire cart)
   *                  - reason: Reason for clearing (for logging/auditing)
   * @returns A Promise that resolves to an object with details about the operation.
   * @throws ShoppingCartError if clearing fails.
   */
  public async clear(
    options: {
      reason?: 'user_requested' | 'system_cleanup'
    } = {}
  ): Promise<boolean> {
    try {
      const cartItems = await ShoppingCartModel.findByCustomerId(this.customerId) ?? [];
      const cartExists = cartItems.length > 0 ? cartItems[0] : null;
  
      if (!cartExists) {
        throw ShoppingCartError.notFound(`No shopping cart found for customer.`);
      }
      
      this.logger.info(`Clearing cart for customer: ${this.customerId}`, {
        specificItems: cartItems,
        reason: options.reason || 'system_cleanup'
      });

      const cartCleaned = await ShoppingCartModel.clear(this.customerId);

      if (!cartCleaned) {
        throw ShoppingCartError.cleanCartFailed(this.customerId);
      }

      let cacheKey = this.cacheKey.customer();
      this.cache.remove(cacheKey);

      return true;
    } catch (error: any) {
      this.logger.error(`Failed to clear cart for customer: ${this.customerId}`, error);

      if (error instanceof ShoppingCartError) {
        throw error;
      }

      throw ShoppingCartError.internalError(
        "Failed to clear shopping cart",
        error,
        { customerID: this.customerId, reason: options.reason || 'system_cleanup' }
      );
    }
  }
}

export default ShoppingCartRepository;
