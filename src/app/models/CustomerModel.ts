import BaseModel from "./BaseModel";
import { Customer } from "@types";

class CustomerModel extends BaseModel<Customer> {
  protected static table: string = "customer";

  /**
   * Get a customer from the database based on the provided ID.
   * @param customerId - Numeric ID of the customer.
   * @returns A Promise that resolves with the customer data or null if not found.
   */
  public static async findById(customerId: number): Promise<Customer | null> {
    const customer: any = await this.search<Customer>("id", customerId);

    return customer;
  }

  /**
   * Get a customer from the database based on the provided UUID.
   * @param customerUUID - Numeric ID of the customer.
   * @returns A Promise that resolves with the customer data or null if not found.
   */
  public static async findByUuid(customerUUID: string): Promise<Customer | null> {
    const customer: any = await this.search<Customer>("uuid", customerUUID);

    return customer;
  }
  
  /**
   * Save a new customer to the database.
   * @param customer - Object representing the customer data to be saved.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async create(customer: Omit<Customer, "id" | "uuid">): Promise<Customer> {
    return await this.save(customer);
  }

  /**
   * Update the data of a customer in the database.
   * @param customerId - Id of the customer to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async updateRecord(customerId: number, updatedFields: Partial<Customer>): Promise<Customer> {
    return await this.update(customerId, updatedFields);
  }

  /**
   * Delete a customer from the database based on the provided UUID.
   * @param customerId - Id of the customer to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async delete(customerId: number): Promise<boolean> {
    return await this.delete(customerId);
  }
}

export default CustomerModel;
