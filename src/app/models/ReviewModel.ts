import Review from "types/Review.type";
import { randomUUID } from 'crypto';
import { RunResult } from "sqlite3";
import BaseModel from "./BaseModel";

class ReviewModel extends BaseModel<ReviewModel> {
  constructor() {
    super("review");
  }

  /**
   * Save a new review to the database.
   * @param review - Object representing the review data to be saved.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async save(review: Review): Promise<Review> {
    try {
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

      const generatedUuid = randomUUID();

      const values = [
        generatedUuid,
        review.product_id,
        review.customer_id,
        review.rating,
        review.comment,
      ];

      return await this.dbManager.transaction(async (dbManager) => {
        const [reviewData] = await dbManager.all(query, values);

        return reviewData;
      });

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
    try {
      const query: string = `
        SELECT * FROM review WHERE uuid = ?
      `;

      const row = await this.dbManager.get(query, [reviewUUID]);

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
    try {
      const keys = Object.keys(updatedFields);
      const values = Object.values(updatedFields);

      const setClause = keys.map((key) => `${key} = ?`).join(", ");

      const query: string = `
        UPDATE review
        SET ${setClause}
        WHERE uuid = ?
        RETURNING *;
      `;

      return await this.dbManager.transaction(async (dbManager) => {
        const [reviewData] = await dbManager.all(query, [...values, reviewUUID]);

        return reviewData;
      });
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
    try {
      const query: string = `
        DELETE FROM review WHERE uuid = ?
      `;
      
      const row = await this.dbManager.run(query, [reviewUUID]);

      return row;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default ReviewModel;
