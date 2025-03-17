import BaseModel from "./BaseModel";
import { Product, AspectResult } from "types/Product.type";

class ProductModel extends BaseModel<Product> {
  protected static table: string = "product";

  /**
   * Get a product from the database based on its ID.
   * @param id - ID of the product to be retrieved.
   * @returns A Promise that resolves with the product data or null if not found.
   */
  static async findById(productId: number | string): Promise<Product | null> {
    try {
      const query: string = `
        SELECT 
          p.*,
          bp.name as brand_name,
          gp.name as gender_name,
          cp.name as category_name,
          cp.name as size_name
        FROM product p
          INNER JOIN brand_product bp on p.brand_id = bp.id
          INNER JOIN gender_product gp on p.gender_id = gp.id
          INNER JOIN category_product cp on p.category_id = cp.id
        WHERE p.id = ?
      `;

      const row = await this.dbManager.get(query, [productId]);

      return row;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get a Product from the database based on the provided ID.
   * @param productId - Numeric ID of the Product.
   * @returns A Promise that resolves with the product data or null if not found.
   */
  public static async findByIds(productId: Array<number | string>) {
    return await this.search("id", productId);
  }

  /**
   * Get all products from the database.
   * @returns A Promise that resolves with an array of products.
   */
  static async findAll(): Promise<Product[]> {
    return await this.all();
  }

  /**
   * Get all aspects of products from the database.
   * @returns A Promise that resolves with an array of product aspects.
   */
  static async findByAspects(): Promise<AspectResult> {
    try {
      const queries = {
        brand: 'SELECT id, name FROM brand_product',
        gender: 'SELECT id, name FROM gender_product',
        category: 'SELECT id, name FROM category_product',
        size: 'SELECT min(size) as min, max(size) as max FROM product'
      };

      const [brand_id, gender_id, category_id, size] = await Promise.all([
        this.dbManager.all(queries.brand, []),
        this.dbManager.all(queries.gender, []),
        this.dbManager.all(queries.category, []),
        this.dbManager.get(queries.size, [])
      ]);

      const aspects: any = {
        brand_id,
        gender_id,
        category_id,
        size
      };

      return aspects;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get a Product from the database based on the provided ID.
   * @param productsIds - Numeric IDs of the Products.
   * @returns A Promise that resolves with the product data or null if not found.
   */
  public static async findByAmount(productsIds: Array<number | string>) {
    try {
      const query = `
        SELECT *
        FROM ${this.table}
        WHERE 1=1
          AND id IN (?) 
          AND quantity_available > 0
      `;

      const rows = await this.dbManager.all(query, productsIds);

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get filtered products from the database based on the provided filters.
   * @param filters - Object containing filters for the products.
   * @returns A Promise that resolves with an array of filtered products.
   */
  static async getFiltered(filters: Partial<any>): Promise<Product[]> {
    try {
      let conditions: string[] = [];
      let values: any[] = [];

      Object.entries(filters).forEach(([key, value]) => {
        if (value.length > 0) {
          conditions.push(`${key} IN (${value.map(() => '?').join(',')})`);
          values.push(...value);
        }
      });

      const conditionString = conditions.join(' AND ');

      const query: string = `
        SELECT * 
        FROM ${this.table}
        WHERE ${conditionString}`;

      const rows = await this.dbManager.all(query, values);

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Create a new product in the database.
   * @param data - Object representing the product data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async create(data: Product): Promise<Product> {
    return await this.save(data);
  }

  /**
   * Update an existing product in the database.
   * @param fields - Object containing the updated product data.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async updateRecord(productId: number, updatedFields: Partial<Product>): Promise<Product> {
    return await this.update(productId, updatedFields);
  }

  /**
   * Delete a product from the database based on its ID.
   * @param id - ID of the product to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async delete(productId: number): Promise<boolean> {
    return await this.delete(productId);
  }
}

export default ProductModel;
