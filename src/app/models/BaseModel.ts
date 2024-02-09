import DatabaseManager from "../../database/db";

class BaseModel<T> {
  protected static dbManager: DatabaseManager = new DatabaseManager();
  protected static table: string;

  constructor(table: string) {
    BaseModel.table = table;
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
      const isArrayPattern = Array.isArray(conditions);
      const isArrayValues = Array.isArray(values);

      const queryValues = isArrayValues ? values : [values];

      const pattern = isArrayPattern ? conditions.join('= ? AND ') : conditions;
      const placeholders = (!isArrayPattern && isArrayValues) ? 'IN (' + values.map(() => '?').join(', ') + ')' : '= ?';

      const query: string = `
        SELECT * FROM ${BaseModel.table} WHERE ${pattern} ${placeholders}
      `;

      return await this.dbManager.transaction(async (dbManager) => {
        const row = await dbManager.get(query, queryValues);
        console.log(row);
        return row;
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default BaseModel;
