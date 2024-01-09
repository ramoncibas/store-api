import { Request, Response } from 'express';
import CustomerRepository from 'repositories/CustomerRepository';
import ReviewRepository from 'repositories/ReviewRepository';
import Customer from 'types/Customer.type';
import Review from 'types/Review.type';
import CustomerError from 'errors/CustomerError';
import UserRepository from '../../repositories/UserRepository';
import UserError from '../../errors/UserError';

class CustomerController {
  static async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customer: Customer = req.body;

      const existingCustomer = await UserRepository.getByPattern('id', customer.user_id);
      
      if (existingCustomer) {
        res.status(409).send(CustomerError.customerAlreadyExists().toResponseObject());
        return;
      }

      await CustomerRepository.create(customer);

      res.status(201).send("Customer created successfully!");

    } catch (error: any) {
      const customerError = new CustomerError('Error creating customer', error);

      res.status(500).send(customerError.toResponseObject());
      throw customerError;
    }
  }

  static async createReview(req: Request, res: Response): Promise<void> {
    try {
      const customerUUID: string = req.params.uuid;
      const reviewData: Review = req.body;

      const customer: Customer | null = await CustomerRepository.get(customerUUID);

      if (!customer || customer.id === null) {
        res.status(404).send(CustomerError.customerNotFound().toResponseObject());
        return;
      }

      reviewData.customer_id = customer.id as string | number;

      await ReviewRepository.create(reviewData);

      res.status(200).send({
        type: "success",
        title: "Success",
        message: "Review created successfully!"
      });
    } catch (error: any) {
      const customerError = new CustomerError('Error creating review', error);

      res.status(500).send(customerError.toResponseObject());
      throw customerError;
    }
  }

  static async getCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerIdentifier: number | string = req.params.uuid;
      const customer = await CustomerRepository.get(customerIdentifier);

      if (!customer) {
        res.status(404).send(CustomerError.customerNotFound().toResponseObject());
        return;
      }

      res.status(200).send(customer);

    } catch (error: any) {
      const customerError = new CustomerError('Something went wrong while fetching the customer.', error);

      res.status(500).send(customerError.toResponseObject());
      throw customerError;
    }
  }

  static async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerUUID: string = req.params.uuid;
      const updatedFields: Partial<Customer> = req.body;

      const areFieldsValid = Object.values(updatedFields).every(value => typeof value === 'string' && value.trim() !== '');

      if (!areFieldsValid) {
        const customerNotFoundError = new CustomerError('One or more fields are missing or have invalid data types.', undefined, 400);

        res.status(404).send(customerNotFoundError.toResponseObject());
        return;
      }

      /**
       * Implement this validation in the future:
        const isCardValid = await CustomerController.validateCreditCard(updatedFields);
      
        if (!isCardValid) {
          res.status(400).send('Invalid credit card details.');
          return;
        }
      */

      const existingCustomer = await CustomerRepository.get(customerUUID);

      if (!existingCustomer) {
        res.status(404).send(CustomerError.customerNotFound().toResponseObject());
        return;
      }

      await CustomerRepository.update(customerUUID, updatedFields);

      res.status(200).send({
        type: "success",
        title: "Success",
        message: "Customer updated successfully!"
      });
    } catch (error: any) {
      res.status(500).send(CustomerError.customerUpdateFailed().toResponseObject());

      throw CustomerError.customerUpdateFailed();
    }
  }

  static async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerUUID: string = req.params.uuid;
      const customer = await CustomerRepository.get(customerUUID);

      if (!customer) {
        res.status(404).send(CustomerError.customerNotFound().toResponseObject());
        return;
      }

      await CustomerRepository.delete(customerUUID);

      res.status(200).send({
        type: "success",
        title: "Success",
        message: "Customer deleted successfully!"
      });
    } catch (error: any) {
      res.status(500).send(CustomerError.customerDeletionFailed().toResponseObject());

      throw CustomerError.customerDeletionFailed();
    }
  }
}

export default CustomerController;
