import { Request, Response } from 'express';
import ShoppingCartRepository from 'repositories/ShoppingCartRepository';
import ProductRepository from 'repositories/ProductRepository';
import ShoppingCartError from 'builders/errors/ShoppingCartError';
import ResponseBuilder from 'builders/response/ResponseBuilder';
import Product, { ShoppingCartItem } from 'types/Product.type';

class ShoppingCartController {
  private static handleCartError(res: Response, error: any) {
    if (error instanceof ShoppingCartError) {
      res.status(error.getErrorCode()).json(error.toResponseObject());
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log(error)
  }

  static async getShoppingCartProducts(req: Request, res: Response): Promise<void> {
    try {
      const { id: customerID } = req.params;
      const numericCustomerID: number = parseInt(customerID, 10);

      if (isNaN(numericCustomerID)) {
        throw ShoppingCartError.invalidInput();
      }

      const shoppingCartIds: Array<number> | null = await ShoppingCartRepository.get(numericCustomerID);

      if (shoppingCartIds === null) {
        throw ShoppingCartError.itemNotFound();
      }

      const products: Product[] = await ProductRepository.getByIds(shoppingCartIds);

      if (products === null) {
        throw ShoppingCartError.itemNotFound();
      }

      return ResponseBuilder.send({
        response: res,
        message: "Shopping Cart Products retrieved successfully!",
        statusCode: 200,
        data: products
      });
    } catch (error: any) {
      this.handleCartError(res, error);
    }
  }

  static async createShoppingCartProduct(req: Request, res: Response): Promise<void> {
    try {
      const fields: ShoppingCartItem = req.body;

      await ShoppingCartRepository.create(fields);

      return ResponseBuilder.send({
        response: res,
        message: "Product saved to ShoppingCart successfully!",
        statusCode: 201
      });
    } catch (error: any) {
      this.handleCartError(res, error);
    }
  }

  static async updateShoppingCartProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id, quantity }: Partial<ShoppingCartItem> = req.body;

      if (id === undefined || quantity === undefined || quantity === 1) {
        throw new ShoppingCartError(
          "ID and quantity must be provided and quantity must be greater than 1!",
          undefined,
          400
        );
      }

      await ShoppingCartRepository.update(id, quantity);

      return ResponseBuilder.send({
        response: res,
        message: "Product updated to ShoppingCart successfully!",
        statusCode: 201
      });
    } catch (error: any) {
      this.handleCartError(res, error);
    }
  }

  static async deleteShoppingCartItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.body;

      await ShoppingCartRepository.delete(id);

      return ResponseBuilder.send({
        response: res,
        message: "Shopping Cart Product deleted successfully",
        statusCode: 200
      });
    } catch (error: any) {
      this.handleCartError(res, error);
    }
  }
}

export default ShoppingCartController;
