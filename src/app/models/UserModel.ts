import { User } from "types/User.type";
import BaseModel from "./BaseModel";

class UserModel extends BaseModel<User> {
  protected static table = "user";

  /**
 * Finds reviews by user ID.
 * @param userId - The ID of the user.
 * @returns A Promise that resolves with an array of reviews.
 */
  public static async findByUserID(userId: number): Promise<User | null> {
    return await this.search("id", userId);
  }

  /**
   * Create a new user to the database.
   * @param user - Object representing the user data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async create(user: User): Promise<User> {
    return await this.save(user);
  }

  /**
   * Get all users from the database.
   * @returns A Promise that resolves with an array of all users.
   */
  public static async getAll(): Promise<User[]> {
    return await this.all();
  }

  /**
   * Update the data of a user in the database.
   * @param userUUID - UUID of the user to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async updateRecord(userUUID: string, updatedFields: Partial<User>): Promise<User> {
    return await this.update(userUUID, updatedFields);
  }

  /**
   * Delete a user from the database based on the provided UUID.
   * @param userUUID - UUID of the user to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public static async delete(userUUID: string): Promise<boolean> {
    return await this.delete(userUUID);
  }
}

export default UserModel;
