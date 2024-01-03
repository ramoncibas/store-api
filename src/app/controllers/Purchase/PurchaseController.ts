import { Request, Response } from 'express';
import PurchaseRepository from 'repositories/PurchaseRepository';
import ShoppingCartRepository from 'repositories/ShoppingCartRepository';
import ProductRepository from 'repositories/ProductRepository';

import ProductHelper from 'helpers/ProductHelper';

import Product, { ShoppingCartItem } from 'types/Product.type';
import UserError from 'errors/UserError';
import PurchaseError from 'errors/PurchaseError';

class PurchaseController {

  // Validar a necessidade de implementar uma arquitetura somente para o estoque
  static async updateStock(shoppingCartItems: ShoppingCartItem[], productList: Partial<Product>[]): Promise<void> {
    try {
      await Promise.all(
        shoppingCartItems.map(async ({ id: cartId, quantity }: ShoppingCartItem) => {
          const product = productList.find(product => product.id === cartId);

          if (!product || typeof product.quantity_available !== 'number') {
            throw new UserError(`Product with ID ${cartId} not found or invalid stock information`);
          }

          if (product.quantity_available < quantity) {
            throw new UserError(`Insufficient stock for product ${product.name}`);
          }

          const updatedProduct: Partial<Product> = {
            id: cartId,
            quantity_available: product.quantity_available - quantity,
          };

          await ProductRepository.update(cartId, updatedProduct);
          await ShoppingCartRepository.delete(cartId);
        })
      );
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  static async buyProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id: customerID } = req.params;
      const numericCustomerID: number = parseInt(customerID, 10);

      if (isNaN(numericCustomerID)) {
        res.status(400).send("Invalid customerID provided");
        return;
      }

      const shoppingCartItems: ShoppingCartItem[] | null = await ShoppingCartRepository.getAll(numericCustomerID);

      if (!shoppingCartItems || shoppingCartItems?.length === 0) {
        res.status(400).send("Shopping cart is empty");
        return;
      }

      const shoppingCartIds: number[] = shoppingCartItems.map(obj => {
        const idAsNumber = Number(obj.id);
        if (isNaN(idAsNumber)) {
          throw new Error(`Invalid id value for shopping cart item: ${obj.id}`);
        }
        return idAsNumber;
      });

      const products: Product[] | null = await ProductRepository.getByIds(shoppingCartIds);

      if (!Array.isArray(products) || products.length === 0) {
        res.status(400).send("No products found for the given shopping cart items");
        return;
      }

      const totalAmount = ProductHelper.calculateTotalAmount(shoppingCartItems, products);

      const purchaseId = await PurchaseRepository.create({
        customer_id: numericCustomerID,
        total_amount: totalAmount
      });

      if(purchaseId) {
        const paymentSuccessful = await ProductHelper.processPayment(customerID, totalAmount);

        if (!paymentSuccessful) {
          res.status(500).send("Payment processing failed");
          return;
        }
      }

      await this.updateStock(shoppingCartItems, products);

      res.status(200).send("Purchase successful");
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong during purchase");
    }
  }

  static async getPurchase(req: Request, res: Response): Promise<void> {
    try {
      const { purchaseId } = req.params;
      const numericPurchaseId: number = parseInt(purchaseId, 10);

      if (isNaN(numericPurchaseId)) {
        res.status(400).send("Invalid purchaseId provided");
        return;
      }

      const purchase = await PurchaseRepository.get(numericPurchaseId);

      if (!purchase) {
        res.status(404).send("Purchase not found");
        return;
      }

      res.send(purchase);
    } catch (error: any) {
      console.error('Error retrieving purchase:', error);
      res.status(500).send("Internal Server Error");
      throw new PurchaseError('Error retrieving purchase', error);
    }
  }

  static async getPurchases(req: Request, res: Response): Promise<void> {
    try {
      const { id: customerID } = req.params;
      const numericCustomerID: number = parseInt(customerID, 10);
  
      if (isNaN(numericCustomerID)) {
        res.status(400).send("Invalid customerID provided");
        return;
      }

      const purchases = await PurchaseRepository.getAll(customerID);

      res.send(purchases);
    } catch (error: any) {
      console.error('Error retrieving purchases:', error);
      res.status(500).send("Internal Server Error");
      throw new PurchaseError('Error retrieving purchases', error);
    }
  }
}

export default PurchaseController;
