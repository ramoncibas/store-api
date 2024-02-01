import { Request, Response } from 'express';
import CustomerRepository from 'repositories/CustomerRepository';
import UserRepository from 'repositories/UserRepository';
import Customer from 'types/Customer.type';
import CustomerError from 'builders/errors/CustomerError';
import ResponseBuilder from 'builders/response/ResponseBuilder';

class CustomerController {
  static async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customer: Customer = req.body;

      if (!customer?.user_id) {
        throw CustomerError.invalidInput();
      }

      const existingCustomer = await UserRepository.getByPattern('id', customer.user_id);

      if (existingCustomer) {
        throw CustomerError.customerAlreadyExists();
      }

      const customerCreated = await CustomerRepository.create(customer);

      if (!customerCreated) {
        throw CustomerError.customerCreationFailed();
      }

      return ResponseBuilder.send({
        response: res,
        message: "Customer created successfully!",
        statusCode: 201,
        data: customer
      });
    } catch (error: any) {
      CustomerError.handleError(res, error);
    }
  }

  static async getCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerIdentifier: number | string = req.params.uuid;
      const customer = await CustomerRepository.get(customerIdentifier);

      if (!customer) {
        throw CustomerError.customerNotFound();
      }

      return ResponseBuilder.send({
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
      const customerUUID: string = req.params.uuid;
      const updatedFields: Partial<Customer> = req.body;

      const areFieldsValid = Object.values(updatedFields).every(value => (
        (typeof value === 'string' && value.trim() !== '') ||
        (!isNaN(Number(value)) && value !== '')
      ));

      if (!areFieldsValid) {
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

      const existingCustomer = await CustomerRepository.get(customerUUID);

      if (!existingCustomer) {
        throw CustomerError.customerNotFound();
      }

      const customerUpdated = await CustomerRepository.update(customerUUID, updatedFields);

      if (!customerUpdated) {
        throw CustomerError.customerUpdateFailed();
      }

      return ResponseBuilder.send({
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
      const customerUUID: string = req.params.uuid;
      const customer = await CustomerRepository.get(customerUUID);

      if (!customer) {
        res.status(404).json(CustomerError.customerNotFound().toResponseObject());
        return;
      }

      const customerDeleted = await CustomerRepository.delete(customerUUID);

      if (!customerDeleted) {
        throw CustomerError.customerDeletionFailed();
      }

      return ResponseBuilder.send({
        response: res,
        message: "Customer deleted successfully!",
        statusCode: 200,
        data: customer
      });
    } catch (error: any) {
      CustomerError.handleError(res, error);
    }
  }
}

export default CustomerController;
