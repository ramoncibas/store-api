import DatabaseManager from '../../database/db';
import Purchase from 'types/Purchase.type';

class PurchaseModel {
  private static dbManager: DatabaseManager;

  private static getDBManager(): DatabaseManager {
    if (!this.dbManager) {
      this.dbManager = new DatabaseManager();
    }
    return this.dbManager;
  }

  /**
   * Save a new purchase to the database.
   * @param purchase - Object representing the purchase data to be saved.
   * @returns A Promise that resolves with the generated purchase ID when the operation is completed.
   */
  static async create(purchase: Purchase): Promise<number | null> {
    const query: string = `
      INSERT INTO purchase (
        user_id,
        total_amount,
        purchase_date
      ) VALUES (?, ?, ?)
      RETURNING id;
    `;

    try {
      const dbManager = this.getDBManager();
      const result = await dbManager.all(query, [...Object.values(purchase)]);
      const id = result[0];

      return id;
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
    const query: string = `
      SELECT * FROM purchase WHERE id = ?
    `;

    try {
      const dbManager = this.getDBManager();
      const row = await dbManager.get(query, [purchaseId]);
      return row || null;
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
      const query: string = `
        SELECT * FROM purchase WHERE customer_id = ?
      `;
  
      try {
        const dbManager = this.getDBManager();
        const row = await dbManager.get(query, [customerID]);
        return row || null;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
}

export default PurchaseModel;
