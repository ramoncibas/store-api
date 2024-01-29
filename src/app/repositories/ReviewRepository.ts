import ReviewModel from 'models/ReviewModel';
import ReviewError from 'builders/errors/ReviewError';
import Review from 'types/Review.type';
import { RunResult } from 'sqlite3';

class ReviewRepository {
  /**
   * Creates a new review in the database.
   * @param review - Object representing the review data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async create(review: Review): Promise<Review> {
    try {
      return await ReviewModel.save(review);
    } catch (error: any) {
      throw new ReviewError('Error creating review', error);
    }
  }

  /**
   * Gets a review from the database based on the provided ID or UUID.
   * @param reviewUUID - UUID of the review.
   * @returns A Promise that resolves with the review data or null if not found.
   */
  static async get(reviewUUID: string): Promise<Review | null> {
    try {
      return await ReviewModel.get(reviewUUID);
    } catch (error: any) {
      throw new ReviewError('Error retrieving review', error);
    }
  }

    /**
   * Gets all the reviews from the database.
   * @returns A Promise that resolves with the reviews data or null if not found.
   */
    static async getByPattern(pattern: string | Array<string>, values: number | string | Array<string>): Promise<Review[] | null> {
      try {
        return await ReviewModel.getByPattern(pattern, values);
      } catch (error: any) {
        throw new ReviewError('Error retrieving review', error);
      }
    }

  /**
   * Updates the data of a review in the database.
   * @param reviewUUID - UUID of the review to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async update(reviewUUID: string, updatedFields: Partial<Review>): Promise<Review> {
    try {
      return await ReviewModel.update(reviewUUID, updatedFields);
    } catch (error: any) {
      throw new ReviewError('Error updating review', error);
    }
  }

  /**
   * Deletes a review from the database based on the provided ID.
   * @param reviewUUID - UUID of the review to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async delete(reviewUUID: string): Promise<RunResult> {
    try {
      return await ReviewModel.delete(reviewUUID);
    } catch (error: any) {
      throw new ReviewError('Error deleting review', error);
    }
  }
}

export default ReviewRepository;