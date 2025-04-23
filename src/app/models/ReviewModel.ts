import BaseModel from "./BaseModel";
import { Review } from "@types";

class ReviewModel extends BaseModel<Review> {
  protected static table: string = "review";

  /**
   * Finds reviews by uuid.
   * @param reviewUUID- The id of the costumer.
   * @returns A Promise that resolves with an array of reviews.
   */
  public static async findByUUID(reviewUUID: string): Promise<Review | null> {
    const review: Review[] = await this.search("uuid", reviewUUID) ?? [];

    return review[0];
  }

  /**
   * Finds reviews by costumer id.
   * @param customerId - The id of the costumer.
   * @returns A Promise that resolves with an array of reviews.
   */
  public static async findByCustomerId(customerId: number): Promise<Review[] | null> {
    return await this.search("customer_id", customerId);
  }

  /**
   * Finds reviews by product ID.
   * @param productId - The ID of the product.
   * @returns A Promise that resolves with an array of reviews.
   */
  public static async findByProductId(productId: number): Promise<Review[] | null> {
    return await this.search("product_id", productId);
  }

  /**
   * Saves a new review.
   * @param data - The review data to be saved.
   * @returns A Promise that resolves with the saved review.
   */
  public static async create(data: Omit<Review, "id" | "uuid">): Promise<Review> {
    return await this.save(data);
  }

  /**
   * Updates an existing review.
   * @param reviewUUID - The UUID of the review.
   * @param updatedFields - The fields to update.
   * @returns A Promise that resolves with the updated review.
   */
  public static async updateRecord(reviewUUID: string, updatedFields: Partial<Review>): Promise<Review> {
    return await this.update(reviewUUID, updatedFields);
  }

  /**
   * Deletes a review.
   * @param reviewUUID - The UUID of the review.
   * @returns A Promise that resolves with a boolean indicating success.
   */
  public static async deleteRecord(reviewUUID: string): Promise<boolean> {
    return await this.delete(reviewUUID);
  }
}

export default ReviewModel;
