import DatabaseManager from "../../config/db";
import { User } from "types/User.type";
import { v4 as uuidv4 } from 'uuid';

class UserModel {
  private static dbManager: DatabaseManager;

  private static getDBManager(): DatabaseManager {
    if (!this.dbManager) {
      this.dbManager = new DatabaseManager();
    }
    return this.dbManager;
  }

  /**
   * Create a new user to the database.
   * @param user - Object representing the user data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async createUser(user: User): Promise<void> {
    const query = `
      INSERT INTO user (
        uuid,
        first_name,
        last_name,
        email,
        password,
        phone,
        user_picture_name,
        type
      ) VALUES (?, ?, ?, ?)
    `;

    try {
      const generatedUuid = uuidv4();

      const dbManager = this.getDBManager();
      await dbManager.run(query, [generatedUuid, ...Object.values(user)]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get a user from the database based on the provided UUID.
   * @param userUUID - UUID of the user.
   * @returns A Promise that resolves with the user data or null if not found.
   */
  static async getUserById(userUUID: string): Promise<User | null> {
    const query = `
      SELECT * FROM user WHERE uuid = ?
    `;

    try {
      const dbManager = this.getDBManager();
      const row = await dbManager.get(query, [userUUID]);
      return row || null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get all users from the database.
   * @returns A Promise that resolves with an array of all users.
   */
  static async getAllUsers(): Promise<User[]> {
    const query = 'SELECT * FROM user';

    try {
      const dbManager = this.getDBManager();
      const users = await dbManager.all(query, []);

      return users;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update the data of a user in the database.
   * @param userUUID - UUID of the user to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async updateUser(userUUID: string, updatedFields: Partial<User>): Promise<void> {
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);

    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    const query = `
      UPDATE user
      SET ${setClause}
      WHERE uuid = ?
    `;

    try {
      const dbManager = this.getDBManager();
      await dbManager.run(query, [...values, userUUID]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Delete a user from the database based on the provided UUID.
   * @param userUUID - UUID of the user to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async deleteUser(userUUID: string): Promise<void> {
    const query = `
      DELETE FROM user WHERE uuid = ?
    `;

    try {
      const dbManager = this.getDBManager();
      await dbManager.run(query, [userUUID]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default UserModel;
