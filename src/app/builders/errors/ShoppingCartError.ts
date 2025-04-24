import { AppError } from "builders/errors";
import { ShoppingCartItem } from "@types";

export class ShoppingCartError extends AppError {

  constructor(
    message: string,
    errorCode: number = 500,
    error?: any,
    data?: Record<string, any>
  ) {
    super(message, errorCode, error, data);
  }

  static alreadyExists(): ShoppingCartError {
    return new ShoppingCartError("Product already exists on Shopping Cart!", 409);
  }

  static creationFailed(customerId: number, product: ShoppingCartItem): ShoppingCartError {
    return new ShoppingCartError(
      `Failed to create shopping cart item for customer ID ${customerId}. Product: ${product}.`,
      500
    );
  }

  static itemOutOfStock(itemId: number, availableQuantity: number): ShoppingCartError {
    return new ShoppingCartError(
      `Item with ID ${itemId} is out of stock or has insufficient quantity. Available quantity: ${availableQuantity}`,
      400,
    );
  }

  static cartEmpty(): ShoppingCartError {
    return new ShoppingCartError("Shopping cart is empty", 400);
  }

  static addItemFailed(itemId: number, error?: any): ShoppingCartError {
    return new ShoppingCartError(
      `Failed to add item ${itemId} to cart`,
      500,
      error,
    );
  }

  static removeItemFailed(itemId: any, error?: any): ShoppingCartError {
    return new ShoppingCartError(
      `Failed to remove item(s) ${itemId} from cart`,
      500,
      error,
    );
  }

  static cleanCartFailed(customerId: number, error?: any): ShoppingCartError {
    return new ShoppingCartError(
      `Failed to clean cart for customer ID ${customerId}`,
      500,
      error,
    );
  }

  static updateQuantityFailed(itemId: number, quantity: number, error?: any): ShoppingCartError {
    return new ShoppingCartError(
      `Unable to update the quantity for item with ID ${itemId}. Requested quantity: ${quantity}. Please try again later.`,
      500,
      error,
    );
  }

}

export default ShoppingCartError;
