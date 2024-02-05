import Purchase from 'types/Purchase.type';
import BaseModel from './BaseModel';

class PurchaseModel extends BaseModel<PurchaseModel> {
  constructor() {
    super("purchase");
  }

  /**
   * Save a new purchase to the database.
   * @param purchase - Object representing the purchase data to be saved.
   * @returns A Promise that resolves with the generated purchase ID when the operation is completed.
   */
  static async create(purchase: Purchase): Promise<number | null> {
    try {
      const query: string = `
        INSERT INTO purchase (
          user_id,
          total_amount,
          purchase_date
        ) VALUES (?, ?, ?)
        RETURNING id;
      `;

      return await this.dbManager.transaction(async (dbManager) => {
        const [id] = await dbManager.all(query, [...Object.values(purchase)]);

        return id;
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get a purchase from the database based on the provided ID or UUID.
   * @param purchaseId - ID of the purchase.
   * @returns A Promise that resolves with the purchase data or null if not found.
   */
  static async get(purchaseId: number): Promise<Purchase | null> {
    try {
      const query: string = `
        SELECT * FROM purchase WHERE id = ?
      `;

      const row = await this.dbManager.get(query, [purchaseId]);

      return row;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get a Purchase from the database based on the customer ID.
   * @param customerID - Numeric ID of the Customer.
   * @returns A Promise that resolves with the purchase data or null if not found.
   */
  static async getAll(customerID: number | string): Promise<Purchase[] | null> {
    try {
      const query: string = `
        SELECT * FROM purchase WHERE customer_id = ?
      `;
      const row = await this.dbManager.get(query, [customerID]);

      return row;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default PurchaseModel;
