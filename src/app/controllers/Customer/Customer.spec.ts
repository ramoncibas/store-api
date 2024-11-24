import config from 'config/environment';
import dotenv from 'dotenv';
dotenv.config(config.envFilePath);

import { Request, Response } from 'express';
import supertest from 'supertest';

import CustomerController from 'controllers/Customer/CustomerController';
import CustomerRepository from 'repositories/CustomerRepository';
import UserRepository from 'repositories/UserRepository';
import CustomerError from 'builders/errors/CustomerError';
import Customer from 'types/Customer.type';

import {
  customer,
  customerBase,
  customerMockToUpdate,
  randomID,
} from '__mocks__';

const JWT_DEV_TOKEN = process.env.JWT_DEV_TOKEN || '';

jest.mock('repositories/CustomerRepository', () => ({
  ...jest.requireActual('repositories/CustomerRepository'),
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('repositories/UserRepository', () => ({
  ...jest.requireActual('repositories/UserRepository'),
  search: jest.fn(),
}));

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
        expect(res.json).toHaveBeenCalledWith({
          message: "Customer retrieved successfully!",
          statusCode: 200,
          title: "Success",
          type: "success",
          data: { ...customer },
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should handle missing customer and return 404 status', async () => {
      try {
        (CustomerRepository.get as jest.Mock).mockResolvedValue(null);

        try {
          await CustomerController.getCustomer(req, res);

        } catch (error) {
          expect(CustomerRepository.get).toHaveBeenCalledWith(req.params.uuid);
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({
            "type": "error",
            "title": "Error",
            "message": "Customer not found!",
            "errorCode": 404,
            "data": null
          });
        }

      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should handle errors and return 500 status', async () => {
      try {
        (CustomerRepository.get as jest.Mock).mockRejectedValue(CustomerError.default());

        try {
          await CustomerController.getCustomer(req, res)
        } catch (error) {
          expect(CustomerRepository.get).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({
            "type": "error",
            "title": "Error",
            "message": "Something went wrong!",
            "errorCode": 500,
            "data": null
          });
        }
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
        (UserRepository.search as jest.Mock).mockResolvedValue(null);
        (CustomerRepository.create as jest.Mock).mockResolvedValue(customer);

        await CustomerController.createCustomer(req, res);

        expect(UserRepository.search).toHaveBeenCalledWith('id', 1);
        expect(CustomerRepository.create).toHaveBeenCalledWith(customer);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          "message": "Customer created successfully!",
          "statusCode": 201,
          "title": "Success",
          "type": "success",
          "data": customer
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should handle existing customer and return 409 status', async () => {
      try {
        (UserRepository.search as jest.Mock).mockResolvedValue(customer);

        await CustomerController.createCustomer(req, res);

        expect(UserRepository.search).toHaveBeenCalledWith('id', 1);
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
        (UserRepository.search as jest.Mock).mockRejectedValue(CustomerError.default());

        await CustomerController.createCustomer(req, res);

        expect(UserRepository.search).toHaveBeenCalledWith('id', 1);
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

  describe('updateCustomer', () => {
    beforeEach(() => {
      req.body = customerMockToUpdate;
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test('should update customer successfully with valid input', async () => {

      (CustomerRepository.get as jest.Mock).mockResolvedValue(customer);
      (CustomerRepository.update as jest.Mock).mockResolvedValue(customerMockToUpdate);

      await CustomerController.updateCustomer(req, res);

      expect(CustomerRepository.get).toHaveBeenCalledWith(customer.uuid);
      expect(CustomerRepository.update).toHaveBeenCalledWith(customer.uuid, customerMockToUpdate);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        type: 'success',
        title: 'Success',
        message: 'Customer updated successfully!',
        statusCode: 200,
        data: customerMockToUpdate
      });
    });

    test('should return 400 for invalid input', async () => {
      const wrongReq = {
        params: { uuid: '1djshagb2' },
        body: null
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
        (CustomerRepository.get as jest.Mock).mockRejectedValue(new CustomerError('Mocked error'));

        await CustomerController.updateCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          "type": "error",
          "title": "Error",
          "message": "Mocked error",
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
        (CustomerRepository.delete as jest.Mock).mockResolvedValue(customerUUID);

        await CustomerController.deleteCustomer(req, res);
        expect(CustomerRepository.get).toHaveBeenCalledWith(customerUUID);
        expect(CustomerRepository.delete).toHaveBeenCalledWith(customerUUID);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          "data": null,
          "type": "success",
          "title": "Success",
          "message": "Customer deleted successfully!",
          "statusCode": 200,
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should return 500 when customer deletion fails', async () => {
      try {
        (CustomerRepository.delete as jest.Mock).mockRejectedValue(new CustomerError('Mocked error'));

        await CustomerController.deleteCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          "data": null,
          "errorCode": 500,
          "message": "Mocked error",
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
      try {
        const response = await supertest(baseUrl)
          .get(`/customer/${customer.uuid}`)
          .set('x-access-token', JWT_DEV_TOKEN);

        expect(typeof response.body).toBe('object');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          type: 'success',
          title: 'Success',
          message: 'Customer retrieved successfully!',
          statusCode: 200,
          data: customer
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should handle missing customer and return 404 status', async () => {
      try {
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
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });
  });

  describe('POST /customer/create', () => {
    test('should create a new customer successfully', async () => {
      try {
        const customer201: Partial<Customer> = { ...customerBase, user_id: randomID() }

        const response = await supertest(baseUrl)
          .post('/customer/create')
          .set('x-access-token', JWT_DEV_TOKEN)
          .send(customer201);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({});
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should handle existing customer and return 409 status', async () => {
      try {
        const response = await supertest(baseUrl)
          .post('/customer/create')
          .set('x-access-token', JWT_DEV_TOKEN)
          .send(customerBase);

        expect(response.status).toBe(409);
        expect(response.body).toEqual({
          type: 'error',
          title: 'Error',
          message: 'Customer already exists!',
          errorCode: 409,
          data: null
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });
  });

  describe('PATCH /customer/update/:uuid', () => {
    test('should update customer successfully', async () => {
      try {
        const response = await supertest(baseUrl)
          .patch(`/customer/update/${customer.uuid}`)
          .set('x-access-token', JWT_DEV_TOKEN)
          .send(customerMockToUpdate);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Customer updated successfully!");
        expect(response.body.data).toMatchObject<Partial<Customer>>(customerMockToUpdate);
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });

    test('should rollback update customer successfully', async () => {
      try {
        const customerRollback: Partial<Customer> = { ...customerBase }

        const responseRollback = await supertest(baseUrl)
          .patch(`/customer/update/${customer.uuid}`)
          .set('x-access-token', JWT_DEV_TOKEN)
          .send(customerRollback);

        expect(responseRollback.status).toBe(200);
        expect(responseRollback.body).toEqual({
          type: 'success',
          title: 'Success',
          message: 'Customer updated successfully!',
          statusCode: 200,
          data: customer
        });
      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    })
  });
  return

  describe('DELETE /customer/delete/:uuid', () => {
    test('should delete a customer successfully', async () => {
      try {
        const response = await supertest(baseUrl)
          .delete(`/customer/delete/${customer.uuid}`)
          .set('x-access-token', JWT_DEV_TOKEN);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          type: 'success',
          title: 'Success',
          message: 'Customer deleted successfully!'
        });

        if (!response) throw new Error();

      } catch (error) {
        console.error('Error during test:', error);
        throw error;
      }
    });
  });
});
