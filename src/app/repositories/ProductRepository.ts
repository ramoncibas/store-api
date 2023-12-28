import ProductModel from 'models/ProductModel';
import ProductError from 'errors/ProductError';
import Product from 'types/Product.type';

class ProductRepository {
  /**
   * Delete a product from the database based on its ID.
   * @param id - ID of the product to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async deleteProduct(id: number): Promise<void> {
    try {
      await ProductModel.deleteProduct(id);
    } catch (error: any) {
      throw new ProductError(`Error deleting product with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Get all aspects of products from the database.
   * @returns A Promise that resolves with an array of product aspects.
   */
  static async getAllAspects(): Promise<any> {
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
  static async getAllProducts(): Promise<Product[]> {
    try {
      return await ProductModel.getAllProducts();
    } catch (error: any) {
      throw new ProductError(`Error getting all products: ${error.message}`);
    }
  }

  /**
   * Get filtered products from the database based on the provided filters.
   * @param filters - Object containing filters for the products.
   * @returns A Promise that resolves with an array of filtered products.
   */
  static async getFilteredProduct(filters: Partial<Product>): Promise<Product[]> {
    try {
      return await ProductModel.getFilteredProduct(filters);
    } catch (error: any) {
      throw new ProductError(`Error getting filtered products: ${error.message}`);
    }
  }

  /**
   * Get a product from the database based on its ID.
   * @param id - ID of the product to be retrieved.
   * @returns A Promise that resolves with the product data or null if not found.
   */
  static async getProductById(id: number): Promise<Product | null> {
    try {
      return await ProductModel.getProductById(id);
    } catch (error: any) {
      throw new ProductError(`Error getting product by ID ${id}: ${error.message}`);
    }
  }

  /**
   * Create a new product in the database.
   * @param fields - Object representing the product data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async createProduct(fields: Product): Promise<void> {
    // Validate price
    if (fields.price < 0) {
      throw new ProductError('Price cannot be negative.');
    }

    try {
      await ProductModel.createProduct(fields);
    } catch (error: any) {
      throw new ProductError(`Error creating product: ${error.message}`);
    }
  }

  /**
   * Update an existing product in the database.
   * @param fields - Object containing the updated product data.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async updateProduct(fields: Product): Promise<void> {
    // Validate price
    if (fields.price < 0) {
      throw new ProductError('Price cannot be negative.');
    }

    try {
      await ProductModel.updateProduct(fields);
    } catch (error: any) {
      throw new ProductError(`Error updating product: ${error.message}`);
    }
  }
}

export default ProductRepository;
