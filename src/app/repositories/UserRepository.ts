import UserModel from 'models/UserModel';
import UserError from 'builders/errors/UserError';
import { User } from 'types/User.type';

class UserRepository {
  /**
   * Creates a new user in the database.
   * @param user - Object representing the user data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async create(user: User): Promise<User> {
    try {
      return await UserModel.create(user);
    } catch (error: any) {
      throw new UserError('Error creating user', error);
    }
  }

  /**
   * Get a user from the database based on the provided pattern and value.
   * @param pattern - A string or array of strings representing the fields to filter on.
   * @param value - The corresponding value for the filter pattern.
   * @returns A Promise that resolves with the user data or null if not found.
   */
  static async getByPattern(pattern: string | Array<string>, value: number | string | Array<string>): Promise<User | null> {
    try {
      return await UserModel.getByPattern(pattern, value);
    } catch (error: any) {
      throw new UserError('Error retrieving user', error);
    }
  }

  /**
   * Gets all users from the database.
   * @returns A Promise that resolves with an array of all users.
   */
  static async getAll(): Promise<User[]> {
    try {
      return await UserModel.getAll();
    } catch (error: any) {
      throw new UserError('Error retrieving all users', error);
    }
  }

  /**
   * Updates the data of a user in the database.
   * @param userUUID - UUID of the user to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async update(userUUID: string, updatedFields: Partial<User>): Promise<void> {
    try {
      await UserModel.update(userUUID, updatedFields);
    } catch (error: any) {
      throw new UserError('Error updating user', error);
    }
  }

  /**
   * Deletes a user from the database based on the provided UUID.
   * @param userUUID - UUID of the user to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  static async delete(userUUID: string): Promise<void> {
    try {
      await UserModel.delete(userUUID);
    } catch (error: any) {
      throw new UserError('Error deleting user', error);
    }
  }
}

export default UserRepository;
