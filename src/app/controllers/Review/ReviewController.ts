import { Request, Response } from 'express';
import CustomerRepository from 'repositories/CustomerRepository';
import ReviewRepository from 'repositories/ReviewRepository';
import { Customer, Review } from '@types';
import { ReviewError, CustomerError } from 'builders/errors';
import { ResponseBuilder } from 'builders/response';
import schemaResponseError from 'validators/response/schemaResponseError';

class ReviewController {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      schemaResponseError(req, res);

      const customerUUID: string = req.params.uuid;
      const reviewData: Review = req.body;

      if (!reviewData) {
        throw CustomerError.invalidInput();
      }

      const customer: Customer | null = await CustomerRepository.get(customerUUID);
      const customerNotFound: boolean = [customer, customer?.id, customer?.uuid].some(
        value => value === null || value === undefined
      );

      if (customerNotFound) {
        throw CustomerError.customerNotFound();
      }

      reviewData.customer_id = customer!.id as number;
      
      const reviewCreated = await ReviewRepository.create(reviewData);

      if (!reviewCreated) {
        throw ReviewError.reviewCreationFailed();
      }

      ResponseBuilder.send({
        response: res,
        message: "Review created successfully!",
        statusCode: 201
      });
    } catch (error: any) {
      ReviewError.handleError(res, error);
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      schemaResponseError(req, res);

      const reviewUUID: string = req.params.uuid;
      const updatedFields: Partial<Review> = req.body;

      if (!updatedFields || !updatedFields) {
        throw ReviewError.invalidInput();
      }

      const reviewCreated = await ReviewRepository.update(reviewUUID, updatedFields);

      if (!reviewCreated) {
        throw ReviewError.reviewCreationFailed()
      }

      ResponseBuilder.send({
        response: res,
        message: "Review updated successfully!",
        statusCode: 200
      });
    } catch (error: any) {
      ReviewError.handleError(res, error);
    }
  }

  public async getByCustomer(req: Request, res: Response): Promise<void> {
    try {
      schemaResponseError(req, res);

      const customerID: number = Number(req.params.id);

      const review: Review[] | null = await ReviewRepository.findByCustomerId(customerID);

      if (!review) {
        throw ReviewError.reviewNotFound();
      }

      ResponseBuilder.send({
        response: res,
        message: "Review retrieved successfully!",
        statusCode: 200,
        data: review
      });
    } catch (error: any) {
      ReviewError.handleError(res, error);
    }
  }

  public async getByProduct(req: Request, res: Response): Promise<void> {
    try {
      schemaResponseError(req, res);
      
      const productID: number = Number(req.params.id);
      const review: Review[] | null = await ReviewRepository.findByProductId(productID);
      
      if (!review) {
        throw ReviewError.reviewNotFound();
      }

      ResponseBuilder.send({
        response: res,
        message: "Review retrieved successfully!",
        statusCode: 200,
        data: review
      });
    } catch (error: any) {
      ReviewError.handleError(res, error);
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      schemaResponseError(req, res);

      const reviewUUID: string = req.params.uuid;

      const reviewDeleted = await ReviewRepository.delete(reviewUUID);

      if (!reviewDeleted) {
        throw ReviewError.reviewDeletionFailed();
      }

      ResponseBuilder.send({
        response: res,
        message: "Review deleted successfully!",
        statusCode: 200
      });
    } catch (error: any) {
      ReviewError.handleError(res, error);
    }
  }
}

export default new ReviewController;