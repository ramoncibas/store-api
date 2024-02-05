import { Request, Response } from 'express';
import CustomerRepository from 'repositories/CustomerRepository';
import ReviewRepository from 'repositories/ReviewRepository';
import Customer from 'types/Customer.type';
import Review from 'types/Review.type';
import ReviewError from 'builders/errors/ReviewError';
import CustomerError from 'builders/errors/CustomerError';
import ResponseBuilder from 'builders/response/ResponseBuilder';

class ReviewController {
  static async createReview(req: Request, res: Response): Promise<void> {
    try {
      const customerUUID: string = req.params.uuid;
      const reviewData: Review = req.body;

      if (!reviewData) {
        throw CustomerError.invalidInput();
      }

      const customer: Customer | null = await CustomerRepository.get(customerUUID);

      if (!customer || customer.id === null) {
        throw CustomerError.customerNotFound();
      }

      reviewData.customer_id = customer.id as number;

      const reviewCreated = await ReviewRepository.create(reviewData);

      if (!reviewCreated) {
        throw ReviewError.reviewCreationFailed();
      }

      return ResponseBuilder.send({
        response: res,
        message: "Review created successfully!",
        statusCode: 201
      });
    } catch (error: any) {
      ReviewError.handleError(res, error);
    }
  }
  static async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const reviewUUID: string = req.params.uuid;
      const updatedFields: Partial<Review> = req.body;

      // utilizar o schema de validação aqui
      if (!updatedFields || !updatedFields) {
        throw ReviewError.invalidInput();
      }

      const reviewCreated = await ReviewRepository.update(reviewUUID, updatedFields);

      if (!reviewCreated) {
        throw ReviewError.reviewCreationFailed()
      }

      return ResponseBuilder.send({
        response: res,
        message: "Review updated successfully!",
        statusCode: 200
      });
    } catch (error: any) {
      ReviewError.handleError(res, error);
    }
  }

  static async getReview(req: Request, res: Response): Promise<void> {
    try {
      const reviewUUID: string = req.params.reviewUUID;

      const review: Review[] | null = await ReviewRepository.getByPattern('uuid', reviewUUID);

      if (!review) {
        throw ReviewError.reviewNotFound();
      }

      return ResponseBuilder.send({
        response: res,
        message: "Review retrieved successfully!",
        statusCode: 200,
        data: review
      });
    } catch (error: any) {
      ReviewError.handleError(res, error);
    }
  }

  static async getReviewByProduct(req: Request, res: Response): Promise<void> {
    try {
      const product_id: string = req.params.id;

      const review: Review[] | null = await ReviewRepository.getByPattern('product_id', product_id);

      if (!review) {
        throw ReviewError.reviewNotFound();
      }

      return ResponseBuilder.send({
        response: res,
        message: "Review retrieved successfully!",
        statusCode: 200,
        data: review
      });
    } catch (error: any) {
      ReviewError.handleError(res, error);
    }
  }

  static async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const reviewUUID: string = req.params.reviewUUID;

      const reviewDeleted = await ReviewRepository.delete(reviewUUID);

      if (!reviewDeleted) {
        throw ReviewError.reviewDeletionFailed();
      }

      return ResponseBuilder.send({
        response: res,
        message: "Review deleted successfully!",
        statusCode: 200
      });
    } catch (error: any) {
      ReviewError.handleError(res, error);
    }
  }
}

export default ReviewController;