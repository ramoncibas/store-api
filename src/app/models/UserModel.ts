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
  static async create(user: User): Promise<User> {
    const query: string = `
      INSERT INTO user (
        uuid,
        first_name,
        last_name,
        email,
        password,
        phone,
        user_picture_name,
        type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *;
    `;

    try {
      const dbManager = this.getDBManager();
      const generatedUuid = uuidv4();
      
      const userData: User[] = await dbManager.all(query, [generatedUuid, ...Object.values(user)]);

      return userData[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Get a user from the database based on the provided pattern and value.
   * @param pattern - A string or array of strings representing the fields to filter on.
   * @param value - The corresponding value for the filter pattern.
   * @returns A Promise that resolves with the user data or null if not found.
   */
  static async getByPattern(pattern: string | Array<string>, value: number | string | Array<string>): Promise<User | null> {
    const conditions = Array.isArray(pattern) ? pattern.join(' AND ') : pattern;

    const query: string = `
      SELECT * FROM user WHERE ${conditions} = ?
    `;

    try {
      const dbManager = this.getDBManager();
      const row = await dbManager.get(query, [value]);
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
  static async getAll(): Promise<User[]> {
    const query: string = 'SELECT * FROM user';

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
  static async update(userUUID: string, updatedFields: Partial<User>): Promise<void> {
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);

    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    const query: string = `
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
  static async delete(userUUID: string): Promise<void> {
    const query: string = `
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
