import { Request, Response } from 'express';
import ShoppingCartRepository from 'repositories/ShoppingCartRepository';
import ProductRepository from 'repositories/ProductRepository';
import StockService from 'services/Stock/StockService';
import Parser from 'utils/parser';
import { ShoppingCartError } from 'builders/errors';
import { ResponseBuilder } from 'builders/response';
import schemaResponseError from 'validators/response/schemaResponseError';
import { ShoppingCartItem } from '@types';

class ShoppingCartController {
  
  static async getCart(req: Request, res: Response): Promise<void> {
    try {
      schemaResponseError(req, res);

      const { customer_id } = req.params as unknown as { customer_id: number };
      const cartRepository = new ShoppingCartRepository(customer_id);

      const shoppingCartItems: Array<ShoppingCartItem> = await cartRepository.findByCustomerId();

      if (!shoppingCartItems || shoppingCartItems.length === 0) {
        throw ShoppingCartError.cartEmpty();
      }
    
      const productIds = shoppingCartItems.map(item => item.product_id);
      const products = await ProductRepository.findByIds(productIds);

      const cartWithProducts = shoppingCartItems.map(item => ({
        ...products.find(p => p.id === item.product_id),
        quantity: item.quantity
      }));

      if (!products) {
        throw ShoppingCartError.notFound();
      }

      ResponseBuilder.send({
        response: res,
        message: "Shopping Cart Products retrieved successfully!",
        statusCode: 200,
        data: cartWithProducts
      });
    } catch (error: any) {
      ShoppingCartError.handleError(res, error);
    }
  }

  static async addProduct(req: Request, res: Response): Promise<void> {
    try {
      schemaResponseError(req, res);

      const customerId = Parser.toNumber(req.params.customer_id);
      const productId = Parser.toNumber(req.body.product_id);
      const quantity = Parser.toNumber(req.body.quantity);

      if (!customerId) {
        throw ShoppingCartError.badRequest("Customer ID is required");
      }

      const cartRepository = new ShoppingCartRepository(customerId);
      const cartProduct: Array<ShoppingCartItem> = await cartRepository.findByCustomerId();

      const cartItem = cartProduct.find(cart => Number(cart.product_id) === productId);
      const cartQuantity = cartItem ? cartItem.quantity : 0;

      const totalQuantity = Number(cartQuantity) + quantity;

      const stockAvailable = await StockService.validateAvailability(productId, totalQuantity);
      
      if (!stockAvailable) {
        throw ShoppingCartError.itemOutOfStock(productId, stockAvailable);
      };

      const savedItem = await cartRepository.save(req.body);

      if (!savedItem) {
        throw ShoppingCartError.creationFailed(customerId, req.body);
      }

      ResponseBuilder.send({
        response: res,
        message: "Product saved to ShoppingCart successfully!",
        statusCode: 201,
        data: savedItem
      });
    } catch (error: any) {
      ShoppingCartError.handleError(res, error);
    }
  }

  static async updateQuantity(req: Request, res: Response): Promise<void> {    
    try {
      schemaResponseError(req, res);

      const cartId = Parser.toNumber(req.params.cart_id);
      const quantity = Parser.toNumber(req.body.quantity);
      const productId = Parser.toNumber(req.body.product_id);
      const customerId = Parser.toNumber(req.body.customer_id);

      if (!customerId) {
        throw ShoppingCartError.badRequest("Customer ID is required");
      }

      const cartRepository = new ShoppingCartRepository(customerId);
      const cartItem: ShoppingCartItem | null = await cartRepository.findByCartId(cartId);
      
      if (!cartItem) {
        throw ShoppingCartError.notFound();
      }

      // If the provided quantity is the same as in the database, avoid unnecessary update
      if (Number(cartItem.quantity) === Number(quantity)) {
        return ResponseBuilder.send({
          response: res,
          message: "No changes made, quantity remains the same.",
          statusCode: 200,
        });
      }

      const stockAvailable = await StockService.validateAvailability(productId, quantity);

      if (!stockAvailable) {
        throw ShoppingCartError.itemOutOfStock(productId, stockAvailable);
      };

      const productUpdated = await cartRepository.update(cartId, { quantity });

      if (!productUpdated) {
        throw ShoppingCartError.updateQuantityFailed(productId, quantity);
      }

      ResponseBuilder.send({
        response: res,
        message: "Product quantity updated in ShoppingCart successfully!",
        statusCode: 200,
        data: productUpdated
      });
    } catch (error: any) {
      ShoppingCartError.handleError(res, error);
    }
  }

  // TODO: Arrumar a rota desse metodo, está confusa ex:
  // cart/:customer_id/remove/item/:cart_id
  static async remove(req: Request, res: Response): Promise<void> {
    try {
      schemaResponseError(req, res);

      const cartId = Parser.toNumber(req.params.cart_id);
      const customerId = Parser.toNumber(String(req?.user?.id ?? ''));

      if (!customerId || !cartId) {
        throw ShoppingCartError.badRequest("Customer ID is required");
      }

      const cartRepository = new ShoppingCartRepository(customerId);
      const cartItem: ShoppingCartItem | null = await cartRepository.findByCartId(cartId);

      if (!cartItem) {
        throw ShoppingCartError.notFound();
      }

      const removedItem = await cartRepository.delete(cartId);

      if (!removedItem) {
        throw ShoppingCartError.removeItemFailed(cartId);
      }

      ResponseBuilder.send({
        response: res,
        message: "Shopping Cart Product deleted successfully",
        statusCode: 200
      });
    } catch (error: any) {
      ShoppingCartError.handleError(res, error);
    }
  }

  static async clear(req: Request, res: Response): Promise<void> {    
    try {
      schemaResponseError(req, res);
      const customerId = Parser.toNumber(req.params.customer_id);

      if(!customerId) {
        throw ShoppingCartError.badRequest("Customer ID is required");
      }
      const { options } = req.body;
      const cartRepository = new ShoppingCartRepository(customerId);
      const cartCleared: boolean = await cartRepository.clear(options);

      if (!cartCleared) {
        throw ShoppingCartError.removeItemFailed(customerId);
      }

      ResponseBuilder.send({
        response: res,
        message: "Shopping Cart Product deleted successfully",
        statusCode: 200
      });
    } catch (error: any) {
      ShoppingCartError.handleError(res, error);
    }
  }
}

export default ShoppingCartController;
