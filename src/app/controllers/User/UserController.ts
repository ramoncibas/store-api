import { Request, Response } from 'express';
import UserRepository from 'repositories/UserRepository';
import UserFile from './UserFile';
import { MulterRequest } from 'types/User.type';
import UserError from 'errors/UserError';

class UserController {
  static async getUser(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params;

    try {
      const user = await UserRepository.get(uuid);

      if (!user) {
        const notFoundError = new UserError('User not found!', undefined, 404);
        res.status(404).send(notFoundError.toResponseObject());
        return;
      }

      if (user?.user_picture_name) {
        const filePath = `${process.env.HOST}/profile/user_picture/${user.user_picture_name}`;
        user.user_picture_url = filePath;
      }

      res.send(user);

    } catch (error: any) {
      const genericError = new UserError('Error retrieving user');

      res.status(500).send(genericError.toResponseObject());
      throw genericError;
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserRepository.getAll();
      res.send(users);

    } catch (error: any) {
      const genericError = new UserError('Error retrieving all user');

      res.status(500).send(genericError.toResponseObject());
      throw genericError;
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    const fields = req.body;

    if (Object.values(fields).some(value => typeof value !== 'string' || value.trim() === '')) {
      const invalidDataError = new UserError('All fields must be filled!', undefined, 400);
      res.status(400).send(invalidDataError.toResponseObject());
      return;
    }

    try {
      await UserRepository.create(fields);
      res.status(201).redirect("/profile");

    } catch (error: any) {
      const createUserError = new UserError('Error creating user', error);

      res.status(500).send(createUserError.toResponseObject());
      throw createUserError;
    }
  }

  static async updateUser(req: MulterRequest, res: Response): Promise<void> {
    const { phone, email, user_picture_name } = req.body;
    const userPictureFile = req.files.find(file => file.fieldname === 'user_picture');

    try {
      const userUUID = req.params.uuid;

      if (userPictureFile) {
        await UserFile.saveUserPicture(userUUID, userPictureFile);
      }

      const fields = {
        phone,
        email,
        user_picture_name: userPictureFile?.filename || user_picture_name || null
      };

      await UserRepository.update(userUUID, fields);

      res.status(200).send({
        type: "success",
        title: "Success",
        message: "Your profile has been updated!"
      });
    } catch (error: any) {
      const updateUserError = new UserError('Error updating user', error);

      res.status(500).send(updateUserError.toResponseObject());
      throw updateUserError;
    }
  }
}

export default UserController;
