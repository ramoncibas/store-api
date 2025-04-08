import PurchaseModel from "models/PurchaseModel";
import PurchaseError from "builders/errors/PurchaseError";
import Purchase from "types/Purchase.type";

class PurchaseRepository {
  /**
   * Creates a new purchase in the database.
   * @param purchase - Object representing the purchase data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async create(purchase: Purchase): Promise<number> {
    try {
      const purchaseId: number | null = await PurchaseModel.create(purchase);
      
      if (purchaseId === null) {
        throw new PurchaseError('Error creating purchase');
      }

      return purchaseId;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Gets a purchase from the database based on the provided ID.
   * @param purchaseId - ID of the purchase.
   * @returns A Promise that resolves with the purchase data or null if not found.
   */
  static async get(purchaseId: number): Promise<Purchase | null> {
    try {
      return await PurchaseModel.get(purchaseId);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Gets a purchase from the database based on the provided ID.
   * @param purchaseId - ID of the purchase.
   * @returns A Promise that resolves with the purchase data or null if not found.
   */
    static async getAll(customerID: number): Promise<Purchase[] | null> {
      try {
        return await PurchaseModel.findByCustomerId(customerID);
      } catch (error: any) {
        throw error;
      }
    }
}

export default PurchaseRepository;
