import config from 'config/environment';
import dotenv from 'dotenv';
dotenv.config(config.envFilePath);

import { Request, Response } from 'express';
import supertest from 'supertest';

import ReviewController from 'controllers/Review/ReviewController';
import CustomerRepository from 'repositories/CustomerRepository';
import ReviewRepository from 'repositories/ReviewRepository';
import CustomerError from 'builders/errors/CustomerError';
import Review from 'types/Review.type';

import {
  customer,
  review,
} from '../../mock/_mock';

const JWT_DEV_TOKEN = process.env.JWT_DEV_TOKEN || '';

jest.mock('repositories/ReviewRepository', () => ({
  create: jest.fn(),
}));

jest.mock('repositories/CustomerRepository', () => ({
  ...jest.requireActual('repositories/CustomerRepository'),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
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

  describe('createReview', () => {
    beforeEach(() => {
      req.body = review;
    });

    test('should create a new review successfully', async () => {
      try {
        const customerUUID = req.params.uuid;
        const createReview = { ...review, customer_id: customer.id };

        (CustomerRepository.get as jest.Mock).mockResolvedValue(customer);

        jest.spyOn(ReviewRepository, 'create').mockResolvedValue(createReview as Review);

        await ReviewController.createReview(req, res);

        expect(CustomerRepository.get).toHaveBeenCalledWith(customerUUID);
        expect(ReviewRepository.create).toHaveBeenCalledWith(createReview);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          "data": null,
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

    test('should handle missing customer and return 404 status', async () => {
      try {
        const req_404 = {
          params: { uuid: 'dqw111111' },
          body: review
        } as unknown as Request;

        const customerUUID_404 = req_404.params.uuid;

        (CustomerRepository.get as jest.Mock).mockResolvedValue(null);

        await ReviewController.createReview(req_404, res);

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

        await ReviewController.createReview(req, res)

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
})

describe('Supertest - ReviewController', () => {
  describe('POST /review/:uuid/create', () => {
    let baseUrl: string = 'http://localhost:5000';

    test('should create a new review successfully', async () => {
      try {
        const response = await supertest(baseUrl)
          .post(`/review/${customer.uuid}/create`)
          .set('x-access-token', JWT_DEV_TOKEN)
          .send(review)

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          data: null,
          type: 'success',
          title: 'Success',
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
          .post(`/review/${customer.uuid}404/create`)
          .set('x-access-token', JWT_DEV_TOKEN)
          .send(review);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          type: 'error',
          title: 'Error',
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


