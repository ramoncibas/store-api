import config from 'config/environment';
import dotenv from 'dotenv';
dotenv.config(config.envFilePath);

import { Request, Response } from 'express';
import supertest from 'supertest';

import ReviewController from 'controllers/Review/ReviewController';
import CustomerRepository from 'repositories/CustomerRepository';
import ReviewRepository from 'repositories/ReviewRepository';
import CustomerError from 'builders/errors/CustomerError';
import ResponseBuilder from 'builders/response/ResponseBuilder';
import Review from 'types/Review.type';

import {
  customer,
  review,
  reviewBase,
  enumReview
} from '__mocks__';

const JWT_DEV_TOKEN = process.env.JWT_DEV_TOKEN || '';

jest.mock('repositories/ReviewRepository', () => ({
  ...jest.requireActual('repositories/ReviewRepository'),
  get: jest.fn(),
  create: jest.fn(),
  search: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('repositories/CustomerRepository', () => ({
  ...jest.requireActual('repositories/CustomerRepository'),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('builders/response/ResponseBuilder', () => ({
  send: jest.fn(),
}));

describe('Mock - ReviewController', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      params: { uuid: '1djshagb2' }
    } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    beforeEach(() => {
      req.body = reviewBase;
    });

    test('should create a new review successfully', async () => {
      try {
        const customerUUID = req.params.uuid;
        const reviewCreated = {...reviewBase, customer_id: 1};
        (CustomerRepository.get as jest.Mock).mockResolvedValue(customer);
        (ReviewRepository.create as jest.Mock).mockResolvedValueOnce(reviewBase);

        await ReviewController.create(req as Request, res as Response);

        expect(CustomerRepository.get).toHaveBeenCalledWith(customerUUID);
        expect(ReviewRepository.create).toHaveBeenCalledWith(reviewBase);
        
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          "type": 'success',
          "title": 'Success',
          "message": 'Review created successfully!',
          "statusCode": 201
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    return

    test('should handle missing customer and return 404 status', async () => {
      try {
        const req_404 = {
          params: { uuid: 'dqw111111' },
          body: review
        } as unknown as Request;

        const customerUUID_404 = req_404.params.uuid;

        (CustomerRepository.get as jest.Mock).mockResolvedValue(null);

        await ReviewController.create(req_404, res);

        expect(CustomerRepository.get).toHaveBeenCalledWith(customerUUID_404);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
          "type": "error",
          "title": "Error",
          "message": "Customer not found!",
          "errorCode": 404,
          "data": null
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should handle errors and return 500 status', async () => {
      try {
        (CustomerRepository.get as jest.Mock).mockRejectedValue(CustomerError.default());

        await ReviewController.create(req, res)

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          "data": null,
          "errorCode": 500,
          "message": "Something went wrong!",
          "title": "Error",
          "type": "error",
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });
  });

  return

  describe('getReview', () => {
    test('should retrieve a review successfully', async () => {
      const req: Request = {
        params: { reviewUUID: 'reviewUUID' },
      } as unknown as Request;
      const res: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (ReviewRepository.search as jest.Mock).mockResolvedValue([{ reviewData: 'value' }]);

      await ReviewController.getByCustomer(req, res);

      expect(ReviewRepository.search).toHaveBeenCalledWith('uuid', 'reviewUUID');
      expect(ResponseBuilder.send).toHaveBeenCalledWith({
        response: res,
        message: 'Review retrieved successfully!',
        statusCode: 200,
        data: [{ reviewData: 'value' }],
      });
    });

    test('should handle review not found and return 404 status', async () => {
      const req: Request = {
        params: { reviewUUID: 'reviewUUID' },
      } as unknown as Request;
      const res: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (ReviewRepository.search as jest.Mock).mockResolvedValue([]);

      await ReviewController.getByCustomer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        type: 'error',
        message: 'Review not found!',
        errorCode: 404,
        data: null,
      });
    });
  });

  describe('getReviewByProduct', () => {
    test('should retrieve reviews by product successfully', async () => {
      (ReviewRepository.search as jest.Mock).mockResolvedValue(null);

      await ReviewController.getByProduct(req, res);

      expect(ReviewRepository.search).toHaveBeenCalledWith('product_id', review.product_id);
      expect(ResponseBuilder.send).toHaveBeenCalledWith({
        response: res,
        message: 'Review retrieved successfully!',
        statusCode: 200,
        data: review,
      });
    });

    test('should handle reviews not found for product and return 404 status', async () => {
      (ReviewRepository.search as jest.Mock).mockResolvedValue([]);

      await ReviewController.getByProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        type: 'error',
        message: 'No reviews found for the product!',
        errorCode: 404,
        data: null,
      });
    });
  });
})

describe('Supertest - ReviewController', () => {
  return

  describe('POST /review/customer/:uuid/create', () => {
    let baseUrl: string = 'http://localhost:5000';

    test('should create a new review successfully', async () => {
      try {
        const response = await supertest(baseUrl)
          .post(`/review/customer/${customer.uuid}/create`)
          .set('x-access-token', JWT_DEV_TOKEN)
          .send(review)

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          data: null,
          type: 'success',
          message: 'Review created successfully!',
          statusCode: 201
        });

        if (!response) throw new Error();

      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should handle missing customer and return 404 status', async () => {
      try {
        const response = await supertest(baseUrl)
          .post(`/review/customer/${customer.uuid}404/create`)
          .set('x-access-token', JWT_DEV_TOKEN)
          .send(review);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          type: 'error',
          message: 'Customer not found!',
          errorCode: 404,
          data: null
        });

        if (!response) throw new Error();

      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });
  });
})
