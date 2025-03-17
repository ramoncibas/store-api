import Purchase from "types/Purchase.type";
import BaseModel from "./BaseModel";

class PurchaseModel extends BaseModel<Purchase> {
  protected static table: string = "purchase";

  /**
   * Save a new purchase to the database.
   * @param data<Purchase> - Object representing the purchase data to be saved.
   * @returns A Promise that resolves with the generated purchase ID when the operation is completed.
   */
  static async create(data: Purchase): Promise<number | null> {
    return await this.save(data);
  }

  /**
   * Get a purchase from the database based on the provided ID or UUID.
   * @param purchaseId - ID of the purchase.
   * @returns A Promise that resolves with the purchase data or null if not found.
   */
  static async findById(purchaseId: number): Promise<Purchase | null> {
    return await this.search("id", purchaseId);
  }

  /**
   * Get a Purchase from the database based on the customer ID.
   * @param customerId - Numeric ID of the Customer.
   * @returns A Promise that resolves with the purchase data or null if not found.
   */
  static async findByCustomerId(customerId: number): Promise<Purchase[] | null> {
    return await this.search("customer_id", customerId);
  }
}

export default PurchaseModel;
