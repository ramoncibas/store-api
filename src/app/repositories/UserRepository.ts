import UserModel from 'models/UserModel';
import CacheService from 'lib/cache';
import { Email, Phone } from 'domain/entities';
import { UserError } from 'builders/errors';
import { User } from '@types';

class UserRepository {
  private cache;

  private cacheKey = {
    user: (userKey: string | number) => {
      return `user_identifier_${userKey}`;
    },
  };

  constructor() {
    this.cache = new CacheService('user');
  }

  /**
   * Find exist user by id in the database.
   * @param userId - Object representing the user data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async findById(userId: number): Promise<User | null> {
    try {
      const cacheKey = this.cacheKey.user(userId);
      const userCached = await this.cache.get<User>(cacheKey);

      if (userCached) return userCached.items?.[0];

      const user = await UserModel.findById(userId);

      if (!user) {
        throw UserError.notFound();
      }

      this.cache.set(cacheKey, user);

      return user;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Find exist user by uuid in the database.
   * @param userUUID - Object representing the user data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async findByUUID(userUUID: string): Promise<User | null> {
    try {
      const cacheKey = this.cacheKey.user(userUUID);
      const userCached = await this.cache.get<User>(cacheKey);

      if (userCached) return userCached.items?.[0];
      
      const user = await UserModel.findByUUID(userUUID);

      this.cache.set(cacheKey, user);
      
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Find exist user by email in the database.
   * @param email - Email object.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async findByEmail(email: string): Promise<User | null> {
    try {
      const emailStr = new Email(email).toString();
      const cacheKey = this.cacheKey.user(emailStr);
      const userCached = await this.cache.get<User>(cacheKey);

      if (userCached) return userCached.items?.[0];
      
      const user = await UserModel.findByEmail(emailStr);

      this.cache.set(cacheKey, user);
      
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Creates a new user in the database.
   * @param values - Object representing the user data to be created.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async create(values: Omit<User, 'id' | 'uuid'>): Promise<User> {
    try {
      if (values.phone) {
        values.phone = new Phone(values.phone).getValue();
      }

      if (values.email) {
        values.email = new Email(values.email).toString();
      }
      
      const user = await UserModel.create(values);

      if (!user) {
        throw UserError.creationFailed();
      }
      
      const cacheKey = this.cacheKey.user(user.id);
      this.cache.set(cacheKey, user);

      return user;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Gets all users from the database.
   * @returns A Promise that resolves with an array of all users.
   */
  public async getAll(): Promise<User[]> {
    try {
      // TODO: Refatorara esse metodo, e colocar cursor a nivel de banco
      return await UserModel.getAll();
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Updates the data of a user in the database.
   * @param userUUID - UUID of the user to be updated.
   * @param updatedFields - Object containing the fields to be updated.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async update(userUUID: string, updatedFields: Partial<User>): Promise<User> {
    try {
      const userExist = await UserModel.findByUUID(userUUID);
      
      if (!userExist) {
        throw UserError.notFound();
      }

      const user = await UserModel.updateRecord(userUUID, updatedFields);
      
      if (!user) {
        throw UserError.updateFailed();
      }

      const cacheKey = this.cacheKey.user(userUUID);
      await this.cache.remove(cacheKey);
      
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Deletes a user from the database based on the provided UUID.
   * @param userUUID - UUID of the user to be deleted.
   * @returns A Promise that resolves when the operation is completed.
   */
  public async delete(userUUID: string): Promise<boolean> {
    try {
      const deleted = await UserModel.deleteRecord(userUUID);

      if (!deleted) {
        throw UserError.deletionFailed();
      }

      const cacheKey = this.cacheKey.user(userUUID);
      await this.cache.remove(cacheKey);

      return deleted;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new UserRepository;
