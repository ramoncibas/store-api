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
        throw ReviewError.creationFailed();
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

      if (!reviews) {
        throw ReviewError.notFound();
      }

      await this.cache.set(cacheKey, reviews);

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

      if (!reviews) {
        throw ReviewError.notFound();
      }

      await this.cache.set(cacheKey, reviews);

      return reviews;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Updates the data of a review in the database.
   * @param customerId - ID of the customer.
   * @param reviewUUID - UUID of the review to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async update(customerId: number, reviewUUID: string, updatedFields: Partial<Review>): Promise<Review> {
    try {
      if (Object.keys(updatedFields).length === 0) {
        throw ReviewError.updateFailed();
      }

      const review = await ReviewModel.findByUUID(reviewUUID);

      if (!review || review.customer_id != customerId) {
        console.log('Customer diferente!')
        throw ReviewError.notFound();
      }

      const updatedReview = await ReviewModel.updateRecord(reviewUUID, updatedFields);
      
      if (!updatedReview) {
        throw ReviewError.updateFailed();
      }

      const cacheKey = this.cacheKey.review(updatedReview.product_id);
      await this.cache.remove(cacheKey);

      return updatedReview;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Deletes a review from the database based on the provided ID.
   * @param customerId - ID of the customer to delete review.
   * @param reviewUUID - UUID of the review to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async delete(customerId: number, reviewUUID: string): Promise<boolean> {
    try {
      const review: Review | null = await ReviewModel.findByUUID(reviewUUID);

      if (!review || review && review.customer_id != customerId) {
        throw ReviewError.notFound();
      }

      if (!review) throw ReviewError.notFound();

      const reviewDeleted = await ReviewModel.deleteRecord(reviewUUID);

      if (!reviewDeleted) {
        throw ReviewError.deletionFailed();
      }

      const cacheKey = this.cacheKey.review(review.product_id);
      await this.cache.remove(cacheKey);

      return reviewDeleted;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new ReviewRepository;