import { randomUUID } from 'crypto';
import DatabaseManager from '../../database/db';
import Product, { AspectResult } from 'types/Product.type';
import { RunResult } from 'sqlite3';

class ProductModel {
  private static dbManager: DatabaseManager;

  /**
   * Get the database manager instance.
   * @returns The database manager instance.
   */
  private static getDBManager(): DatabaseManager {
    if (!this.dbManager) {
      this.dbManager = new DatabaseManager();
    }
    return this.dbManager;
  }

  /**
   * Delete a product from the database based on its ID.
   * @param id - ID of the product to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async delete(productId: number | string): Promise<RunResult> {
    const query: string = 'DELETE FROM product WHERE id = ?';
    const dbManager = this.getDBManager();

    return await dbManager.run(query, [productId]);
  }

  /**
   * Get all aspects of products from the database.
   * @returns A Promise that resolves with an array of product aspects.
   */
  static async getAllAspects(): Promise<AspectResult> {
    let dbManager: DatabaseManager | null = null;

    try {
      dbManager = this.getDBManager();

      const brandQuery = 'SELECT id, name FROM brand_product';
      const genderQuery = 'SELECT id, name FROM gender_product';
      const categoryQuery = 'SELECT id, name FROM category_product';
      const sizeQuery = 'SELECT id, size FROM size_product';

      const [brands, genders, categories, sizes] = await Promise.all([
        dbManager.all(brandQuery, []),
        dbManager.all(genderQuery, []),
        dbManager.all(categoryQuery, []),
        dbManager.all(sizeQuery, []),
      ]);

      const aspects: any = {
        brands,
        genders,
        categories,
        sizes
      };

      return aspects;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get all aspects");
    }
  }

  /**
   * Get all products from the database.
   * @returns A Promise that resolves with an array of products.
   */
  static async get(): Promise<Product[]> {
    let dbManager: DatabaseManager | null = null;

    try {
      dbManager = this.getDBManager();
      const query: string = 'SELECT * FROM product';

      return await dbManager.all(query, []);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get all products");
    }
  }

  /**
   * Get filtered products from the database based on the provided filters.
   * @param filters - Object containing filters for the products.
   * @returns A Promise that resolves with an array of filtered products.
   */
  static async getFiltered(filters: Partial<Product>): Promise<Product[]> {
    let dbManager: DatabaseManager | null = null;

    try {
      const conditions: string[] = [];
      const values: any[] = [];

      Object.entries(filters).forEach(([key, value]) => {
        conditions.push(`${key} = ?`);
        values.push(value);
      });

      const conditionString = conditions.join(' AND ');

      const query: string = `SELECT * FROM product WHERE ${conditionString}`;
      dbManager = this.getDBManager();

      return await dbManager.all(query, values);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get all products");
    }
  }

  /**
   * Get a product from the database based on its ID.
   * @param id - ID of the product to be retrieved.
   * @returns A Promise that resolves with the product data or null if not found.
   */
  static async getById(productId: number | string): Promise<Product | null> {
    let dbManager: DatabaseManager | null = null;

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
          INNER JOIN size_product sz on p.size_id = sz.id
        WHERE p.id = ?
      `;

      dbManager = this.getDBManager();

      return await dbManager.get(query, [productId]);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get product by Id");
    }
  }

  /**
   * Get a products from the database based on its IDs.
   * @param ids - IDs of the products to be retrieved.
   * @returns A Promise that resolves with the products data or null if not found.
   */
  static async getByIds(productIds: Array<number | string>): Promise<Product[] | null> {
    let dbManager: DatabaseManager | null = null;

    try {
      const query: string = 'SELECT * FROM product WHERE id IN (?)';
      dbManager = this.getDBManager();

      return await dbManager.get(query, productIds);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get products by Ids");
    }
  }

  /**
   * Create a new product in the database.
   * @param fields - Object representing the product data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async create(fields: Product): Promise<Product> {
    let dbManager: DatabaseManager | null = null;

    try {
      const query: string = `
        INSERT INTO product (
          uuid,
          name,
          price,
          color,
          discount_percentage,
          product_picture,
          number_of_installments,
          free_shipping,
          description,
          size_id,
          brand_id,
          gender_id,
          category_id,
          quantity_available
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *;
      `;

      // deixar color como uma tabela auxiliar

      const generatedUuid = randomUUID();
      const values = [generatedUuid, ...Object.values(fields)];
      
      const dbManager = this.getDBManager();
      const productData = await dbManager.all(query, values);

      return productData[0];

    } catch (error) {
      console.error(error);
      throw new Error("Failed to create an product");
    }
  }

  /**
   * Update an existing product in the database.
   * @param fields - Object containing the updated product data.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async update(productId: number | string, fields: Partial<Product>): Promise<RunResult> {
    let dbManager: DatabaseManager | null = null;

    try {
      const keys = Object.keys(fields);
      const values = Object.values(fields);

      const setClause = keys.map((key) => `${key} = ?`).join(", ");

      const query: string = `
        UPDATE customer
        SET ${setClause}
        WHERE uuid = ?
      `;

      dbManager = this.getDBManager();
      return await dbManager.run(query, [...values, productId]);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch all products");
    }
  }
}

export default ProductModel;
