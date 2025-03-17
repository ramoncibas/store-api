import ReviewModel from "models/ReviewModel";
import ReviewError from "builders/errors/ReviewError";
import CacheService from "lib/cache";
import Review from "types/Review.type";

class ReviewRepository {
  private cache;

  constructor() {
    this.cache = new CacheService('product_review');
  }

  /**
   * Creates a new review in the database.
   * @param review - Object representing the review data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async create(review: Review): Promise<Review> {
    try {
      const newReview = await ReviewModel.create(review);

      if (!newReview) {
        throw ReviewError.reviewCreationFailed();
      }

      const cacheKey = `reviews_product_${review.product_id}`;
      this.cache.set(cacheKey, newReview);

      return newReview;
    } catch (error: any) {
      throw new ReviewError('Error creating review', error);
    }
  }

  /**
   * Gets a review from the database based on the provided ID.
   * @param customerID - Id of the review.
   * @returns A Promise that resolves with the review data or null if not found.
   */
  public async findByCustomerId(customerID: string): Promise<Review[] | null> {
    try {
      const cacheKey = `reviews_product_customer_${customerID}`;
      const cachedReviews = await this.cache.get<Review[]>(cacheKey);

      if (cachedReviews) return cachedReviews;

      const reviews = await ReviewModel.findByCustomerId(customerID);

      if (reviews) {
        this.cache.set(cacheKey, reviews);
      }

      return reviews;
    } catch (error: any) {
      throw new ReviewError('Error retrieving review', error);
    }
  }

  /**
   * Gets a review from the database based on Product Id.
   * @param productId - Id of the product.
   * @returns A Promise that resolves with the review data or null if not found.
   */
  public async findByProductId(productId: number): Promise<Review[] | null> {
    try {
      const cacheKey = `reviews_product_${productId}`;
      const cachedReviews = await this.cache.get<Review[]>(cacheKey);

      if (cachedReviews) return cachedReviews;

      const reviews = await ReviewModel.findByProductId(productId);

      if (reviews) {
        const saved = this.cache.set(cacheKey, reviews);
        console.log(`Product reviews cached = ${saved}`);
      }

      return reviews;
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
  public async update(reviewUUID: string, updatedFields: Partial<Review>): Promise<Review> {
    try {
      if (Object.keys(updatedFields).length === 0) {
        throw new ReviewError('No fields provided for update');
      }

      const updatedReview = await ReviewModel.updateRecord(reviewUUID, updatedFields);

      if (updatedReview) {
        this.cache.remove(`reviews_product_${updatedReview.product_id}`);
      }

      return updatedReview;
    } catch (error: any) {
      throw new ReviewError('Error updating review', error);
    }
  }

  /**
   * Deletes a review from the database based on the provided ID.
   * @param reviewUUID - UUID of the review to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async delete(reviewUUID: string): Promise<boolean> {
    try {
      const review = await ReviewModel.findByUuid(reviewUUID);
      
      if (!review) throw ReviewError.reviewNotFound();

      const reviewDeleted = await ReviewModel.delete(reviewUUID);

      if (reviewDeleted) {
        this.cache.remove(`reviews_product_${review.product_id}`);
      }

      return reviewDeleted;
    } catch (error: any) {
      throw new ReviewError('Error deleting review', error);
    }
  }
}

export default new ReviewRepository;