import ProductRepository from 'repositories/ProductRepository';
import ShoppingCartError from 'builders/errors/ShoppingCartError';
import StockError from 'builders/errors/StockError';

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
  public static async getProductStock(productId: number): Promise<StockResponse> {

    /*
    
    TODO: Criar um repository para o estoque, onde ele deverá coletar informações do tabela stock, e nesse service realizar as devidas operações: 

    const product = await StockRepository.findById(productId);

    */
   
    const product = await ProductRepository.findById(productId);

    if (!product) {
      return { success: false, error: StockError.productNotFound() };
    }

    return { success: true, data: Number(product.quantity_available) };
  }

  /**
   * Returns `true` if the product is available in stock.
   * @param productId - ID of the product.
   * @returns `true` if the product is available in stock, otherwise `false`.
   */
  public static async isProductInStock(productId: number): Promise<StockResponse> {
    const product = await this.getProductStock(productId);

    if (!product || product.error || product.data <= 0) {
      return { success: false, error: StockError.productNotFound() };
    }

    return { success: true, data: product?.data };
  }

  /**
 * Validates if there is enough stock for a product.
 * @param productId - ID of the product.
 * @param requestedQuantity - Requested quantity.
 * @throws ShoppingCartError if the requested quantity exceeds the available stock.
 */
  public static async validateAvailability(productId: number, requestedQuantity: number): Promise<StockResponse> {
    const productQuantity = await this.isProductInStock(productId);

    if (productQuantity?.error) return productQuantity;

    const isAvailableStock: boolean = productQuantity?.data && (requestedQuantity > productQuantity?.data);

    if (!isAvailableStock) {
      return { success: false, error: StockError.insufficientStock() };
    }

    return { success: true, data: productQuantity?.data };
  }

  /**
   * Temporarily reserves the stock of a product (useful for checkout).
   * @param productId - ID of the product.
   * @param quantity - Quantity to be reserved.
   * @throws ShoppingCartError if the requested quantity exceeds the available stock.
   */
  public static async reserveStock(productId: number, quantity: number): Promise<StockResponse> {
    const availableStock = await this.validateAvailability(productId, quantity);

    if (availableStock?.error) return availableStock;

    const newStockQuantity = availableStock.data - quantity;

    await ProductRepository.updateStock(productId, newStockQuantity);

    return { success: true };
  }

  /**
   * Releases a stock reservation (e.g., order canceled).
   * @param productId - ID of the product.
   * @param quantity - Quantity to be released.
   */
  public static async releaseStock(productId: number, quantity: number): Promise<StockResponse> {
    const availableStock = await this.validateAvailability(productId, quantity);

    if (availableStock?.error) return availableStock;

    const newStockQuantity = availableStock.data - quantity;

    await ProductRepository.updateStock(productId, newStockQuantity);

    return { success: true };
  }

  /**
   * Permanently removes the quantity from stock after a completed purchase.
   * @param productId - ID of the product.
   * @param quantity - Quantity to be deducted.
   * @throws ShoppingCartError if the requested quantity exceeds the available stock.
   */
  public static async deductStock(productId: number, quantity: number): Promise<StockResponse> {
    const availableStock = await this.validateAvailability(productId, quantity);

    if (availableStock?.error) return availableStock;

    const newStockQuantity = availableStock.data - quantity;

    await ProductRepository.updateStock(productId, newStockQuantity);

    return { success: true };
  }

}

export default StockService;