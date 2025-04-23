import BaseModel from "./BaseModel";
import { Product, AttributesResult, ProductFilter } from "@types";

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
   * Get all products from the database.
   * @returns A Promise that resolves with an array of products.
   */
  static async getAll(): Promise<Product[]> {
    return await this.all();
  }

  /**
   * Get all aspects of products from the database.
   * @returns A Promise that resolves with an array of product aspects.
   */
  static async findByAttributes(): Promise<AttributesResult> {
    try {
      const [brands, genders, categories, sizeRange] = await Promise.all([
        this.dbManager.all('SELECT id, name, "brand" as type FROM brand_product', []),
        this.dbManager.all('SELECT id, name, "gender" as type FROM gender_product', []),
        this.dbManager.all('SELECT id, name, "category" as type FROM category_product', []),
        this.dbManager.get('SELECT MIN(size) as min, MAX(size) as max FROM product', []),
      ]);
  
      const allAspects = [...brands, ...genders, ...categories];
  
      const aspects = allAspects.reduce((acc, aspect) => {
        if (!acc[aspect.type]) acc[aspect.type] = [];
        
        acc[aspect.type].push(aspect);

        return acc;
      }, {});
  
      return {
        ...aspects,
        sizeRange: {
          min: sizeRange?.min ?? 0,
          max: sizeRange?.max ?? 0,
        },
        _meta: {
          retrievedAt: new Date().toISOString(),
          categoryCount: Object.keys(aspects).length,
        }
      };
    } catch (error) {
      console.error('Failed to retrieve attributes:', error);
      throw error;
    }
  }

  /**
   * Get a Product from the database based on the provided ID.
   * @param productsIds - Numeric IDs of the Products.
   * @returns A Promise that resolves with the product data or null if not found.
   */
  public static async findByAmount(productsIds: Array<number | string>): Promise<Product[]> {
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
  static async filter(filters: ProductFilter): Promise<Product[]> {
    try {
      let conditions: string[] = [];
      let values: any[] = [];

      Object.entries(filters).forEach(([key, value]) => {
        // Verifica se é o objeto de tamanho
        if (key === 'sizeRange' && typeof value === 'object' && 'min' in value && 'max' in value) {
          conditions.push(`size >= ? AND size <= ?`);
          values.push(value.min, value.max);
        } 
        // Para os filtros de array normais
        else if (Array.isArray(value) && value.length > 0) {
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
  static async deleteRecord(productId: number): Promise<boolean> {
    return await this.delete(productId);
  }
}

export default ProductModel;
