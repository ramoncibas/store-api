import DatabaseManager from "database/db";
import { randomUUID } from "crypto";
import { isValidUUID } from "utils";
import { DatabaseError } from "builders/errors";

class BaseModel<T> {
  protected static dbManager: DatabaseManager = new DatabaseManager();
  protected static table: string;

  /**
   * Validates and determines the condition for querying a record.
   * @param record - ID or UUID of the record.
   * @returns An object containing the record string and the condition ("id" or "uuid").
   * @throws DatabaseError if the record is invalid.
   */
  protected static getRecordCondition(record: string | number): { recordString: string; condition: "id" | "uuid"; } {
    if (!record) {
      throw DatabaseError.constraintViolation('getRecordCondition');
    }

    const recordString = String(record);
    const condition = isValidUUID(recordString) ? "uuid" : "id";

    return { recordString, condition };
  }

  /**
   * Gets a record from the database based on the provided ID or UUID.
   * @param record - ID or UUID of the record.
   * @returns A Promise that resolves with the record data or except if not found.
   */
  public static async get<T>(record: string | number): Promise<T> {
    try {
      const { recordString, condition } = this.getRecordCondition(record);
      const query = `SELECT * FROM ${this.table} WHERE ${condition} = ?`;
      const result = await BaseModel.dbManager.get(query, [recordString]) || null;

      if (!result) {
        throw DatabaseError.recordNotFound(
          `No record found with ${condition}: ${recordString}`
        );

        return {} as T;
      }

      return result as T;
    } catch (error: any) {
      throw DatabaseError.recordNotFound(error);
    }
  }

  /**
   * Gets all records from the database based on the table.
   * @returns A Promise that resolves with the record data or except if not found.
   */
  public static async all<T>(): Promise<T> {
    try {
      const query = `SELECT * FROM ${this.table}`;
      const result = await BaseModel.dbManager.all(query, []) || null;

      if (!result) {
        throw DatabaseError.recordNotFound(
          `No record found from table: ${this.table}`
        );
      }

      return result as T;
    } catch (error: any) {
      throw DatabaseError.recordNotFound(error);
    }
  }

  /**
   * Saves a new record to the database.
   * @param data - The data to be saved.
   * @returns A Promise that resolves with the saved record.
   */
  protected static async save<T>(data: Omit<T, "id" | "uuid">): Promise<T> {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = [randomUUID(), ...Object.values(data)] as (string | number)[];

    const query = `
      INSERT INTO ${this.table} (uuid, ${columns})
      VALUES (?, ${placeholders})
      RETURNING *;
    `;

    try {
      const result = await BaseModel.dbManager.transaction(async (dbManager) => {

        return await dbManager.run(query, values);
        // Talvez alterar para dbManager.all(), para ter o retorno dos valores...
      });

      if (!result.lastID) {
        DatabaseError.transactionFailed();
        return {} as T;
      }

      const insertedRecord = await this.get(result.lastID);

      return insertedRecord as T;
    } catch (error) {
      throw DatabaseError.transactionFailed(error);
    }
  }

  /**
   * Updates an existing record in the database.
   * @param record - The ID or UUID of the record to update.
   * @param updatedFields - The fields to update.
   * @returns A Promise that resolves with the updated record.
   */
  protected static async update<T>(record: string | number, updatedFields: Partial<T>): Promise<T> {
    try {
      const { recordString, condition } = this.getRecordCondition(record);
      const keys = Object.keys(updatedFields);
      const values = Object.values(updatedFields) as (string | number)[];

      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const query = `UPDATE ${this.table} SET ${setClause} WHERE ${condition} = ?`;

      await BaseModel.dbManager.transaction(async (dbManager) => {
        return await dbManager.run(query, [...values, recordString]);
      });

      const updatedRecord = await this.get(recordString);

      return updatedRecord as T;
    } catch (error) {
      throw DatabaseError.transactionFailed(error);
    }
  }

  /**
   * Deletes a record from the database.
   * @param record - The ID or UUID of the record to delete.
   * @returns A Promise that resolves with a boolean indicating success.
   */
  protected static async delete(record: string | number | Array<string | number>): Promise<boolean> {
    try {
      const records = Array.isArray(record) ? record : [record];
      const conditions = records.map(this.getRecordCondition);
      const placeholders = conditions.map(() => '?').join(', ');
      const query = `DELETE FROM ${this.table} WHERE ${conditions[0].condition} IN (${placeholders})`;

      const result = await BaseModel.dbManager.transaction(async (dbManager) => {
        return await dbManager.run(query, conditions.map(cond => cond.recordString));
      });

      return result && result.changes > 0;
    } catch (error) {
      throw DatabaseError.transactionFailed(error);
    }
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
  protected static async search<T>(
    conditions: string | Array<string>,
    values: number | string | Array<number | string>
  ): Promise<T | T[] | null> {
    try {
      const isArrayPattern = Array.isArray(conditions);
      const isArrayValues = Array.isArray(values);

      const queryValues = isArrayValues ? values : [values];

      const pattern = isArrayPattern ? conditions.join('= ? AND ') : conditions;
      const placeholders = (!isArrayPattern && isArrayValues) ? 'IN (' + values.map(() => '?').join(', ') + ')' : '= ?';

      const query: string = `
        SELECT * FROM ${this.table} WHERE ${pattern} ${placeholders}
      `;

      const result = await BaseModel.dbManager.transaction(async (dbManager) => {
        return await dbManager.all(query, queryValues);
      });
      
      if (!result || result.length === 0) {
        return null;
      }

      if (result.length === 1) {
        return result[0] as T;
      }

      return result as T;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default BaseModel;
