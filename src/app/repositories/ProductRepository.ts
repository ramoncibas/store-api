import ProductModel from "models/ProductModel";
import ProductError from "builders/errors/ProductError";
import { Product } from "types/Product.type";

class ProductRepository {

  
  /**
   * Get a product from the database based on its ID.
   * @param id - ID of the product to be retrieved.
   * @returns A Promise that resolves with the product data or null if not found.
   */
  static async findById(productId: number | string): Promise<Product | null> {
    try {
      return await ProductModel.findById(productId);
    } catch (error: any) {
      throw new ProductError(`Error getting product by ID ${productId}: ${error.message}`);
    }
  }

  /**
   * Get products from the database based on an array of product IDs.
   * @param productIds - Array of product IDs to retrieve from the database.
   * @returns A Promise that resolves with an array of products matching the provided IDs.
   */
  static async findByIds(productIds: Array<number | string>): Promise<Product[]> {
    try {
      const products = await ProductModel.findByIds(productIds) as Product[] | null;

      return products || [];
    } catch (error: any) {
      throw new ProductError(`Error getting all products: ${error.message}`);
    }
  }

  /**
   * Get all products from the database.
   * @returns A Promise that resolves with an array of products.
   */
  static async findAll(): Promise<Product[]> {
    try {
      return await ProductModel.findAll();
    } catch (error: any) {
      throw new ProductError(`Error getting all products: ${error.message}`);
    }
  }

  /**
   * Get all aspects of products from the database.
   * @returns A Promise that resolves with an array of product aspects.
   */
  static async findByAspects(): Promise<any> {

    // Refatorar esse metodo!!!

    try {
      return await ProductModel.findByAspects();
    } catch (error: any) {
      throw new ProductError(`Error getting all aspects: ${error.message}`);
    }
  }

  /**
   * Get products "quantity available" from the database based on an array of product IDs.
   * @param productsIds - Array of product IDs to retrieve from the database.
   * @returns A Promise that resolves with an array of products matching the provided IDs.
   */
  static async findByAmount(productsIds: Array<number | string>): Promise<Product[]> {
    try {
      const products = await ProductModel.findByAmount(productsIds) as Product[] | null;

      return products || [];
    } catch (error: any) {
      throw new ProductError(`Error getting all products: ${error.message}`);
    }
  }

  /**
   * Get filtered products from the database based on the provided filters.
   * @param filters - Object containing filters for the products.
   * @returns A Promise that resolves with an array of filtered products.
   */
  static async getFiltered(filters: Partial<Product>): Promise<Product[]> {
    try {
      return await ProductModel.getFiltered(filters);
    } catch (error: any) {
      throw new ProductError(`Error getting filtered products: ${error.message}`);
    }
  }

  /**
   * Create a new product in the database.
   * @param fields - Object representing the product data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async create(fields: Product): Promise<Product> {
    // Validate price
    if (fields.price < 0) {
      throw new ProductError('Price cannot be negative.');
    }

    try {
      return await ProductModel.create(fields);
    } catch (error: any) {
      throw new ProductError(`Error creating product: ${error.message}`);
    }
  }

  /**
   * Update an existing product in the database.
   * @param productId - ID of the product to be updated.
   * @param fields - Object containing the updated product data.
   * @returns A Promise that resolves with the updated product data.
   */
  static async update(productId: number, fields: Partial<Product>): Promise<Product> {
    if (fields.price !== undefined && fields.price <= 0) {
      throw new ProductError('Price cannot be negative or zero.');
    }

    if (productId === undefined || !productId) {
      throw new ProductError('The Product UUID could not be null', undefined, 404);
    }

    try {
      return await ProductModel.updateRecord(productId, fields);
    } catch (error: any) {
      throw new ProductError(`Error updating product: ${error.message}`);
    }
  }

  /**
   * Delete a product from the database based on its ID.
   * @param productId - ID of the product to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async delete(productId: number): Promise<boolean> {
    try {
      const result = await ProductModel.delete(productId);
      return result;
    } catch (error: any) {
      throw new ProductError(`Error deleting product with Product Id ${productId}: ${error.message}`);
    }
  }
}

export default ProductRepository;
