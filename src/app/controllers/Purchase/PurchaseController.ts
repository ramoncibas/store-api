import { Request, Response } from 'express';
import PurchaseRepository from 'repositories/PurchaseRepository';
import ShoppingCartRepository from 'repositories/ShoppingCartRepository';
import ProductRepository from 'repositories/ProductRepository';

import ProductHelper from 'helpers/ProductHelper';

import { Product, ShoppingCartItem } from 'types/Product.type';
import UserError from 'builders/errors/UserError';
import PurchaseError from 'builders/errors/PurchaseError';
import ResponseBuilder from 'builders/response/ResponseBuilder';
import ShoppingCartError from 'builders/errors/ShoppingCartError';

class PurchaseController {
  // Validar a necessidade de implementar uma arquitetura somente para o estoque
  // Implementar uma classe separada para esse metodo, ela será utilizada aqui, e quando um admin inserir um novo produto por exemplo
  static async updateStock(
    customerID: number,
    shoppingCartItems: ShoppingCartItem[],
    productList: Partial<Product>[]
  ): Promise<any> {
    try {
      return await Promise.all(
        shoppingCartItems.map(async ({ product_id, quantity }: ShoppingCartItem) => {
          const product = productList.find(product => product.id === product_id);

          if (!product || typeof product.quantity_available !== 'number') {
            throw new UserError(`Product with ID ${product_id} not found or invalid stock information`);
          }

          if (product.quantity_available < quantity) {
            throw new UserError(`Insufficient stock for product ${product.name}`);
          }

          const updatedProduct: Partial<Product> = {
            id: product_id,
            quantity_available: (product.quantity_available - quantity),
          };

          await ProductRepository.update(product_id, updatedProduct);
          await ShoppingCartRepository.delete(customerID, product_id);
        })
      );
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  // Botão de "Comprar Produtos" na interface do cliente
  static async buyProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id: customerID } = req.params;
      const numericCustomerID: number = parseInt(customerID, 10);

      if (isNaN(numericCustomerID)) {
        throw UserError.invalidInput();
      }

      // Busco os produtos que estão no carrinho de compras
      const shoppingCartItems: Array<ShoppingCartItem> | null = await ShoppingCartRepository.findByCustomerId(numericCustomerID);

      if (!shoppingCartItems || shoppingCartItems?.length === 0) {
        throw ShoppingCartError.isEmpty();
      }

      // Retorna apenas os IDs dos produtos que estão no carrinho de compras
      const productCartIds: Array<number> = shoppingCartItems.map(obj => {
        const idAsNumber = Number(obj.product_id);
        if (isNaN(idAsNumber)) {
          throw ShoppingCartError.invalidValue(obj.product_id);
        }
        return idAsNumber;
      });

      // TODO: Melhorar a logica de compra e produtos, validar se o produto ainda existe, se o estoque é suficiente, etc
      const products: Array<Product> | null = await ProductRepository.findByAmount(productCartIds);

      if (!Array.isArray(products) || products.length === 0) {
        throw ShoppingCartError.itemNotFound();
      }

      const totalAmount = ProductHelper.calculateTotalAmount(shoppingCartItems, products);

      const purchaseId = await PurchaseRepository.create({
        customer_id: numericCustomerID,
        total_amount: totalAmount
      });

      if (purchaseId) {
        const paymentSuccessful = await ProductHelper.processPayment(customerID, totalAmount);

        if (!paymentSuccessful) {
          throw PurchaseError.default();
        }
      }

      await this.updateStock(numericCustomerID, shoppingCartItems, products);

      ResponseBuilder.send({
        response: res,
        message: "Purchase created successfully!",
        statusCode: 201
      });
    } catch (error: any) {
      ShoppingCartError.handleError(res, error);
    }
  }

  static async getPurchase(req: Request, res: Response): Promise<void> {
    try {
      const { purchaseId } = req.params;
      const numericPurchaseId: number = parseInt(purchaseId, 10);

      if (isNaN(numericPurchaseId)) {
        throw PurchaseError.invalidInput();
      }

      const purchase = await PurchaseRepository.get(numericPurchaseId);

      if (!purchase) {
        throw PurchaseError.notFound();
      }

      ResponseBuilder.send({
        response: res,
        message: "Purchase retrieved successfully!",
        statusCode: 200,
        data: purchase
      });
    } catch (error: any) {
      PurchaseError.handleError(res, error);
    }
  }

  static async getPurchases(req: Request, res: Response): Promise<void> {
    try {
      const { id: customerID } = req.params;
      const numericCustomerID: number = parseInt(customerID, 10);

      if (isNaN(numericCustomerID)) {
        throw PurchaseError.invalidInput();
      }

      const purchases = await PurchaseRepository.getAll(customerID);

      if (!purchases) {
        throw PurchaseError.notFound();
      }

      ResponseBuilder.send({
        response: res,
        message: "Purchases retrieved successfully!",
        statusCode: 200,
        data: purchases
      });
    } catch (error: any) {
      PurchaseError.handleError(res, error);
    }
  }
}

export default PurchaseController;
