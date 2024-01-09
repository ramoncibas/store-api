import { Request, Response } from 'express';
import CustomerController from 'controllers/Customer/CustomerController';
import CustomerRepository from 'repositories/CustomerRepository';
import UserRepository from 'repositories/UserRepository';
import CustomerError from 'errors/CustomerError';
import ReviewRepository from 'repositories/ReviewRepository';
import Customer from 'types/Customer.type';
import Review from 'types/Review.type';

jest.mock('repositories/CustomerRepository', () => ({
  ...jest.requireActual('repositories/CustomerRepository'),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

jest.mock('repositories/UserRepository', () => ({
  ...jest.requireActual('repositories/UserRepository'),
  getByPattern: jest.fn(),
}));

const customer: Customer = {
  id: '1',
  uuid: '1djshagb2',
  user_id: '24',
  shipping_address: 'Alameda dos Anjos',
  card_number: '3400010300',
  card_expiry_date: '20281211',
  card_security_code: '123',
  last_purchase_date: '20240107',
  total_purchases: 1290,
  favorite_categories: 'Masculino',
  favorite_brands: 'Nike',
  customer_reviews: '2',
};

const review: Partial<Review> = {
  product_id: '1',
  customer_id: '1',
  rating: 5,
  comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  review_date: '20240107'
};

describe('CustomerController', () => {
  describe('getCustomer', () => {
    const req = {
      params: { uuid: '1djshagb2' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    test('should get a customer successfully', async () => {
      try {
        // Mock CustomerRepository.get to return an existing customer
        (CustomerRepository.get as jest.Mock).mockResolvedValue(customer);

        await CustomerController.getCustomer(req, res);

        expect(CustomerRepository.get).toHaveBeenCalledWith(req.params.uuid);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(customer);
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
        expect(res.send).toHaveBeenCalledWith({
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
        expect(res.send).toHaveBeenCalledWith({
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
    const req = { body: customer } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    test('should create a new customer successfully', async () => {
      try {
        // Mock UserRepository.getByPattern to return an existing customer
        (UserRepository.getByPattern as jest.Mock).mockResolvedValue(null);

        await CustomerController.createCustomer(req, res);

        expect(UserRepository.getByPattern).toHaveBeenCalledWith('id', '24');
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

        expect(UserRepository.getByPattern).toHaveBeenCalledWith('id', '24');
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.send).toHaveBeenCalledWith({
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

        expect(UserRepository.getByPattern).toHaveBeenCalledWith('id', '24');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
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
    const req = {
      params: { uuid: '1djshagb2' },
      body: review,
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

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
        expect(res.send).toHaveBeenCalledWith({
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
        expect(res.send).toHaveBeenCalledWith({
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
        expect(res.send).toHaveBeenCalledWith({
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
    const req = {
      params: { uuid: '1djshagb2' }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    test('should delete a customer successfully', async () => {
      try {
        const customerUUID = req.params.uuid;

        (CustomerRepository.get as jest.Mock).mockResolvedValue(customerUUID);

        await CustomerController.deleteCustomer(req, res);
        expect(CustomerRepository.get).toHaveBeenCalledWith('1djshagb2');
        expect(CustomerRepository.delete).toHaveBeenCalledWith('1djshagb2');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
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
        expect(res.send).toHaveBeenCalledWith({
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

