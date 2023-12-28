import { Request, Response } from 'express';
import CustomerRepository from 'repositories/CustomerRepository';
import ReviewRepository from 'repositories/ReviewRepository';
import Customer from 'types/Customer.type';
import Review from 'types/Review.type';
import CustomerError from 'errors/CustomerError';

class CustomerController {
  static async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerData: Customer = req.body;

      await CustomerRepository.create(customerData);

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

      const customer = await CustomerRepository.get(customerUUID);

      if (!customer) {
        const customerNotFoundError = new CustomerError('Customer not found!', undefined, 404);
        res.status(404).send(customerNotFoundError.toResponseObject());
        return;
      }

      reviewData.customer_id = customer.id;

      await ReviewRepository.create(reviewData);

      res.status(201).send("Review created successfully!");

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
        res.status(404).send("Customer not found.");
      }

      res.send(customer);

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
        const customerNotFoundError = new CustomerError(`Customer with UUID ${customerUUID} not found.`, undefined, 400);

        res.status(404).send(customerNotFoundError.toResponseObject());
        return;
      }

      await CustomerRepository.update(customerUUID, updatedFields);

      res.status(200).send("Customer updated successfully!");
    } catch (error: any) {
      const customerError = new CustomerError('Something went wrong while updating the customer.', error);

      res.status(500).send(customerError.toResponseObject());
      throw customerError;
    }
  }

  static async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerUUID: string = req.params.uuid;

      await CustomerRepository.delete(customerUUID);

      res.status(200).send("Customer deleted successfully!");
    } catch (error: any) {
      console.error(error);
      const customerError = new CustomerError('Something went wrong while deleting the customer.', error);

      res.status(500).send(customerError.toResponseObject());
      throw customerError;
    }
  }
}

export default CustomerController;
