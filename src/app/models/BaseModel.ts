import DatabaseManager from "../../database/db";

class BaseModel<T> {
  protected static dbManager: DatabaseManager = new DatabaseManager();
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  private static getInstance(): BaseModel<any> {
    return new this("");
  }

  /**
   * Retrieves a record from the specified database table based on the provided conditions and value.
   *
   * @param conditions - A string or array of strings representing the fields to filter on.
   * @param values - A string or array of strings corresponding to values for the filter conditions.
   *
   * @returns A Promise that resolves with the record data or null if not found.
   *
   * @throws Will throw an error if there's any issue with the database operation.
   *
   * @example
   * // First, extend the 'BaseModel' class and define the corresponding table
   * class YourClass extends BaseModel<YourClass> {
        constructor() {
          super("user");
        }   
      }
   *
   * // Single condition, single value
   * const result1 = await BaseModel.search('customer_id', 1);
   *
   * // Multiple conditions, single value
   * const result2 = await BaseModel.search(['customer_id', 'product_id'], 1);
   *
   * // Single condition, array of values (IN clause)
   * const result3 = await BaseModel.search('product_id', [1, 2, 3]);
   *
   * // Multiple conditions, array of values (IN clause)
   * const result4 = await BaseModel.search(['customer_id', 'product_id'], [1, 2, 3]);
   *
   * // Single condition, single string value
   * const result5 = await BaseModel.search('product_name', 'Example Product');
   *
   * // Multiple conditions, single string value
   * const result6 = await BaseModel.search(['product_name', 'category'], 'Example Product');
   *
   * // Single condition, array of string values (IN clause)
   * const result7 = await BaseModel.search('category', ['Electronics', 'Clothing']);
   *
   * // Multiple conditions, array of string values (IN clause)
   * const result8 = await BaseModel.search(['product_name', 'category'], ['Example Product', 'Electronics']);
   */
  static async search(
    conditions: string | Array<string>,
    values: number | string | Array<string | number>
  ): Promise<any> {
    try {
      const currentInstance = this.getInstance();

      const isArrayPattern = Array.isArray(conditions);
      const isArrayValues = Array.isArray(values);

      const queryValues = isArrayValues ? values : [values];

      const pattern = isArrayPattern ? conditions.join('= ? AND ') : conditions;
      const placeholders = (!isArrayPattern && isArrayValues) ? 'IN (' + values.map(() => '?').join(', ') + ')' : '= ?';

      const query: string = `
        SELECT * FROM ${currentInstance.table} WHERE ${pattern} ${placeholders}
      `;

      return await BaseModel.dbManager.transaction(async (dbManager) => {
        const row = await dbManager.get(query, queryValues);
        return row;
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default BaseModel;
