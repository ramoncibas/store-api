import CustomerModel from "models/CustomerModel";
import CustomerError from "errors/CustomerError";
import Customer from "types/Customer.type";

class CustomerRepository {
  /**
   * Creates a new customer in the database.
   * @param customer - Object representing the customer data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async create(customer: Customer): Promise<void> {
    try {
      await CustomerModel.save(customer);
    } catch (error: any) {
      throw new CustomerError('Error creating customer', error);
    }
  }

  /**
   * Gets a customer from the database based on the provided ID or UUID.
   * @param customerIdentifier - Numeric ID or UUID of the customer.
   * @returns A Promise that resolves with the customer data or null if not found.
   */
  static async get(customerIdentifier: number | string): Promise<Customer | null> {
    try {
      return await CustomerModel.get(customerIdentifier);
    } catch (error: any) {
      throw new CustomerError('Error retrieving customer', error);
    }
  }

  /**
   * Updates the data of a customer in the database.
   * @param customerUUID - UUID of the customer to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async update(customerUUID: string, updatedFields: Partial<Customer>): Promise<void> {
    try {
      await CustomerModel.update(customerUUID, updatedFields);
    } catch (error: any) {
      throw new CustomerError('Error updating customer', error);
    }
  }

  /**
   * Deletes a customer from the database based on the provided ID.
   * @param customerUUID - UUID of the customer to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async delete(customerUUID: string): Promise<void> {
    try {
      await CustomerModel.delete(customerUUID);
    } catch (error: any) {
      throw new CustomerError('Error deleting customer', error);
    }
  }
}

export default CustomerRepository;
