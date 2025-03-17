import { randomUUID } from "crypto";
import Customer from "types/Customer.type";
import BaseModel from "./BaseModel";

class CustomerModel extends BaseModel<Customer> {
  protected static table: string = "customer";

  /**
   * Save a new customer to the database.
   * @param customer - Object representing the customer data to be saved.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async create(customer: Omit<Customer, "id" | "uuid">): Promise<Customer> {
    return await this.save(customer);
  }

  /**
   * Get a customer from the database based on the provided ID or UUID.
   * @param customerUUID - Numeric ID of the customer.
   * @returns A Promise that resolves with the customer data or null if not found.
   */
  public static async findByUuid(customerUUID: string): Promise<Customer> {
    return await this.search("uuid", customerUUID);
  }

  /**
   * Update the data of a customer in the database.
   * @param customerUUID - UUID of the customer to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async updateRecord(customerUUID: string, updatedFields: Partial<Customer>): Promise<Customer> {
    return await this.update(customerUUID, updatedFields);
  }

  /**
   * Delete a customer from the database based on the provided UUID.
   * @param customerUUID - UUID of the customer to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async delete(customerUUID: string): Promise<boolean> {
    return await this.delete(customerUUID);
  }
}

export default CustomerModel;
