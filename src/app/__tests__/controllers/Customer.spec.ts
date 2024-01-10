import express, { Request, Response } from 'express';
import supertest from 'supertest';
import appRoutes from 'routes';

import CustomerController from 'controllers/Customer/CustomerController';
import CustomerRepository from 'repositories/CustomerRepository';
import UserRepository from 'repositories/UserRepository';
import CustomerError from 'errors/CustomerError';
import ReviewRepository from 'repositories/ReviewRepository';
import Customer from 'types/Customer.type';
import Review from 'types/Review.type';
import DatabaseManager from '../../../config/db';
import { authMiddleware } from '../../middlewares';


beforeAll(async () => {
  const dbManager = new DatabaseManager();
  await dbManager.initializeTestData();
});

afterAll(async () => {
  const dbManager = new DatabaseManager();
  await dbManager.close();
});

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


const customer: Customer = {
  id: 2,
  user_id: 24,
  uuid: "1djshagb2",
  card_expiry_date: "20281211",
  card_number: "3400010300",
  card_security_code: "123",
  customer_reviews: "2",
  favorite_brands: "Nike",
  favorite_categories: "Masculino",
  last_purchase_date: "20240107",
  shipping_address: "Alameda dos Anjos",
  total_purchases: 1290
};

const review: Partial<Review> = {
  product_id: '1',
  customer_id: '1',
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
        // Mock CustomerRepository.get to return an existing customer
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
        // Mock CustomerRepository.get to return null
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
        // Mock CustomerRepository.get to return an error
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
        // Mock UserRepository.getByPattern to return an existing customer
        (UserRepository.getByPattern as jest.Mock).mockResolvedValue(null);

        await CustomerController.createCustomer(req, res);

        expect(UserRepository.getByPattern).toHaveBeenCalledWith('id', 24);
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
        // Mock UserRepository.getByPattern to return an existing customer
        (UserRepository.getByPattern as jest.Mock).mockResolvedValue(customer);

        await CustomerController.createCustomer(req, res);

        expect(UserRepository.getByPattern).toHaveBeenCalledWith('id', 24);
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
        // Mock UserRepository.getByPattern to return an error
        (UserRepository.getByPattern as jest.Mock).mockRejectedValue(new Error('Mocked error'));

        await expect(CustomerController.createCustomer(req, res)).rejects.toThrow(CustomerError);

        expect(UserRepository.getByPattern).toHaveBeenCalledWith('id', 24);
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

        // Mock CustomerRepository.get to return an existing customer
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
        // Mock CustomerRepository.get to return null
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
        // Mock CustomerRepository.get to return an error
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
  // Escrever os testes de Update
});

describe('Supertest - CustomerController', () => {  
  let baseUrl: string = 'http://localhost:5000';

  // ajustar o middlware de authMiddleware, para conseguir lidar com token padrão
  describe('GET /customer/:uuid', () => {
    test('should get a customer successfully', async () => {
      const response = await supertest(baseUrl)
        .get(`/customer/${customer.uuid}`)

      expect(typeof response.body).toBe('object');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(customer);
    });

    test('should handle missing customer and return 404 status', async () => {
      const response = await supertest(baseUrl).get(`/customer/${customer.uuid}404`);

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

  describe('POST /customer/:uuid/review', () => {
    test('should create a new review successfully', async () => {
      (ReviewRepository.create as jest.Mock).mockResolvedValueOnce(review);

      const response = await supertest(baseUrl)
        .post(`/customer/${customer.uuid}/review`)
        .send(review);
      console.log(response.body)
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        type: 'success',
        title: 'Success',
        message: 'Review created successfully!'
      });

      expect(ReviewRepository.create).toHaveBeenCalledWith(review);
    });
    return

    test('should handle missing customer and return 404 status', async () => {
      const response = await supertest(baseUrl)
        .post(`/customer/${customer.uuid}404/review`)
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

    test('should handle errors and return 500 status', async () => {
      // Try create a review, with mock data
      const response = await supertest(baseUrl)
        .post(`/customer/${customer.uuid}/review`)
        .send(review);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        type: 'error',
        title: 'Error',
        message: 'Error creating review',
        errorCode: 500,
        data: null
      });
    });
  });

  // Update Customer:
  // request(app)
  // .post('/')
  // .field('name', 'my awesome avatar')
  // .field('complex_object', '{"attribute": "value"}', {contentType: 'application/json'})
  // .attach('avatar', 'test/fixtures/avatar.jpg')

  // describe('POST /customer', () => {
  //   test('should create a new customer successfully', async () => {
  //     // Mock UserRepository.getByPattern to return null
  //     (UserRepository.getByPattern as jest.Mock).mockResolvedValue(null);

  //     const response = await supertest(baseUrl)
  //       .post('/customer')
  //       .send(customer);

  //     expect(UserRepository.getByPattern).toHaveBeenCalledWith('id', customer.user_id);
  //     expect(CustomerRepository.create).toHaveBeenCalledWith(customer);
  //     expect(response.status).toBe(201);
  //     expect(response.text).toBe('Customer created successfully!');
  //   });

  //   test('should handle existing customer and return 409 status', async () => {
  //     // Mock UserRepository.getByPattern to return an existing customer
  //     (UserRepository.getByPattern as jest.Mock).mockResolvedValue(customer);

  //     const response = await supertest(baseUrl)
  //       .post('/customer')
  //       .send(customer);

  //     expect(UserRepository.getByPattern).toHaveBeenCalledWith('id', customer.user_id);
  //     expect(response.status).toBe(409);
  //     expect(response.body).toEqual({
  //       type: 'error',
  //       title: 'Error',
  //       message: 'Customer already exists!',
  //       errorCode: 409,
  //       data: null
  //     });
  //   });

  //   test('should handle errors and return 500 status', async () => {
  //     // Mock UserRepository.getByPattern to return an error
  //     (UserRepository.getByPattern as jest.Mock).mockRejectedValue(new Error('Mocked error'));

  //     const response = await supertest(baseUrl)
  //       .post('/customer')
  //       .send(customer);

  //     expect(UserRepository.getByPattern).toHaveBeenCalledWith('id', customer.user_id);
  //     expect(response.status).toBe(500);
  //     expect(response.body).toEqual({
  //       type: 'error',
  //       title: 'Error',
  //       message: 'Error creating customer',
  //       errorCode: 500,
  //       data: null
  //     });
  //   });
  // });



  // describe('DELETE /customer/:uuid', () => {
  //   test('should delete a customer successfully', async () => {
  //     // Mock CustomerRepository.get to return an existing customer
  //     (CustomerRepository.get as jest.Mock).mockResolvedValue(customer);

  //     const response = await supertest(baseUrl).delete(`/customer/${customer.uuid}`);

  //     expect(CustomerRepository.get).toHaveBeenCalledWith(customer.uuid);
  //     expect(CustomerRepository.delete).toHaveBeenCalledWith(customer.uuid);
  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual({
  //       type: 'success',
  //       title: 'Success',
  //       message: 'Customer deleted successfully!'
  //     });
  //   });

  //   test('should return 500 when customer deletion fails', async () => {
  //     // Mock CustomerRepository.delete to return an error
  //     (CustomerRepository.delete as jest.Mock).mockRejectedValue(new Error('Mocked error'));

  //     const response = await supertest(baseUrl).delete(`/customer/${customer.uuid}`);

  //     expect(response.status).toBe(500);
  //     expect(response.body).toEqual({
  //       type: 'error',
  //       title: 'Error',
  //       message: 'Failed to delete the customer.',
  //       errorCode: 500,
  //       data: null
  //     });
  //   });
  // });
});