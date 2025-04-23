import CustomerModel from "models/CustomerModel";
import CacheService from "lib/cache";
import { Customer } from "@types";
import { CustomerError } from "../builders/errors";

class CustomerRepository {
  private cache;
  
  private cacheKey = {
    customer: (customerKey: string | number) => {
      return `customer_identifier_${customerKey}`;
    },
  };

  constructor() {
    this.cache = new CacheService('customer');
  }

  /**
   * Gets a customer from the database based on the provided ID or UUID.
   * @param customerId - Numeric ID or UUID of the customer.
   * @returns A Promise that resolves with the customer data or null if not found.
   */
  public async get(customerId: number): Promise<Customer | null> {
    try {
      const cacheKey = this.cacheKey.customer(customerId);
      const customerCached = await this.cache.get<Customer>(cacheKey);

      if (customerCached) return customerCached.items?.[0];

      const customer = await CustomerModel.get<Customer>(customerId);
      
      if (!customer) {
        throw CustomerError.notFound();
      }

      await this.cache.set(cacheKey, customer);

      return customer;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Creates a new customer in the database.
   * @param customer - Object representing the customer data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async create(customer: Omit<Customer, "id" | "uuid">): Promise<Customer> {
    try {
      const customerCreated = await CustomerModel.create(customer);

      if (!customerCreated) {
        throw CustomerError.creationFailed();
      }

      const cacheKey = this.cacheKey.customer(customerCreated.id);
      await this.cache.set(cacheKey, customerCreated);

      return customerCreated;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Updates the data of a customer in the database.
   * @param customerId - Id of the customer to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async update(customerId: number, updatedFields: Partial<Customer>): Promise<Customer> {
    try {
      const customerExist = await CustomerModel.findById(customerId);
      
      if (!customerExist) {
        throw CustomerError.notFound();
      }

      const customer = await CustomerModel.updateRecord(customerId, updatedFields);

      if (!customer) {
        throw CustomerError.updateFailed();
      }
      
      const cacheKey = this.cacheKey.customer(customerId);      
      await this.cache.remove(cacheKey);
      
      return customer;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Deletes a customer from the database based on the provided ID.
   * @param customerId - Id of the customer to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async delete(customerId: number): Promise<boolean> {
    try {
      const customerExist = await CustomerModel.findById(customerId);
      
      if (!customerExist) {
        throw CustomerError.notFound();
      }

      const deleted = await CustomerModel.delete(customerId);

      if (!deleted) {
        throw CustomerError.deletionFailed();
      }

      const cacheKey = this.cacheKey.customer(customerId);      
      await this.cache.remove(cacheKey);

      return deleted;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new CustomerRepository;
