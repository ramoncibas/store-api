import { randomUUID } from 'crypto';
import Product, { AspectResult } from 'types/Product.type';
import { RunResult } from 'sqlite3';
import BaseModel from './BaseModel';

class ProductModel extends BaseModel<ProductModel> {
  constructor() {
    super("shopping_cart");
  }

  /**
   * Delete a product from the database based on its ID.
   * @param id - ID of the product to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async delete(productId: number | string): Promise<RunResult> {
    try {
      const query: string = 'DELETE FROM product WHERE id = ?';

      return await this.dbManager.transaction(async (dbManager) => {
        const result = await dbManager.run(query, [productId]);

        return result;
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get all aspects of products from the database.
   * @returns A Promise that resolves with an array of product aspects.
   */
  static async getAllAspects(): Promise<AspectResult> {
    try {
      const brandQuery = 'SELECT id, name FROM brand_product';
      const genderQuery = 'SELECT id, name FROM gender_product';
      const categoryQuery = 'SELECT id, name FROM category_product';
      const sizeQuery = 'SELECT id, size FROM size_product';

      const [brands, genders, categories, sizes] = await Promise.all([
        this.dbManager.all(brandQuery, []),
        this.dbManager.all(genderQuery, []),
        this.dbManager.all(categoryQuery, []),
        this.dbManager.all(sizeQuery, []),
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
      throw error;
    }
  }

  /**
   * Get all products from the database.
   * @returns A Promise that resolves with an array of products.
   */
  static async get(): Promise<Product[]> {
    try {
      const query: string = 'SELECT * FROM product';
      const rows = await this.dbManager.all(query, []);

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
  static async getFiltered(filters: Partial<Product>): Promise<Product[]> {
    try {
      const conditions: string[] = [];
      const values: any[] = [];

      Object.entries(filters).forEach(([key, value]) => {
        conditions.push(`${key} = ?`);
        values.push(value);
      });

      const conditionString = conditions.join(' AND ');

      const query: string = `SELECT * FROM product WHERE ${conditionString}`;

      const rows = await this.dbManager.all(query, values);

      return rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get a product from the database based on its ID.
   * @param id - ID of the product to be retrieved.
   * @returns A Promise that resolves with the product data or null if not found.
   */
  static async getById(productId: number | string): Promise<Product | null> {
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

      const row = await this.dbManager.get(query, [productId]);

      return row;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get a products from the database based on its IDs.
   * @param ids - IDs of the products to be retrieved.
   * @returns A Promise that resolves with the products data or null if not found.
   */
  static async getByIds(productIds: Array<number | string>): Promise<Product[] | null> {
    try {
      return await this.dbManager.transaction(async (dbManager) => {
        const placeholders = productIds.map(() => '?').join(',');

        const query: string = `SELECT * FROM product WHERE id IN (${placeholders})`;
        const rows = await dbManager.all(query, productIds);

        return rows;
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Create a new product in the database.
   * @param fields - Object representing the product data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async create(fields: Product): Promise<Product> {
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

      return await this.dbManager.transaction(async (dbManager) => {
        const [productCreated]: any = await dbManager.all(query, values);

        return productCreated;
      });


    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update an existing product in the database.
   * @param fields - Object containing the updated product data.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async update(productUUID: number | string, fields: Partial<Product>): Promise<RunResult> {
    try {
      const keys = Object.keys(fields);
      const values = Object.values(fields);

      const setClause = keys.map((key) => `${key} = ?`).join(", ");

      const query: string = `
        UPDATE product
        SET ${setClause}
        WHERE uuid = ?
      `;

      return await this.dbManager.transaction(async (dbManager) => {
        const row = await dbManager.run(query, [...values, productUUID]);

        return row;
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default ProductModel;
