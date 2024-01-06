import DatabaseManager from '../../config/db';
import Product from 'types/Product.type';

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
  static async delete(productId: number | string): Promise<void> {
    const query: string = 'DELETE FROM product WHERE id = ?';
    const dbManager = this.getDBManager();

    await dbManager.run(query, [productId]);
  }

  /**
   * Get all aspects of products from the database.
   * @returns A Promise that resolves with an array of product aspects.
   */
  static async getAllAspects(): Promise<any> {
    const query: string = 'SELECT * FROM product_aspects';
    const dbManager = this.getDBManager();

    return await dbManager.all(query, []);
  }

  /**
   * Get all products from the database.
   * @returns A Promise that resolves with an array of products.
   */
  static async get(): Promise<Product[]> {
    const query: string = 'SELECT * FROM product';
    const dbManager = this.getDBManager();

    return await dbManager.all(query, []);
  }

  /**
   * Get filtered products from the database based on the provided filters.
   * @param filters - Object containing filters for the products.
   * @returns A Promise that resolves with an array of filtered products.
   */
  static async getFiltered(filters: Partial<Product>): Promise<Product[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    Object.entries(filters).forEach(([key, value]) => {
      conditions.push(`${key} = ?`);
      values.push(value);
    });

    const conditionString = conditions.join(' AND ');

    const query: string = `SELECT * FROM product WHERE ${conditionString}`;
    const dbManager = this.getDBManager();

    return await dbManager.all(query, values);
  }

  /**
   * Get a product from the database based on its ID.
   * @param id - ID of the product to be retrieved.
   * @returns A Promise that resolves with the product data or null if not found.
   */
  static async getById(productId: number | string): Promise<Product | null> {
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
    const dbManager = this.getDBManager();

    return await dbManager.get(query, [productId]);
  }

  /**
   * Get a products from the database based on its IDs.
   * @param ids - IDs of the products to be retrieved.
   * @returns A Promise that resolves with the products data or null if not found.
   */
  static async getByIds(productIds: Array<number | string>): Promise<Product[] | null> {
    const query: string = 'SELECT * FROM product WHERE id IN (?)';
    const dbManager = this.getDBManager();

    return await dbManager.get(query, productIds);
  }

  /**
   * Create a new product in the database.
   * @param fields - Object representing the product data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async create(fields: Product): Promise<void> {
    const query: string = `
      INSERT INTO product (
        name,
        price,
        discount_percentage,
        number_of_installments,
        product_picture,
        color,
        size,
        free_shipping,
        brand_product_id,
        gender_product_id,
        category_product_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = Object.values(fields);

    const dbManager = this.getDBManager();

    await dbManager.run(query, values);
  }

  /**
   * Update an existing product in the database.
   * @param fields - Object containing the updated product data.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async update(productId: number | string, fields: Partial<Product>): Promise<void> {
    // const query: string = `
    //   UPDATE product
    //   SET name = ?,
    //       price = ?,
    //       discount_percentage = ?,
    //       number_of_installments = ?,
    //       product_picture = ?,
    //       color = ?,
    //       size = ?,
    //       free_shipping = ?,
    //       brand_product_id = ?,
    //       gender_product_id = ?,
    //       category_product_id = ?
    //   WHERE id = ?
    // `;

    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    const query: string = `
      UPDATE customer
      SET ${setClause}
      WHERE uuid = ?
    `;

    const dbManager = this.getDBManager();
    await dbManager.run(query, [...values, productId]);
  }
}

export default ProductModel;
