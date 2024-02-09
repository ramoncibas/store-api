import { User } from "types/User.type";
import { randomUUID } from 'crypto';
import BaseModel from "./BaseModel";
import { RunResult } from "sqlite3";

class UserModel extends BaseModel<UserModel> {
  constructor() {
    super("user");
  }

  /**
   * Create a new user to the database.
   * @param user - Object representing the user data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async create(user: User): Promise<User> {
    try {
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

      const generatedUuid = randomUUID();

      return await this.dbManager.transaction(async (dbManager) => {
        const [userData] = await dbManager.all(query, [generatedUuid, ...Object.values(user)]);

        return userData[0];
      });

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
    try {
      const query: string = 'SELECT * FROM user';

      const users = await this.dbManager.all(query, []);

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
    try {
      const keys = Object.keys(updatedFields);
      const values = Object.values(updatedFields);

      const setClause = keys.map((key) => `${key} = ?`).join(", ");

      const query: string = `
        UPDATE user
        SET ${setClause}
        WHERE uuid = ?
      `;

      return await this.dbManager.transaction(async (dbManager) => {
        const [product]: any = await dbManager.run(query, [...values, userUUID]);

        return product;
      });
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
  static async delete(userUUID: string): Promise<RunResult> {
    try {
      const query: string = `
        DELETE FROM user WHERE uuid = ?
      `;

      const row = await this.dbManager.run(query, [userUUID]);

      return row;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default UserModel;
