import { Request, Response } from 'express';
import CustomerRepository from 'repositories/CustomerRepository';
import UserRepository from 'repositories/UserRepository';
import { CustomerError } from 'builders/errors';
import { ResponseBuilder } from 'builders/response';
import { Customer } from '@types';

class CustomerController {
  static async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customer: Omit<Customer, "id" | "uuid"> = req.body;

      if (!customer?.user_id) {
        throw CustomerError.invalidInput();
      }

      const existingCustomer = await UserRepository.findById(customer.user_id);

      if (existingCustomer) {
        throw CustomerError.alreadyExists();
      }

      const customerCreated = await CustomerRepository.create(customer);

      if (!customerCreated) {   
        throw CustomerError.creationFailed();
      }

      ResponseBuilder.send({
        response: res,
        message: "Customer created successfully!",
        statusCode: 201,
        data: customerCreated
      });
    } catch (error: any) {
      CustomerError.handleError(res, error);
    }
  }

  static async getCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerId: number = Number(req.user?.id);
      const customer = await CustomerRepository.get(customerId);

      if (!customer) {
        throw CustomerError.notFound();
      }

      ResponseBuilder.send({
        response: res,
        message: "Customer retrieved successfully!",
        statusCode: 200,
        data: customer
      });
    } catch (error: any) {
      CustomerError.handleError(res, error);
    }
  }

  static async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerId: number = Number(req.user?.id);
      const updatedFields: Partial<Customer> = req.body;

      if (!updatedFields) {
        throw CustomerError.invalidInput();
      }

      /**
       * Implement this validation in the future:
        const isCardValid = await CustomerController.validateCreditCard(updatedFields);
      
        if (!isCardValid) {
          res.status(400).json('Invalid credit card details.');
          return;
        }
      */

      const existingCustomer = await CustomerRepository.get(customerId);

      if (!existingCustomer) {
        throw CustomerError.notFound();
      }

      const customerUpdated = await CustomerRepository.update(customerId, updatedFields);
      
      if (!customerUpdated) {
        throw CustomerError.updateFailed();
      }

      ResponseBuilder.send({
        response: res,
        message: "Customer updated successfully!",
        statusCode: 200,
        data: customerUpdated
      });
    } catch (error: any) {
      CustomerError.handleError(res, error);
    }
  }

  static async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerId: number = Number(req.user?.id);
      const customer = await CustomerRepository.get(customerId);

      if (!customer) {
        throw CustomerError.notFound();
      }

      const customerDeleted = await CustomerRepository.delete(customerId);

      if (!customerDeleted) {
        throw CustomerError.deletionFailed();
      }

      ResponseBuilder.send({
        response: res,
        message: "Customer deleted successfully!",
        statusCode: 200
      });
    } catch (error: any) {
      CustomerError.handleError(res, error);
    }
  }
}

export default CustomerController;
