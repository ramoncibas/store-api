import ProductModel from 'models/ProductModel';
import ProductError from 'builders/errors/ProductError';
import Product from 'types/Product.type';
import { RunResult } from 'sqlite3';

class ProductRepository {
  /**
   * Delete a product from the database based on its ID.
   * @param productId - ID of the product to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async delete(productId: number | string): Promise<RunResult> {
    try {
      return await ProductModel.delete(productId);
    } catch (error: any) {
      throw new ProductError(`Error deleting product with Product Id ${productId}: ${error.message}`);
    }
  }

  /**
   * Get all aspects of products from the database.
   * @returns A Promise that resolves with an array of product aspects.
   */
  static async getAllAspects(): Promise<any> {
    
    // Refatorar esse metodo!!!

    try {
      return await ProductModel.getAllAspects();
    } catch (error: any) {
      throw new ProductError(`Error getting all aspects: ${error.message}`);
    }
  }

  /**
   * Get all products from the database.
   * @returns A Promise that resolves with an array of products.
   */
  static async get(): Promise<Product[]> {
    try {
      return await ProductModel.get();
    } catch (error: any) {
      throw new ProductError(`Error getting all products: ${error.message}`);
    }
  }


  /**
   * Get products from the database based on an array of product IDs.
   * @param productIds - Array of product IDs to retrieve from the database.
   * @returns A Promise that resolves with an array of products matching the provided IDs.
   */
  static async getByIds(productIds: Array<number | string>): Promise<Product[]> {
    try {
      const products: Product[] | null = await ProductModel.getByIds(productIds);

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
   * Get a product from the database based on its ID.
   * @param id - ID of the product to be retrieved.
   * @returns A Promise that resolves with the product data or null if not found.
   */
  static async getById(productId: number | string): Promise<Product | null> {
    try {
      return await ProductModel.getById(productId);
    } catch (error: any) {
      throw new ProductError(`Error getting product by ID ${productId}: ${error.message}`);
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
   * @param fields - Object containing the updated product data.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async update(productUUID: number | string, fields: Partial<Product>): Promise<RunResult> {
    if (fields.price !== undefined && fields.price <= 0) {
      throw new ProductError('Price cannot be negative or zero.');
    }
  
    if (productUUID === undefined || !productUUID) {
      throw new ProductError('The Product Id could not be null', undefined, 404);
    }
    

    try {
      return await ProductModel.update(productUUID, fields);
    } catch (error: any) {
      throw new ProductError(`Error updating product: ${error.message}`);
    }
  }
}

export default ProductRepository;
