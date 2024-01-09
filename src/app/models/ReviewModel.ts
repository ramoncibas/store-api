import DatabaseManager from "../../config/db";
import Review from "types/Review.type";
import { v4 as uuidv4 } from 'uuid';

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
  static async save(review: Review): Promise<void> {
    const query: string = `
      INSERT INTO review (
        uuid,
        product_id,
        customer_id,
        rating,
        comment,
        review_date
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
      const dbManager = this.getDBManager();
      const reviewUUID = uuidv4();
      await dbManager.run(query, [reviewUUID, ...Object.values(review)]);
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
   * Update the data of a review in the database.
   * @param reviewUUID - UUID of the review to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async update(reviewUUID: string, updatedFields: Partial<Review>): Promise<void> {
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);

    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    const query: string = `
      UPDATE review
      SET ${setClause}
      WHERE uuid = ?
    `;

    try {
      const dbManager = this.getDBManager();
      await dbManager.run(query, [...values, reviewUUID]);
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
  static async delete(reviewUUID: string): Promise<void> {
    const query: string = `
      DELETE FROM review WHERE uuid = ?
    `;

    try {
      const dbManager = this.getDBManager();
      await dbManager.run(query, [reviewUUID]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default ReviewModel;
