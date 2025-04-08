import CustomerModel from "models/CustomerModel";
import { Customer } from "@types";

class CustomerRepository {
  /**
   * Creates a new customer in the database.
   * @param customer - Object representing the customer data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async create(customer: Omit<Customer, "id" | "uuid">): Promise<Customer> {
    try {
      return await CustomerModel.create(customer);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Gets a customer from the database based on the provided ID or UUID.
   * @param customerUUID - Numeric ID or UUID of the customer.
   * @returns A Promise that resolves with the customer data or null if not found.
   */
  public async get(customerUUID: string): Promise<Customer | null> {
    try {
      return await CustomerModel.get(customerUUID);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Updates the data of a customer in the database.
   * @param customerUUID - UUID of the customer to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async update(customerUUID: string, updatedFields: Partial<Customer>): Promise<Customer> {
    try {
      return await CustomerModel.updateRecord(customerUUID, updatedFields);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Deletes a customer from the database based on the provided ID.
   * @param customerUUID - UUID of the customer to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async delete(customerUUID: string): Promise<boolean> {
    try {
      return await CustomerModel.delete(customerUUID);
    } catch (error: any) {
      throw error;
    }
  }
}

export default new CustomerRepository;
