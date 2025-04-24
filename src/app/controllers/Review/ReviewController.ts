import { Request, Response } from 'express';
import CustomerRepository from 'repositories/CustomerRepository';
import ReviewRepository from 'repositories/ReviewRepository';
import { Customer, Review } from '@types';
import { ReviewError, CustomerError } from 'builders/errors';
import { ResponseBuilder } from 'builders/response';

class ReviewController {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const customerId: number = Number(req.user?.id);
      const reviewData: Review = req.body;

      if (!customerId ||!reviewData) {
        throw CustomerError.invalidInput();
      }

      const customer: Customer | null = await CustomerRepository.get(customerId);
      const customerNotFound: boolean = [customer, customer?.id, customer?.uuid].some(
        value => value === null || value === undefined
      );

      if (customerNotFound) {
        throw CustomerError.notFound();
      }

      reviewData.customer_id = customer!.id as number;
      
      const reviewCreated = await ReviewRepository.create(reviewData);

      if (!reviewCreated) {
        throw ReviewError.creationFailed();
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
      const customerId: number = Number(req.user?.id);
      const reviewUUID: string = req.params?.uuid;
      const updatedFields: Partial<Review> = req.body;

      if (!reviewUUID || !updatedFields) {
        throw ReviewError.invalidInput();
      }

      const reviewCreated = await ReviewRepository.update(customerId, reviewUUID, updatedFields);

      if (!reviewCreated) {
        throw ReviewError.creationFailed();
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
      const customerID: number = Number(req.user?.id);

      const review: Review[] | null = await ReviewRepository.findByCustomerId(customerID);

      if (!review) {
        throw ReviewError.notFound();
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
      const productID: number = Number(req.params.id);
      const review: Review[] | null = await ReviewRepository.findByProductId(productID);
      
      if (!review) {
        throw ReviewError.notFound();
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
      const customerId: number = Number(req.user?.id);
      const reviewUUID: string = req.params.uuid;

      if (!customerId || !reviewUUID) {
        throw ReviewError.invalidInput();
      }

      const reviewDeleted = await ReviewRepository.delete(customerId, reviewUUID);

      if (!reviewDeleted) {
        throw ReviewError.deletionFailed();
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