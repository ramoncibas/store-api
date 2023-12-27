import { Request, Response } from 'express';
import CustomerRepository from 'repositories/CustomerRepository';
import Customer from 'types/Customer.type';

class CustomerController {
  /**
   * Handles the request to save a new customer.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @return A Promise that resolves when the operation is completed.
   */
  static async saveCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerData: Customer = req.body;

      await CustomerRepository.create(customerData);

      res.status(201).send("Customer created successfully!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong while creating the customer.");
    }
  }

  /**
   * Handles the request to get customer details.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @return A Promise that resolves with the customer data or null if not found.
   */
  static async getCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerIdentifier: number | string = req.params.customerIdentifier;
      const customer = await CustomerRepository.get(customerIdentifier);

      if (!customer) {
        res.status(404).send("Customer not found.");
      }

      res.send(customer);
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong while fetching the customer.");
    }
  }

  /**
   * Handles the request to update customer details.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @return A Promise that resolves when the operation is completed.
   */
  static async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerUUID: string = req.params.uuid;
      const updatedFields: Partial<Customer> = req.body;

      await CustomerRepository.update(customerUUID, updatedFields);

      res.status(200).send("Customer updated successfully!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong while updating the customer.");
    }
  }

  /**
   * Handles the request to delete a customer.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @return A Promise that resolves when the operation is completed.
   */
  static async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerUUID: string = req.params.uuid;

      await CustomerRepository.delete(customerUUID);

      res.status(200).send("Customer deleted successfully!");
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong while deleting the customer.");
    }
  }
}

export default CustomerController;
