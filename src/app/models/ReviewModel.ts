import DatabaseManager from "../../database/db";
import Review from "types/Review.type";
import { randomUUID } from 'crypto';
import { RunResult } from "sqlite3";

class ReviewModel {
  private static dbManager: DatabaseManager;

  private static getDBManager(): DatabaseManager {
    if (!this.dbManager) {
      this.dbManager = new DatabaseManager();
    }
    return this.dbManager;
  }

  /**
   * Save a new review to the database.
   * @param review - Object representing the review data to be saved.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async save(review: Review): Promise<Review> {
    const query: string = `
      INSERT INTO review (
        uuid,
        product_id,
        customer_id,
        rating,
        comment
      ) VALUES (?, ?, ?, ?, ?)
      RETURNING *;
    `;

    try {
      const generatedUuid = randomUUID();

      const values = [
        generatedUuid,
        review.product_id,
        review.customer_id,
        review.rating,
        review.comment,
      ];

      const dbManager = this.getDBManager();
      const reviewData = await dbManager.all(query, values);

      return reviewData[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get a review from the database based on the provided ID or UUID.
   * @param reviewUUID - UUID of the review.
   * @returns A Promise that resolves with the review data or null if not found.
   */
  static async get(reviewUUID: string): Promise<Review | null> {

    const query: string = `
      SELECT * FROM review WHERE uuid = ?
    `;

    try {
      const dbManager = this.getDBManager();
      const row = await dbManager.get(query, [reviewUUID]);
      return row || null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

   /**
   * Get a review from the database based on the provided pattern and value.
   * @param pattern - A string or array of strings representing the fields to filter on.
   * @param values - A string or array of strings corresponding values for the filter pattern.
   * @returns A Promise that resolves with the review data or null if not found.
   */
   static async getByPattern(pattern: string | Array<string>, values: number | string | Array<string>): Promise<Review[] | null> {
    const conditions = Array.isArray(pattern) ? pattern.join(' AND ') : pattern;
    const placeholders = Array.isArray(values) ? values.map(() => '?').join(', ') : '?';
    const queryValues = Array.isArray(values) ? values : [values];
    
    const query: string = `
      SELECT * FROM review WHERE ${conditions} = ${placeholders}
    `;

    try {
      const dbManager = this.getDBManager();
      const row: Review[] = await dbManager.all(query, queryValues);
      return row;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update the data of a review in the database.
   * @param reviewUUID - UUID of the review to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async update(reviewUUID: string, updatedFields: Partial<Review>): Promise<Review> {
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);

    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    const query: string = `
      UPDATE review
      SET ${setClause}
      WHERE uuid = ?
      RETURNING *;
    `;

    try {
      const dbManager = this.getDBManager();
      const reviewData = await dbManager.all(query, [...values, reviewUUID]);

      return reviewData[0];   
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Delete a review from the database based on the provided UUID.
   * @param reviewUUID - UUID of the review to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async delete(reviewUUID: string): Promise<RunResult> {
    const query: string = `
      DELETE FROM review WHERE uuid = ?
    `;

    try {
      const dbManager = this.getDBManager();
      return await dbManager.run(query, [reviewUUID]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default ReviewModel;
