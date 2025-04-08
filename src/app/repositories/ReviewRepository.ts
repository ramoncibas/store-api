import ReviewModel from "models/ReviewModel";
import CacheService from "lib/cache";
import { ReviewError } from "builders/errors";
import { Review } from "@types";

class ReviewRepository {
  private cache;

  private cacheKey = {
    customer: (customerId: number) => {
      return `reviews_product_customer_${customerId}`;
    },
    review: (productId: number) => {      
      return `reviews_product_${productId}`;
    },
  };

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

      const cacheKey = this.cacheKey.review(review.product_id);
      await this.cache.set(cacheKey, newReview);

      return newReview;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Gets a review from the database based on the provided ID.
   * @param customerId - Id of the customer.
   * @returns A Promise that resolves with the review data or null if not found.
   */
  public async findByCustomerId(customerId: number): Promise<Review[] | null> {
    try {
      const cacheKey = this.cacheKey.customer(customerId);
      const cachedReviews = await this.cache.get<Review>(cacheKey);

      if (cachedReviews) return cachedReviews.items;

      const reviews = await ReviewModel.findByCustomerId(customerId);

      if (reviews) {
        await this.cache.set(cacheKey, reviews);
      }

      return reviews;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Gets a review from the database based on Product Id.
   * @param productId - Id of the product.
   * @returns A Promise that resolves with the review data or null if not found.
   */
  public async findByProductId(productId: number): Promise<Review[] | null> {
    try {
      const cacheKey = this.cacheKey.review(productId);
      const cachedReviews = await this.cache.get<Review>(cacheKey);

      if (cachedReviews) return cachedReviews.items;

      const reviews = await ReviewModel.findByProductId(productId);

      if (reviews) {
        const cached = await this.cache.set(cacheKey, reviews);
        console.log(`Product reviews cached = ${cached}`);
      }

      return reviews;
    } catch (error: any) {
      throw error;
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
        const cacheKey = this.cacheKey.review(updatedReview.product_id);
        await this.cache.remove(cacheKey);
      }

      return updatedReview;
    } catch (error: any) {
      throw error;
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
        const cacheKey = this.cacheKey.review(review.product_id);
        await this.cache.remove(cacheKey);
      }

      return reviewDeleted;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new ReviewRepository;