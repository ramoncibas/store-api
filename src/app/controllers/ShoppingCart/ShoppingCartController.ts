import { Request, Response } from 'express';
import ShoppingCartRepository from 'repositories/ShoppingCartRepository';
import ProductRepository from 'repositories/ProductRepository';
import ShoppingCartError from 'builders/errors/ShoppingCartError';
import ResponseBuilder from 'builders/response/ResponseBuilder';
import { Product, ShoppingCartItem } from 'types/Product.type';
import schemaResponseError from 'validators/response/schemaResponseError';
import StockService from '../../service/Stock/StockService';

// TODO: Criar um modulo especifico para validar:
// 1 - Se o produto existe
// 2 - Se está disponivel para compra (quantidade, tempo de disponibilidade do produto, etc...)

class ShoppingCartController {

  static async getCartItems(req: Request, res: Response): Promise<void> {
    schemaResponseError(req, res);

    try {
      const { customer_id } = req.params as unknown as { customer_id: number };

      const shoppingCartItems: Array<ShoppingCartItem> = await ShoppingCartRepository.findByCustomerId(customer_id);

      if (!shoppingCartItems || shoppingCartItems.length === 0) {
        throw ShoppingCartError.itemNotFound();
      }
    
      const productIds = shoppingCartItems.map(item => item.product_id);
      const products = await ProductRepository.findByIds(productIds);

      const cartWithProducts = shoppingCartItems.map(item => ({
        ...products.find(p => p.id === item.product_id),
        quantity: item.quantity
      }));

      if (!products) {
        throw ShoppingCartError.itemNotFound();
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

  static async addToCart(req: Request, res: Response): Promise<void> {
    schemaResponseError(req, res);

    try {
      const { customer_id } = req.params as unknown as { customer_id: number };
      const fields: ShoppingCartItem = req.body;

      const productExistInCart = await ShoppingCartRepository.findByProductId(customer_id, fields.product_id);

      const currentQuantity = productExistInCart?.[0]?.quantity ?? 0;
      const totalQuantity = currentQuantity + Number(fields.quantity);

      const stockAvailable = await StockService.validateAvailability(fields.product_id, totalQuantity);
      
      if (!stockAvailable || stockAvailable?.error) {
        throw stockAvailable.error;
      };

      const response = await ShoppingCartRepository.save(customer_id, fields);

      if (!response) {
        throw ShoppingCartError.itemCreationFailed();
      }

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
    schemaResponseError(req, res);
    
    try {
      const cart_id = Number(req.params.cart_id);
      const { customer_id, product_id, quantity } = req.body as ShoppingCartItem;
      
      const areAllNumbers = [
        cart_id,
        customer_id,
        product_id,
        quantity
      ].every(value => !isNaN(Number(value)));

      if (!areAllNumbers) {
        throw ShoppingCartError.invalidInput();
      }

      const cartItem = await ShoppingCartRepository.findByCartId(cart_id);
      
      if (!cartItem) {
        throw ShoppingCartError.itemNotFound();
      }

      // If the provided quantity is the same as in the database, avoid unnecessary update
      if (Number(cartItem.quantity) === quantity) {
        return ResponseBuilder.send({
          response: res,
          message: "No changes made, quantity remains the same.",
          statusCode: 200,
        });
      }

      const stockAvailable = await StockService.validateAvailability(product_id, quantity);

      if (!stockAvailable || stockAvailable?.error) {
        throw stockAvailable.error;
      };

      const productUpdated = await ShoppingCartRepository.update(customer_id, cart_id, { quantity });

      if (!productUpdated) {
        throw ShoppingCartError.itemUpdateFailed();
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
  static async removeCartItem(req: Request, res: Response): Promise<void> {
    schemaResponseError(req, res);
    
    try {
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

  // TODO: Arrumar esse metodo, ele não está limpando todos o produtos adicionados no cart do cliente
  static async cleanCart(req: Request, res: Response): Promise<void> {
    schemaResponseError(req, res);
    
    try {
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
