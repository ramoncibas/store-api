import ProductRepository from 'repositories/ProductRepository';
import { StockError } from 'builders/errors';

interface StockResponse {
  data?: any;
  success: boolean;
  error?: StockError;
}

class StockService {
  /**
   * Returns the available quantity of a product in stock.
   * @param productId - ID of the product.
   * @returns The available quantity of the product in stock.
   * @throws ShoppingCartError if the product is not found.
   */
  public static async getProductQuantity(productId: number): Promise<number> {

    /*
    
    TODO: Criar um repository para o estoque, onde ele deverá coletar informações do tabela stock, e nesse service realizar as devidas operações: 

    const product = await StockRepository.findById(productId);

    */
   
    const product = await ProductRepository.findById(productId);

    if (!product) {
      throw StockError.productNotFound();
    }

    const quantity = Number(product.quantity_available);

    return quantity;
  }

  /**
   * Returns `true` if the product is available in stock.
   * @param productId - ID of the product.
   * @returns `true` if the product is available in stock, otherwise `false`.
   */
  public static async isProductInStock(productId: number): Promise<boolean> {
    const productQuantity = await this.getProductQuantity(productId);

    return productQuantity > 0;
  }

  /**
   * Validates if there is enough stock for a product.
   * @param productId - ID of the product.
   * @param requestedQuantity - Requested quantity.
   * @throws ShoppingCartError if the requested quantity exceeds the available stock.
   */
  public static async validateAvailability(productId: number, requestedQuantity: number): Promise<number> {
    const isProductInStock = await this.isProductInStock(productId);

    if (!isProductInStock) {
      throw StockError.productNotFound();
    }

    const stockQuantity = await this.getProductQuantity(productId);

    if (!stockQuantity || stockQuantity <= 0) {
      throw StockError.productNotFound();
    }

    if (requestedQuantity > stockQuantity) {
      throw StockError.insufficientStock();
    }

    return stockQuantity;
  }

  /**
   * Temporarily reserves the stock of a product (useful for checkout).
   * @param productId - ID of the product.
   * @param quantity - Quantity to be reserved.
   * @throws ShoppingCartError if the requested quantity exceeds the available stock.
   */
  public static async reserveStock(productId: number, quantity: number): Promise<any> {
    const availableStock = await this.validateAvailability(productId, quantity);

    if (!availableStock) {
      throw StockError.productNotFound(); 
    }

    const newStockQuantity = Number(availableStock) - Number(quantity);

    const stockUpdated = await ProductRepository.updateStock(productId, newStockQuantity);

    return stockUpdated;
  }

  /**
   * Releases a stock reservation (e.g., order canceled).
   * @param productId - ID of the product.
   * @param quantity - Quantity to be released.
   */
  public static async releaseStock(productId: number, quantity: number): Promise<any> {
    const availableStock = await this.validateAvailability(productId, quantity);

    if (!availableStock) {
      throw StockError.productNotFound(); 
    }

    const newStockQuantity = Number(availableStock) - Number(quantity);

    const stockUpdated = await ProductRepository.updateStock(productId, newStockQuantity);

    return stockUpdated;
  }

  /**
   * Permanently removes the quantity from stock after a completed purchase.
   * @param productId - ID of the product.
   * @param quantity - Quantity to be deducted.
   * @throws ShoppingCartError if the requested quantity exceeds the available stock.
   */
  public static async deductStock(productId: number, quantity: number): Promise<any> {
    const availableStock = await this.validateAvailability(productId, quantity);

    if (!availableStock) {
      throw StockError.productNotFound(); 
    }

    const newStockQuantity = Number(availableStock) - Number(quantity);

    const stockUpdated = await ProductRepository.updateStock(productId, newStockQuantity);

    return stockUpdated;
  }

}

export default StockService;