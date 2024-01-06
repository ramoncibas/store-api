import { Request, Response } from 'express';
import ShoppingCartRepository from 'repositories/ShoppingCartRepository';
import ProductRepository from 'repositories/ProductRepository';
import ShoppingCartError from 'errors/ShoppingCartError';
import Product, { ShoppingCartItem } from 'types/Product.type';

class ShoppingCartController {
  
  static async getShoppingCartProducts(req: Request, res: Response): Promise<void> {
    try {
      const { id: customerID } = req.params;
      const numericCustomerID: number = parseInt(customerID, 10);
  
      if (isNaN(numericCustomerID)) {
        res.status(400).send("Invalid customerID provided");
        return;
      }
  
      const shoppingCartIds: Array<number> | null = await ShoppingCartRepository.get(numericCustomerID);

      if (shoppingCartIds === null) {
        res.status(404).send("No products were found in the shopping cart for the specified customerID.");
        return;
      }

      const products: Product[] = await ProductRepository.getByIds(shoppingCartIds);

      if (products === null) {
        res.status(404).send("No products found for the specified customerID");
        return;
      }
  
      res.send(products);
    } catch (error: any) {
      console.error('Error retrieving all ShoppingCartProducts:', error);
      res.status(500).send("Internal Server Error");
      throw new ShoppingCartError('Error retrieving all ShoppingCartProducts', error);
    }
  }

  static async createShoppingCartProduct(req: Request, res: Response): Promise<void> {
    try {
      const fields: ShoppingCartItem = req.body;

      await ShoppingCartRepository.create(fields);

      res.status(201).send("Product saved to ShoppingCart successfully!");
    } catch (error: any) {
      console.error('Error saving product to ShoppingCart:', error);
      res.status(500).send("Internal Server Error");
      throw new ShoppingCartError('Error saving product to ShoppingCart', error);
    }
  }

  static async updateShoppingCartProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id, quantity }: Partial<ShoppingCartItem> = req.body;

      if (id === undefined || quantity === undefined || quantity === 1) {
        res.status(400).send("ID and quantity must be provided and quantity must be greater than 1!");
        return;
      }

      await ShoppingCartRepository.update(id, quantity);

      res.status(201).send("Product updated to ShoppingCart successfully!");
    } catch (error: any) {
      console.error('Error updating product to ShoppingCart:', error);
      res.status(500).send("Internal Server Error");
      throw new ShoppingCartError('Error updating product to ShoppingCart', error);
    }
  }

  static async deleteShoppingCartItem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.body;

      await ShoppingCartRepository.delete(id);

      res.send("ShoppingCartProduct deleted successfully");
    } catch (error: any) {
      console.error('Error deleting ShoppingCartProduct:', error);
      res.status(500).send("Internal Server Error");
      throw new ShoppingCartError('Error deleting ShoppingCartProduct', error);
    }
  }
}

export default ShoppingCartController;
