import config from 'config/environment';
import dotenv from 'dotenv';
dotenv.config(config.envFilePath);

import { Request, Response } from 'express';
import supertest from 'supertest';

import CustomerController from 'controllers/Customer/CustomerController';
import CustomerRepository from 'repositories/CustomerRepository';
import UserRepository from 'repositories/UserRepository';
import CustomerError from 'builders/errors/CustomerError';
import ReviewRepository from 'repositories/ReviewRepository';
import Customer from 'types/Customer.type';
import Review from 'types/Review.type';

const JWT_DEV_TOKEN = process.env.JWT_DEV_TOKEN || '';

jest.mock('repositories/CustomerRepository', () => ({
  ...jest.requireActual('repositories/CustomerRepository'),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('repositories/ReviewRepository', () => ({
  create: jest.fn(),
}));

jest.mock('repositories/UserRepository', () => ({
  ...jest.requireActual('repositories/UserRepository'),
  getByPattern: jest.fn(),
}));

const randomID = () => Math.floor(Math.random() * 100000);

const customer: Partial<Customer> = {
  id: 1,
  user_id: 1,
  uuid: "1djshagb2",
  card_expiry_date: "20281211",
  card_number: "3400010300231211",
  card_security_code: "123",
  customer_reviews: "2",
  favorite_brands: "Nike",
  favorite_categories: "Masculino",
  last_purchase_date: "20240107",
  shipping_address: "Alameda dos Anjos",
  total_purchases: 1290
};

const customerToUpdate: Partial<Customer> = {
  card_expiry_date: "11111111",
  card_number: "1111111111111111",
  card_security_code: "111",
  customer_reviews: "11",
  favorite_brands: "11111111",
  favorite_categories: "11111111",
  last_purchase_date: "11111111",
  shipping_address: "11111111",
  total_purchases: 1111
};

const review: Partial<Review> = {
  product_id: randomID(),
  rating: 5,
  comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  review_date: '20240107'
};

describe('Mock - CustomerController', () => {
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

  describe('getCustomer', () => {
    test('should get a customer successfully', async () => {
      try {
        (CustomerRepository.get as jest.Mock).mockResolvedValue(customer);

        await CustomerController.getCustomer(req, res);

        expect(CustomerRepository.get).toHaveBeenCalledWith(req.params.uuid);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(customer);
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should handle missing customer and return 404 status', async () => {
      try {
        (CustomerRepository.get as jest.Mock).mockResolvedValue(null);

        await CustomerController.getCustomer(req, res);

        expect(CustomerRepository.get).toHaveBeenCalledWith(req.params.uuid);
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
        (CustomerRepository.get as jest.Mock).mockRejectedValue(new Error('Mocked error'));

        await expect(CustomerController.getCustomer(req, res)).rejects.toThrow(CustomerError);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          "type": "error",
          "title": "Error",
          "message": "Something went wrong while fetching the customer.",
          "errorCode": 500,
          "data": null
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });
  });

  describe('createCustomer', () => {
    beforeEach(() => {
      req.body = customer;
    });

    test('should create a new customer successfully', async () => {
      try {
        (UserRepository.getByPattern as jest.Mock).mockResolvedValue(null);

        await CustomerController.createCustomer(req, res);

        expect(UserRepository.getByPattern).toHaveBeenCalledWith('id', 1);
        expect(CustomerRepository.create).toHaveBeenCalledWith(customer);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith('Customer created successfully!');
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should handle existing customer and return 409 status', async () => {
      try {
        (UserRepository.getByPattern as jest.Mock).mockResolvedValue(customer);

        await CustomerController.createCustomer(req, res);

        expect(UserRepository.getByPattern).toHaveBeenCalledWith('id', 1);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
          "type": "error",
          "title": "Error",
          "message": "Customer already exists!",
          "errorCode": 409,
          "data": null
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should handle errors and return 500 status', async () => {
      try {
        (UserRepository.getByPattern as jest.Mock).mockRejectedValue(new Error('Mocked error'));

        await expect(CustomerController.createCustomer(req, res)).rejects.toThrow(CustomerError);

        expect(UserRepository.getByPattern).toHaveBeenCalledWith('id', 1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          "type": "error",
          "title": "Error",
          "message": "Error creating customer",
          "errorCode": 500,
          "data": null
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });
  });

  describe('createReview', () => {
    beforeEach(() => {
      req.body = review;
    });

    test('should create a new review successfully', async () => {
      try {
        const customerUUID = req.params.uuid;

        (CustomerRepository.get as jest.Mock).mockResolvedValue(customer);

        jest.spyOn(ReviewRepository, 'create').mockResolvedValue();

        await CustomerController.createReview(req, res);

        expect(CustomerRepository.get).toHaveBeenCalledWith(customerUUID);
        expect(ReviewRepository.create).toHaveBeenCalledWith({
          product_id: review.product_id,
          customer_id: customer.id,
          rating: review.rating,
          comment: review.comment,
          review_date: review.review_date,
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          type: 'success',
          title: 'Success',
          message: 'Review created successfully!',
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should handle missing customer and return 404 status', async () => {
      try {
        (CustomerRepository.get as jest.Mock).mockResolvedValue(null);

        await CustomerController.createReview(req, res);

        expect(CustomerRepository.get).toHaveBeenCalledWith(customer.uuid);
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
        (CustomerRepository.get as jest.Mock).mockRejectedValue(new Error('Mocked error'));

        await expect(CustomerController.createReview(req, res)).rejects.toThrow(CustomerError);

        expect(CustomerRepository.get).toHaveBeenCalledWith(customer.uuid);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          "type": "error",
          "title": "Error",
          "message": "Error creating review",
          "errorCode": 500,
          "data": null
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });
  });

  describe('updateCustomer', () => {
    beforeEach(() => {
      req.body = customerToUpdate;
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test('should update customer successfully with valid input', async () => {

      (CustomerRepository.get as jest.Mock).mockResolvedValue(customer);
      (CustomerRepository.update as jest.Mock).mockResolvedValue(null);

      await CustomerController.getCustomer(req, res);
      await CustomerController.updateCustomer(req, res);

      expect(CustomerRepository.get).toHaveBeenCalledWith(customer.uuid);
      expect(CustomerRepository.update).toHaveBeenCalledWith(customer.uuid, customerToUpdate);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        type: 'success',
        title: 'Success',
        message: 'Customer updated successfully!',
      });
    });

    test('should return 400 for invalid input', async () => {
      const wrongReq = {
        params: { uuid: '1djshagb2' },
        body: { ...customerToUpdate, card_expiry_date: '' }
      } as unknown as Request;

      (CustomerRepository.get as jest.Mock).mockResolvedValue(customer);

      await CustomerController.updateCustomer(wrongReq, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        type: 'error',
        title: 'Error',
        message: 'Invalid input provided.',
        data: null,
        errorCode: 400
      });

      expect(CustomerRepository.update).not.toHaveBeenCalled();
    });

    test('should handle customer not found with 404 status', async () => {
      (CustomerRepository.get as jest.Mock).mockResolvedValue(null);

      await CustomerController.updateCustomer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalled();

      expect(CustomerRepository.update).not.toHaveBeenCalled();
    });

    test('should handle internal server error with 500 status', async () => {
      try {
        (CustomerRepository.get as jest.Mock).mockRejectedValue(new Error('Mocked error'));

        await expect(CustomerController.updateCustomer(req, res)).rejects.toThrow(CustomerError);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          "type": "error",
          "title": "Error",
          "message": "Failed to update the customer.",
          "errorCode": 500,
          "data": null
        });

        expect(CustomerRepository.update).not.toHaveBeenCalled();
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });
  });

  describe('deleteCustomer', () => {
    test('should delete a customer successfully', async () => {
      try {
        const customerUUID = req.params.uuid;

        (CustomerRepository.get as jest.Mock).mockResolvedValue(customerUUID);

        await CustomerController.deleteCustomer(req, res);
        expect(CustomerRepository.get).toHaveBeenCalledWith('1djshagb2');
        expect(CustomerRepository.delete).toHaveBeenCalledWith('1djshagb2');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          type: "success",
          title: "Success",
          message: "Customer deleted successfully!"
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should return 500 when customer deletion fails', async () => {
      try {
        // Mocking CustomerRepository.get to return a mock customer
        (CustomerRepository.delete as jest.Mock).mockRejectedValue(new Error('Mocked error'));

        await expect(CustomerController.deleteCustomer(req, res)).rejects.toThrow(CustomerError);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          "data": null,
          "errorCode": 500,
          "message": "Failed to delete the customer.",
          "title": "Error",
          "type": "error",
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });
  });
});

describe('Supertest - CustomerController', () => {
  let baseUrl: string = 'http://localhost:5000';

  describe('GET /customer/:uuid', () => {
    test('should get a customer successfully', async () => {
      const response = await supertest(baseUrl)
        .get(`/customer/${customer.uuid}`)
        .set('x-access-token', JWT_DEV_TOKEN);

      expect(typeof response.body).toBe('object');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(customer);
    });

    test('should handle missing customer and return 404 status', async () => {
      const response = await supertest(baseUrl)
        .get(`/customer/${customer.uuid}404`)
        .set('x-access-token', JWT_DEV_TOKEN);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        type: 'error',
        title: 'Error',
        message: 'Customer not found!',
        errorCode: 404,
        data: null
      });
    });
  });

  describe('POST /customer/:uuid/create/review', () => {
    test('should create a new review successfully', async () => {
      const response = await supertest(baseUrl)
        .post(`/customer/${customer.uuid}/create/review`)
        .set('x-access-token', JWT_DEV_TOKEN)
        .send(review)

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        type: 'success',
        title: 'Success',
        message: 'Review created successfully!'
      });
    });

    test('should handle missing customer and return 404 status', async () => {
      const response = await supertest(baseUrl)
        .post(`/customer/${customer.uuid}404/review`)
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
    });
  });

  describe('POST /customer/create', () => {
    test('should create a new customer successfully', async () => {
      const customer201 = { ...customer, user_id: randomID() }
      delete customer201.id;
      delete customer201.uuid;

      const response = await supertest(baseUrl)
        .post('/customer/create')
        .set('x-access-token', JWT_DEV_TOKEN)
        .send(customer201);

      expect(response.status).toBe(201);
      expect(response.text).toBe('Customer created successfully!');
    });

    test('should handle existing customer and return 409 status', async () => {
      const customer409 = { ...customer, user_id: 1 }
      delete customer409.id;

      const response = await supertest(baseUrl)
        .post('/customer/create')
        .set('x-access-token', JWT_DEV_TOKEN)
        .send(customer409);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        type: 'error',
        title: 'Error',
        message: 'Customer already exists!',
        errorCode: 409,
        data: null
      });
    });
  });

  describe('PATCH /customer/:uuid', () => {
    test('should update customer successfully', async () => {
      const response = await supertest(baseUrl)
        .patch(`/customer/${customer.uuid}`)
        .set('x-access-token', JWT_DEV_TOKEN)
        .send(customerToUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        type: 'success',
        title: 'Success',
        message: 'Customer updated successfully!'
      });

      const customerRollback = { ...customer }
      delete customerRollback.id;
      delete customerRollback.uuid;
      delete customerRollback.user_id;

      const responseRollback = await supertest(baseUrl)
        .patch(`/customer/${customer.uuid}`)
        .set('x-access-token', JWT_DEV_TOKEN)
        .send(customerRollback);

      expect(responseRollback.status).toBe(200);
      expect(responseRollback.body).toEqual({
        type: 'success',
        title: 'Success',
        message: 'Customer updated successfully!'
      });
    });

    test('should handle existing customer and return 409 status', async () => {
      const customer409 = { ...customer, user_id: 1 }
      delete customer409.id;

      const response = await supertest(baseUrl)
        .post('/customer/create')
        .set('x-access-token', JWT_DEV_TOKEN)
        .send(customer409);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        type: 'error',
        title: 'Error',
        message: 'Customer already exists!',
        errorCode: 409,
        data: null
      });
    });
  });

  return
  describe('DELETE /customer/:uuid', () => {
    test('should delete a customer successfully', async () => {
      const response = await supertest(baseUrl)
        .delete(`/customer/delete/${customer.uuid}`)
        .set('x-access-token', JWT_DEV_TOKEN);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        type: 'success',
        title: 'Success',
        message: 'Customer deleted successfully!'
      });
    });
  });
});

