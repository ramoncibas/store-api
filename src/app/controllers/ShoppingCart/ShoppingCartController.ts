import { Request, Response } from 'express';
import ShoppingCartRepository from 'repositories/ShoppingCartRepository';
import ProductRepository from 'repositories/ProductRepository';
import StockService from 'services/Stock/StockService';
import Parser from 'utils/parser';
import { ShoppingCartError } from 'builders/errors';
import { ResponseBuilder } from 'builders/response';
import { Quantity, ShoppingCartItem } from '@types';

class ShoppingCartController {
  static async get(req: Request, res: Response): Promise<void> {
    try {
      const customerId = req.user!.id;
      const cartRepository = new ShoppingCartRepository(customerId);

      const shoppingCartItems = await cartRepository.findByCustomerId();

      if (!shoppingCartItems) {
        throw ShoppingCartError.cartEmpty();
      }

      ResponseBuilder.send({
        response: res,
        message: "Shopping Cart Products retrieved successfully!",
        statusCode: 200,
        data: shoppingCartItems
      });
    } catch (error: any) {
      ShoppingCartError.handleError(res, error);
    }
  }

  static async add(req: Request, res: Response): Promise<void> {
    try {
      const customerId = req.user!.id;
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

      await StockService.validateAvailability(productId, totalQuantity);

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
      const customerId = req.user!.id;
      const cartId = Parser.toNumber(req.params.id);
      const quantity = Parser.toNumber(req.body.quantity);
      const productId = Parser.toNumber(req.body.product_id);

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

      await StockService.validateAvailability(productId, quantity);

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

  static async remove(req: Request, res: Response): Promise<void> {
    try {
      const customerId = req.user!.id;
      const cartId = Parser.toNumber(req.params.id);

      if (!cartId) {
        throw ShoppingCartError.badRequest("Cart Id is required");
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
      const customerId = req.user!.id;
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