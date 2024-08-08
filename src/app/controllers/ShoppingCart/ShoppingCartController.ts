import { Request, Response } from 'express';
import ShoppingCartRepository from 'repositories/ShoppingCartRepository';
import ProductRepository from 'repositories/ProductRepository';
import ShoppingCartError from 'builders/errors/ShoppingCartError';
import ResponseBuilder from 'builders/response/ResponseBuilder';
import Product, { ShoppingCartItem } from 'types/Product.type';
import schemaResponseError from 'validators/response/schemaResponseError';

class ShoppingCartController {
  static async getCartItems(req: Request, res: Response): Promise<void> {
    try {
      schemaResponseError(req, res);

      const { customer_id } = req.params as unknown as { customer_id: number };

      const shoppingCartIds: Array<{ product_id: number }> | null = await ShoppingCartRepository.get(customer_id);

      if (!shoppingCartIds) {
        throw ShoppingCartError.itemNotFound();
      }

      const arrayOfProducts: Array<number> = shoppingCartIds.map(item => item.product_id);
      
      const products: Product[] = await ProductRepository.getByIds(arrayOfProducts);

      if (!products) {
        throw ShoppingCartError.itemNotFound();
      }

      ResponseBuilder.send({
        response: res,
        message: "Shopping Cart Products retrieved successfully!",
        statusCode: 200,
        data: products
      });
    } catch (error: any) {
      ShoppingCartError.handleError(res, error);
    }
  }

  static async addToCart(req: Request, res: Response): Promise<void> {
    try {
      schemaResponseError(req, res);

      const { customer_id } = req.params as unknown as { customer_id: number };

      const fields: ShoppingCartItem = req.body;

      const productExist = await ShoppingCartRepository.search(
        ['customer_id ', 'product_id'],
        [customer_id, fields.product_id]
      );

      if (productExist) {
        throw ShoppingCartError.itemAlreadyExists();
      }
      
      await ShoppingCartRepository.create(customer_id, fields);

      ResponseBuilder.send({
        response: res,
        message: "Product saved to ShoppingCart successfully!",
        statusCode: 201
      });
    } catch (error: any) {
      ShoppingCartError.handleError(res, error);
    }
  }

  static async updateCartItemQuantity(req: Request, res: Response): Promise<void> {
    try {
      schemaResponseError(req, res);

      const { cart_id } = req.params as unknown as { cart_id: number };

      const { quantity } = req.body;

      await ShoppingCartRepository.update(cart_id, quantity);

      ResponseBuilder.send({
        response: res,
        message: "Product updated to ShoppingCart successfully!",
        statusCode: 201
      });
    } catch (error: any) {
      ShoppingCartError.handleError(res, error);
    }
  }

  static async removeCartItem(req: Request, res: Response): Promise<void> {
    try {
      schemaResponseError(req, res);
      
      const { customer_id, id } = req.params as unknown as { customer_id: number, id: number };

      await ShoppingCartRepository.delete(customer_id, id);

      ResponseBuilder.send({
        response: res,
        message: "Shopping Cart Product deleted successfully",
        statusCode: 200
      });
    } catch (error: any) {
      ShoppingCartError.handleError(res, error);
    }
  }

  static async cleanCart(req: Request, res: Response): Promise<void> {
    try {
      schemaResponseError(req, res);
            
      const { customer_id } = req.params as unknown as { customer_id: number };

      const result = await ShoppingCartRepository.clear(customer_id);

      if (!result) {
        throw ShoppingCartError.itemDeletionFailed();
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
